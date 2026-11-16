---
slug: snapshots-vs-diffs
title: "Snapshots, Not Diffs"
topic: foundations
kind: concept
summary: "Learn how Git models project history as a stream of complete snapshots rather than per-file change deltas."
tags: [internals, snapshots, history]
related: [version-control-models, git-design-philosophy, three-areas-three-states]
---
> **In one line:** Git stores project history as a sequence of full snapshots, deduplicating unchanged files by content hash.

## The idea

The fundamental difference between Git and traditional version control systems (like CVS, Subversion, or Perforce) is the way Git thinks about its data. Most other systems store information as a list of file-based changes. These systems (often called delta-based version control) track a base file and store sets of cumulative differences (deltas) for each file over time.

Git does not think of or store its data this way. Instead, Git models data like a miniature filesystem where each commit is a picture of what all your files looked like at that exact moment. To be efficient, if files have not changed between commits, Git does not store the file again. Instead, it creates a lightweight pointer linking directly to the identical object stored previously.

| Property | Delta-Based VCS (SVN, CVS) | Snapshot-Based VCS (Git) |
|---|---|---|
| **Storage Model** | Base file + chronological per-file diffs | Complete project filesystem snapshot per commit |
| **Reconstruction** | Assembles diffs sequentially to build state | Points directly to trees and blob content |
| **Deduplication** | Compression of delta chunks | Content-addressed SHA hashes for identical files |
| **Branch Switching** | Computes and applies file-by-file delta patches | Swaps filesystem pointers to target root tree |

## See it

When inspecting a commit object with Git's plumbing commands, you can see that it points to a root tree representing the entire folder snapshot:

```bash
# Inspect the commit object to see its root tree pointer
git cat-file -p HEAD

# Inspect the root tree object pointing to whole files (blobs), not diffs
git cat-file -p HEAD^{tree}

# Check file contents directly by blob SHA hash
git cat-file -p 4b825dc642cb6eb9a060e54bf8d69288fbee4904
```

## Go deeper

Because Git stores complete snapshots, branch switching and checking out historical commits is extremely fast. Git does not need to compute hundreds of incremental delta patches to reconstruct how a file looked two months ago. It checks the tree object and writes the stored blob directly to your working tree.

When you ask Git to display a diff (via `git diff` or `git log -p`), Git does not read stored diffs—it compares two complete snapshots in memory and computes the difference on the fly. This makes diff generation flexible because you can diff any two arbitrary commits in the graph.

> **Note:** Identical file content always produces the identical SHA hash, meaning duplicate files across different folders or branches share the same storage object.

## Watch out

- Describing Git as storing 'diffs' between commits—diffs are computed on demand when you request them.
- Worrying that snapshots waste disk space; identical files share the exact same blob hash across all commits.

## Remember

- Traditional VCS stores a base file plus lists of incremental file deltas.
- Git stores each commit as a pointer to a complete snapshot of all files at that instant.
- Unchanged files are not duplicated; Git links back to identical content objects via SHA hashes.
