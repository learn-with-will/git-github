---
slug: branches-as-pointers
title: "Branches as Movable Pointers"
topic: branching-merging
kind: concept
summary: "Understand that a Git branch is simply a 41-byte text file containing a commit SHA hash, making branching instantaneous and zero-cost."
tags: [branching, internals, pointers]
related: [head-and-detached-head, branch-operations, fast-forward-merges]
---
> **In one line:** A Git branch is not a container of files; it is simply a lightweight, movable pointer to a specific commit.

## The idea

In older version control systems, creating a branch meant copying the entire project directory tree on the server into a new folder. This was slow, consumed significant disk space, and discouraged developers from creating branches for small tasks.

In Git, branching is instantaneous and virtually cost-free.

A branch in Git is simply a lightweight, movable pointer to one commit in the object graph. Under the hood, a local branch is literally a 41-byte text file stored in `.git/refs/heads/<branch-name>` containing the 40-character hexadecimal SHA-1 hash of the commit it points to, followed by a newline. Creating a branch writes 41 bytes to disk. Deleting a branch removes that small file.

When you make a new commit while on a branch, Git creates the new commit object and then moves the branch pointer forward so it points to the new commit.

| Action | What Older VCS Did | What Git Does |
|---|---|---|
| **Create Branch** | Copied thousands of files into a new server directory | Writes a 41-byte text file with the current commit hash |
| **Commit on Branch** | Recorded diffs in the branched directory | Creates new commit object; updates 41-byte pointer |
| **Delete Branch** | Recursively deleted the copied directory | Deletes the 41-byte file under `.git/refs/heads/` |

## See it

Inspect the raw filesystem reality of a Git branch:

```bash
# Create and switch to a new branch
git switch -c feature-auth

# Inspect the file Git created for this branch
cat .git/refs/heads/feature-auth

# Verify that the hash in that file matches HEAD
git rev-parse HEAD
```

## Go deeper

Because branches are just pointers, you can create dozens of short-lived branches without worrying about repository size or performance degradation. Branching in Git encourages developers to create focused 'topic branches' for every bug fix, experiment, or feature, isolating incomplete work from stable production code.

> **Tip:** Never think of branches as containers holding commits. Commits exist independently in the object store; branches are merely labeled bookmarks pointing to them.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Thinking creating a branch duplicates your source files on disk; it creates a single 41-byte text pointer.
- Worrying about performance overhead when creating dozens of topic branches.

## Remember

- A Git branch is simply a 41-byte text file holding a commit hash.
- Creating, switching, and deleting branches executes in microseconds.
- Commits automatically advance the pointer of the currently active branch.
