---
slug: restoring-files
title: "Discarding Changes with `git restore`"
topic: undoing-changes
kind: technique
summary: "Safely unstage files or discard uncommitted modifications in your working tree using the dedicated git restore command."
tags: [git-restore, undo, worktree]
related: [three-areas-three-states, amending-commits, git-reset-modes]
---
> **In one line:** Use git restore to discard unstaged working tree changes or unstage files without touching working tree edits.

## The idea

Introduced in Git 2.23, `git restore` provides a dedicated, safe interface for undoing uncommitted changes. Historically, developers used `git checkout` to discard changes and `git reset` to unstage, which overloaded those commands and caused confusion.

`git restore` operates on files in your working tree and staging area:
1. **Unstaging a file (`git restore --staged <file>`):** Moves changes from the staging area back to the working tree. Your file modifications are preserved completely—they simply become unstaged.
2. **Discarding working tree changes (`git restore <file>`):** Overwrites modified files in your working tree with the version from `HEAD` or the index. **This operation is destructive**; uncommitted changes in that file are permanently lost.

| Goal | Command | Affects Working Tree? | Destructive? |
|---|---|---|---|
| **Unstage a file** | `git restore --staged <file>` | No (keeps edits) | Safe |
| **Discard file edits** | `git restore <file>` | Yes (reverts to index) | Yes (uncommitted edits erased) |
| **Discard all edits in repo** | `git restore .` | Yes (reverts all files) | Yes (all uncommitted edits erased) |
| **Restore from specific commit** | `git restore --source=HEAD~2 <file>` | Yes (loads historical version) | Yes |

## See it

Unstage and discard changes safely:

```bash
# Modify two files and stage one
echo "temp" >> app.ts
echo "config" >> config.ts
git add app.ts

# Unstage app.ts (keeps your edits in working tree)
git restore --staged app.ts

# Discard edits to config.ts entirely (reverts to last snapshot)
git restore config.ts

# Verify status is clean
git status
```

## Go deeper

The `--source` flag allows you to restore a file in your working tree to match any historical commit without switching branches or altering HEAD. For example, `git restore --source=v1.0.0 schema.sql` loads the schema as it existed in release `v1.0.0` straight into your working tree.

> **Tip:** If you are unsure whether you want to discard changes, run `git stash` instead of `git restore` so you can retrieve them later.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Running `git restore <file>` on work you haven't committed; Git has never recorded those bytes, so they cannot be recovered.
- Confusing `git restore --staged` (safe) with `git restore` (destructive to uncommitted edits).

## Remember

- `git restore --staged <file>` safely unstages a file while preserving your modifications in the working tree.
- `git restore <file>` discards uncommitted modifications, reverting the file to its staged or committed state.
- `git restore` was introduced in Git 2.23 to replace the overloaded `git checkout -- <file>`.
