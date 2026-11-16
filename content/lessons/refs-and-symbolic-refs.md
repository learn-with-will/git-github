---
slug: refs-and-symbolic-refs
title: "Refs, Packed Refs, and Symbolic Refs"
topic: internals
kind: concept
summary: "Understand how references under .git/refs/ turn cryptic 40-character SHA hashes into human-friendly branch and tag names."
tags: [internals, refs, architecture]
related: [content-addressed-store, the-four-object-types, head-and-detached-head]
---
> **In one line:** References (refs) are human-readable text files under .git/refs/ that store commit hashes, giving names to graph nodes.

## The idea

Navigating a repository by typing 40-character hexadecimal SHA hashes (`4b825dc642cb6eb9a060e54bf8d69288fbee4904`) would be impossible for human developers.

**References (refs)** provide user-friendly names that point to specific commit hashes.

Refs are organized into subdirectories inside `.git/refs/`:
- **Local branches (`refs/heads/`):** Files named after your branches (e.g. `.git/refs/heads/main`). They contain the hash of the latest commit on that branch.
- **Remote-tracking branches (`refs/remotes/`):** Bookmarks for remote branches (e.g. `.git/refs/remotes/origin/main`).
- **Tags (`refs/tags/`):** Permanent bookmarks for releases (e.g. `.git/refs/tags/v1.0.0`).

A **symbolic ref** is a reference that points to another reference rather than directly to a SHA hash. The primary symbolic ref in every repository is **`.git/HEAD`**, which typically contains `ref: refs/heads/main`.

| Reference Location | Example | What It Points To |
|---|---|---|
| `.git/HEAD` | `ref: refs/heads/main` | Symbolic pointer to currently checked-out branch |
| `.git/refs/heads/` | `main`, `feat-auth` | Commit hash at the tip of the local branch |
| `.git/refs/remotes/` | `origin/main` | Commit hash at the tip of the remote branch |
| `.git/refs/tags/` | `v1.0.0` | Commit hash (lightweight) or tag object hash (annotated) |

## See it

Inspect references in your local filesystem:

```bash
# Inspect the symbolic reference in HEAD
cat .git/HEAD

# Inspect the commit hash stored inside a branch ref
cat .git/refs/heads/main

# Update a ref safely using plumbing (what git branch does under the hood)
git update-ref refs/heads/test-pointer HEAD

# Use symbolic-ref to check active branch name
git symbolic-ref --short HEAD
```

## Go deeper

As repositories accumulate thousands of tags and branches, having thousands of individual small files in `.git/refs/` slows down filesystem operations. Git optimizes this with **packed-refs**: it periodically collects loose refs into a single sorted text file at `.git/packed-refs`. Git checks loose files first, falling back to `packed-refs`.

> **Tip:** Use `git show-ref` to list all loose and packed references along with their target commit hashes.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Manually editing `.git/refs/` files with text editors; always use `git branch` or `git update-ref`.
- Deleting `.git/refs/heads/` files directly, which destroys local branch tracking.

## Remember

- Refs are simple text files under `.git/refs/` containing 40-character commit hashes.
- `HEAD` is usually a symbolic ref pointing to an active branch in `refs/heads/`.
- Git packs historical references into `.git/packed-refs` for filesystem efficiency.
