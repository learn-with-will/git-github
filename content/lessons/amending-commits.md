---
slug: amending-commits
title: "Amending the Last Commit with `git commit --amend`"
topic: undoing-changes
kind: technique
summary: "Fix typos, update messages, or add forgotten files to the most recent commit without creating extra commits."
tags: [undo, commit-amend, history]
related: [restoring-files, git-reset-modes, reverting-shared-commits]
---
> **In one line:** Use git commit --amend to replace the most recent commit with staged changes or an updated commit message.

## The idea

One of the most common everyday Git needs is fixing the commit you just made: you noticed a typo in the commit message, forgot to stage a file, or introduced a small syntax error.

Instead of creating a messy follow-up commit like 'Fix typo' or 'Forgot file', `git commit --amend` replaces the most recent commit with a brand new commit. It combines whatever is currently in your staging area with the previous commit, presenting an editor to update the message.

Under the hood, **`git commit --amend` does not mutate the existing commit**—it creates a completely new commit object with a new SHA hash, moves the current branch pointer to it, and leaves the old commit orphaned for eventual garbage collection.

| Action | Command | Result |
|---|---|---|
| **Edit message only** | `git commit --amend` | Opens editor with existing commit message |
| **Add forgotten file** | `git add <file> && git commit --amend --no-edit` | Merges file into last commit without changing message |
| **Change author** | `git commit --amend --author="Name <email>"` | Updates author metadata on the last commit |

## See it

Fix a typo and add a forgotten file to your latest commit:

```bash
# Make a commit with a typo in the message
git commit -m "Add authentication middlware"

# Stage a file that was accidentally left out
git add src/middleware/auth.ts

# Amend the commit: fixes the message and includes the staged file
git commit --amend -m "Add authentication middleware"

# Verify that only one clean commit exists in history
git log -n 1 --stat
```

## Go deeper

Because amending creates a new commit hash, **you must never amend a commit that has already been pushed to a shared remote branch**. If you amend a shared commit, teammates based on the old hash will diverge, causing push rejections and messy reconciliation.

> **Tip:** The `--no-edit` flag allows you to amend staged files into the previous commit without re-opening your text editor for the message.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Amending a commit that has already been pushed to a remote repository used by teammates.
- Accidentally having files in your staging area when running `git commit --amend` to edit only a message.

## Remember

- `git commit --amend` replaces the tip of the current branch with a new snapshot and hash.
- Use `--no-edit` to add files to the previous commit without changing its message.
- Only amend private, unpushed commits.
