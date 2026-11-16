---
slug: git-reset-modes
title: "The Three Modes of `git reset`"
topic: undoing-changes
kind: concept
summary: "Master the three flags of git reset—soft, mixed, and hard—and know precisely what each does to HEAD, the index, and your working tree."
tags: [git-reset, undo, internals]
related: [amending-commits, restoring-files, reverting-shared-commits]
---
> **In one line:** git reset moves the current branch pointer backwards, with --soft, --mixed, and --hard controlling index and worktree updates.

## The idea

The `git reset` command is one of Git's most powerful history-altering tools. When given a commit reference (like `git reset HEAD~1`), its primary job is to move the current branch pointer backwards to that commit.

What happens to your staging area and working tree depends entirely on the mode flag you choose:
1. **`--soft`:** Moves the branch pointer (`HEAD`) only. Leaves the staging area and working tree untouched. All changes from the undone commits remain staged and ready to commit.
2. **`--mixed` (Default):** Moves `HEAD` AND resets the staging area to match the target commit. Leaves the working tree untouched. Your changes remain on disk as modified, unstaged files.
3. **`--hard`:** Moves `HEAD`, resets the staging area, AND resets the working tree. **Destructive!** Any uncommitted modifications in your working tree and the undone commits are erased.

| Mode Flag | Moves Branch (`HEAD`)? | Resets Staging Area? | Resets Working Tree? | Danger Level |
|---|---|---|---|---|
| `--soft` | Yes | No (stays staged) | No (kept) | Safe |
| `--mixed` (default) | Yes | Yes (unstaged) | No (kept) | Safe |
| `--hard` | Yes | Yes | Yes (discarded) | Destructive |

## See it

Compare the practical effects of reset modes:

```bash
# Undo last commit but keep changes staged for recommit
git reset --soft HEAD~1

# Undo last commit and unstage changes, keeping edits in files
git reset --mixed HEAD~1

# Completely wipe last commit and erase all local working tree changes
git reset --hard HEAD~1
```

## Go deeper

Think of the three areas as a stack:
- Step 1: Move `HEAD` to the target commit (what `--soft` does).
- Step 2: Make the Index match the new `HEAD` (what `--mixed` does).
- Step 3: Make the Working Tree match the Index (what `--hard` does).

Because `reset` rewrites branch history by moving the branch pointer, never run `git reset` on commits that have been pushed to a shared public branch.

> **Watch out:** Running `git reset --hard` destroys uncommitted modifications in your working tree. Those uncommitted bytes were never stored in Git and cannot be recovered.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Running `git reset --hard` when you have uncommitted edits; uncommitted files are permanently wiped.
- Using `git reset` on shared remote branches; use `git revert` instead to preserve history.

## Remember

- `--soft` moves HEAD only, keeping changes staged.
- `--mixed` (the default) moves HEAD and unstages changes, keeping modifications in the working tree.
- `--hard` resets HEAD, index, and working tree, destroying uncommitted work.
