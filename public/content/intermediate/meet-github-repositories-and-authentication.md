---
id: lesson-09
slug: meet-github-repositories-and-authentication
title: "Meet GitHub: Repositories & Authentication"
level: intermediate
order: 9
duration: 18
tags:
  - github
  - authentication
  - ssh
  - personal-access-token
summary: "Create and connect GitHub repositories, and authenticate the right way — HTTPS with a Personal Access Token or a credential manager, or SSH with a key pair (no account passwords)."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe what a GitHub repository is and how to create one.
- Connect a local repository to GitHub with a remote.
- Choose between **HTTPS** and **SSH** for authenticating Git operations.
- Explain why you can't use your account **password** for Git over HTTPS, and what to use instead.
- Set up an **SSH key** or a **Personal Access Token (PAT)**.

# Why It Matters

Phase 1 was all local. Now you'll put your work on GitHub so it's backed up and shareable.
The one part that trips people up is **authentication** — proving to GitHub that you're
allowed to push. GitHub deliberately doesn't accept your account password for Git
operations anymore, and knowing the two supported methods (SSH keys and tokens) saves you
from a frustrating wall of "authentication failed" errors.

# Concept Explanation

### Creating a repository

On github.com, choose **New repository**, give it a name, pick **public** or **private**,
and optionally have GitHub add a `README`, a `.gitignore`, and a license. You now have an
empty (or nearly empty) repo with a URL.

### Connecting a local repo

If you already have a local project, link it to the new GitHub repo and push:

```bash
git remote add origin https://github.com/you/my-project.git
git branch -M main               # ensure the branch is named main
git push -u origin main
```

If instead you created the repo on GitHub first, just `git clone` its URL and start
working — `origin` and tracking are set up for you.

### Authentication: two supported methods

GitHub removed **account-password authentication for Git operations in August 2021**. If
you type your GitHub password when Git asks, it will fail. Use one of these instead:

**1. HTTPS with a Personal Access Token (PAT).** A PAT is a long, revocable string that
acts as your password for Git over HTTPS. Create one in GitHub under
*Settings → Developer settings → Personal access tokens*. Prefer **fine-grained** tokens,
grant only the scopes you need, and set an expiry. A **Git credential manager** (like Git
Credential Manager, bundled with Git for Windows) can store it so you enter it once.

```bash
git clone https://github.com/you/my-project.git
# When prompted for a password, paste the PAT (not your account password).
```

**2. SSH with a key pair.** Generate a key once, add the **public** half to GitHub, and
Git authenticates automatically over SSH:

```bash
ssh-keygen -t ed25519 -C "you@example.com"   # creates a key pair
# Add the PUBLIC key (~/.ssh/id_ed25519.pub) to GitHub: Settings → SSH and GPG keys
ssh -T git@github.com                         # test the connection
git clone git@github.com:you/my-project.git   # SSH-style URL
```

Keep the **private** key (`id_ed25519`, no `.pub`) secret — it never leaves your machine.

# Key Terminology

- **GitHub repository:** a Git repo hosted on GitHub, with a URL and collaboration
  features.
- **HTTPS URL:** `https://github.com/owner/repo.git` — authenticated with a token.
- **SSH URL:** `git@github.com:owner/repo.git` — authenticated with a key pair.
- **Personal Access Token (PAT):** a revocable, scoped string used in place of a password
  over HTTPS.
- **SSH key pair:** a private key (kept secret) and a public key (added to GitHub).
- **Credential manager:** a helper that stores your token so you don't re-enter it.

# Options and Trade-offs

| Method | You set up | Feels like | Good when |
| ------ | ---------- | ---------- | --------- |
| HTTPS + PAT | Create a token; a credential manager stores it | Password prompt (paste the token) | Simple, works through most firewalls |
| SSH keys | Generate a key, add the public key to GitHub | No prompt after setup | You push often and want it seamless |

# Worked Example

You built a project locally and want it on GitHub using SSH.

```bash
# One-time SSH setup (skip if you already have a key on GitHub)
ssh-keygen -t ed25519 -C "you@example.com"
# → paste ~/.ssh/id_ed25519.pub into GitHub: Settings → SSH and GPG keys
ssh -T git@github.com
```

```text
Hi you! You've successfully authenticated, but GitHub does not provide shell access.
```

Now create an empty repo on GitHub, then connect and push:

