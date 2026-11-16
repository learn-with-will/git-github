---
slug: the-four-object-types
title: "The Four Object Types: Blob, Tree, Commit, Tag"
topic: internals
kind: concept
summary: "Understand Git's four fundamental object types—blobs (data), trees (directories), commits (snapshots), and tags (annotations)."
tags: [internals, objects, dag]
related: [content-addressed-store, refs-and-symbolic-refs, the-commit-dag]
---
> **In one line:** Every piece of data in Git is stored as one of four object types: blob, tree, commit, or annotated tag.

## The idea

Everything in your Git repository—every file, every directory, every commit message, and every release note—is represented by just **four fundamental object types** in `.git/objects/`:

1. **Blob (Binary Large Object):** Stores pure file contents. Blobs do not store filenames, permissions, or timestamps—only raw bytes.
2. **Tree:** Represents a directory. A tree object contains a list of pointers to blobs (files) and other nested trees (subdirectories), along with file modes (permissions) and filenames.
3. **Commit:** Captures a snapshot of the project. It points to a top-level root tree object and contains metadata: parent commit hashes, author, committer, and the commit message.
4. **Tag:** An annotated tag object. It points to a specific commit and contains a tagger name, date, message, and optional cryptographic signature.

| Object Type | What It Contains | Analogy |
|---|---|---|
| **Blob** | Raw file contents (no filename or mode) | The text of a document |
| **Tree** | Directory listing mapping names and modes to SHA hashes | A folder holding files and subfolders |
| **Commit** | Root tree hash, parent commit hashes, author, timestamp, message | A snapshot with a timestamp and caption |
| **Tag** | Target commit hash, tagger name, date, annotation message | A signed permanent certificate |

## See it

Peek into Git's object database using `git cat-file`:

```bash
# 1. View the commit object at HEAD
git cat-file -p HEAD

# 2. View the root tree object referenced by that commit
git cat-file -p HEAD^{tree}

# 3. View a blob (file content) referenced in that tree
git cat-file -p HEAD:package.json

# Check the object type of any SHA hash
git cat-file -t HEAD
```

## Go deeper

Notice how clean this separation is: because filenames are stored in tree objects and not in blobs, renaming a file in Git does not create a new blob object! Git simply writes a new tree object where the existing blob hash is mapped to the new filename.

> **Tip:** You can print the complete recursive tree of any commit using `git ls-tree -r HEAD`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Expecting a blob object to contain the file's name; names are stored in tree objects.
- Confusing lightweight tags (which are ref pointers) with annotated tag objects in `.git/objects/`.

## Remember

- Git has four object types: blob (file), tree (directory), commit (snapshot), and tag (annotation).
- Trees map filenames and permissions to blob and child-tree hashes.
- Commits link root trees to parent commits with author and message metadata.
