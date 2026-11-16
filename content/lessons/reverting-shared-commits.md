---
slug: reverting-shared-commits
title: "Undoing Shared Commits with `git revert`"
topic: undoing-changes
kind: technique
summary: "Safely undo commits on public or shared branches by generating a new forward-moving inverse commit with git revert."
tags: [git-revert, collaboration, undo]
related: [git-reset-modes, amending-commits, golden-rule-of-rebasing]
---
> **In one line:** git revert creates a new commit that records the exact inverse of a previous commit, preserving linear shared history.

## The idea

When you need to undo a commit that has already been pushed to a shared branch (like `main`), commands that rewrite history like `git reset` or `git commit --amend` are dangerous. They change commit hashes and orphan commits that your colleagues may have already based work on.

The safe, professional way to undo shared history is `git revert`.

`git revert <commit>` does not delete the target commit. Instead, it figures out what changes were made in that commit, computes the exact opposite (inverting additions into deletions and deletions into additions), and creates a **brand new commit** that applies that inverse patch.

Because `git revert` is strictly forward-moving and additive, history is preserved. Teammates can pull normally without merge conflicts or detached heads, and the historical record clearly documents when the feature was added and when it was rolled back.

| Operation | `git reset` | `git revert` |
|---|---|---|
| **Mechanism** | Moves branch pointer backwards | Creates a new inverse commit at branch tip |
| **History Effect** | Rewrites history (drops commit nodes) | Preserves history (strictly forward-moving) |
| **Safe for Shared Branches?** | No (breaks collaborators' branches) | Yes (standard practice for shared branches) |
| **Recoverability** | Requires reflog if unreferenced | Part of permanent commit log |

## See it

Revert a problematic commit that was already pushed to main:

```bash
# Revert a specific commit by hash, opening editor for message
git revert 3a8f1b2

# Revert without opening an editor, using the default message
git revert --no-edit 3a8f1b2

# Inspect log showing the original commit followed by the revert commit
git log --oneline -n 2
```

## Go deeper

If you need to revert a merge commit, Git requires you to specify `-m <parent-number>` (usually `-m 1`) to declare which parent line of history should be kept as the mainline. Reverting a merge commit reverses the code changes, but Git will still consider the merged branch's commits as having been merged, meaning future re-merges will not re-introduce those changes unless you revert the revert.

> **Tip:** You can revert multiple commits in sequence by passing a commit range: `git revert HEAD~3..HEAD`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Attempting to revert a merge commit without providing the `-m 1` parent selection flag.
- Using `git reset` on a public branch instead of `git revert`, forcing teammates to reconcile broken histories.

## Remember

- `git revert` creates a new commit that applies the exact inverse of a target commit.
- Always use `git revert` (not `git reset`) to undo changes on shared or public branches.
- Reverting preserves the historical audit trail of what was introduced and when it was rolled back.
