---
slug: conventional-commits
title: "Standardizing History with Conventional Commits"
topic: ci-workflows
kind: pattern
summary: "Adopt the Conventional Commits specification to standardize commit messages and automate SemVer versioning and changelogs."
tags: [conventional-commits, standards, automation]
related: [semantic-versioning-rules, branching-strategies-compared, feature-lifecycle-capstone]
---
> **In one line:** Conventional Commits provides a structured format (type(scope): subject) that enables automated changelog and version generation.

## The idea

A clean Git log should read like a changelog. However, across a team of developers, commit messages often vary wildly in formatting, tense, and detail.

The **Conventional Commits** specification (conventionalcommits.org) provides a lightweight, universally recognized convention on top of commit messages.

Structure:
```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common Types:
- `feat:` Introduces a new feature (correlates with SemVer **MINOR**).
- `fix:` Patches a bug (correlates with SemVer **PATCH**).
- `docs:` Documentation changes only.
- `chore:` Maintenance tasks, dependency updates, build configs.
- `refactor:` Code change that neither fixes a bug nor adds a feature.
- `test:` Adding or correcting tests.
- `perf:` Performance optimizations.

**Breaking changes** are indicated by appending an exclamation mark `!` after the type/scope (e.g. `feat!:`) or adding `BREAKING CHANGE:` in the commit footer (correlates with SemVer **MAJOR**).

| Commit Message | SemVer Impact | Automated Action |
|---|---|---|
| `fix(auth): handle expired refresh token` | **PATCH** (`1.0.1`) | Added to 'Bug Fixes' changelog section |
| `feat(api): add webhook subscription endpoint` | **MINOR** (`1.1.0`) | Added to 'Features' changelog section |
| `feat!(db): drop legacy v1 users table` | **MAJOR** (`2.0.0`) | Added to 'Breaking Changes' warning section |

## See it

Write structured Conventional Commits:

```bash
# Standard bug fix commit
git commit -m "fix(billing): correct vat calculation for eu invoices"

# New feature commit with scope
git commit -m "feat(auth): add passkey authentication support"

# Breaking change commit with exclamation mark and footer explanation
git commit -m "feat!(api): replace session cookies with bearer tokens"            -m "BREAKING CHANGE: Mobile clients prior to v3.0 must upgrade to authenticate."
```

## Go deeper

When your repository follows Conventional Commits, tools like **Semantic Release** or **Release Please** can run on GitHub Actions to completely automate software releases. The tool analyzes all commit messages since the last tag, calculates the next SemVer version, creates the Git tag, generates the release notes, and publishes packages to npm/PyPI without human intervention.

> **Tip:** Use commitlint in a `commit-msg` git hook to automatically validate that commit messages follow the Conventional Commits format before accepting them.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Writing vague descriptions like `fix(app): fix it`; the description should clearly state what was resolved.
- Forgetting the exclamation mark `!` or `BREAKING CHANGE:` footer when introducing breaking API changes.

## Remember

- Conventional Commits uses structured prefixes: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- Breaking changes are flagged with `!` (e.g. `feat!:`) or a `BREAKING CHANGE:` footer.
- Enables fully automated SemVer version bumping and changelog generation in CI pipelines.
