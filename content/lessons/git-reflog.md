---
slug: git-reflog
title: "The Safety Net: Recovering Commits with `git reflog`"
topic: undoing-changes
kind: technique
summary: "Recover seemingly lost commits, discarded branches, and accidental reset --hard mistakes using the reference log."
tags: [git-reflog, recovery, safety]
related: [git-reset-modes, git-stash, git-cherry-pick]
---
> **In one line:** git reflog records every local movement of HEAD, allowing you to recover commits even after destructive commands like reset --hard.

## The idea

Many developers experience moments of panic after accidentally running `git reset --hard HEAD~5` or deleting a branch before merging it, believing their work is permanently lost.

In Git, almost nothing committed is ever truly lost immediately.

Git maintains a local safety net called the **reference log (reflog)**. Every time `HEAD` moves—whether you switch branches, create a commit, amend, rebase, reset, or pull—Git records an entry in `.git/logs/HEAD`. Even if a branch is deleted or a commit is no longer part of any branch graph (making it orphaned), its hash remains recorded in the reflog for at least 30 to 90 days before garbage collection runs.

| Event | Logged in `git log`? | Logged in `git reflog`? |
|---|---|---|
| Committing new code | Yes | Yes (`commit: ...`) |
| Switching branches | No | Yes (`checkout: moving from ...`) |
| Resetting `--hard` | No (dropped from log) | Yes (`reset: moving to ...`) |
| Amending a commit | No (old hash replaced) | Yes (`commit (amend): ...`) |

## See it

Recover an orphaned commit after an accidental `git reset --hard`:

```bash
# Accidental hard reset drops the last 2 commits
git reset --hard HEAD~2

# Inspect the reflog to find the commit hash before the reset
git reflog -n 5

# Restore the branch directly to the commit identified in the reflog
git reset --hard HEAD@{1}
```

## Go deeper

Reflogs are strictly local to your machine. They are not cloned when you run `git clone`, nor are they pushed when you run `git push`. They reflect solely your local actions.

To rescue a commit from the reflog into a permanent branch, you can create a new branch pointing directly to that hash: `git branch recovery-branch HEAD@{2}`.

> **Tip:** If you ever lose a branch or commit, type `git reflog` immediately. Find the state just before the mistake, and reset or branch to that hash.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Waiting months to recover a dropped commit; Git automatically runs `git gc` and purges unreachable reflog entries after 90 days.
- Expecting `git reflog` to recover uncommitted edits discarded by `git restore`—reflog only tracks committed snapshots.

## Remember

- `git reflog` records every local movement of HEAD, including commits, checkouts, and resets.
- Commits dropped by `reset --hard` or deleted branches remain recoverable via their reflog hashes.
- Reflogs are strictly local to your machine and are kept for at least 30 to 90 days.
