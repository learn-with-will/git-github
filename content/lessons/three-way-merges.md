---
slug: three-way-merges
title: "Three-Way Merge Commits"
topic: branching-merging
kind: concept
summary: "Learn how Git uses the common ancestor (merge base) to combine diverging branches into a merge commit with two parents."
tags: [merging, three-way-merge, commit-dag]
related: [fast-forward-merges, merge-conflict-basics, the-commit-dag]
---
> **In one line:** A three-way merge finds the common ancestor of two diverged branches and combines them into a commit with two parents.

## The idea

When your base branch (`main`) has moved forward with new commits while you were working on your `feature` branch, history has **diverged**. The commit at the tip of `main` is no longer a direct ancestor of `feature`.

A simple pointer advancement (fast-forward) is impossible.

Git reconciles this divergence by performing a **three-way merge**. It identifies three specific snapshots:
1. **The common ancestor (merge base):** The last commit shared by both branches before they diverged.
2. **The current branch tip (`ours`):** The latest commit on the branch you are on (`main`).
3. **The incoming branch tip (`theirs`):** The latest commit on the branch you are merging (`feature`).

By comparing both branch tips against the common ancestor, Git figures out which files were changed by which branch. If changes occurred in different files or different parts of the same file, Git combines them automatically and creates a **merge commit**.

Unlike normal commits, a merge commit has **two parent pointers** linking back to both branches.

| Commit Type | Number of Parent Pointers | Typical Creation Method |
|---|---|---|
| **Standard Commit** | 1 parent | `git commit -m "..."` |
| **Initial Root Commit** | 0 parents | First commit in a new repository |
| **Three-Way Merge Commit** | 2 parents | `git merge <diverged-branch>` |
| **Octopus Merge Commit** | 3+ parents | `git merge branch1 branch2 branch3` |

## See it

Perform a three-way merge and inspect the resulting two-parent commit:

```bash
# Ensure you are on the target integration branch
git switch main

# Merge the diverged feature branch
git merge feature-analytics -m "Merge feature-analytics into main"

# Inspect the merge commit showing its two parents
git cat-file -p HEAD

# View the visual merge graph in your terminal
git log --graph --oneline -n 5
```

## Go deeper

You can programmatically inspect the exact common ancestor Git will use for a three-way merge by executing `git merge-base main feature`. This outputs the SHA hash of the commit where the two branches originally split apart.

> **Note:** A three-way merge commit does not store duplicates of both branches' files; like all commits, it stores a single root tree snapshot representing the combined project state.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Forgetting which branch you are on before running `git merge`; always run `git switch <target>` first.
- Assuming every merge commit indicates a conflict; Git performs three-way merges completely cleanly if edits don't overlap.

## Remember

- Three-way merges occur when both branches have added commits since splitting apart.
- Git compares both branch tips against their common ancestor (`merge-base`).
- The resulting merge commit has two parents, tying the two historical lines together.
