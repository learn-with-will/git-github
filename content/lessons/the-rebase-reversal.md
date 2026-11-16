---
slug: the-rebase-reversal
title: "The Rebase Conflict Reversal"
topic: conflict-resolution
kind: pitfall
summary: "Understand why 'ours' and 'theirs' reverse roles during a rebase compared to a standard merge, preventing backwards resolutions."
tags: [rebase, conflicts, pitfalls]
related: [conflict-anatomy-diff3, checkout-ours-theirs, rebase-fundamentals]
---
> **In one line:** During a rebase, 'ours' refers to the upstream target branch and 'theirs' refers to your replayed commit.

## The idea

One of the most confusing mental traps in Git is the **Rebase Conflict Reversal**.

When you run `git merge feature` while on `main`:
- **`HEAD` / `ours`:** Your current branch (`main`).
- **`theirs`:** The incoming branch you are merging (`feature`).

However, when you run `git rebase main` while on `feature`, **the meaning of `ours` and `theirs` flips backwards!**

Here is why:
To rebase, Git temporarily checks out the upstream target branch (`main`). That means `main` is now `HEAD` (`ours`). Git then takes your commits from `feature` and replays them one by one as incoming patches (`theirs`).

Therefore, if a conflict occurs during `git rebase main`:
- **`<<<<<<< HEAD` (`ours`):** Represents the upstream branch (`main`)!
- **`>>>>>>> <commit>` (`theirs`):** Represents your feature commit that is being replayed!

| Context | `ours` / `HEAD` Represents | `theirs` Represents |
|---|---|---|
| **During `git merge feature`** | Your branch (`main`) | Incoming feature (`feature`) |
| **During `git rebase main`** | Upstream target (`main`) | **Your commit being replayed (`feature`)** |

## See it

Observe the reversal when resolving a conflict during a rebase:

```bash
# You are on your feature branch and rebase onto main
git switch feature-billing
git rebase main

# CONFLICT occurs! Inspect markers carefully:
# <<<<<<< HEAD (This is the code currently on main!)
# =======
# >>>>>>> 4a1e9f1 (This is YOUR commit from feature-billing!)

# Resolve the file, stage it, and continue the rebase:
git add src/billing.ts
git rebase --continue
```

## Go deeper

This reversal also applies to checkout commands: running `git checkout --ours <file>` during a rebase keeps the code from `main`, while `git checkout --theirs <file>` keeps the code from your feature branch. Misunderstanding this causes developers to accidentally discard their own feature work during a rebase!

> **Tip:** When resolving rebase conflicts, always check the label after `>>>>>>>`. It displays your feature commit message, confirming that side holds your feature code.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Running `git checkout --ours` during a rebase thinking it keeps your feature work; it keeps upstream `main`!
- Relying on terminology without checking the commit hash or branch name in conflict hunk headers.

## Remember

- During a rebase, HEAD (`ours`) is the upstream target branch you are rebasing onto.
- `theirs` represents your local feature commit that is being replayed.
- `git checkout --theirs` keeps your feature changes during a rebase conflict.
