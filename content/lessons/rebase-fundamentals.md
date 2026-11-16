---
slug: rebase-fundamentals
title: "Rebase Fundamentals"
topic: rebasing-history
kind: concept
summary: "Understand how git rebase replays your commits onto a new base commit, creating new commit hashes and linear history."
tags: [rebase, history, branching]
related: [interactive-rebase, golden-rule-of-rebasing, fast-forward-merges]
---
> **In one line:** git rebase moves the starting point of your branch to a new commit by replaying your commits as brand new snapshots.

## The idea

In Git, there are two primary ways to integrate changes from one branch into another: merging and rebasing.

While merging joins two branches with a three-way merge commit, **rebasing** takes all the commits that were introduced on your current branch and replays them one by one onto the tip of another branch.

Here is what happens under the hood when you run `git rebase main` on a `feature` branch:
1. Git finds the common ancestor between `feature` and `main`.
2. Git saves each commit introduced on `feature` as a temporary patch file in memory.
3. Git resets your local `feature` branch to point directly to the tip of `main`.
4. Git applies each temporary patch in order onto the new base, creating **brand new commit objects with brand new SHA hashes**.

The primary benefit is a **completely linear history**. When you inspect the log, it looks as though you developed your feature directly on top of the latest version of `main`, without any merge commits or branch divergence.

| Comparison | `git merge` | `git rebase` |
|---|---|---|
| **Mechanism** | Creates a 2-parent merge commit | Replays commits as new snapshots onto new base |
| **History Shape** | Non-linear with visible branch bubbles | Strictly linear |
| **Commit Hashes** | Preserves original branch commit hashes | Replaces branch commits with new hashes |
| **Audit Trail** | Documents exact chronological occurrence | Documents clean, logical progression |

## See it

Rebase a feature branch onto latest main:

```bash
# Ensure local main has latest remote commits
git switch main && git pull

# Switch to your feature branch
git switch feature-search

# Rebase your feature commits onto the tip of main
git rebase main

# If conflicts arise: resolve, stage, and continue
# git rebase --continue

# Verify linear history with no merge commit
git log --oneline --graph -n 5
```

## Go deeper

If a conflict occurs during a rebase, Git halts execution at the specific patch that failed to apply. You resolve the conflict, run `git add` to stage the resolution, and then type `git rebase --continue`. If you get overwhelmed or want to back out, `git rebase --abort` immediately returns your branch to its exact pre-rebase state.

> **Tip:** You can configure Git to automatically stash dirty uncommitted changes before rebasing and pop them when finished: `git config --global rebase.autoStash true`.

## Watch out

- Panicking during a rebase conflict; use `git rebase --abort` to return to safety anytime.
- Forgetting that rebased commits receive new hashes, meaning unpushed commits must be force-pushed with care.

## Remember

- `git rebase` replays your branch commits onto a new base commit.
- Produces a clean, strictly linear history without merge commit bubbles.
- Use `git rebase --continue` to proceed after conflicts, or `git rebase --abort` to exit safely.
