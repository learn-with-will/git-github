---
slug: linking-prs-to-issues
title: "Automating Issues with Closing Keywords"
topic: project-management
kind: technique
summary: "Automatically close tracked issues when pull requests merge using keywords like Fixes #123 in commit messages or PR descriptions."
tags: [issues, automation, pull-requests]
related: [github-issues-and-labels, opening-and-reviewing-prs, the-github-flow]
---
> **In one line:** Include closing keywords like Fixes #123 in your PR description to automatically close tracked issues upon merge.

## The idea

Keeping your issue tracker synchronized with actual code releases can be tedious. Developers frequently merge pull requests that resolve bugs, but forget to go back to the issue tracker to close the associated tickets.

GitHub provides built-in automation called **Closing Keywords**.

If you include specific keywords followed by an issue reference in a pull request description (or in a commit message merged into the default branch), GitHub links the two items. When the pull request is merged into the default branch (`main`), **GitHub automatically closes the linked issue and posts a link to the merged PR**.

Supported closing keywords:
- `close`, `closes`, `closed`
- `fix`, `fixes`, `fixed`
- `resolve`, `resolves`, `resolved`

Syntax examples:
- `Fixes #42` (links issue #42 in the same repository)
- `Closes owner/repo#89` (links an issue across different repositories)

| Scenario | Example PR Description Syntax | Effect on Merge to `main` |
|---|---|---|
| Single issue | `Fixes #104` | Closes #104 automatically |
| Multiple issues | `Closes #12, resolves #15` | Closes both #12 and #15 |
| Cross-repository issue | `Fixes learn-with-will/core#45` | Closes #45 in core repository |
| Mention without closing | `Related to #42` or `See #42` | Creates link reference; does NOT close issue |

## See it

Link and auto-close an issue when creating a pull request:

```bash
# Create a pull request that links and auto-closes issue #84
gh pr create --title "fix(auth): prevent session timeout race condition"              --body "Fixes #84. Adds mutex locking to session refresh token rotation."

# Inspect PR on GitHub: issue #84 will show under 'Development' linked items
```

## Go deeper

The auto-close trigger only fires when the pull request is merged into the repository's **default branch** (usually `main`). If you merge a pull request into a development or feature branch, the issue will link, but it will not close until those commits eventually reach `main`.

> **Tip:** You must include a keyword before *each* issue number. Writing `Fixes #12 and #15` only closes #12; write `Fixes #12, fixes #15` instead.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Writing `Addresses #42` or `Ref #42` and expecting the issue to auto-close; only recognized keywords trigger closure.
- Writing `Fixes #12, #15`; GitHub only closes #12 because the keyword was not repeated for #15.

## Remember

- Use keywords like `Fixes #123` or `Closes #123` in PR descriptions to auto-close issues.
- The auto-closing action triggers only when the PR merges into the default branch (`main`).
- Repeat the keyword for multiple issues: `Fixes #12, fixes #15`.
