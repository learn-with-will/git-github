---
id: lesson-21
slug: git-internals-objects-refs-and-the-dag
title: "Git Internals: Objects, Refs & the DAG"
level: advanced
order: 21
duration: 20
tags:
  - internals
  - objects
  - refs
  - dag
summary: "How Git really works: a content-addressed store of blob/tree/commit/tag objects named by hash, refs that point into them, and the commit DAG that ties it all together."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe Git's four object types — **blob, tree, commit, tag** — and what each stores.
- Explain **content-addressing**: objects named by a hash of their contents.
- Explain what **refs** (branches, tags, `HEAD`) really are.
- Picture history as a **DAG** and see why it's tamper-evident.

# Why It Matters

Every command you've learned is a thin layer over a surprisingly small and elegant model. Once
you see that model — objects addressed by content, refs pointing at commits, a graph of parents —
Git stops feeling like a bag of magic commands and starts making sense. This is the lesson that
turns "I memorized the commands" into "I understand what Git is doing."

# Concept Explanation

### Git is a content-addressed store

At its core, Git is a **key–value store** where the **key is a hash of the value**. Store some
content and Git gives you back a hash (its object ID); ask for that hash and you get the content
back. The default hash is **SHA-1** (a 40-character hex string); Git also supports SHA-256 as an
opt-in newer format, but SHA-1 remains the default.

Because the name **is** a fingerprint of the content, **identical content is stored once** (two
files with the same bytes share one blob), and **nothing can change without its hash changing**.

### The four object types

| Object | Stores | Points to |
| ------ | ------ | --------- |
| **blob** | The **contents** of a file (just bytes — no name, no metadata) | — |
| **tree** | A **directory**: a list of names + modes | blobs (files) and other trees (subdirs) |
| **commit** | A snapshot's metadata: author, committer, message | one **tree** + its **parent** commit(s) |
| **tag** (annotated) | Tagger, date, message (optional signature) | usually a **commit** |

So a **commit** points to a **tree** (the top folder of your snapshot), the tree points to
**blobs** and sub-**trees**, and each commit points back to its **parent(s)**. Filenames live in
trees, not blobs.

### Refs: human-friendly names

You don't memorize hashes — you use **refs**, which are just names that point to a commit hash:

- **Branches** live in `.git/refs/heads/` — a branch is literally a small file containing a
  commit hash.
- **Tags** live in `.git/refs/tags/`.
- **`HEAD`** (`.git/HEAD`) is usually a **symbolic ref** — it points to a branch, e.g.
  `ref: refs/heads/main`. That's how Git knows "the current branch."

### The commit DAG

Follow parents and you get a **directed acyclic graph (DAG)**: each commit points back to its
parent(s), merges have multiple parents, and there are no cycles. Branches and tags are just
labels pointing into this graph.

```text
   (blob: "hi") ◀── (tree) ◀── C ──▶ parent B ──▶ parent A
                                 ▲
                              refs/heads/main ── HEAD
```

Because each commit's hash covers its tree **and** its parent, changing any old commit changes
every hash after it — which is exactly why Git history is **tamper-evident**.

### Peeking with plumbing

```bash
git cat-file -t HEAD        # object type: "commit"
git cat-file -p HEAD        # pretty-print the commit (tree, parent, author, message)
git rev-parse HEAD          # the full hash HEAD resolves to
```

# Key Terminology

- **Content-addressed:** named by a hash of the content itself.
- **blob / tree / commit / tag:** Git's four object types.
- **Ref:** a name pointing to a commit hash (branches, tags).
- **`HEAD`:** a symbolic ref pointing to the current branch.
- **DAG:** directed acyclic graph — the shape of commit history.
- **Plumbing:** low-level commands like `cat-file`, `hash-object`, `rev-parse`.

# Options and Trade-offs

This lesson is about the model, not a choice between options — but the model explains many
earlier behaviors:

| You observed… | …because internally |
| ------------- | ------------------- |
| Branching is instant | A branch is one small file (a ref) pointing at a commit |
| Identical files don't double storage | Same content → same blob hash → stored once |
| You can't quietly alter old history | A commit's hash covers its parent, so edits cascade to new hashes |
| Snapshots, not diffs | A commit points to a full tree of blobs |

# Worked Example

Walk from a commit down to a file's contents using plumbing commands.

```bash
git cat-file -p HEAD
```

```text
tree 9a1f...c3
parent 4d5e...77
author Ada <ada@example.com> 1700000000 +0000
committer Ada <ada@example.com> 1700000000 +0000

Add greeting
```

Follow the tree, then a blob:

