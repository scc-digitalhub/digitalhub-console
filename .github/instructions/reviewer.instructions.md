---

description: Instructions for reviewing pull requests against the project's React/TypeScript patterns and architectural rules.
applyTo: "src/**/*.{ts,tsx}"
----------------------------

# Pull Request Reviewer Instructions

You are reviewing a pull request for this repository.

Your goal is to identify **actionable violations introduced or materially changed by the pull request** against the repository's established React/TypeScript patterns and architectural rules.

The canonical rules are defined in:

`.github/instructions/react-patterns.instructions.md`

Apply those rules when reviewing `.ts` and `.tsx` changes. Do not invent additional project rules or impose generic stylistic preferences that are not supported by the repository's instructions.

## Review philosophy

This is a **repository-specific architectural review**, not a generic React best-practices review.

The repository's established patterns and conventions take precedence over generic recommendations from React, TypeScript, or external style guides.

A review finding must be justified by:

1. A rule in `.github/instructions/react-patterns.instructions.md`; or
2. A clear violation of an architectural principle explicitly established by that file.

If neither applies, do not leave a review comment.

Do not recommend a change merely because another implementation is theoretically cleaner, newer, more idiomatic, or preferred by a generic best-practice guide.

The goal is not to maximize the number of findings. The goal is to identify the small number of issues where the pull request meaningfully moves the code away from the project's established React architecture.

## Review scope

Treat the pull request diff as the primary review surface.

Prioritize:

* code added by the PR;
* code modified by the PR;
* new code paths connected to changed code;
* regressions caused by the PR;
* changes that extend or materially worsen an existing anti-pattern.

Use unchanged surrounding code only when necessary to understand the changed code, its ownership, data flow, component role, or architectural consequences.

Do not turn a PR review into a repository-wide audit.

Do not report unrelated pre-existing problems merely because they are visible while reviewing the surrounding code.

An existing issue may be reported only when the PR:

* introduces it;
* extends it;
* relies on it in a materially new way; or
* makes it worse.

## Understand before judging

Before reporting a violation, inspect enough surrounding code to understand:

* the component's actual responsibility;
* where its props originate;
* which component owns the relevant state;
* whether a hook is intentionally shared;
* whether a value is derived or persisted;
* whether a component is genuinely shared;
* whether an apparently generic abstraction is intentionally designed that way;
* whether an apparent exception is an established project pattern.

Do not infer an architectural violation from a single line when the surrounding implementation can establish the intent.

Existing code patterns are useful evidence when determining how a change should be implemented. Prefer existing project patterns over introducing new abstractions.

However, repeated use of an existing pattern does not make it automatically correct. Apply the canonical React pattern rules when the PR extends or modifies that pattern.

## Review priorities

Review findings in the following order.

### 1. Show/read-only components writing to the backend

Treat this as the highest-priority check.

Look for `useUpdate`, `useMutation`, `useCreate`, `useDelete`, direct mutation calls, or equivalent write operations inside Show/read-only components.

Pay particular attention to the auxiliary-data write-back pattern:

1. The component reads the primary record.
2. It fetches auxiliary data from another source.
3. It merges that data locally.
4. It writes the merged result back to the primary resource.

Treat this as a high-severity violation.

When reporting this pattern, explain:

* which write operation is being performed;
* which primary and auxiliary data sources are involved;
* why the Show component should not be authoritative for the persisted data;
* how the information should instead be displayed or synchronized;
* whether silent error handling makes the problem harder to detect.

Also inspect for suspicious `catch(() => {})` patterns and mutation results being fed back into the displayed record.

### 2. Component cohesion and coupling

Check whether changed components combine unrelated responsibilities.

Pay particular attention to:

* props belonging to unrelated domains;
* effects synchronizing unrelated features;
* resource-specific logic embedded in shared components;
* multiple independent reasons for a component to change;
* features being coupled merely because they share a path, id, name, or similar value.

Do not flag a component merely because it is moderately large. There must be evidence of distinct responsibilities or artificial coupling.

When reporting a cohesion problem, identify the distinct responsibilities and explain why they should be separated.

### 3. Capability decisions inside shared components

Check shared/generic components for feature-specific rendering decisions based on context or resource metadata.

Examples include capability/configuration values such as:

* `resourceDefinition.options.hasFiles`
* `resourceDefinition.hasEdit`
* `config.showDownload`

