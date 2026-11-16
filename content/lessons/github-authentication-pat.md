---
slug: github-authentication-pat
title: "Authenticating with Personal Access Tokens"
topic: remotes-collaboration
kind: tool
summary: "Authenticate Git operations over HTTPS using fine-grained GitHub Personal Access Tokens and Git Credential Manager."
tags: [authentication, https, pat, security]
related: [connecting-github-repos, github-authentication-ssh, installing-git]
---
> **In one line:** GitHub retired account password authentication for Git; use Personal Access Tokens or Git Credential Manager over HTTPS.

## The idea

In August 2021, GitHub permanently deprecated account passwords for authenticating Git operations over HTTPS. Entering your standard account login password in response to a terminal password prompt will be rejected with an authentication error.

To authenticate HTTPS Git operations, GitHub uses **Personal Access Tokens (PATs)** or the **Git Credential Manager (GCM)**.

A Personal Access Token is an encrypted secret string that acts like an API key. GitHub offers two kinds:
1. **Fine-grained Personal Access Tokens:** The modern standard. Scoped to specific repositories, permissions (e.g. read-only vs read-write on code), and with mandatory expiration dates (e.g. 90 days).
2. **Tokens (classic):** Older broad-scoped tokens with full access to all repositories.

When using Git for Windows or macOS with Homebrew, **Git Credential Manager** is included automatically. It opens a browser window for a single sign-in flow and securely stores the OAuth token in your operating system's native keychain (Windows Credential Manager or macOS Keychain).

| Authentication Method | How It Works | Key Benefit |
|---|---|---|
| **Git Credential Manager** | Web browser login dialog | Zero manual token copy-pasting; auto-refreshed |
| **Fine-Grained PAT** | Generated in GitHub Settings → Developer settings | Minimal necessary permissions; auto-expires |
| **Account Password** | Typing GitHub account password in CLI | **Disabled and rejected by GitHub** |

## See it

Generate and configure a Personal Access Token:

```bash
# 1. On GitHub: Settings -> Developer Settings -> Personal access tokens -> Fine-grained tokens
# 2. Select Repository access and grant "Contents: Read and write"
# 3. Generate and copy the token (starts with github_pat_...)

# When cloning or pushing via HTTPS, use your token when prompted for password:
git clone https://github.com/my-org/private-repo.git
# Username: your-github-username
# Password: <paste your github_pat_... token here>

# Check which credential helper is managing your logins
git config --get credential.helper
```

## Go deeper

Fine-grained PATs represent a massive security upgrade over account passwords. If your laptop is compromised or a developer leaves your organization, you can revoke that specific token immediately in GitHub Settings without needing to change your master account password or affecting other development machines.

> **Tip:** Never hardcode your Personal Access Token in remote URLs (e.g. `https://token@github.com/...`); this writes your secret in plaintext to `.git/config` and command history.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Entering your GitHub account web password in the terminal; it will fail with HTTP 403 / authentication error.
- Hardcoding a token inside git clone URLs, accidentally exposing your secret in bash history or dotfiles.

## Remember

- GitHub requires Personal Access Tokens or SSH keys for all command-line operations.
- Fine-grained tokens restrict access to specific repositories and specific permission scopes.
- Git Credential Manager securely stores tokens inside your operating system keychain.
