---
slug: git-user-identity
title: "Configuring Commit Identity"
topic: foundations
kind: technique
summary: "Configure your user.name and user.email, and understand why commit identity is permanently baked into snapshots."
tags: [git-config, identity, commits]
related: [installing-git, configuration-scopes, essential-git-settings]
---
> **In one line:** Set your commit identity with git config user.name and user.email before recording your first snapshot.

## The idea

The very first thing you should do after installing Git is set your user name and email address. This step is critical because every single Git commit records the author and committer's name and email address directly into the immutable commit object.

Once a commit is created and hashed, its author identity cannot be changed without changing the commit's SHA hash (which rewrites history). If you do not configure these settings, Git attempts to guess your identity from your operating system username and hostname, resulting in messy or anonymous commit attributions.

Furthermore, remote hosting services like GitHub rely on the commit's author email address to link your commits to your GitHub profile and display your avatar. If your local commit email does not match an email verified on your GitHub account, the commits will show as unlinked.

| Setting Key | Purpose | Example Value |
|---|---|---|
| `user.name` | Human-readable name attached to your commits | `"Alex Chen"` |
| `user.email` | Email address identifying the commit author | `"alex@example.com"` |
| `user.signingkey` | Optional GPG or SSH key for cryptographically signed commits | `"ssh-ed25519 AAAAC3..."` |

## See it

Configure your global identity using the `git config` command:

```bash
# Set your public author name
git config --global user.name "Alex Chen"

# Set your commit author email (must match GitHub verified email)
git config --global user.email "alex@example.com"

# Verify the configured identity
git config user.name
git config user.email

# Inspect identity as stored in the global config file
git config --global --get-regexp "user.*"
```

## Go deeper

Git separates **Author** (the person who originally wrote the code) from **Committer** (the person who committed or applied the patch). When you commit normally, you are both author and committer. During a rebase or cherry-pick, the author remains the original creator, but you become the committer.

Your commit identity is public. Anyone who clones a public repository can inspect the author name and email on every commit in the graph. If you want to prevent personal email scraping, use GitHub's private noreply email service.

> **Note:** If you want to keep your personal email private on GitHub, enable 'Keep my email addresses private' in GitHub settings and configure the generated `noreply` email address in Git.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Using placeholder emails like `user@localhost`, which breaks GitHub contribution graphs and blame attribution.
- Forgetting that changing your `user.email` today does not retroactively change the author in past commits.

## Remember

- Every commit object permanently stores the author name, email, and timestamp.
- Match your `user.email` to an email verified on your GitHub account to link contributions.
- Author is who wrote the patch; committer is who recorded or applied it into the repository.
