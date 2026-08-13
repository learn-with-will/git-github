---
id: lesson-20
slug: submodules-and-git-lfs
title: "Submodules & Git LFS"
level: advanced
order: 20
duration: 17
tags:
  - submodules
  - git-lfs
  - large-files
  - dependencies
summary: "Embed one repo inside another at a pinned commit with submodules, and keep large binaries out of history with Git LFS pointer files — plus the gotchas of each."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a **submodule** is and what the parent repo actually records.
- Clone and update a repository that uses submodules.
- Explain what **Git LFS** does and when to use it.
- Recognize the common pitfalls of both.

# Why It Matters

Two real-world problems don't fit plain Git well: including **another repository** inside yours
at a controlled version, and storing **large binary files** (art, audio, datasets) without
bloating every clone. Submodules solve the first; Git LFS solves the second. Both are powerful,
both have sharp edges, and knowing their gotchas saves you from empty folders and gigabyte
clones.

# Concept Explanation

### Submodules: a repo inside a repo

A **submodule** embeds one Git repository inside another at a specific path, **pinned to a
specific commit**. The parent repo stores only the submodule's URL (in a `.gitmodules` file) and
a pointer to the exact commit — **not** the submodule's files.

```bash
git submodule add https://github.com/acme/shared-lib.git libs/shared
# creates .gitmodules and records libs/shared at a specific commit
git commit -m "Add shared-lib submodule"
```

Cloning a project **with** submodules needs an extra step, or the submodule folders come down
**empty**:

```bash
git clone --recurse-submodules https://github.com/you/app.git
# or, after a plain clone:
git submodule update --init --recursive
```

To move a submodule to a newer commit, update it inside the submodule, then **commit the new
pointer** in the parent — submodules do **not** auto-update.

### Git LFS: pointers for big files

**Git Large File Storage (LFS)** is a separate extension that replaces large files in your repo
with tiny **pointer files**, while the actual content is stored on a dedicated LFS server. Your
Git history stays small and fast.

```bash
git lfs install                 # one-time setup
git lfs track "*.psd"           # writes the pattern to .gitattributes
git add .gitattributes
git add design.psd              # stored as a pointer; content goes to LFS
git commit -m "Add design (LFS)"
```

The repo commits a small pointer; the big bytes live in LFS. The host must **support LFS**
(GitHub does, with storage/bandwidth quotas). LFS is **not** part of core Git.

# Key Terminology

- **Submodule:** a repository nested in another at a pinned commit.
- **`.gitmodules`:** file recording each submodule's path and URL.
- **`--recurse-submodules`:** fetch submodule contents during clone/update.
- **Git LFS:** an extension that stores large files outside the repo, leaving pointers behind.
- **Pointer file:** the small text stand-in LFS commits in place of a big file.
- **`.gitattributes`:** where LFS records which paths it manages.

# Options and Trade-offs

| Need | Use | Watch out for |
| ---- | --- | ------------- |
| Include another repo at a fixed version | **Submodule** | Empty dirs without `--recurse-submodules`; manual updates |
| Version large binaries without bloat | **Git LFS** | Needs LFS installed + host support and quotas |
| Simple dependency management | A **package manager** | Often simpler than a submodule for libraries |

# Worked Example

Your app depends on a shared library at a known-good version, and includes large design assets.

```bash
# Pin the shared library as a submodule
git submodule add https://github.com/acme/shared-lib.git libs/shared
git commit -m "Vendor shared-lib at current commit"

# Track big design files with LFS
git lfs install
git lfs track "*.psd"
git add .gitattributes assets/hero.psd
git commit -m "Add hero design via LFS"
```

A teammate clones correctly with:

```bash
git clone --recurse-submodules git@github.com:you/app.git
```

The submodule arrives at the exact pinned commit, and the `.psd` downloads through LFS as a real
file (its pointer resolved), while the Git history stays lean.

# Real World Analogy

A **submodule** is a **link to another book** placed inside yours, with a sticky note saying
"use *exactly* the 3rd edition." Your book doesn't contain that book's pages — just the reference
and the edition number. **Git LFS** is a **coat check**: instead of lugging a heavy coat through
the whole building (the repo), you hang it at the desk and carry a lightweight **claim ticket**
(the pointer); you collect the actual coat only when you need it.