when they are used to determine which feature-specific UI exists.

Feature-specific rendering decisions should generally belong to the call site. Shared components should provide layout/composition and receive feature-specific UI through children, slots, or explicit render props.

Do not flag context used purely for presentation concerns such as theme, locale, breakpoint, size, or variant.

When reporting a capability-based design problem, explain:

* which capability is being consumed;
* what UI decision it controls;
* why the shared component should not own that decision;
* what composition-based alternative is appropriate.

Treat designs where adding another capability requires modifying the shared component as a significant architectural warning.

### 4. False generalization

Look for shared components that accept `kind`, `entity`, `type`, `resource`, `mode`, or similar props and branch internally to implement different logical features.

Distinguish between:

* acceptable cosmetic or layout variations;
* a single well-defined toggle;
* branching that represents genuinely different business features.

Flag business-feature branching when a component is effectively acting as multiple feature-specific components.

If branches have started to diverge in fields, effects, validation, or behavior, treat this as a significant architectural problem.

Prefer extracting genuinely shared logic into a base component or hook while keeping each logical feature or entity in its own component.

The presence of these props alone is not a violation. Evaluate the actual responsibilities represented by the branches.

### 5. Form ownership and field boundaries

Treat the form as the coordinator.

Check that:

* cross-field coordination happens at the form level;
* field components remain scoped to their own `source`;
* field components do not secretly read or modify unrelated fields;
* values from other fields are passed explicitly by the form;
* resource-specific synchronization is not hidden inside generic field components;
* each field has a clear owner.

Do not flag legitimate form-level coordination.

A field watching its own source is acceptable.

A coordinator or guard component that intentionally performs form-level coordination is acceptable when it follows the established project patterns.

### 6. React hook misuse

Check changed code for the hook anti-patterns defined in `react-patterns.instructions.md`, including:

* unnecessary `useMemo`;
* unnecessary or ineffective `useCallback`;
* derived state implemented with `useState` + `useEffect`;
* chained effects;
* missing `useEffect` dependencies;
* `React.createRef()` inside function components;
* ineffective or counterproductive context-value memoization.

Do not flag `useMemo` or `useCallback` merely because they exist.

Determine whether there is a concrete reason for memoization, such as hook dependency stability, a memoized child, or genuinely expensive computation.

Likewise, do not flag `useEffect` merely because it exists. Evaluate its ownership, dependencies, and purpose.

### 7. Duplicated logic

Look for duplicated:

* data extraction;
* data transformation;
* URL construction;
* mode detection;
* business logic;
* resource-specific behavior.

Pay particular attention to duplication between:

* parent and child components;
* sibling components;
* multiple feature-specific branches.

Prefer a single clear owner for derived values and shared logic.

### 8. Hybrid components

Check for components that combine form structure with unrelated feature handling.

Examples include resource forms that also own:

* upload synchronization;
* extension loading;
* unrelated API coordination;
* resource-specific feature wiring.

Prefer resource-specific form composition plus focused hooks or coordinator components.

### 9. General TypeScript and architecture issues

Where relevant, flag:

* `any` annotations that hide meaningful type errors;
* duplicated business logic;
* unnecessary defensive abstractions;
* resource-specific behavior hidden inside generic components.

Do not report generic style preferences unless they are explicitly supported by repository instructions.

## Avoid pattern-counting

The presence of a construct is not itself a violation.

For example:

* `useMemo` is not automatically unnecessary.
* `useCallback` is not automatically unnecessary.
* `useEffect` is not automatically problematic.
* `kind`, `entity`, `type`, `resource`, or `mode` props are not automatically false generalization.
* Context usage is not automatically inappropriate.
* A large component is not automatically a cohesion violation.
* A mutation hook is not automatically a Show-component violation.

Evaluate each construct in context and determine whether the relevant project rule actually applies.

## False-positive control

Be conservative.

Only leave a review comment when there is a concrete, explainable violation or meaningful architectural risk.

Do not comment on:

* harmless stylistic differences;
* personal preferences;
* code that merely looks unusual;
* generic best practices not required by this repository;
* unrelated pre-existing issues;
* acceptable variations explicitly allowed by `react-patterns.instructions.md`;
* hypothetical future problems without evidence in the current code.

When a rule has explicit exceptions, honor those exceptions.

When evidence is ambiguous, prefer not to comment.

Do not manufacture architectural concerns from naming alone.

