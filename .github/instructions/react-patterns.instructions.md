---
description: "React/TypeScript coding patterns and anti-patterns for this codebase. Apply when writing or reviewing .tsx/.ts files."
applyTo: "src/**/*.{ts,tsx}"
---

# React Patterns – Coding Standards

## Show components must never write to the backend

**A Show (read-only) component must never call `useUpdate`, `useMutation`, `useCreate`, or any other write hook.**

The most dangerous form of this violation is the **auxiliary-merge write-back** pattern:

1. A Show component fetches the primary record.
2. It fetches auxiliary data from a second API (file storage, metrics, an external service).
3. It merges the two locally and calls `useUpdate` to write the merged result back to the primary resource.

This silently corrupts the backend resource. The browser client is not the authority on data it fetched from a second source. External systems (background jobs, SDKs, other services) that also write to the same resource will have their updates overwritten the next time the Show page is opened.

The bug is extremely hard to diagnose: symptoms appear as data corruption in backend systems or external jobs, with no visible error in the UI (especially if the write failure is swallowed with an empty `catch`).

**The correct pattern for auxiliary data in Show components:**
- Fetch auxiliary data and display it locally. Never write it back to the primary resource.
- If the backend genuinely needs to be updated with auxiliary data, that is a backend-side concern: a sync endpoint, a background job, or an explicit user-initiated action (a button with confirmation), never a passive side effect of viewing a record.
- If the auxiliary data needs to be shown alongside the record, derive the combined view locally without persisting it.

```tsx
// Bad: Show component that corrupts backend data
const ShowComponent = () => {
    const record = useRecordContext();
    const [update] = useUpdate();
    const getFileInfo = useGetNestedFileInfo();

    useEffect(() => {
        getFileInfo({ path: record.spec.path }).then(res => {
            // This overwrites backend data the job is responsible for
            update(resource, { id: record.id, data: { ...record, status: { files: res } } });
        });
    }, [record]);
};

// Good: display auxiliary data locally, never write it back
const ShowComponent = () => {
    const record = useRecordContext();
    const { data: fileInfo } = useGetNestedFileInfo(record.spec.path);
    // render record + fileInfo together, no update call
};
```

**Additional red flags** that indicate this pattern:
- An empty or silent `catch(() => {})` near a write hook — hides data corruption errors.
- A write hook whose `data` return value is fed back into the view (`data && !isPending ? data : record`) — the component is treating its own mutation result as the source of truth.
- Write hooks in components named `*Show*`, `*View*`, `*Detail*`, `*Display*`, or `*Preview*`.

## Hooks: useMemo

Use `useMemo` **only** when:
- The result is an **object or array passed to a hook** that uses it as a dependency (e.g. `filter` object passed to `useListController`).
- The computation is genuinely expensive (e.g. large data transformation, heavy sorting).

**Do NOT use `useMemo` for:**
- Values only used in the render return (JSX). React re-renders are cheap; memoization overhead is not zero.
- Context values unless **all** dependencies are themselves stable (memoized or primitive).
- Deriving display values from props/state (just compute inline).

A `useMemo` whose dependencies include non-memoized inline functions or objects **always** recomputes on every render and provides zero benefit.

## Hooks: useCallback

Use `useCallback` **only** when:
- The function is listed as a dependency of another hook (`useEffect`, `useMemo`, etc.).
- The function is passed as a prop to a `React.memo()`-wrapped child component.

**Do NOT use `useCallback` for:**
- Event handlers passed to plain DOM/MUI elements (`onClick`, `onChange`). These do not benefit from memoization.
- Consistency/symmetry reasons ("I memoized one, so I'll memoize all").

Be consistent: if some handlers in a component are wrapped in `useCallback` and others are not, there must be a concrete reason for the difference.

## State: Avoid derived state

Do NOT use `useState` + `useEffect` to keep state in sync with other state or props. Compute the derived value directly during render:

