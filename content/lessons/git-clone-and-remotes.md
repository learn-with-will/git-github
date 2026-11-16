---
slug: git-clone-and-remotes
title: "Cloning and Managing Remotes"
topic: remotes-collaboration
kind: technique
summary: "Clone remote repositories, configure new remotes with git remote add, and manage upstream URLs."
tags: [git-clone, git-remote, cli]
related: [remote-tracking-branches, fetch-vs-pull, connecting-github-repos]
---
> **In one line:** git clone downloads a full repository copy, and git remote add connects your local repo to additional remotes.

## The idea

The `git clone` command is the standard entry point for joining an existing project. When you clone a repository, Git executes several steps in sequence automatically:
1. Creates a new directory on your machine.
2. Initializes a new local `.git/` database.
3. Adds a remote named `origin` pointing to the cloned URL.
4. Downloads all objects, trees, commits, and tags from the remote.
5. Checks out a local working branch matching the remote's default branch (usually `main`).

In addition to the initial clone, you can add, rename, and remove remotes anytime using `git remote`. In open-source workflows, developers routinely configure at least two remotes: `origin` (their own personal fork) and `upstream` (the official parent repository).

| Command | Action |
|---|---|
| `git clone <url> [folder]` | Clones full repository into specified local folder |
| `git remote add <name> <url>` | Connects a new named remote repository |
| `git remote rename <old> <new>` | Renames an existing remote reference |
| `git remote set-url <name> <url>` | Updates the URL (e.g. switching from HTTPS to SSH) |
| `git remote remove <name>` | Removes the remote reference and its tracking branches |

## See it

Clone a repository and add an upstream remote:

```bash
# Clone a repository from GitHub into a custom folder
git clone https://github.com/learn-with-will/git-github.git my-repo

# Enter the project directory
cd my-repo

# Add an upstream remote pointing to the canonical parent repository
git remote add upstream https://github.com/organization/main-repo.git

# Verify all configured remotes
git remote -v
```

## Go deeper

You can clone specific sub-elements if dealing with massive repositories. A **shallow clone** (`git clone --depth=1 <url>`) downloads only the latest single snapshot, saving bandwidth and disk space when you only need to run tests or build an artifact without historical logs.

> **Tip:** If you need to switch an existing clone from HTTPS to SSH authentication, run `git remote set-url origin git@github.com:user/repo.git`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Cloning a repository inside an existing Git repository folder; always clone into an unversioned parent directory.
- Forgetting that cloning copies all historical commits; on multi-gigabyte repositories, this may take time.

## Remember

- `git clone` initializes a new local repo, creates `origin`, downloads all history, and checks out `main`.
- Use `git remote add <name> <url>` to connect additional remotes such as `upstream`.
- Inspect and update remote endpoint URLs with `git remote -v` and `git remote set-url`.
