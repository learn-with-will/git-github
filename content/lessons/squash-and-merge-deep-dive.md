---
slug: squash-and-merge-deep-dive
title: "Squash and Merge Deep Dive"
topic: pull-requests
kind: technique
summary: "Master Squash and Merge: collapsing messy branch histories into atomic, bisectable, and easily revertible main commits."
tags: [squash, pull-requests, history]
related: [pr-merge-strategies, rebase-and-merge-tradeoffs, interactive-rebase]
---
> **In one line:** Squash and merge combines all commits in a PR into a single atomic commit on main, cleaning up development noise.

## The idea

During the lifecycle of a feature branch, developers often make dozens of small, messy commits: 'WIP auth', 'Fix typo', 'Address PR comment', 'Formatting', 'Try fixing CI'.

While these granular checkpoints are helpful during local development, having 25 noisy commits on the `main` branch makes reading history, running `git bisect`, and reverting broken releases painful.

**Squash and Merge** solves this problem cleanly.

When you Squash and Merge a pull request, GitHub computes the net diff of the entire branch, creates a **single new commit** at the tip of the base branch containing that net diff, and closes the PR. The feature branch can then be deleted.

Benefits of Squash and Merge:
- **Atomic feature history:** Every commit on `main` represents one complete, tested feature or fix.
- **Trivial rollbacks:** If a feature causes an issue in production, reverting it requires running `git revert` on a single commit hash.
- **Clean `git bisect`:** Binary searching for regressions never lands on half-finished intermediate commits where the build was broken.

| Metric | With Standard Merge | With Squash and Merge |
|---|---|---|
| **Commits on `main` for 10-commit PR** | 11 commits | 1 commit |
| **Reverting the feature** | Reverting a merge commit (`-m 1`) | Reverting a standard commit |
| **Log readability** | Noisy with experimental intermediate commits | Pristine, one commit per merged PR |

## See it

Simulate what Squash and Merge does locally using Git's command line:

```bash
# Switch to main
git switch main

# Squash all commits from feature branch into working tree & staging area
git merge --squash feature-payments

# Inspect status showing all net changes staged together
git status

# Record the single squashed atomic commit
git commit -m "feat(payments): integrate Stripe subscription webhooks"
```

## Go deeper

GitHub provides a setting under **Pull Requests** called 'Default commit message for squash merges'. You can configure GitHub to default to the Pull Request title and description rather than concatenating every raw commit message, guaranteeing consistent commit documentation across your team.

> **Tip:** If you need to continue working on a branch after it was squashed and merged into `main`, do not re-use the old branch; delete it and create a fresh branch from `main`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Re-using a branch after it was squashed and merged; because commit hashes changed, subsequent merges can cause duplicate conflict hunks.
- Leaving default squash commit messages that concatenate 30 bulleted 'wip' messages into the commit body.

## Remember

- Squash and merge collapses all PR commits into one single commit on the base branch.
- Provides clean, atomic history on main, making rollbacks and bisecting effortless.
- Delete feature branches immediately after squash merging to avoid duplicate commit hash conflicts.
