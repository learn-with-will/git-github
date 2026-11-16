---
slug: creating-snapshots-git-commit
title: "Creating Snapshots with `git commit`"
topic: basics-workflow
kind: technique
summary: "Record staged changes into permanent snapshot commits with clear, informative messages and atomic scope."
tags: [git-commit, snapshots, history]
related: [three-areas-three-states, staging-with-git-add, inspecting-history-git-log]
---
> **In one line:** Running git commit creates a permanent, immutable snapshot containing author metadata, tree hashes, and parent links.

## The idea

Running `git commit` takes everything currently in your staging area and writes a permanent commit object to the repository database.

A commit is not just a diff; it is a full snapshot of your project at that moment, accompanied by metadata:
1. **The root tree pointer:** Hash of the top-level directory snapshot.
2. **Parent commit pointer(s):** The SHA hash of the commit that came immediately before this one.
3. **Author metadata:** Name, email, and timestamp of when the work was written.
4. **Committer metadata:** Name, email, and timestamp of when the commit was created.
5. **Commit message:** The human explanation of why the change was made.

| Commit Habit | Why It Matters |
|---|---|
| **Atomic scope** | A commit should do one complete thing; easy to review, revert, or cherry-pick |
| **Imperative mood** | 'Add user auth' not 'Added user auth'—matches Git's own merge and revert messages |
| **Clear short summary** | First line under 50 characters; readable in `git log --oneline` |

## See it

Create a commit with a concise message, or open your editor for a multi-line message:

```bash
# Quick single-line commit for small changes
git commit -m "Fix token expiration parsing in auth service"

# Multi-line commit with summary and explanatory body
git commit -m "feat(api): add rate limiting middleware" -m "Enforce 100 requests per minute per IP to protect auth endpoints."

# Check the resulting commit hash and summary
git log -n 1 --stat
```

## Go deeper

Good commit messages are an invaluable asynchronous communication channel for your team. The summary line states *what* changed, while the optional commit body explains *why* the change was necessary and any non-obvious trade-offs considered.

> **Tip:** You can combine staging tracked modifications and committing in one step with `git commit -am "message"`, though this will not stage untracked new files.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Writing useless commit messages like 'fixed stuff' or 'updates', making future debugging difficult.
- Bundling three unrelated features or bug fixes into one giant commit, making reverts risky.

## Remember

- `git commit` records everything currently staged into an immutable snapshot object.
- Write commit subjects in the imperative mood ('Add feature', 'Fix bug').
- Keep commits atomic so individual changes can be reviewed, cherry-picked, or reverted safely.
