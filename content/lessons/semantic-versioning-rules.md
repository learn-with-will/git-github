---
slug: semantic-versioning-rules
title: "Semantic Versioning (SemVer)"
topic: project-management
kind: pattern
summary: "Adopt the Semantic Versioning standard (MAJOR.MINOR.PATCH) to communicate API stability and breaking changes clearly."
tags: [semver, versioning, best-practices]
related: [lightweight-vs-annotated-tags, github-releases-and-assets, conventional-commits]
---
> **In one line:** Semantic Versioning encodes API compatibility in three numbers: MAJOR for breaking changes, MINOR for features, and PATCH for fixes.

## The idea

Software dependencies can quickly become a nightmare of incompatible upgrades if version numbers are assigned randomly. **Semantic Versioning (SemVer)** is a widely adopted specification (at semver.org) that gives version numbers precise, universally understood meaning.

A SemVer version format takes the form: **`MAJOR.MINOR.PATCH`** (e.g. `2.4.1`)

The numbers increment according to strict rules:
1. **MAJOR version (X.0.0):** Incremented when you make incompatible, **breaking API changes**. Callers must update their code to upgrade.
2. **MINOR version (1.X.0):** Incremented when you add functionality in a **backward-compatible manner**. Safe to upgrade without changing existing consumer code.
3. **PATCH version (1.0.X):** Incremented when you make **backward-compatible bug fixes**. Safe for automatic, zero-risk upgrades.

Optional pre-release identifiers and build metadata can be appended: `1.0.0-alpha.1` or `1.0.0+20261116`.

| Version Change | From → To | Type of Change | Consumer Action Required |
|---|---|---|---|
| **Patch** | `1.4.2` → `1.4.3` | Bug fix, security patch | Upgrade immediately; no code changes |
| **Minor** | `1.4.3` → `1.5.0` | New feature, new endpoints | Safe upgrade; explore new APIs |
| **Major** | `1.5.0` → `2.0.0` | Removed endpoint, changed return type | Review migration guide; update broken calls |

## See it

Tag releases following SemVer conventions:

```bash
# Backward-compatible bug fix (increments PATCH)
git tag -a v1.2.4 -m "fix(auth): resolve session expiration calculation"

# Backward-compatible new feature (increments MINOR and resets PATCH to 0)
git tag -a v1.3.0 -m "feat(api): add webhook notification delivery"

# Breaking API change (increments MAJOR and resets MINOR and PATCH to 0)
git tag -a v2.0.0 -m "feat!(api): migrate authentication to OAuth2 bearer tokens"
```

## Go deeper

Versions before `1.0.0` (such as `0.4.1`) represent initial development. Under SemVer rules, anything MAY change at any time in `0.y.z`, and the public API should not be considered stable. Once software is used in production, releasing `1.0.0` formally declares API stability.

> **Tip:** Pair SemVer with Conventional Commits (`feat:`, `fix:`, `feat!:`) to automatically calculate next version numbers and generate changelogs using CI tools like Semantic Release.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Introducing a breaking API change in a Minor or Patch release, breaking downstream production builds.
- Staying on `0.x.x` versions for years while in production, leaving consumers unsure about stability.

## Remember

- SemVer follows the format `MAJOR.MINOR.PATCH`.
- MAJOR indicates breaking changes; MINOR adds backward-compatible features; PATCH fixes bugs.
- Tag version releases using standard `vMAJOR.MINOR.PATCH` Git tags.
