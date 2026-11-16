---
slug: branch-operations
title: "Branch Operations: Create, Switch, Delete"
topic: branching-merging
kind: technique
summary: "Master branch creation, listing, switching with git switch, and safe vs forced deletion with git branch -d and -D."
tags: [git-branch, git-switch, cli]
related: [branches-as-pointers, head-and-detached-head, branch-navigation-best-practices]
---
> **In one line:** Use git switch -c to create and switch branches in one step, and git branch -d to delete fully merged branches safely.

## The idea

Managing local branches is an everyday workflow skill. Modern Git (version 2.23+) provides `git switch` as a clean, intuitive command dedicated exclusively to branch navigation, separating it from file restoration (`git restore`).

To create and switch to a new branch in a single command, run `git switch -c <name>` (short for `--create`).

Deleting branches is also a routine task. Once a feature branch has been merged into your main branch, the pointer is no longer needed. Git provides safety checks:
- `git branch -d <name>`: Safe delete. Git checks whether the branch has been fully merged into your current upstream branch. If unmerged commits exist, Git refuses to delete and warns you.
- `git branch -D <name>`: Force delete (shortcut for `--delete --force`). Deletes the branch pointer regardless of merge status.

| Command | Action | Safety Level |
|---|---|---|
| `git branch` | Lists all local branches | Read-only |
| `git switch <name>` | Switches to an existing branch | Safe (blocks if uncommitted conflicts exist) |
| `git switch -c <name>` | Creates and immediately checks out new branch | Safe |
| `git branch -d <name>` | Deletes branch only if fully merged | Safe |
| `git branch -D <name>` | Force deletes branch even with unmerged commits | Destructive to unreferenced commits |

## See it

Create, navigate, and clean up branches:

```bash
# Create and switch to a new feature branch
git switch -c feature-billing

# List all local branches with their latest commit
git branch -v

# Switch back to main
git switch main

# Delete the merged feature branch safely
git branch -d feature-billing
```

## Go deeper

Branch names are flexible, but teams usually adopt naming conventions using slashes, such as `feature/user-auth`, `bugfix/issue-404`, or `chore/upgrade-deps`. Git treats the slash as a directory separator under `.git/refs/heads/`, meaning you cannot name a branch `feature` if `feature/auth` already exists.

> **Tip:** Run `git branch --merged` to see which branches have already been integrated into your current branch and can be safely deleted.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Attempting to delete the branch you are currently on; you must switch to another branch first.
- Using `git branch -D` blindly and accidentally deleting commits that were not pushed or merged anywhere.

## Remember

- Use `git switch -c <name>` to create and check out a new branch in one command.
- `git branch -d` safely refuses to delete branches containing unmerged work.
- Use `git branch -v` or `git branch --merged` to audit branch status.
