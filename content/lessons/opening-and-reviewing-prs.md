---
slug: opening-and-reviewing-prs
title: "Opening and Reviewing Pull Requests"
topic: pull-requests
kind: technique
summary: "Create well-structured pull requests, write effective descriptions, use PR templates, and perform constructive code reviews."
tags: [pull-requests, code-review, collaboration]
related: [the-github-flow, code-review-guidelines, pr-merge-strategies]
---
> **In one line:** A pull request is a formal proposal on GitHub to merge changes from one branch into another, reviewed by your team.

## The idea

A **Pull Request (PR)** is a GitHub platform feature that allows developers to propose changes, review code line by line, discuss implementation details, and run automated validation before merging code into a protected branch.

A great pull request is respectful of the reviewer's time. It provides context, screenshots for UI changes, links to tracked issues, and a concise explanation of what was changed and why.

When reviewing a PR, reviewers can:
- **Comment:** Leave general feedback without approving or blocking.
- **Approve:** Certify that the code meets team standards and is ready to merge.
- **Request Changes:** Block merging until specific bugs, design issues, or missing tests are addressed.

| PR Section | Recommended Content |
|---|---|
| **Title** | Follows Conventional Commits (`feat(auth): add refresh token rotation`) |
| **Summary** | 2–3 sentences explaining what problem this PR solves |
| **Impact / Testing** | Steps for reviewers to verify the changes locally |
| **Issue Link** | `Fixes #142` to auto-close the associated issue upon merge |

## See it

Open a pull request from your terminal using the official GitHub CLI (`gh`):

```bash
# Push your branch
git push -u origin feat/export-csv

# Open a pull request directly from terminal with title and body
gh pr create --title "feat(reports): add CSV export capability"              --body "Closes #84. Adds streaming CSV export for monthly invoices."

# Check PR review and status checks status
gh pr status
```

## Go deeper

Repositories can define a `.github/pull_request_template.md` file. When present, GitHub automatically pre-populates the pull request description box with your team's checklist (e.g. unit tests added, docs updated, security reviewed) whenever anyone opens a new PR.

> **Tip:** You can use GitHub's 'Suggested Changes' feature in review comments, allowing the author to commit the suggested fix directly from the PR web UI with a single click.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Submitting massive PRs with 1,500+ lines changed across 40 files; giant PRs get superficial reviews.
- Opening a PR and immediately merging it yourself without waiting for required team approvals or CI tests.

## Remember

- Pull requests are a GitHub collaboration tool for peer review and automated verification.
- Keep PR descriptions informative and link related issues with closing keywords.
- Reviewers can Approve, Comment, or Request Changes with line-by-line comments.
