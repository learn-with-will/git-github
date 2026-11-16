---
slug: removing-sensitive-data
title: "Removing Sensitive Data & `git filter-repo`"
topic: rebasing-history
kind: technique
summary: "Purge leaked credentials, private keys, and huge binaries from complete Git history using the official git filter-repo tool."
tags: [security, filter-repo, credentials]
related: [rewriting-history-implications, ignoring-files-gitignore, force-with-lease]
---
> **In one line:** When secrets are committed to Git, rotate the credential immediately, then purge it from all historical commits with git filter-repo.

## The idea

Accidentally committing an API key, database password, or private SSH key is a critical security incident. A common rookie mistake is making a follow-up commit that deletes the file or adds it to `.gitignore`.

**Simply deleting a secret in a new commit does not make it safe!** The credential remains permanently accessible in the commit history, and automated bots scan GitHub commits in real time within seconds of pushing.

The mandatory incident response procedure has two non-negotiable steps:
1. **Rotate the secret immediately:** Consider the credential compromised. Revoke the token, generate a new one, and update your production services. Rotating the secret is the only true fix.
2. **Purge the file from history:** Use the modern, official **`git filter-repo`** tool to rewrite all historical commits, stripping the offending file from every branch and tag.

> **Note:** The older `git filter-branch` command is officially deprecated by the Git project due to excruciatingly slow performance and safety bugs. Always use `git-filter-repo`.

## See it

Purge a leaked secret file from all historical commits across all branches:

```bash
# 1. Install git-filter-repo (via pip or package manager)
pip install git-filter-repo

# 2. Make a fresh backup clone of your repository
git clone --mirror https://github.com/my-org/my-project.git backup-repo

# 3. Purge the sensitive file from every commit in the repository
git filter-repo --invert-paths --path .env

# 4. Force-push rewritten branches and tags to GitHub
git push origin --force --all
git push origin --force --tags
```

## Go deeper

`git filter-repo` operates on the raw commit graph in memory, rewriting trees and commit objects in seconds where `filter-branch` took hours. Because every commit after the leaked file was introduced receives a new SHA hash, all collaborators must discard their old clones and clone fresh copies of the rewritten repository.

> **Tip:** Install pre-commit secret scanners like `gitleaks` or `trufflehog` in your local development environment to block credential commits before they ever happen.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Believing that deleting a file in a new commit removes it from repository history; it does not.
- Purging history without rotating the compromised secret; public bots may have already scraped it.

## Remember

- Rotate any committed credential immediately; assume it is publicly compromised.
- A follow-up commit deleting the secret leaves it visible in past history.
- Use `git filter-repo` to rewrite all historical commits and permanently eradicate the file.