```tsx
// Bad
const [currentLog, setCurrentLog] = useState(undefined);
useEffect(() => { setCurrentLog(data?.find(r => r.id === selectedId)); }, [data, selectedId]);

// Good
const currentLog = data?.find(r => r.id === selectedId);
```

Derived state causes an extra render cycle and introduces stale-closure risk in the effect.

## Refs in function components

Always use `useRef` inside function components. `React.createRef()` creates a new ref object on every render.

```tsx
// Bad
const ref = React.createRef<LazyLog>();

// Good
const ref = useRef<LazyLog>(null);
```

## useEffect

- Every value read inside an effect that can change over time must be in the dependency array.
- If the effect exists only to sync derived state, eliminate it and compute inline (see "Avoid derived state" above).
- Avoid chained effects (effect A sets state, which triggers effect B). Collapse the logic into a single derived value or a single effect.

## Context values

A `Context.Provider value={...}` object should be memoized **only** if:
1. The context contains values that do NOT change on every render (i.e., stable callbacks via `useCallback`, stable state), **and**
2. There are consumers that benefit from skipping re-renders.

If the context value includes state that **must** reflect current render values (e.g. `isOpen`), memoization is counterproductive.

## General

- Avoid duplicating logic across a parent and its child component (e.g. extracting the same URLs twice from `record`). Pass the derived value as a prop, or let the child derive it.
- Prefer explicit over "defensive" hooks. Every `useMemo`/`useCallback` must have a clear, stated reason. If you cannot articulate why it is there, remove it.

## Component cohesion

**One component, one responsibility.** If you cannot name a component with a single noun or noun phrase (without "And", "With", "Plus"), it is doing too many things — split it.

**Props domain check.** If a component's props come from two unrelated domains (e.g. schema config AND file upload config), that is a design smell. The parent should own the coupling, not the component.

**Do not use effects to bridge unrelated features.** A `useEffect` that copies a value from feature A into a field owned by feature B signals that the two features are artificially co-located. The shared value should be lifted to the parent and passed down independently. Sharing one piece of data (a path, an id, a name) is not a sufficient reason to merge two features into one component.

## Capability flag consumption in shared components

**A shared/generic component should not read feature-flag or capability props from context (e.g. `resourceDefinition.options.hasFiles`, `resourceDefinition.hasEdit`) to conditionally include UI elements.**

This is implicit configuration: the shared component silently knows which features each resource type has. The consequence is that:
- Adding a new capability requires modifying the shared component.
- The shared component cannot be reused by a resource that wants different behaviour without changing the flags.
- The *what to show* decision is scattered between the call site and the component internals.

The correct model is **composition**: the call site decides which elements exist and passes them in as children, slots, or explicit render props. The shared component is responsible only for layout and orchestration.

```tsx
// Bad: toolbar reaches into resource metadata to decide what to render
export const ShowToolbar = () => {
    const resourceDefinition = useResourceDefinition();
    return (
        <TopToolbar>
            {resourceDefinition.hasEdit && <EditButton />}
            {resourceDefinition.options?.hasFiles && <DownloadButton />}
        </TopToolbar>
    );
};

// Good: caller decides, toolbar just lays out what it receives
export const ShowToolbar = ({ children }) => (
    <TopToolbar>{children}</TopToolbar>
);

// at the call site:
<ShowToolbar>
    {resourceDefinition.hasEdit && <EditButton />}
    {hasFiles && <DownloadButton />}
</ShowToolbar>
```

**Acceptable**: reading context that is genuinely about *how* to render (theme, locale, screen size), not *what* to render. A `variant` prop is fine; reading `options.hasFiles` to decide whether to include a button is not.

**Important nuance**: moving the `if kind === X` logic into `resourceDefinition` is better than inline branching (it puts the knowledge with the owner), but it does not eliminate the problem — the shared component is still the one consuming those flags to make rendering decisions. Ownership of the data and ownership of the rendering decision are separate concerns.

