---
slug: comparing-changes-git-diff
title: "Comparing Changes with `git diff`"
topic: basics-workflow
kind: technique
summary: "Compare working tree changes against the index with git diff, and staged changes against HEAD with --staged."
tags: [git-diff, inspection, staging]
related: [three-areas-three-states, staging-with-git-add, inspecting-history-git-log]
---
> **In one line:** Use git diff to inspect unstaged changes and git diff --staged to review what will be included in the next commit.

## The idea

Before you stage or commit code, you should review your changes line by line. The `git diff` command inspects differences between the three areas of Git.

Understanding what `git diff` compares depends entirely on the flags you supply:
1. **`git diff` (no arguments):** Compares your **working tree** against your **staging area (index)**. It answers: 'What edits have I made that I have not yet staged?'
2. **`git diff --staged` (or `--cached`):** Compares your **staging area** against your **last commit (`HEAD`)**. It answers: 'What changes will go into the next commit if I run `git commit` right now?'
3. **`git diff HEAD`:** Compares your **working tree** directly against **`HEAD`**, showing all changes regardless of staging status.

| Command | Left Side (Base) | Right Side (Comparison) | Answers the Question |
|---|---|---|---|
| `git diff` | Staging Area (Index) | Working Tree | What have I modified but not yet staged? |
| `git diff --staged` | Last Commit (`HEAD`) | Staging Area (Index) | What am I about to commit? |
| `git diff HEAD` | Last Commit (`HEAD`) | Working Tree | What has changed since the last commit? |
| `git diff A..B` | Commit A | Commit B | What changed between these two snapshots? |

## See it

Review differences at each stage of your workflow:

```bash
# Review unstaged modifications in your working tree
git diff

# Stage your modifications
git add src/config.ts

# Review staged changes about to be committed
git diff --staged

# Compare changes between two branches
git diff main..feature-branch
```

## Go deeper

Diff output uses standard unified diff format: lines preceded by `-` in red represent removed lines, while lines preceded by `+` in green represent added lines. The `@@ -start,len +start,len @@` hunk headers indicate line numbers in the original and comparison versions.

> **Tip:** Use `git diff --stat` for a summary of modified files and inserted/deleted line counts without full code blocks.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Running `git diff` after `git add` and seeing no output; your changes are now staged, so you must run `git diff --staged`.
- Committing without running `git diff --staged`, accidentally committing unwanted console logs or debugging statements.

## Remember

- `git diff` shows unstaged modifications in your working tree.
- `git diff --staged` shows what is staged and ready to be committed.
- Compare any two commits or branches with `git diff commitA..commitB`.
