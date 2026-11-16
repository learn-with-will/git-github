---
slug: checkout-ours-theirs
title: "Checking Out Whole Sides in Conflicts"
topic: conflict-resolution
kind: technique
summary: "Resolve conflicts instantly on binary files, compiled bundles, or total rewrites with git checkout --ours and --theirs."
tags: [conflicts, checkout, binary-files]
related: [conflict-anatomy-diff3, the-rebase-reversal, git-rerere]
---
> **In one line:** Use git checkout --ours or --theirs to take an entire file version wholesale during merge conflicts.

## The idea

Not all merge conflicts should be resolved by editing lines in a text editor.

Consider these scenarios:
1. **Binary files:** Git cannot insert conflict markers into image assets (`.png`, `.svg`), compiled binaries, or SQLite databases.
2. **Lockfiles:** In `package-lock.json` or `yarn.lock`, line-by-line manual resolution is error-prone. It is far better to take one branch's version and re-run your package manager.
3. **Complete rewrites:** When one branch has completely rewritten a file and your team agrees to discard the alternative version entirely.

In these cases, you can use `git checkout --ours <path>` or `git checkout --theirs <path>`.

This command completely overwrites the conflicted file in your working tree with one side's version. Once checked out, you stage the file with `git add` to mark the conflict as resolved.

| Command | File Version Taken | Best Used For |
|---|---|---|
| `git checkout --ours <file>` | Current branch version (`HEAD`) | Keeping your branch's asset or lockfile |
| `git checkout --theirs <file>` | Incoming branch version | Accepting teammate's asset or lockfile |
| `git add <file>` | Marks file resolved in index | Finalizing the choice |

## See it

Resolve a conflict on an image file and a lockfile during a merge:

```bash
# Encounter conflict during merge on a binary asset and lockfile
git merge feature-branding

# Take your branch's version of the logo image
git checkout --ours assets/logo.png

# Take the incoming branch's version of package-lock.json
git checkout --theirs package-lock.json

# Regenerate lockfile to ensure consistency
npm install

# Stage both resolved files
git add assets/logo.png package-lock.json
git commit -m "Merge feature-branding and resolve assets"
```

## Go deeper

In modern Git (version 2.23+), you can also use `git restore` with the same flags: `git restore --ours <file>` and `git restore --theirs <file>`. Both commands achieve the identical result of loading the specified stage index into your working tree.

> **Tip:** You can check out an entire directory of conflicted files at once: `git checkout --theirs assets/icons/`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Attempting to manually edit binary files that have merge conflicts; use `--ours` or `--theirs`.
- Forgetting the rebase reversal: during a rebase, `--ours` is the upstream branch and `--theirs` is your feature branch.

## Remember

- `git checkout --ours <path>` accepts the entire file version from your current branch.
- `git checkout --theirs <path>` accepts the entire file version from the incoming branch.
- Indispensable for resolving conflicts on binary assets, generated code, and package lockfiles.