## False generalization (shared component with entity/kind branching)

**Do NOT merge logically separate features into one shared component just because their implementation looks similar.**

The symptom is a component that accepts a `kind`, `entity`, `type`, `resource`, or `mode` prop and then branches on it:

```tsx
// Red flag
if (kind === 'artifact') { ... }
if (entity === 'function') { ... }
switch (resource) { case 'dataitem': ...; case 'model': ...; }
```

This pattern looks like reuse but is actually **forced coupling**. Each branch is a separate logical feature. When one branch changes, the entire shared component must be understood and regression-tested. The branches will diverge over time, making the conditionals grow and the component increasingly fragile.

**The correct approach is composition, not consolidation:**
- Extract the *truly shared* logic (layout, common fields, shared hooks) into a base component or hook.
- Keep each entity/kind as its own component that uses the shared base.
- The call site decides which component to render — not the component itself via internal branching.

```tsx
// Bad: one component that knows about every entity
<SpecForm kind={kind} entity={entity} />

// Good: each entity has its own form, sharing a common base
<ArtifactSpecForm />   // internally uses <BaseSpecForm />
<FunctionSpecForm />   // internally uses <BaseSpecForm />
```

**Acceptable branching** (not a violation):
- Cosmetic/layout differences (e.g. `size`, `variant`, `color` props).
- A single well-defined toggle (e.g. `readonly`, `showFileInput`).
- Branching on a prop that represents a *dimension of the same feature*, not a different feature altogether.

The test: if removing one branch would leave a coherent, independently useful component — the branches represent different features and should be split.

## Form building and field synchronization

**The form is the coordinator. Fields are scoped to their source.**

### The form owns all synchronization

The form component (the one that renders the `<Form>` or stepper) is responsible for:
- Deciding which fields exist and what values they receive
- Watching fields and deriving cross-field values via `useWatch` or `useFieldObserver`
- Passing derived values down to child components as explicit props
- Triggering side effects when field values change
- Global validation that spans more than one field

No field component should reach outside its own `source` to read or modify another field.

### Field components are scoped

A field component must:
- Only read and write the field identified by its own `source` prop
- Never call `useWatch`, `useInput`, or `useFormContext` for a field other than its own `source`
- Receive any value it needs from another field as an **explicit prop** passed by the form

```tsx
// Bad: SpecInput secretly watches 'kind' — a field it doesn't own
const SpecInput = ({ source }) => {
    const kind = useWatch({ name: 'kind' }); // ❌ watching another field
};

// Good: form derives kind, passes it as a prop
const MyForm = () => {
    const kind = useWatch({ name: 'kind' });
    return <SpecInput source="spec" kind={kind} />;
};
```

A field watching its **own** `source` (e.g. for dirty tracking or internal derived state) is acceptable — that is intrinsic, not hidden coupling.

### useFieldObserver for explicit side effects

When a field change needs to trigger a side effect (sync to external state, auto-fill another field, validation message, etc.), use a dedicated observer hook at the **form level**:

```ts
// Typed wrapper: watch a field, run a lambda when it changes
useFieldObserver<T>(source: string, effect: (value: T) => void): void
```

Every inter-field dependency is visible at the form level. Reading form **metadata** (`useFormState().dirtyFields`) inside a coordinator component is acceptable — it reads aggregate state, not a field value owned by another component.

### Hidden fixed logic and hardcoded dependencies are forbidden

Do not hide resource-specific fixes inside a generic field or shared component.

Examples of forbidden patterns:
- A `SpecInput` component removing `path` from a schema it received, or mutating the schema object in-place because a certain resource needs it.
- A generic guard reading a specific `spec` shape or a hardcoded `record.spec.path`/`kind` dependency to decide whether to warn.
- A child component writing to a different field than its own `source` to satisfy a one-off UI bug.
- “Just one more little fix” in a shared component to handle a specific resource, kind, or file-upload flow.

