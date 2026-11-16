---
slug: lightweight-vs-annotated-tags
title: "Lightweight vs Annotated Tags"
topic: project-management
kind: concept
summary: "Understand the difference between lightweight tag pointers and full annotated tag objects with checksums, messages, and GPG signatures."
tags: [tags, releases, internals]
related: [semantic-versioning-rules, github-releases-and-assets, the-four-object-types]
---
> **In one line:** Lightweight tags are simple commit bookmarks; annotated tags are full checksummed objects with messages, author, and date.

## The idea

Git has the ability to tag specific points in a repository's history as being important. Typically, people use this functionality to mark release points (such as `v1.0.0` or `v2.4.1`).

Git supports two main types of tags:

1. **Lightweight Tags:** A lightweight tag is simply a pointer to a specific commit—essentially a branch that never moves. Under the hood, it is a 41-byte text file inside `.git/refs/tags/` containing a commit SHA hash. It contains no message, no date, and no author metadata.
2. **Annotated Tags:** An annotated tag is stored as a full, independent object in the Git object database. It is checksummed, contains the tagger's name, email, and date, carries a tagging message, and can be cryptographically signed with GPG or SSH.

**Best Practice:** For formal software releases, always use **annotated tags** (`git tag -a`). Reserve lightweight tags for temporary local bookmarks.

| Tag Type | Creation Command | Stores Message? | Stores Tagger & Date? | GPG Signable? | Recommended Use |
|---|---|---|---|---|---|
| **Lightweight** | `git tag v1.0.0` | No | No | No | Temporary personal bookmarks |
| **Annotated** | `git tag -a v1.0.0 -m "..."` | Yes | Yes | Yes (`-s`) | Formal public releases |

## See it

Create, inspect, and push tags:

```bash
# Create an annotated release tag with a descriptive message
git tag -a v1.0.0 -m "Release version 1.0.0 with core auth and dashboard"

# Inspect the annotated tag object showing tagger, date, and message
git show v1.0.0

# Note: git push does NOT push tags by default! Push the tag explicitly:
git push origin v1.0.0

# Or push all local tags in one step
git push origin --tags
```

## Go deeper

Tags are not automatically sent to remote servers when you run `git push`. This intentional design allows you to create private local tags without polluting the remote repository. You must explicitly push tags by name (`git push origin v1.0.0`) or pass `--tags`.

> **Tip:** You can retroactively tag past commits by appending the commit hash: `git tag -a v0.9.0 9fceb02 -m "Beta release"`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Forgetting to push tags to the remote repository; `git push` alone only pushes branches.
- Using lightweight tags for public software releases; annotated tags are required for auditability.

## Remember

- Lightweight tags are simple bookmarks; annotated tags are complete checksummed objects.
- Always use `git tag -a <name> -m <msg>` for official version releases.
- Push tags explicitly using `git push origin <tagname>` or `git push origin --tags`.
