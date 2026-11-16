---
slug: staging-with-git-add
title: "Staging Changes with `git add`"
topic: basics-workflow
kind: technique
summary: "Use git add to stage modified, new, and deleted files, and master selective hunk staging with -p."
tags: [git-add, staging, workflow]
related: [three-areas-three-states, creating-snapshots-git-commit, comparing-changes-git-diff]
---
> **In one line:** Use git add to move specific modified and untracked files into the staging area to prepare your next snapshot.

## The idea

The `git add` command takes a pathspec and adds content from your working tree to the staging area (the index). It tells Git: 'Include this exact version of this file in the next commit.'

Running `git add` does not merely register a file name; it hashes the file contents, writes a new blob object into `.git/objects/`, and records that hash in `.git/index`. This is why running `git add` stages the file *as it is right now*. If you edit the file five seconds later, those new edits are not staged until you run `git add` again.

| Command | Action | Recommended Scenario |
|---|---|---|
| `git add <file>` | Stages single file | Focused, single-concern updates |
| `git add <dir>/` | Stages all changes in folder | Component or module refactorings |
| `git add -p <file>` | Interactive patch staging | Splitting multiple changes in one file into distinct commits |
| `git add -A` | Stages all new, modified, and deleted files | Project-wide atomic commits |

## See it

Observe staging behaviors and partial staging:

```bash
# Stage specific files selectively
git add src/index.ts src/models.ts

# Review staged status
git status -s

# Stage hunks interactively within a file
git add -p src/index.ts
```

## Go deeper

The `git add -p` (patch) flag is a superpower for writing clean commit histories. When you have edited several parts of a file—such as fixing a bug while also tweaking comments or formatting—`-p` prompts you for each diff hunk (`y` to stage, `n` to skip, `s` to split into smaller hunks).

> **Tip:** Avoid running `git add .` blindly without checking `git status` first, or you may accidentally stage temporary debug files or credentials.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Modifying a file after staging it and expecting the new modifications to be committed automatically.
- Using `git add .` without a proper `.gitignore` file, accidentally staging `node_modules` or `.env` files.

## Remember

- `git add` snapshots the file content at the moment the command is executed.
- Use `git add -p` to stage specific hunks within a file for atomic commits.
- Check `git status` before committing to verify staged changes.