```bash
git remote add origin git@github.com:you/my-project.git
git push -u origin main
```

Your project is now on GitHub, and future pushes need no password because the SSH key
handles authentication.

# Real World Analogy

Your GitHub repository is your project's **home address** on the internet.
Authentication is how the building verifies it's really you at the door. A **Personal
Access Token** is like a **scoped keycard** — it opens specific doors, can be revoked, and
expires. An **SSH key pair** is like a **personal lock and key** you install once: you keep
the key (private), GitHub keeps the matching lock (public), and from then on the door opens
without a card each time.

# Examples

## Example 1 — Basic: publish an existing project

A developer finishes a local project, creates an empty GitHub repo, runs
`git remote add origin …` and `git push -u origin main`, and their code is live and backed
up.

**Why this works:** A GitHub repo is just a remote; connecting and pushing is the same
mechanics you learned locally, plus authentication.

## Example 2 — Real-world: seamless SSH

An engineer sets up an SSH key once. Every clone and push afterward is silent — no prompts
— across all their repositories on that machine.

**Why this works:** SSH keys authenticate automatically, so frequent pushers get a
friction-free workflow after a one-time setup.

## Example 3 — Trade-off / pitfall: typing your password

A newcomer clones over HTTPS and enters their GitHub **account password** when prompted.
Authentication fails with a confusing error. They generate a PAT (or set up SSH) and it
works.

**Why this bites:** GitHub stopped accepting account passwords for Git in 2021. The prompt
still says "Password," but it expects a **token**, not your login password.

# Common Mistakes

- **Entering your account password** for Git over HTTPS. Use a PAT or SSH.
- **Committing a token into the repository.** Treat PATs like passwords; never commit them.
  If one leaks, revoke it immediately.
- **Adding the private SSH key to GitHub** instead of the public one. Only the `.pub` file
  goes to GitHub.
- **Mismatched URLs.** An HTTPS remote wants a token; an SSH remote wants your key. Check
  with `git remote -v`.

# Best Practices

- Prefer **SSH** or an **HTTPS credential manager** so you authenticate once.
- Give PATs **minimal scopes** and an **expiry**; use fine-grained tokens when you can.
- **Never** commit tokens or private keys; add them to `.gitignore` if they live in the
  project folder (better: keep them out of it).
- Rotate/revoke credentials that may have leaked.

# Summary

- A **GitHub repository** is a hosted Git repo; connect a local project with
  `git remote add origin …` then `git push -u origin main`, or `git clone` an existing one.
- GitHub **doesn't accept account passwords** for Git operations (since 2021).
- Authenticate with **HTTPS + a Personal Access Token** (optionally stored by a credential
  manager) or with an **SSH key pair**.
- With SSH, add the **public** key to GitHub and keep the **private** key secret.

# Flash Cards

Q: What is GitHub, compared with Git?
A: GitHub is a service that hosts Git repositories and adds collaboration features; Git is the version-control tool itself.

Q: Over HTTPS, what do you use to authenticate Git operations instead of your account password?
A: A Personal Access Token (often stored by a credential manager) — GitHub removed password auth for Git in 2021.

Q: With SSH authentication, which key do you add to GitHub?
A: The public key (the .pub file). The private key stays secret on your machine.

Q: Which command links a local repository to a GitHub remote?
A: git remote add origin <url> (then git push -u origin main).

Q: Why does entering your GitHub password when Git prompts you fail?
A: Account-password authentication for Git operations was removed in 2021; you must use a PAT or an SSH key.

Q: What's a good practice when creating a Personal Access Token?
A: Grant only the scopes you need, set an expiry, prefer fine-grained tokens, and never commit it.

# Exercises

### Easy

Create a new empty repository on GitHub. Connect a local project to it with
`git remote add origin …` and push. Verify with `git remote -v`.

### Medium

Set up an SSH key (`ssh-keygen`), add the public key to GitHub, and test with
`ssh -T git@github.com`. Then change an existing repo's remote from an HTTPS to an SSH URL
and push.

### Challenging

Explain, step by step, what happens during an SSH-authenticated push: which key proves
your identity, what GitHub checks, and why the private key never needs to leave your
machine. Then explain how a PAT achieves the same trust over HTTPS.

# Further Reading

- GitHub Docs — [Create a repo](https://docs.github.com/en/get-started/quickstart/create-a-repo) and [About authentication to GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)
- GitHub Docs — [Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) and [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
