---
slug: head-and-detached-head
title: "HEAD and Detached HEAD State"
topic: branching-merging
kind: concept
summary: "Understand HEAD as Git's current pointer, and learn what a detached HEAD state means and how to safely navigate it."
tags: [head, detached-head, pointers]
related: [branches-as-pointers, branch-operations, git-reflog]
---
> **In one line:** HEAD is the pointer to your currently checked-out branch or commit; when pointing directly to a commit, HEAD is detached.

## The idea

Git has a special pointer named `HEAD`. You can think of `HEAD` as the 'You are here' marker on a map. It indicates what you currently have checked out in your working tree.

Normally, `HEAD` does not point directly to a commit. Instead, it is a **symbolic reference** pointing to a branch pointer (e.g. `ref: refs/heads/main`), which in turn points to a commit. When you commit, Git checks `HEAD` to find which branch to advance.

A **detached HEAD** state occurs when you check out a specific commit hash, a remote-tracking branch, or a tag directly (e.g. `git checkout <hash>`). In this state, `HEAD` points straight to the commit itself rather than to a branch name. You can explore the code and compile historical versions without issue, but any new commits you make are not attached to any branch. If you switch away, those commits become orphaned.

| State | What `.git/HEAD` Contains | When You Commit |
|---|---|---|
| **Normal (Attached)** | `ref: refs/heads/main` | Active branch moves forward to the new commit |
| **Detached HEAD** | `e83f2a1...` (raw hash) | New commit created, but no branch moves; orphan risk |

## See it

Inspect `HEAD` and explore a detached HEAD safely:

```bash
# Check where HEAD currently points
cat .git/HEAD

# Check out a specific past commit hash (enters detached HEAD)
git checkout HEAD~1

# View detached status warning from Git
git status

# To save work done in detached HEAD, create a branch right here:
git switch -c rescue-experimental-work
```

## Go deeper

If you make commits in a detached HEAD state and then run `git switch main` without creating a branch, Git displays a warning message displaying the commit hashes you left behind. If you ever lose those commits, `git reflog` records their hashes so you can rescue them with `git branch <new-branch> <hash>`.

> **Note:** Modern Git introduced `git switch` specifically to prevent accidental detached HEAD states: `git switch` requires `--detach` to detach HEAD, whereas the older `git checkout` did so silently.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Switching away from a detached HEAD where you made new commits without creating a branch first.
- Panicking when Git warns you are in a detached HEAD; your code is not damaged—simply attach a branch.

## Remember

- `HEAD` is a reference indicating your currently checked-out branch or commit.
- In detached HEAD, HEAD points directly to a commit hash rather than a named branch.
- Attach a branch with `git switch -c <name>` before switching away to preserve experimental commits.
