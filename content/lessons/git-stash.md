---
slug: git-stash
title: "Shelving Work-in-Progress with `git stash`"
topic: undoing-changes
kind: technique
summary: "Temporarily shelve dirty working tree and staging area changes with git stash to switch contexts cleanly."
tags: [git-stash, context-switching, worktree]
related: [restoring-files, branch-operations, git-cherry-pick]
---
> **In one line:** git stash temporarily shelves uncommitted changes into a stack, reverting your working tree to a clean state.

## The idea

Often when working on a feature, you are interrupted: an urgent production bug needs fixing, or a colleague asks you to review a pull request. However, your current work is halfway done and not ready for a commit.

Git will often block you from switching branches (`git switch`) if uncommitted local changes conflict with files in the target branch.

`git stash` takes your dirty working tree and staged index, records them onto a local stash stack, and resets your working tree to match `HEAD`. You can now switch branches, fix the bug, commit, and return. When you come back to your original branch, you reapply the stashed changes and resume right where you left off.

| Command | Action |
|---|---|
| `git stash` (or `git stash push`) | Shelves tracked modifications and resets worktree to clean `HEAD` |
| `git stash -u` (or `--include-untracked`) | Shelves tracked changes AND newly created untracked files |
| `git stash list` | Displays all stashed snapshots currently on the stack |
| `git stash pop` | Reapplies the most recent stash and deletes it from the stack |
| `git stash apply` | Reapplies the most recent stash while leaving it on the stack |

## See it

Stash uncommitted work to switch branches, then restore it:

```bash
# Shelve work-in-progress, including new untracked files
git stash push -u -m "WIP: customer table pagination"

# Switch to main to handle urgent hotfix
git switch main
# ... fix bug, commit, push ...

# Return to feature branch and restore stashed work
git switch feature-pagination
git stash pop
```

## Go deeper

Under the hood, a stash is not a magic temporary file—it is actually two or three commit objects created in `.git/` that are referenced by `.git/refs/stash`. One commit holds the index snapshot, one holds the working tree snapshot, and an optional third holds untracked files.

> **Tip:** Always use `git stash push -m "description"` to give your stash a recognizable label, avoiding mystery entries in `git stash list`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Forgetting that `git stash` ignores newly created untracked files by default; always pass `-u` to include them.
- Accumulating dozens of unnamed stashes over months and forgetting what code each contains.

## Remember

- `git stash` saves uncommitted modifications to a stack and restores a clean working tree.
- Pass `-u` (`--include-untracked`) to ensure newly created files are stashed as well.
- Use `git stash pop` to reapply and drop, or `git stash apply` to reapply while keeping the backup.
