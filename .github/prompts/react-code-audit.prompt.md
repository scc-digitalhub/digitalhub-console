---
description: "Audit a React/TypeScript file or component for code quality issues: misused hooks, derived state anti-patterns, stale closures, and architectural problems."
name: "React Code Quality Audit"
argument-hint: "File or component to audit (leave blank to audit the active file)"
agent: "agent"
---

Perform a thorough code quality audit of the specified file (or the currently active file if none is given).

Evaluate the following categories and report findings with file links and line numbers. For each issue, state: what the problem is, why it matters, and the corrected code.

---

## 0. Show/read-only components writing to the backend (CHECK THIS FIRST — highest risk)

This is the highest-severity class of bug in this codebase. Scan for any use of `useUpdate`, `useMutation`, `useCreate`, `useDelete`, or direct `dataProvider` mutation calls inside components that are:
- Named `*Show*`, `*View*`, `*Detail*`, `*Display*`, `*Preview*`
- Used on Show/read-only pages
- Wrapped inside `<Show>`, `<SimpleShowLayout>`, or `RecordContextProvider` without a form

For each occurrence, check for the **auxiliary-merge write-back** pattern:
1. The component reads the primary record from context.
2. It fetches auxiliary data from a second source (file storage API, metrics API, external service).
3. It merges the two locally and calls a write hook to persist the merged result back to the primary resource.

**Why this is critical**: the browser client is not the authority on data it received from a second API. External systems (background jobs, Python SDKs, other services) that write to the same resource will have their updates silently overwritten whenever a user opens the page. The bug manifests as data corruption in backend systems, not as a UI error — especially if the write is inside a `catch(() => {})` that swallows errors.

For each finding:
1. **Name the write hook** and where it is called.
2. **Identify the two data sources** being merged (primary record + what auxiliary source?).
3. **Who is the actual authority** on the data being written back? (Always: not the browser Show component.)
4. **What is the correct pattern?** Display the auxiliary data locally. If the backend needs updating, it must be a backend-side process or an explicit user-initiated action — never a passive side effect of viewing a record.
5. **Check for silent error suppression**: is there an empty `catch(() => {})` hiding failures?

Always flag as **High** severity.

---

## 1. useMemo misuse

- Is `useMemo` used for values that are only consumed in the render return (no hook dependency, no memoized child)? → Remove it.
- Are any dependencies themselves non-stable (inline functions, inline objects, non-memoized values)? → The memoization is a no-op; fix or remove.
- Does the memoized value include state that must stay current (e.g. `isOpen`)? → Memoization is counterproductive; remove.
- Is the computation genuinely expensive, or is it a trivial field access? → Trivial → remove.

## 2. useCallback misuse

- Is `useCallback` applied to event handlers that are NOT deps of other hooks and NOT passed to `React.memo()` children? → Remove.
- Are some handlers wrapped and others not, with no apparent reason? → Flag the inconsistency.

## 3. Derived state anti-patterns

- Is there a `useState` + `useEffect` pair where the state is fully derivable from other state or props? → Replace with an inline variable.
- Are there chained effects (effect sets state → triggers another effect)? → Collapse into one derivation or one effect.

## 4. useEffect correctness

- Are all values read inside an effect present in the dependency array? → Flag missing deps (stale closure risk).
- Does any effect exist only to sync derived state? → Eliminate it.

## 5. Ref usage

- Is `React.createRef()` used inside a function component? → Replace with `useRef`.

## 6. Duplicated logic

- Is the same data extraction or transformation performed in both a parent and child component? → The parent should derive the value once and pass it as a prop.

## 7. Context provider values

- Is a `Context.Provider value={...}` object memoized? Check whether the deps are truly stable. If not, the memo is a no-op or masks a design issue.
- If the context value contains current state (must stay fresh), is it still being memoized? → Flag as incorrect.

## 8. General architecture signals

- Are there components that re-render excessively because they hold too much unrelated state? → Suggest decomposition.
- Is business logic (data transformation, URL extraction, mode detection) duplicated across sibling components? → Suggest lifting or a shared utility.
- Are there `any` type annotations that hide potential bugs? → Flag for proper typing.

## 9. Component cohesion and coupling (MOST IMPORTANT — check this first)

**Name smells**: Does the component name contain "And", "With", "Plus", or other conjunctions? These almost always signal a component that has two responsibilities. Flag the name and explain what the two responsibilities are.

