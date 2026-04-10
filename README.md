# Project Template

This is the canonical starting point for every new project in this workspace.

## How to use

1. Copy this entire folder to a new location:
   ```bash
   cp -r project-template/ ~/projects/my-new-project
   cd ~/projects/my-new-project
   git init
   ```

2. Fill in `PROJECT_BRIEF.md` first. Do not start coding until the brief is clear.

3. Run your spec tool (Spec Kit or equivalent) and put outputs in `specs/`.

4. Update `ARCHITECTURE.md` with the system design from the spec.

5. Populate `TASKS.md` from the spec's task breakdown.

6. Open Claude Code, point it at this folder, and start with `CLAUDE.md`.

## File Purposes

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Instructions for Claude Code — read first, every session |
| `PROJECT_BRIEF.md` | Goals, scope, constraints, success criteria |
| `ARCHITECTURE.md` | System design, components, data model, infra |
| `TASKS.md` | Ordered task list with context and acceptance criteria |
| `DECISIONS.md` | Architectural and process decisions with rationale |
| `specs/` | Spec Kit outputs, user stories, acceptance tests |
| `docs/` | Internal docs, handoff notes, runbooks |
| `src/` | Source code |
| `tests/` | Test files |

## Naming convention for the repo

Use lowercase kebab-case: `my-project-name`

## Git setup

After copying, initialize the repo and make an initial commit:

```bash
git init
git add .
git commit -m "chore: init project from workspace template"
```
