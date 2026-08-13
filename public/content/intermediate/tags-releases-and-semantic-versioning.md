---
id: lesson-16
slug: tags-releases-and-semantic-versioning
title: "Tags, Releases & Semantic Versioning"
level: intermediate
order: 16
duration: 17
tags:
  - tags
  - releases
  - semver
  - versioning
summary: "Mark release points with lightweight vs. annotated Git tags, publish GitHub Releases on top of them, and version software meaningfully with SemVer (MAJOR.MINOR.PATCH)."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Create **lightweight** and **annotated** tags and know when to use each.
- Push tags to a remote (they don't go automatically).
- Explain what a **GitHub Release** adds on top of a tag.
- Apply **Semantic Versioning** (MAJOR.MINOR.PATCH) to decide the next version.

# Why It Matters

Commits are great for history, but humans need named, stable reference points: "version
1.0," "the release we shipped Tuesday." **Tags** provide those, **GitHub Releases** turn a tag
into a published, downloadable version with notes, and **Semantic Versioning** makes the
version number itself *mean* something to the people who depend on you.

# Concept Explanation

### Tags: named pointers to a commit

A **tag** marks a specific commit permanently — unlike a branch, a tag doesn't move. There are
two kinds:

- **Lightweight tag:** just a name pointing at a commit. No extra metadata.
  ```bash
  git tag v1.0.0
  ```
- **Annotated tag:** a full Git object storing the tagger's name and email, a date, and a
  message — and it can be GPG-signed. **Recommended for releases.**
  ```bash
  git tag -a v1.0.0 -m "Release 1.0.0"
  ```

Useful tag commands:

```bash
git tag                       # list tags
git show v1.0.0               # see a tag (and its commit)
git tag -a v0.9.0 <commit>    # tag an older commit after the fact
```

### Tags aren't pushed by default

`git push` does **not** send your tags. Push them explicitly:

```bash
git push origin v1.0.0        # push one tag
git push origin --tags        # push all tags
```

(Checking out a tag puts you in a detached `HEAD`, since a tag isn't a branch.)

### GitHub Releases

A **GitHub Release** is built **on top of a Git tag**. It attaches **release notes** and,
optionally, **binary assets** (compiled downloads) to that tag, giving users a friendly page to
download a specific version. You create releases through the GitHub UI or API; the tag is the
anchor.

### Semantic Versioning (SemVer)

**Semantic Versioning** is a widely used *convention* (specified at semver.org) for version
numbers of the form **MAJOR.MINOR.PATCH**:

- **MAJOR** — increment for **incompatible (breaking)** API changes.
- **MINOR** — increment for **new, backward-compatible** functionality.
- **PATCH** — increment for **backward-compatible bug fixes**.

Optional suffixes mark pre-releases and build metadata: `1.0.0-alpha`, `1.0.0+build.5`. SemVer
is a promise to your users about what a version bump means — Git doesn't enforce it; you follow
it.

# Key Terminology

- **Tag:** an immovable named pointer to a commit.
- **Lightweight tag:** a bare name → commit pointer.
- **Annotated tag:** a tag object with tagger, date, message (and optional signature).
- **GitHub Release:** a tag plus release notes and downloadable assets.
- **Semantic Versioning (SemVer):** the MAJOR.MINOR.PATCH convention.

# Options and Trade-offs

| Tag type | Stores | Use for |
| -------- | ------ | ------- |
| Lightweight | Just a pointer | Quick, private bookmarks |
| Annotated | Tagger, date, message, optional signature | Releases and anything shared |

| SemVer part | Bump it when… | Example |
| ----------- | ------------- | ------- |
| MAJOR | You break backward compatibility | 1.4.2 → 2.0.0 |
| MINOR | You add backward-compatible features | 1.4.2 → 1.5.0 |
| PATCH | You fix a bug, no API change | 1.4.2 → 1.4.3 |

# Worked Example

You ship version 1.2.0 and publish it.

```bash
git tag -a v1.2.0 -m "Release 1.2.0: add CSV export"
git push origin v1.2.0
```

Then, on GitHub, you create a **Release** from tag `v1.2.0`, paste in release notes (what
changed), and attach a built binary. Users get a downloadable, documented version.

Later you fix a bug with no API change — SemVer says bump **PATCH**:

```bash
git tag -a v1.2.1 -m "Release 1.2.1: fix export encoding"
git push origin v1.2.1
```

And when you add a new, backward-compatible feature, you'd bump **MINOR** to `v1.3.0`; a
breaking change would make it `v2.0.0`.

# Real World Analogy

A **tag** is a permanent bookmark labeled "v1.2.0" pressed onto one exact page of history — it
never slides around like a branch bookmark does. A **GitHub Release** is the **published
edition**: the bookmark plus a printed summary of what's new and a boxed copy you can hand out.
**SemVer** is the shared **language on the spine** — readers know at a glance that a jump from
1.x to 2.0 means "expect changes," while 1.2.0 → 1.2.1 means "same book, small fixes."

# Examples

## Example 1 — Basic: tag a release

A maintainer finishes v1.0.0, runs `git tag -a v1.0.0 -m "First stable release"`, and
`git push origin v1.0.0`. The version now has a permanent, named anchor in history.

**Why this works:** An annotated tag records who tagged it and why, and pushing it makes the
release point visible to everyone.

## Example 2 — Real-world: a GitHub Release with assets

A CLI tool tags `v3.1.0`, then publishes a GitHub Release with notes and pre-built binaries for
Windows, macOS, and Linux. Users download the right binary without touching Git.

**Why this works:** Releases turn a tag into a distribution channel — notes plus downloads on a
stable, versioned page.

## Example 3 — Trade-off / pitfall: forgetting to push the tag

A developer tags a release locally and creates the GitHub Release later — but the tag was never
pushed, so it doesn't exist on GitHub yet, and teammates can't find `v1.2.0`.

**Why this bites:** `git push` doesn't send tags. Until you `git push origin <tag>` (or
`--tags`), the tag lives only on your machine.

# Common Mistakes

- **Assuming `git push` sends tags.** Push them explicitly with `git push origin <tag>` or
  `--tags`.
- **Using lightweight tags for releases,** losing the tagger/date/message metadata.
- **Misapplying SemVer** — e.g. shipping a breaking change as a PATCH, surprising dependents.
- **Re-tagging or moving a published version,** which breaks anyone who pinned to it.

# Best Practices

- Use **annotated tags** for releases; keep the message meaningful.
- **Follow SemVer** so your version numbers communicate compatibility.
- **Push tags** as part of releasing; automate it if you can.
- Publish a **GitHub Release** with clear notes (and assets where relevant).
- **Never move a published tag;** cut a new version instead.

# Summary

- A **tag** is an immovable named pointer to a commit; **lightweight** is just a name,
  **annotated** stores tagger/date/message (use annotated for releases).
- Tags are **not pushed by default** — use `git push origin <tag>` or `--tags`.
- A **GitHub Release** builds on a tag, adding **release notes** and downloadable **assets**.
- **SemVer** (MAJOR.MINOR.PATCH): MAJOR for breaking changes, MINOR for backward-compatible
  features, PATCH for backward-compatible fixes.

# Flash Cards

Q: What's the difference between a lightweight and an annotated tag?
A: A lightweight tag is just a name pointing at a commit; an annotated tag is a full object with tagger, date, and message (and can be signed). Use annotated for releases.

Q: Does `git push` send your tags to the remote?
A: No. Push them explicitly with git push origin <tag> or git push origin --tags.

Q: What does a GitHub Release add on top of a Git tag?
A: Release notes and optional downloadable assets (binaries), published on a page anchored to that tag.

Q: In SemVer MAJOR.MINOR.PATCH, which part increases for a backward-compatible bug fix?
A: PATCH (e.g. 1.4.2 → 1.4.3).

Q: You add a new backward-compatible feature to 1.4.2. What's the next SemVer version?
A: 1.5.0 — a MINOR bump for backward-compatible new functionality.

Q: Which SemVer part changes for a breaking, incompatible change?
A: MAJOR (e.g. 1.4.2 → 2.0.0).

# Exercises

### Easy

Create an annotated tag `v0.1.0` on your latest commit and push it. Confirm with `git tag` and
`git show v0.1.0` that the message and tagger are stored.

### Medium

Given a project at `1.4.2`, decide the next version for each change and explain your reasoning:
(a) a bug fix, (b) a new backward-compatible feature, (c) a breaking API change.

### Challenging

Explain the full path from code to a published, downloadable version: which commit gets tagged,
why an annotated tag is preferred, how the tag reaches GitHub, and what a GitHub Release adds.
Note one thing you should never do to a published tag, and why.

# Further Reading

- Pro Git, Chapter 2 — [Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
- GitHub Docs — [About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- [Semantic Versioning 2.0.0](https://semver.org/)
