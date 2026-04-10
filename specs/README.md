# specs/

This folder holds all spec-driven planning outputs for this project.

## What goes here

- Spec Kit output files (user stories, acceptance criteria, functional specs)
- Manually written feature specs
- API contracts or interface definitions generated during planning
- Wireframe references or linked design files

## What does NOT go here

- Source code
- Test files (those go in `tests/`)
- Architecture diagrams (those go in `ARCHITECTURE.md` or `docs/`)

---

## Recommended file naming

| File | Contents |
|------|---------|
| `spec-v1.md` | Initial Spec Kit output |
| `spec-v2.md` | Revised spec after feedback |
| `feature-auth.md` | Spec for a specific feature |
| `api-contract.md` | Endpoint definitions, request/response shapes |
| `acceptance-tests.md` | Human-readable acceptance test scenarios |

---

## Spec → Task flow

Once a spec is written and reviewed:

1. Extract discrete implementation tasks from the spec.
2. Add them to `TASKS.md` in priority order.
3. Each task should reference the spec section it implements.
4. Do not begin implementation until tasks are confirmed and ordered.

---

## Spec Kit usage

If using Spec Kit:

1. Run Spec Kit against `PROJECT_BRIEF.md`.
2. Save the output here as `spec-v1.md`.
3. Review the output, edit as needed, and save revisions as `spec-v2.md`.
4. Use the accepted spec as the basis for `TASKS.md` population.
