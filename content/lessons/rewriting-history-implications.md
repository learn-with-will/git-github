---
slug: rewriting-history-implications
title: "Rewriting History: Scopes and Implications"
topic: rebasing-history
kind: concept
summary: "Understand the three scopes of history rewriting—amend (last commit), rebase (branch), and filter-repo (entire repository)."
tags: [history-editing, internals, architecture]
related: [interactive-rebase, force-with-lease, removing-sensitive-data]
---
> **In one line:** Git history rewriting operates across three scopes: single commits (amend), branch series (rebase), and full repository (filter-repo).

## The idea

In Git, 'rewriting history' sounds dangerous, but it is a standard capability that developers use daily. To use it responsibly, you must understand the three distinct scopes of history rewriting and their operational consequences.

1. **Single Commit Scope (`git commit --amend`):** Replaces only the very latest commit at the tip of your current branch. Safest scope; ideal for fixing the immediate last commit before pushing.
2. **Branch History Scope (`git rebase -i`):** Rewrites a series of commits on your active topic branch. Used to curate a feature branch before merging into `main`.
3. **Repository-Wide Scope (`git filter-repo`):** Rewrites every commit across all branches and tags in the entire repository history. Used exclusively for major repository surgery, such as purging accidentally committed credentials or multi-gigabyte binary files.

| Rewriting Tool | Scope | When to Reach for It | Risk Level |
|---|---|---|---|
| `git commit --amend` | Last commit only | Typo in message or forgotten file | Low |
| `git rebase -i` | Specific branch range | Curating WIP commits before PR review | Medium (Local only) |
| `git filter-repo` | All branches & history | Purging leaked secrets or shrinking repo | High (Requires coordination) |

## See it

Choose the tool matching the scope of the problem:

```bash
# Scope 1: Fix only the last commit message
git commit --amend -m "chore: correct module export"

# Scope 2: Reorder or squash the last 4 commits on feature branch
git rebase -i HEAD~4

# Scope 3: Inspect repository size and large packfile blobs
git count-objects -vH
```

## Go deeper

Whenever you rewrite history, the old commit objects are not immediately deleted from `.git/objects/`. Instead, they become **dangling objects**—nodes in the graph that no branch pointer or tag reaches. They remain stored locally until Git's background garbage collector (`git gc`) purges unreferenced objects older than the expiry window (default 30 days).

> **Tip:** You can inspect unreachable or dangling commits in your local repository anytime by running `git fsck --unreachable`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Using repository-wide tools like `filter-repo` for simple branch cleanups that interactive rebase handles cleanly.
- Believing history rewriting deletes your work permanently on the spot; reflogs keep old commits recoverable for weeks.

## Remember

- Rewriting history operates at commit, branch, or entire repository scopes.
- `git commit --amend` fixes the last commit; `git rebase -i` curates a branch series.
- Old commit objects remain temporarily accessible as dangling objects in your local database.
