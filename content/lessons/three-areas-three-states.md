---
slug: three-areas-three-states
title: "The Three Areas and Three States"
topic: basics-workflow
kind: concept
summary: "Master Git's core architecture: the working tree, staging area (index), and repository, plus modified, staged, and committed states."
tags: [workflow, staging-area, states]
related: [staging-with-git-add, creating-snapshots-git-commit, restoring-files]
---
> **In one line:** Git manages your files across the working tree, the staging area (index), and the repository database.

## The idea

To understand Git, you must internalize its three primary areas and the three corresponding states files can reside in.

1. **The Working Tree:** The single checkout of one version of the project on your filesystem. These are the physical files you edit in your IDE or text editor.
2. **The Staging Area (Index):** A binary file inside your `.git/` directory that stores the exact snapshot formatted and ready to go into your next commit. It acts as a staging dock or review surface.
3. **The Git Directory (Repository):** Where Git stores the metadata and object database (`.git/`). This is the permanent historical archive of your project.

| Area | File Location | Matching File State | What Happens Here |
|---|---|---|---|
| **Working Tree** | Root project folder on disk | **Modified** | You write code, test changes, and edit files |
| **Staging Area** | `.git/index` binary file | **Staged** | Marked changes collected for the upcoming snapshot |
| **Repository** | `.git/objects/` store | **Committed** | Safely stored in the immutable historical graph |

## See it

Observe how files transition between states using `git status`:

```bash
# Check initial clean repository state
git status

# Modify a file (transitions to Modified in Working Tree)
echo "console.log('debug')" >> app.js
git status -s

# Stage the file (transitions to Staged in Index)
git add app.js
git status -s

# Commit the file (transitions to Committed in Repository)
git commit -m "Add debug logging to app"
```

## Go deeper

The existence of the staging area is what makes Git vastly superior to older version control systems. In systems without a staging area, whatever files were touched in your working tree were bundled into the commit. In Git, the staging area lets you craft deliberate, atomic commits by staging only specific files or specific line hunks.

> **Note:** A file can be both modified and staged at the same time if you stage changes with `git add` and then make further edits to the working tree before committing.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Believing that editing a file after running `git add` automatically updates the staged version; you must re-add.
- Thinking the staging area is a separate copy of your files on disk; it is an index of object references.

## Remember

- The working tree holds files on disk; the staging area formats the next commit; the repository stores history.
- Files transition from Modified (working tree) to Staged (index) to Committed (object database).
- The staging area enables precise, atomic commit curation.
