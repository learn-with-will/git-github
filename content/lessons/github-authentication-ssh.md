---
slug: github-authentication-ssh
title: "Authenticating with SSH Keys"
topic: remotes-collaboration
kind: tool
summary: "Generate an ed25519 SSH key pair, add your public key to GitHub, and enjoy seamless, passwordless Git operations."
tags: [ssh, authentication, security]
related: [github-authentication-pat, connecting-github-repos, git-clone-and-remotes]
---
> **In one line:** SSH key pairs provide secure, passwordless authentication for Git operations without managing expiring HTTPS tokens.

## The idea

Secure Shell (SSH) is the gold standard authentication protocol for software engineers. Instead of passing tokens or passwords across HTTP, SSH uses asymmetric public-key cryptography to authenticate your machine.

An SSH key pair consists of two mathematically linked files:
1. **Private key (`id_ed25519`):** Stored securely on your computer in `~/.ssh/`. **Never share or upload your private key.** Protect it with a local passphrase.
2. **Public key (`id_ed25519.pub`):** The public counterpart. You copy this text and paste it into GitHub Settings under **SSH and GPG keys**.

When you run `git push` over SSH (using a URL like `git@github.com:user/repo.git`), GitHub sends an encrypted challenge that only your private key can decrypt and sign. Authentication succeeds instantly without typing usernames or passwords.

| Key Algorithm | Key File Names | Recommendation |
|---|---|---|
| **Ed25519** | `id_ed25519` / `id_ed25519.pub` | **Recommended:** Modern, short, exceptionally secure |
| **RSA (4096-bit)** | `id_rsa` / `id_rsa.pub` | Legacy fallback; slower and longer keys |

## See it

Generate an Ed25519 key pair and test connectivity to GitHub:

```bash
# 1. Generate a modern Ed25519 SSH key pair
ssh-keygen -t ed25519 -C "alex@example.com"

# 2. Start the ssh-agent and add your private key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. Print the public key to copy into GitHub Settings
cat ~/.ssh/id_ed25519.pub

# 4. Test SSH connection to GitHub
ssh -T git@github.com
```

## Go deeper

When testing with `ssh -T git@github.com`, GitHub will reply: `Hi username! You've successfully authenticated, but GitHub does not provide shell access.` This confirms your key pair is configured properly and ready for Git operations.

> **Tip:** You can configure `~/.ssh/config` to automatically load keys into `ssh-agent` on macOS and Linux so you only unlock your passphrase once per boot.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Copying the private key (`id_ed25519`) instead of the public key (`id_ed25519.pub`) into GitHub settings.
- Attempting to use SSH URLs when your remote is still configured with an HTTPS URL; update with `git remote set-url`.

## Remember

- Use `ssh-keygen -t ed25519` to generate modern, high-security SSH key pairs.
- Upload the public key (`.pub`) to GitHub; keep your private key secure on your machine.
- Verify SSH authentication anytime using `ssh -T git@github.com`.
