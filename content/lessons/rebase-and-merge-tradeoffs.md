---
slug: rebase-and-merge-tradeoffs
title: "Rebase and Merge Trade-Offs"
topic: pull-requests
kind: technique
summary: "Understand when to choose Rebase and Merge, the discipline it requires, and why commit curation is mandatory."
tags: [rebase, merge-strategies, linear-history]
related: [pr-merge-strategies, squash-and-merge-deep-dive, interactive-rebase]
---
> **In one line:** Rebase and merge creates a strictly linear history while preserving individual commits, requiring rigorous commit hygiene.

## The idea

**Rebase and Merge** is GitHub's third merge strategy. When you select this option, GitHub takes each commit from the PR branch and replays it onto the base branch without creating a merge commit.

The result is a **strictly linear history**: no branch bubbles, no merge nodes, just an uninterrupted line of commits.

However, Rebase and Merge requires serious developer discipline. Unlike Squash and Merge (which hides all intermediate mess), Rebase and Merge publishes every single commit on your feature branch straight into `main`. If your PR contains 15 commits with messages like 'wip' and 'fix bug', all 15 commits become permanent history on `main`.

Therefore, Rebase and Merge is best suited for teams that practice **interactive rebase commit curation**: developers curate their branch into 2–4 logical, well-tested commits before clicking merge.

| Scenario | Best Merge Strategy | Why |
|---|---|---|
| **Small team, fast shipping** | **Squash and Merge** | Zero maintenance; clean single-commit log on main |
| **Large feature with logical commits** | **Rebase and Merge** | Keeps separable steps (e.g. backend API, then UI) distinct |
| **Audit-heavy or open-source repo** | **Merge Commit** | Preserves exact branch provenance and SHA hashes |

## See it

Curate your branch locally with interactive rebase before a Rebase and Merge:

```bash
# Clean up your branch history before opening the PR
git rebase -i main
# (reword messages, squash wip commits into clean logical units)

# Push the curated commits to your branch
git push --force-with-lease origin feature-cache

# Merge on GitHub using Rebase and Merge
gh pr merge --rebase
```

## Go deeper

One subtle detail of Rebase and Merge: because commits are replayed onto the base branch, their commit SHA hashes **change**. This means that after the PR is merged, your local feature branch pointer will point to the old hashes, not the rebased commits on `main`. Always switch to `main`, pull, and delete the feature branch.

> **Tip:** If your team uses Rebase and Merge, verify that every intermediate commit compiles and passes unit tests, or `git bisect` may stumble on broken intermediate commits later.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Clicking Rebase and Merge on an uncurated PR filled with messy 'typo' and 'debug' commits.
- Attempting to re-use the local feature branch after a Rebase and Merge without resyncing.

## Remember

- Rebase and merge produces a strictly linear commit history without merge commits.
- Every individual commit from the PR is preserved on main with a new SHA hash.
- Requires commit curation via interactive rebase before merging to maintain high log standards.
