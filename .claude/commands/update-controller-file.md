---
name: update-controller-file
description: Workflow command scaffold for update-controller-file in shiftleft-ts-demo.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /update-controller-file

Use this workflow when working on **update-controller-file** in `shiftleft-ts-demo`.

## Goal

Make changes to a specific controller (e.g., Login or Order) in the src/Controllers directory.

## Common Files

- `src/Controllers/Login.ts`
- `src/Controllers/Order.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit the relevant controller file in src/Controllers (e.g., Login.ts or Order.ts)
- Commit the change with a message indicating the file updated

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.