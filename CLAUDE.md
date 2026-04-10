# CLAUDE.md — Instructions for Claude Code

Read this file completely at the start of every session. These rules are not optional.

---

## Session Start Checklist

Before writing any code, do all of the following in order:

1. **Read `PROJECT_BRIEF.md`** — understand what this project is and why it exists.
2. **Read `TASKS.md`** — identify the current task queue and the first incomplete item.
3. **Read `ARCHITECTURE.md`** — understand the system structure before touching anything.
4. **Read `DECISIONS.md`** — know what has already been decided and why.
5. **State your plan** — describe what you intend to do this session and which task you'll tackle first.
6. **Wait for confirmation** — do not start editing until the user confirms the plan.

---

## Scoping Rules

- Work on **one task at a time**. Complete it, confirm it, then move to the next.
- If a task is ambiguous, ask for clarification before starting. Do not guess at scope.
- If you discover the task is larger than expected, stop and report back. Do not expand scope silently.
- Never start a new feature while a previous one is in an incomplete or broken state.

---

## Planning Before Editing

- For any change that touches more than one file, write out a brief plan first:
  - What files will be changed
  - What the change will do
  - What could break
- Wait for approval before making the changes.
- For single-file, low-risk changes, you may proceed — but summarize what you're doing first.

---

## Change Guidelines

- **Keep changes minimal and reversible.** Prefer small, incremental changes over large rewrites.
- **Do not refactor code that isn't related to the current task.** If you notice something to improve, note it in `TASKS.md` instead of fixing it now.
- **Do not rename files, move directories, or restructure the codebase** without explicit approval.
- **Do not install new dependencies** without listing them and asking for approval first.
- **Do not change environment configuration, CI/CD pipelines, or infrastructure code** without explicit discussion.

---

## Architecture Changes — Hard Stop

The following require explicit approval before any work begins:

- Introducing a new external dependency or service
- Changing the database schema in a non-additive way
- Changing the authentication or authorization model
- Splitting or merging services/modules
- Changing how the application is deployed or built
- Any change that cannot be cleanly reverted in one step

If you believe an architecture change is necessary, describe the problem and the options in writing. Do not implement anything until told to proceed.

---

## Updating Tasks and Decisions

- When a task is complete, mark it done in `TASKS.md` with the date.
- If a new task is discovered during work, add it to `TASKS.md` in the correct priority position.
- If a significant decision was made during the session (about design, approach, tooling, etc.), add it to `DECISIONS.md` using the existing format.
- At the end of the session, provide a session summary suitable for use as a handoff note.

---

## Testing and Validation

- Do not mark a task complete unless it has been tested.
- For new features: write or update tests as part of the task, not as a follow-up.
- For bug fixes: confirm the fix works and that the bug does not reappear in related paths.
- Run the test suite before closing a session. Report results.
- If tests are failing and you can't fix them within the task scope, flag clearly and do not hide the failure.

---

## Code Quality

- Follow the existing code style. Do not introduce a new style in isolation.
- Use existing patterns in the codebase before creating new ones.
- Prefer explicit over implicit. Prefer readable over clever.
- Comments should explain *why*, not *what*. Remove commented-out code.

---

## Session End Checklist

Before ending the session, confirm:

- [ ] Current task is complete or clearly paused with a note
- [ ] `TASKS.md` is updated
- [ ] `DECISIONS.md` is updated with anything decided this session
- [ ] Tests were run and results are noted
- [ ] No broken state was left in the codebase
- [ ] Handoff summary is provided

---

## If You Are Unsure

Ask. Do not proceed on assumptions. A short clarifying question saves significant rework.
