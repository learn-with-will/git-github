---
slug: branch-protection-rules
title: "Branch Protection & Rulesets"
topic: ci-workflows
kind: technique
summary: "Protect critical branches like main with GitHub Rulesets: enforce pull requests, required reviews, passing CI, and block force-pushes."
tags: [branch-protection, rulesets, security]
related: [github-actions-fundamentals, codeowners, the-github-flow]
---
> **In one line:** Branch protection rules enforce server-side gates on main: required PR reviews, passing CI checks, and blocking force-pushes.

## The idea

Without branch protection, any team member with write access can accidentally run `git push origin main`, overwrite production code with `git push --force`, or delete the `main` branch entirely.

**Branch Protection Rules** (and modern **GitHub Rulesets**) enforce server-side policies that prevent accidental damage and mandate quality standards before code can reach production.

When you protect `main`, GitHub blocks direct pushes. All changes must go through a pull request and meet specific merge requirements:
1. **Require a pull request before merging:** Blocks direct pushes to `main`.
2. **Require approvals:** Mandates 1 or more peer approvals from team members before the merge button unlocks.
3. **Require status checks to pass:** Mandates that automated CI tests (like GitHub Actions workflows) pass cleanly before merging.
4. **Require linear history:** Blocks merge commits, enforcing squash or rebase merges.
5. **Block force-pushes and branch deletions:** Enforces immutable production history.

| Protection Setting | What It Enforces | Risk Prevented |
|---|---|---|
| **Require Pull Request** | Changes must be proposed via PR | Accidental direct pushes to production |
| **Require Approvals (1+)** | Peers must review and approve code | Unreviewed bugs or vulnerabilities |
| **Require Status Checks** | CI pipeline must pass before merge | Merging broken builds or failing tests |
| **Do not allow force pushes** | Rejects `git push --force` | Overwriting or erasing team history |

## See it

Configure branch protection via the GitHub CLI or view branch status:

```bash
# View active protection status on main branch
gh api repos/{owner}/{repo}/branches/main/protection

# When a developer tries to push directly to protected main:
git push origin main
# Remote rejects: "remote: error: GH006: Protected branch update failed for refs/heads/main."
# "remote: error: At least 1 approving review is required by reviewers with write access."
```

## Go deeper

GitHub **Repository Rulesets** are the modern evolution of classic branch protection rules. Rulesets allow organization administrators to define layered rules across hundreds of repositories simultaneously, apply bypass permissions for automated deploy bots, and test rules in 'Evaluate' mode before hard enforcement.

> **Tip:** Enable 'Dismiss stale pull request approvals when new commits are pushed' to ensure that if an author pushes new code after receiving approval, the PR requires re-approval.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Setting up required status checks for a workflow that only runs on `pull_request`, which can cause deadlock if check names change.
- Forgetting to check 'Include administrators' in classic protection rules, allowing admins to bypass safety checks accidentally.

## Remember

- Branch protection rules physically prevent direct pushes and force-pushes to production branches.
- Require peer approvals and passing CI status checks before pull requests can be merged.
- Use modern GitHub Rulesets for centralized, multi-repository policy enforcement.
