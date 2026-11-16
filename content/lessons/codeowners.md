---
slug: codeowners
title: "Routing Code Reviews with CODEOWNERS"
topic: ci-workflows
kind: technique
summary: "Automatically assign expert reviewers to pull requests based on modified file paths using a .github/CODEOWNERS file."
tags: [codeowners, code-review, governance]
related: [branch-protection-rules, code-review-guidelines, the-github-flow]
---
> **In one line:** A CODEOWNERS file automatically requests reviews from domain experts whenever their files or folders are modified in a PR.

## The idea

In large codebases with dozens of engineers, knowing who should review a pull request is challenging: Who owns the payment processing module? Who understands the database migration scripts? Who manages the infrastructure Terraform files?

A **`CODEOWNERS`** file solves this by defining pattern-based ownership rules.

Placed in `.github/CODEOWNERS` (or in repository root), this file maps path patterns to GitHub usernames or team handles. Whenever a pull request modifies files matching a pattern, **GitHub automatically requests reviews from the specified owners**.

When paired with branch protection ('Require review from Code Owners'), a PR cannot be merged until someone from that specific team approves the changes!

| Pattern in CODEOWNERS | Owner Assigned | What It Matches |
|---|---|---|
| `*` | `@core-team` | Default catch-all owner for all files |
| `/src/billing/` | `@billing-devs` | Any file inside `src/billing/` |
| `*.tf` | `@devops-team` | Any Terraform infrastructure file |
| `/docs/` | `@tech-writers` | Any documentation file |

## See it

A standard `.github/CODEOWNERS` configuration file:

```ini
# Global fallback owner for anything not matched below
* @org/frontend-leads

# Backend security and authentication files
/src/auth/ @org/security-team
/src/api/auth.ts @org/security-team

# Database schema migrations require DBA review
/prisma/migrations/ @org/database-admins

# Infrastructure and CI/CD pipelines
/.github/workflows/ @org/devops-team
Dockerfile @org/devops-team
```

## Go deeper

Rules in `CODEOWNERS` are evaluated from top to bottom; the **last matching pattern takes precedence**. For example, if `*` is at line 1 and `/src/auth/` is at line 5, a change to `/src/auth/login.ts` will assign `@org/security-team`, not the global frontend leads.

> **Tip:** Use GitHub team handles (e.g. `@org/security-team`) rather than individual usernames in `CODEOWNERS` so ownership survives team turnover.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Specifying usernames that lack write permissions to the repository; GitHub will ignore their code ownership.
- Putting spaces around `@mentions` that break pattern matching syntax.

## Remember

- `.github/CODEOWNERS` automatically routes pull request review requests based on modified file paths.
- The last matching pattern in the file takes precedence.
- Pair with branch protection rules to enforce mandatory approval from designated code owners.