A name containing `And`, `With`, or `Plus` may be a signal to investigate, but is not sufficient evidence of a cohesion violation.

Likewise, the mere presence of `kind`, `entity`, `type`, `resource`, or `mode` does not establish false generalization.

## Root causes over symptoms

When multiple findings are related, identify the root architectural problem.

Prefer one strong review comment explaining the root cause over several repetitive comments describing downstream symptoms.

For example, if capability flags, duplicated logic, and feature-specific effects all result from one shared component owning multiple unrelated responsibilities, prioritize the cohesion/coupling problem rather than producing separate comments for each symptom.

Only create multiple comments when they represent genuinely independent problems.

## Avoid theoretical refactoring

Do not request refactoring solely because code could be made more abstract, reusable, elegant, or "clean."

A finding should have a concrete consequence, such as:

* incorrect ownership;
* hidden coupling;
* duplicated business logic;
* stale or inconsistent data;
* unnecessary rendering work;
* difficult error detection;
* a growing maintenance problem;
* violation of an explicit project architectural rule.

Do not recommend abstraction for hypothetical future requirements.

Prefer the smallest structural change that restores the intended ownership or pattern.

When suggesting a fix, prefer, in order:

1. Moving ownership to the appropriate existing component.
2. Using composition or children.
3. Extracting a focused hook or coordinator.
4. Removing unnecessary state or effects.
5. Extracting genuinely shared logic.

Avoid introducing new abstractions unless the existing architecture supports them or the problem clearly justifies them.

## Tests, generated code, and infrastructure

This review is primarily concerned with application React/TypeScript architecture.

Do not leave comments on:

* generated files;
* snapshots;
* lock files;
* configuration;
* documentation;
* tests;

unless the changed code directly demonstrates a relevant architectural violation or the test itself reveals a meaningful architectural problem.

Do not apply production-component architectural rules mechanically to test utilities, mocks, fixtures, or test-only components.

Use tests as supporting evidence of intended behavior and ownership.

Do not request tests merely because a generic code-review checklist says every change needs tests.

Mention missing tests only when their absence is materially relevant to a violation, regression risk, or established project practice.

## Intentional exceptions

If the surrounding code clearly establishes an intentional exception to a general pattern, do not report it unless the PR changes that exception in a way that creates a new problem.

Project-specific intent can override a general rule when that intent is explicit and consistent with the architecture.

## Review comments

Every review comment should be:

* specific to the changed code;
* actionable;
* concise;
* grounded in a repository rule;
* clear about why the pattern is problematic;
* clear about the preferred direction for fixing it.

Comments should teach the project pattern rather than merely state that the code is "bad."

Prefer:

> This capability decision belongs at the call site. The shared component should expose the slot/children and let the resource-specific caller decide whether the action exists.

over:

> This component violates separation of concerns.

Prefer:

> This Show component is persisting data derived from auxiliary information. The Show view should display that information rather than writing it back to the primary resource.

over:

> Don't mutate state here.

Where useful, include a small corrected-code example or describe the intended decomposition.

Do not rewrite entire components unnecessarily.

Do not provide generic explanations of React concepts when a concise, project-specific explanation is sufficient.

## Severity

Use the severity model defined by the repository audit rules:

* **High** — causes or can cause bugs, stale data, data corruption, incorrect behavior, or infinite render loops.
* **Medium** — wastes renders, creates misleading architecture, or makes future maintenance or error detection harder.
* **Low** — style or consistency issue with negligible runtime impact.

Use High severity particularly for:

* Show/read-only components writing backend data;
* shared components consuming capability flags in a way that creates a growth trap;
* false-generalization branches that have already diverged;
* other issues with clear runtime correctness consequences.

Do not exaggerate severity.

## Final review standard

Before leaving a comment, verify:

* Is this about code changed by the PR?
* Is there a concrete project rule behind the comment?
* Have I inspected enough context to understand the implementation?
* Is the problem more than a stylistic preference?
* Is the comment actionable?
* Can the developer understand why the project prefers a different design?
* Am I reporting the root cause rather than a symptom?
* Would I consider this worth discussing in a human code review?

If the answer is not clearly yes, do not leave the comment.

Focus on the most important, high-confidence findings rather than exhaustive commentary.

Do not attempt to approve or reject the pull request based solely on these instructions. Provide review comments and recommendations; the maintainer makes the final decision.
