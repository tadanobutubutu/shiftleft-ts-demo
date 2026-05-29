---
name: empty-commit-to-trigger-tests
description: Workflow command scaffold for empty-commit-to-trigger-tests in shiftleft-ts-demo.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /empty-commit-to-trigger-tests

Use this workflow when working on **empty-commit-to-trigger-tests** in `shiftleft-ts-demo`.

## Goal

Create an empty commit to trigger CI/CD or final tests without changing any files.

## Common Files

- Inspect the files touched by the related commits before editing.

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create an empty commit (no file changes)
- Push the commit to trigger tests

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.