# Examples

## Example 1 — Basic: pin a dependency

A team vendors an internal library as a submodule pinned to a reviewed commit, so every clone
builds against that exact version until they deliberately bump it.

**Why this works:** The parent records a specific commit, giving reproducible builds without
copying the library's history into the main repo.

## Example 2 — Real-world: a game repo with LFS

A game project stores textures, audio, and models — hundreds of megabytes — via Git LFS.
Developers clone quickly because history holds pointers, and LFS fetches the assets on demand.

**Why this works:** LFS keeps heavy binaries out of the core history, so clones and operations
stay fast even with large assets.

## Example 3 — Trade-off / pitfall: the empty submodule folder

A new contributor runs a plain `git clone` and finds `libs/shared` empty, then gets confusing
build errors. Running `git submodule update --init --recursive` (or cloning with
`--recurse-submodules`) fixes it.

**Why this bites:** A plain clone fetches the *pointer* to the submodule commit, not its
contents. Submodules always need that extra fetch step.

# Common Mistakes

- **Cloning without `--recurse-submodules`,** leaving submodule folders empty.
- **Forgetting to commit the updated submodule pointer** in the parent after bumping it.
- **Expecting submodules to auto-update** — they stay pinned until you move them.
- **Adding large files before `git lfs track`,** so they land in normal history and bloat it.
- **Assuming LFS is built in** — it's a separate tool needing installation and host support.

# Best Practices

- **Document** that a repo uses submodules and how to clone it.
- Clone/update with **`--recurse-submodules`**; pin submodules intentionally.
- Set up **LFS and `.gitattributes` first**, *then* add large files.
- Check your host's **LFS quotas** before committing gigabytes.
- Consider whether a **package manager** is simpler than a submodule for a library dependency.

# Summary

- A **submodule** nests one repo inside another at a **pinned commit**; the parent stores the URL
  (`.gitmodules`) and commit pointer, not the files.
- Clone submodule-using repos with **`--recurse-submodules`** (or
  `git submodule update --init`), and they don't auto-update.
- **Git LFS** replaces large files with **pointer files**, storing content on a separate LFS
  server to keep the repo small; it needs installation and host support.
- Both are powerful but have gotchas: empty submodule folders, and large files added before LFS
  tracking.

# Flash Cards

Q: What does a submodule record in the parent repository?
A: A link to another repository at a specific commit (its URL in .gitmodules plus the pinned commit) — not the submodule's actual files.

Q: What does Git LFS do?
A: It replaces large files with small pointer files in the repo, storing the real content on a separate LFS server to keep history small.

Q: How do you clone a repository and fetch its submodules in one step?
A: git clone --recurse-submodules <url> (or run git submodule update --init --recursive after a plain clone).

Q: Do submodules update to the latest upstream automatically?
A: No — a submodule stays pinned to its recorded commit until you update it and commit the new pointer in the parent.

Q: Why is your freshly cloned submodule folder empty?
A: You cloned without --recurse-submodules; a plain clone brings the pointer, not the submodule's contents.

Q: Is Git LFS part of core Git?
A: No — it's a separate extension that must be installed, and the host (e.g. GitHub) must support it.

# Exercises

### Easy

Add any small public repo as a submodule of a test repo with `git submodule add`. Inspect the
generated `.gitmodules` and explain what the parent recorded.

### Medium

Clone a submodule-using repo two ways: a plain `git clone`, then `--recurse-submodules` (or
`git submodule update --init`). Explain the difference in the submodule folder's contents.

### Challenging

Explain when you'd choose a submodule, a package manager, or Git LFS for: (a) depending on a
shared internal library, (b) an open-source dependency, and (c) versioning 500 MB of image
assets. Justify each choice and name a pitfall you'd guard against.

# Further Reading

- Pro Git, Chapter 7 — [Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Git LFS](https://git-lfs.com/) and GitHub Docs — [About Git Large File Storage](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)
