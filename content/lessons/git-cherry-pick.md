---
slug: git-cherry-pick
title: "Copying Commits with `git cherry-pick`"
topic: undoing-changes
kind: technique
summary: "Apply the exact change introduced by any existing commit onto your current branch with git cherry-pick."
tags: [git-cherry-pick, hotfix, branching]
related: [git-stash, git-reflog, rebase-fundamentals]
---
> **In one line:** git cherry-pick copies the patch introduced by a specific commit and replays it as a new commit on your current branch.

## The idea

Sometimes a commit made on one branch is urgently needed on another branch, without merging all the other unrelated commits from that branch. A classic example is a critical bug fix committed on a future `develop` branch that must be immediately back-ported into a live `release` branch.

`git cherry-pick <commit-hash>` solves this problem.

It inspects the changes introduced by the target commit, applies that exact patch to your currently checked-out branch, and records a brand new commit. The new commit contains the same code changes and commit message, but it receives a new SHA hash and points to the current branch as its parent.

| Scenario | Best Tool | Why |
|---|---|---|
| **Backport single fix to release** | `git cherry-pick <hash>` | Brings only the fix without merging unreleased features |
| **Combine full branch** | `git merge <branch>` | Preserves complete branch history and parentage |
| **Move entire branch sequence** | `git rebase <base>` | Replays series of commits onto a new base |

## See it

Cherry-pick a bug fix commit from a feature branch onto main:

```bash
# Switch to the target branch (where the fix should go)
git switch main

# Copy the commit from the feature branch
git cherry-pick 7f3a9e1

# If conflicts occur, resolve them, stage, and continue
# git cherry-pick --continue

# Verify the new commit on main
git log -n 1 --stat
```

## Go deeper

Cherry-picking copies code, but it creates duplicate commits with different hashes. If you later merge the original feature branch into `main`, Git's merge algorithm is usually smart enough to realize the changes are identical, but it can occasionally create redundant merge conflicts. Use cherry-picking deliberately for isolated hotfixes rather than routine branch integration.

> **Tip:** Pass the `-x` flag (`git cherry-pick -x <hash>`) to automatically append a line saying `(cherry picked from commit ...)` to the new commit message, maintaining clear provenance.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Relying on cherry-pick instead of standard merges for normal feature integration, which fragments history.
- Cherry-picking a commit that depends on earlier un-picked commits from the source branch, causing conflict.

## Remember

- `git cherry-pick` copies the diff of a specific commit and applies it as a new commit on HEAD.
- Ideal for backporting critical bug fixes across release branches without full branch merges.
- Use `-x` to record the original source commit hash in the new commit message.