**Props domain check**: Do the props of this component come from two or more unrelated domains (e.g. schema config AND file upload config AND network config)? A component whose props span unrelated domains is almost certainly doing too many things. List the prop groups and their domains.

**Effect coupling**: Are there `useEffect` hooks whose sole purpose is to synchronize two otherwise-unrelated features (e.g. writing a value from feature A into the form field used by feature B)? These effects are the connective tissue of an architectural violation — the features should be decoupled, not glued by effects.

**Single Responsibility check**: State explicitly how many reasons this component has to change. If changes to the file upload system AND changes to the schema form would both require editing this file, it violates SRP. Name each responsibility.

**Artificial co-location**: Are two features only in the same component because they share *one* piece of data (e.g. a path, an id, a name)? Sharing one value is not a sufficient reason to merge features. The shared value should be lifted to the parent and passed down independently to each feature component.

For each violation found in this category, describe: (1) what the two responsibilities are, (2) what the *only* coupling point between them is, and (3) what the decomposed structure would look like.

## 10. Capability flag consumption in shared components

Look for shared/generic components (toolbars, layouts, forms) that read feature-flag or capability props from context — e.g. `resourceDefinition.options.hasFiles`, `resourceDefinition.hasEdit`, `config.showDownload` — to conditionally include or exclude UI elements.

This is a distinct anti-pattern from entity branching (category 11). The flags may be correctly owned by a resource definition rather than hardcoded, but the *shared component* is still the one making rendering decisions that belong at the call site.

For each occurrence:
1. **What is the flag?** Name the capability flag being read and where it comes from.
2. **What rendering decision does it control?** Which element is conditionally shown/hidden?
3. **Who should own that decision?** The answer is always the call site (the parent that renders the shared component), not the shared component itself.
4. **What is the composition-based fix?** Show how the element would be passed in as a child or explicit prop instead.

Also flag the **growth trap**: if adding a new capability would require modifying this shared component, the design is closed for extension. That is always High severity.

**Do not flag**: reading context that is about *how* to render (theme, locale, breakpoint, `variant`, `size`). Only flag reading context that decides *what* to render.

**Important nuance**: if the capability flags were previously inline `if kind === X` checks inside the component and were moved to a `resourceDefinition` object, that is an improvement in ownership — but the rendering decision problem remains. Flag it, but note the partial improvement.

## 11. False generalization (entity/kind branching inside shared components)

Scan for components that accept a `kind`, `entity`, `type`, `resource`, or `mode` prop and branch on it internally to alter behaviour for different logical features:

```tsx
if (kind === 'artifact') { ... }
if (entity === 'function') { ... }
switch (resource) { case 'dataitem': ...; case 'model': ...; }
```

For each occurrence:
1. **Name the branches**: what are the distinct features or entities that are conditionally handled?
2. **Is this acceptable branching?** Cosmetic props (`size`, `variant`, `readonly`) and single-dimension toggles are fine. Branching that encodes *different business features* is not.
3. **What is the shared logic?** Identify what is genuinely common and could become a shared base component or hook.
4. **Describe the decomposition**: show what the component tree would look like if each branch were its own component using the shared base.

Flag the finding as **High** severity if different branches have already started diverging (different fields, different effects, different validation) — this is the point where the merged component actively causes bugs and regressions.

---

## Final output

### Step 1 — Root cause analysis

Before writing the summary table, review all findings and identify which are **root causes** and which are **symptoms** of another finding. A symptom is a finding that would not exist if a root-cause finding were fixed.

For each symptom, note: *"This finding is a downstream consequence of finding #N."*

Present this as a short paragraph, e.g.:
> Finding #1 (capability flags) and #2 (version fetch inside toolbar) are both symptoms of finding #3 (SRP violation). Fixing #3 by extracting the version logic into a hook and passing buttons as children would eliminate #1 and #2 automatically.

### Step 2 — Summary table

| # | Category | Severity (High/Med/Low) | File | Line(s) | Root cause or symptom | One-line description |
|---|----------|------------------------|------|---------|----------------------|----------------------|

Severity guide:
- **High**: causes bugs, stale data, or infinite render loops
- **Med**: wastes renders, misleads future developers, masks real problems
- **Low**: style/consistency issue, negligible runtime impact

Prioritize fixing root causes. Symptoms that are downstream of a root cause inherit its severity but should not be fixed in isolation.
