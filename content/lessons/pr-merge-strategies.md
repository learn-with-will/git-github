---
slug: pr-merge-strategies
title: "PR Merge Strategies: Commit, Squash & Rebase"
topic: pull-requests
kind: pattern
summary: "Compare GitHub's three PR merge button options—Create a merge commit, Squash and merge, and Rebase and merge."
tags: [pull-requests, merge-strategies, github]
related: [squash-and-merge-deep-dive, rebase-and-merge-tradeoffs, three-way-merges]
---
> **In one line:** GitHub offers three PR merge methods: merge commit preserves all commits; squash collapses into one; rebase keeps commits linear.

## The idea

When a pull request is approved and ready to merge, repository maintainers click the big green **Merge pull request** button on GitHub. GitHub provides three distinct merge strategies, and choosing the right one determines the shape of your project's historical graph.

1. **Create a merge commit:** Performs a standard `--no-ff` three-way merge. All individual commits from the branch are retained, and a new merge commit is created with two parents.
2. **Squash and merge:** Takes all commits from the feature branch, combines their diffs into a single commit on the base branch, and prompts for a single commit message. No merge commit is created.
3. **Rebase and merge:** Replays each commit from the feature branch individually onto the base branch without creating a merge commit, resulting in a strictly linear graph.

| Strategy | Commit Count on Base | Creates Merge Commit? | Preserves Individual Commit Hashes? | Graph Shape |
|---|---|---|---|---|
| **Merge commit** | All branch commits + 1 | Yes | Yes | Branch bubbles / merge nodes |
| **Squash and merge** | Exactly 1 commit | No | No (new squashed commit created) | Flat, single-commit line |
| **Rebase and merge** | All branch commits | No | No (commits receive new hashes) | Completely linear line |

## See it

Choose the merge method when merging a PR using the GitHub CLI:

```bash
# Option 1: Standard merge commit (preserves complete branch history)
gh pr merge 15 --merge

# Option 2: Squash and merge (collapses all PR commits into one)
gh pr merge 15 --squash

# Option 3: Rebase and merge (replays commits linearly onto main)
gh pr merge 15 --rebase
```

## Go deeper

Repository administrators can configure which merge strategies are permitted in GitHub repository settings under **Pull Requests**. Many modern software teams disable standard merge commits and enforce **Squash and merge** only, ensuring that messy intermediate work-in-progress commits never enter the permanent `main` history.

> **Tip:** If your team uses Squash and Merge, individual commit messages during development do not need to be pristine, because only the final PR squash message survives into `main`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Using Rebase and Merge on PRs that contain 'WIP' or 'fix typo' commits, polluting `main` history with noise.
- Assuming Squash and Merge preserves individual branch commit hashes; the original commits are discarded.

## Remember

- Merge commit keeps all commits plus an explicit merge commit node.
- Squash and merge collapses all branch commits into a single clean commit on main.
- Rebase and merge keeps all individual commits replayed in a strictly linear sequence.
