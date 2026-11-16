---
slug: merge-conflict-basics
title: "Merge Conflict Basics"
topic: branching-merging
kind: technique
summary: "Understand why merge conflicts happen, learn to read standard conflict markers, and resolve them confidently."
tags: [conflicts, merging, troubleshooting]
related: [three-way-merges, aborting-and-resolving-merges, conflict-anatomy-diff3]
---
> **In one line:** A merge conflict occurs when two branches modify the exact same lines in a file differently, requiring human resolution.

## The idea

Git automatically merges files whenever changes occur in different files or in different sections of the same file. However, if you and a teammate both modified the exact same lines in the same file since your branches diverged, Git cannot automatically guess which version is correct.

Instead of making an arbitrary guess, Git halts the merge, leaves your working tree in an unresolved state, and writes **conflict markers** directly into the affected files.

Conflict markers follow a strict structure:
- `<<<<<<< HEAD`: Marks the beginning of the conflicted hunk and shows what exists on your current branch.
- `=======`: The separator dividing the two competing versions.
- `>>>>>>> <branch>`: Marks the end of the conflicted hunk and shows what exists on the incoming branch.

Resolving a conflict simply means opening the file, editing the text to the desired final version, removing the marker lines entirely, and running `git add` to mark the conflict as resolved.

| Marker | Indicates |
|---|---|
| `<<<<<<< HEAD` | Start of conflicted hunk; contains changes from your current branch |
| `=======` | Dividing line between the two conflicting versions |
| `>>>>>>> feature-branch` | End of conflicted hunk; contains changes from the incoming branch |

## See it

Here is how a conflicted section looks inside an application source file:

```text
<<<<<<< HEAD
const API_URL = "https://api.production.internal";
=======
const API_URL = "https://api.v2.production.com";
>>>>>>> feature-api-v2
```

To resolve it, replace the entire block with the chosen code, stage, and finish the merge:

```bash
# 1. Edit the file to the final clean code
# 2. Stage the resolved file
git add src/config.js

# 3. Complete the merge commit
git commit -m "Merge feature-api-v2 and resolve API_URL conflict"
```

## Go deeper

Modern IDEs (VS Code, JetBrains) automatically detect Git conflict markers and display interactive buttons: 'Accept Current Change', 'Accept Incoming Change', or 'Accept Both Changes'. Behind the scenes, clicking these buttons simply edits the file text and removes the conflict markers.

> **Tip:** Running `git status` during a conflict clearly lists all conflicted files under 'Unmerged paths'.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Accidentally committing files with the conflict markers (`<<<<<<<` or `=======`) still inside them.
- Panicking during a conflict; conflicts are a normal, everyday occurrence in collaborative software development.

## Remember

- Merge conflicts happen when competing changes affect the exact same lines of code.
- Git inserts `<<<<<<<`, `=======`, and `>>>>>>>` markers around the disputed lines.
- Edit the file to your desired solution, remove the markers, and stage with `git add` to resolve.