```bash
git cat-file -p 9a1f...c3      # the tree: lists entries with hashes and names
# 100644 blob 7e5a...  README.md
git cat-file -p 7e5a...        # the blob: the file's actual contents
```

```text
# Hello
```

Commit → tree → blob. That chain, plus parent links, is *all* of Git's data model.

# Real World Analogy

Git is a **filing system where everything is filed by a fingerprint of its contents**. A **blob**
is a document filed by its fingerprint (no title on it). A **tree** is a folder's table of
contents, listing names next to the fingerprints of the documents and subfolders inside. A
**commit** is a dated index card: "here's the fingerprint of the whole folder as of now, and
here's the card that came before." **Branches** and **tags** are just labeled paperclips you
attach to particular index cards.

# Examples

## Example 1 — Basic: read a commit object

A developer runs `git cat-file -p HEAD` and sees the commit's tree, parent, author, and message —
realizing a commit is just a small text object pointing at a tree and a parent.

**Why this works:** Commits aren't mysterious; they're plain objects you can print, which
demystifies everything built on them.

## Example 2 — Real-world: why history is trustworthy

A team relies on commit hashes to verify that a deployed artifact matches a reviewed commit.
Because a hash covers the content and full ancestry, a matching hash guarantees identical
history.

**Why this works:** Content-addressing makes each commit a fingerprint of its entire past, so
equal hashes mean equal history — the basis of Git's integrity.

## Example 3 — Trade-off / pitfall: "the branch holds my commits"

Someone deletes a branch thinking it stores its commits, and is surprised the commits are still
reachable from another branch (and via the reflog). A branch is only a **pointer**; the commits
live in the object store.

**Why this bites:** Confusing the label (a ref) with the data (objects) leads to wrong mental
models about what deleting or moving a branch actually does.

# Common Mistakes

- **Thinking a branch "contains" its commits.** A branch is a pointer to one commit; commits are
  reached by following parents.
- **Believing Git stores diffs.** It stores whole objects (snapshots); diffs are computed on
  demand.
- **Confusing blobs and trees.** Blobs hold content; **trees** hold the names and structure.
- **Assuming the hash is of the filename.** It's of the **content** (that's why identical files
  dedupe).

# Best Practices

- Learn the object model to **reason about Git confidently** instead of memorizing commands.
- Use **`git cat-file`** and **`git rev-parse`** to inspect objects when something confuses you.
- Remember **`HEAD` is a symbolic ref** to your current branch.
- **Don't hand-edit `.git`;** use commands, which keep the object store consistent.

# Summary

- Git is a **content-addressed** store: objects are named by a hash (SHA-1 by default) of their
  content, so identical content is stored once and history is tamper-evident.
- Four object types: **blob** (file contents), **tree** (directory of names → blobs/trees),
  **commit** (a tree + parent(s) + metadata), and **tag**.
- **Refs** are names pointing at commits; a **branch** is a tiny file with a commit hash, and
  **`HEAD`** is a symbolic ref to the current branch.
- History is a **DAG** of commits linked to their parents — which is why branching is cheap and
  old history can't change quietly.

# Flash Cards

Q: What are Git's four object types?
A: blob (file contents), tree (directory listing), commit (snapshot metadata pointing to a tree and parents), and tag (annotated tag object).

Q: What does a blob store?
A: The raw contents of a file — just the bytes, with no filename or metadata. Filenames live in tree objects.

Q: How does Git name its objects?
A: By a hash of the object's content (SHA-1 by default), so identical content yields the same object and is stored once.

Q: What is HEAD, at the file level?
A: A symbolic ref, usually pointing to the current branch (e.g. `ref: refs/heads/main`).

Q: Why can't you quietly change an old commit?
A: A commit's hash covers its tree and its parent, so altering any old commit changes its hash and every descendant's hash.

Q: Is a branch a copy of its commits?
A: No — a branch is just a pointer (a ref) to one commit; the commits live in the object store and are reached via parent links.

# Exercises

### Easy

Run `git cat-file -p HEAD` in any repo. Identify the tree, parent, author, and message fields,
and explain what each points to.

### Medium

Starting from `HEAD`, use `git cat-file -p` to walk commit → tree → blob and print a file's
contents through the object model. Describe each hop.

### Challenging

Explain, using the object model, three earlier behaviors: why branching is instant, why two
identical files don't double storage, and why you can't rewrite an old commit without changing
all later hashes.

# Further Reading

- Pro Git, Chapter 10 — [Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) and [Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
- [`git cat-file`](https://git-scm.com/docs/git-cat-file) and [`git rev-parse`](https://git-scm.com/docs/git-rev-parse) references