If the fix depends on a resource-specific convention, it belongs to the parent form or a small coordinator/hook that owns the field boundary.

```tsx
// Bad: shared field mutates another field silently
const SpecInput = ({ source, schema }) => {
    const path = useWatch({ name: 'path' });
    delete schema.properties.path; // ❌ hidden resource-specific fix
};

// Good: form owns the resource-specific boundary
const MyForm = () => {
    const path = useWatch({ name: 'path' });
    const filteredSchema = filterProperties(schema, ['path']);
    return <SpecInput source="spec" schema={filteredSchema} />;
};
```

**Rule:** if a component needs to know about a field it does not own, that dependency must be explicit in props or in the parent form’s `useWatch`/`useFormContext`, not hidden inside the component.

### No hybrid components

**Do not create components that mix form building with unrelated feature handling.**

Names like `CreateWithUpload`, `EditWithExtensions`, `FormAndFileManager` signal two collapsed concerns:
- Form structure (fields, steps, layout) belongs in the **page component** for that resource
- Feature logic (upload sync, extension loading) belongs in dedicated hooks or coordinator components

```tsx
// Bad: one component owns both form shape and upload wiring
<CreateSpecWithUpload uploader={uploader} getSpecUiSchema={...} />

// Good: page owns the form shape, hooks/coordinators own the feature wiring
const MyResourceForm = ({ uploader }) => {
    useUploaderSync({ uploader });          // controller hook
    const kind = useWatch({ name: 'kind' });
    return (
        <>
            <KindChangeGuard />             // coordinator component (renders only Confirm dialog)
            <KindSelector kinds={kinds} />
            <SpecInput source="spec" kind={kind} ... />
            {kind && uploader && <FileInput ... />}
        </>
    );
};
```

Each resource gets its own form component. Shared logic lives in hooks or focused coordinator components, not in hybrid form-building components that encode resource-specific structure.

### Acceptable cross-field access

Not violations:
- The form component itself reading multiple fields via `useWatch` to coordinate between them
- A field watching its own `source` for dirty tracking or format conversion
- A coordinator/guard component (renders no user-visible UI of its own) that reads form metadata and writes back to correct the form state

### One owner per field

**Each form field must have exactly one component that reads and writes it.** Two components registering the same `source`, or one component secretly updating a field owned by another, creates write conflicts and stale values that are silent and hard to diagnose.

When a conceptual value needs to live in two different locations (e.g. a file path that belongs in `spec.path` for the backend but must be managed independently from the JSON schema form that owns `spec`), the **form acts as the boundary coordinator** — it bridges the split at initialization and at submit, not inside field components:

- **Init**: provide the transient field via `defaultValues` function so it is initialized from the record without touching the owning field. Filter the key from the JSON schema using `filterProperties(schema, ['path'])` so the schema-driven component never renders or writes it.
- **Submit**: merge the transient field back into its final location in `transform`. Always use the transient field as the authoritative source — the nested copy inside the schema-owned field may be stale if the user never touched that component.

```tsx
// Edit: derive transient 'path' from spec.path at init; SpecInput never sees 'path'
<SimpleForm defaultValues={record => ({ path: record?.spec?.path ?? null })}>
    <SpecInput source="spec" schema={filterProperties(rawSchema, ['path'])} ... />
    <PathInput source="path" uploader={uploader} />
</SimpleForm>

// transform: merge path back; never read rest.spec.path — it may be stale
const transform = data => {
    const { path, ...rest } = data;
    return { ...rest, spec: { ...(rest.spec || {}), ...(path != null ? { path } : {}) } };
};
```

`spec.path` in the initial record is intentionally left in the form state untouched — it will disappear the first time SpecInput writes (because `path` is not in the filtered schema), and `transform` uses the top-level `path` regardless. No runtime synchronization between the two copies is needed.
