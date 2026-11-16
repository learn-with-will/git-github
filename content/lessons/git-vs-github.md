---
slug: git-vs-github
title: "Git Is Not GitHub"
topic: foundations
kind: concept
summary: "Clarify the distinction between Git the local CLI tool and GitHub the cloud hosting and collaboration platform."
tags: [git-vs-github, ecosystem, collaboration]
related: [version-control-models, git-design-philosophy, connecting-github-repos]
---
> **In one line:** Git is an open-source command-line version control engine, while GitHub is a commercial cloud hosting platform built around Git.

## The idea

One of the most persistent confusions among developers is conflating Git and GitHub. They are distinct technologies created by different entities with completely different purposes.

**Git** is an open-source distributed version control tool created in 2005. It runs locally on your computer (Windows, macOS, or Linux) inside your terminal. It requires no user account, no internet access, and no cloud service. You can use Git on an airplane in offline mode to track changes, create branches, and commit code.

**GitHub** is a commercial cloud service launched in 2008 (acquired by Microsoft in 2018) that provides remote hosting for Git repositories. On top of standard Git functionality, GitHub provides web-based collaboration features: Pull Requests, Issues, Actions (CI/CD), Discussions, Wiki pages, and team permissions. Other platforms like GitLab, Bitbucket, and Sourcegraph provide similar hosting services.

| Feature | Git | GitHub |
|---|---|---|
| **What it is** | Local command-line software | Web-based hosting service and platform |
| **Creator** | Linus Torvalds & community (2005) | Chris Wanstrath, PJ Hyett, Tom Preston-Werner (2008) |
| **Account Required** | No; entirely local | Yes; GitHub user account |
| **Core Functions** | `add`, `commit`, `branch`, `merge`, `rebase` | Pull requests, code review UI, issues, webhooks |
| **Offline Work** | Fully functional offline | Requires network connection to load web UI or sync |

## See it

You can initialize and work with a Git repository completely offline without ever touching GitHub:

```bash
# Create a local Git repository with no network connection
mkdir solo-project && cd solo-project
git init -b main

# Create a file, stage it, and commit
echo "hello world" > readme.txt
git add readme.txt
git commit -m "Initial commit"

# Verify the snapshot exists locally
git log --oneline
```

## Go deeper

Features such as Pull Requests, Issue trackers, and fork buttons exist in the GitHub web interface and API, not inside Git itself. When you run `git push origin main`, you are using Git's network protocol to upload local commits to GitHub's remote server.

Understanding this boundary is liberating: if GitHub undergoes maintenance or your network drops, your team's development does not stall. You can continue committing, creating local topic branches, and merging locally.

> **Tip:** You can push your local Git repository to any forge (GitHub, GitLab, self-hosted Gitea), or even to a bare repository on a local USB drive or SSH server.

## Watch out

- Saying 'GitHub is down so we cannot write or commit code'—local commits work without issue.
- Looking for `git pull-request` in the core Git CLI; PRs are a forge-level code review construct.

## Remember

- Git is the local version control program installed on your machine.
- GitHub is a cloud platform for hosting Git repositories and collaborating with teams.
- Pull requests, issues, and automated workflows are GitHub platform features, not Git commands.
