---
slug: connecting-github-repos
title: "Creating and Connecting GitHub Repositories"
topic: remotes-collaboration
kind: technique
summary: "Create a new remote repository on GitHub and link an existing local Git project using git remote add origin."
tags: [github, setup, remotes]
related: [git-clone-and-remotes, github-authentication-pat, github-authentication-ssh]
---
> **In one line:** Connect an existing local project to GitHub by creating an empty repository on GitHub and adding it as origin.

## The idea

A common scenario for developers is having a project already initialized and committed locally that now needs to be published to GitHub for backup, sharing, or CI/CD.

To connect an existing local repository to GitHub:
1. Navigate to GitHub and click **New Repository**.
2. Give the repository a name matching your local project.
3. **Leave 'Initialize with README, .gitignore, or license' unchecked.** (Initializing those on GitHub creates an initial commit on the remote, causing an immediate divergence conflict with your local project).
4. Copy the remote URL (HTTPS or SSH).
5. In your local terminal, add the remote as `origin` and push.

| Connection Step | Command | Purpose |
|---|---|---|
| **1. Ensure default branch is main** | `git branch -M main` | Standardizes branch name to match GitHub |
| **2. Add remote origin** | `git remote add origin <url>` | Configures GitHub endpoint |
| **3. Push and track** | `git push -u origin main` | Uploads all commits and sets upstream |

## See it

Connect an existing local repository to a newly created empty GitHub repository:

```bash
# Navigate to your existing local project
cd my-local-app

# Ensure default branch is named main
git branch -M main

# Add the GitHub repository as origin
git remote add origin https://github.com/my-username/my-local-app.git

# Verify remote configuration
git remote -v

# Push all local commits to GitHub and configure tracking
git push -u origin main
```

## Go deeper

The `git branch -M main` command renames your current local branch to `main` even if it was originally initialized as `master`. The `-M` flag ensures the rename proceeds cleanly even if a branch named `main` already existed locally.

> **Tip:** If you accidentally initialized the GitHub repository with a README, run `git pull origin main --rebase` to integrate the remote README commit before pushing your local commits.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Checking 'Add a README' on GitHub when creating a repo for an existing local project, causing push rejections.
- Adding a remote URL with typos; use `git remote set-url origin <new-url>` to correct it.

## Remember

- Create an empty repository on GitHub without README or license when publishing an existing local project.
- Use `git remote add origin <url>` to link your local project to GitHub.
- Push with `git push -u origin main` to upload commits and configure tracking.
