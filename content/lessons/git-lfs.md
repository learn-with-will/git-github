---
slug: git-lfs
title: "Handling Large Files with Git LFS"
topic: debugging-large-repos
kind: tool
summary: "Prevent repository bloat by storing large assets (videos, datasets, model weights) using Git Large File Storage (LFS)."
tags: [git-lfs, large-files, storage]
related: [git-submodules, removing-sensitive-data, content-addressed-store]
---
> **In one line:** Git LFS replaces large binaries in your repository with tiny pointer files, storing actual asset bytes on a dedicated server.

## The idea

Git is optimized for text source code files that compress efficiently. When you commit large binary files (videos, 3D models, machine learning weights, compiled binaries), Git struggles:
- Git cannot compute meaningful deltas for binaries.
- Every modification to a 100MB file stores another 100MB blob in `.git/objects/`.
- Every future cloner must download the entire historical accumulation of all past binary versions, causing clone times to balloon into hours.

**Git Large File Storage (LFS)** is an open-source Git extension that solves this problem.

With Git LFS:
1. Large files in your repository are replaced with tiny **text pointer files** (around 130 bytes) containing the SHA-256 hash and byte size of the asset.
2. The actual heavy binary payloads are uploaded via HTTP to a dedicated LFS object store (such as GitHub LFS storage).
3. When you check out a branch, Git LFS downloads only the specific binary version needed for your current working tree.

| File Type | Stored in Standard Git | Stored in Git LFS |
|---|---|---|
| **Text Source Code (`.ts`, `.py`, `.md`)** | Directly in Git object database | Directly in Git object database |
| **Large Binaries (`.psd`, `.zip`, `.onnx`)** | Full copies bloated across all commits | Tiny 130-byte pointer in Git; binary in LFS store |
| **Clone Impact** | Downloads all historical binaries | Downloads only active checked-out binary versions |

## See it

Configure Git LFS to track large assets:

```bash
# 1. Install Git LFS hooks on your machine
git lfs install

# 2. Tell LFS which file extensions to track
git lfs track "*.psd"
git lfs track "models/*.onnx"

# 3. .gitattributes records the tracking configuration; commit it
git add .gitattributes
git commit -m "chore: configure Git LFS for psd and onnx models"

# 4. Add large file and commit normally
git add models/classifier.onnx
git commit -m "feat: add trained classifier model"
git push origin main
```

## Go deeper

When you inspect an LFS-tracked file in the raw Git object database, it looks like this:
```text
version https://git-lfs.github.com/spec/v1
oid sha256:4d7a282a16da4f...
size 124857600
```
Git's smudge and clean filter drivers intercept file checkouts and commits, seamlessly replacing pointer files with real binary bytes on disk.

> **Tip:** Run `git lfs ls-files` to inspect which files in your current commit are managed by Git LFS.

## Watch out

- Committing a large binary before running `git lfs track`; the large file is already baked into Git history.
- Forgetting to commit the `.gitattributes` file, meaning collaborators' machines won't know to use LFS.

## Remember

- Git LFS replaces heavy binary files with tiny pointer files in Git history.
- Actual binary assets are stored in a dedicated remote LFS store and fetched on demand.
- Always commit the `.gitattributes` file when configuring LFS patterns.
