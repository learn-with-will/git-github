---
slug: installing-git
title: "Installing Git Across Operating Systems"
topic: foundations
kind: tool
summary: "Install Git on macOS, Windows, and Linux distributions, and verify the installed binary version."
tags: [installation, cli, setup]
related: [git-user-identity, configuration-scopes, essential-git-settings]
---
> **In one line:** Install Git through your platform package manager or official installer and verify it in your terminal.

## The idea

Git runs natively across all major operating systems. On modern developer machines, Git is either pre-installed or easily available through official platform package managers.

On **Windows**, installing *Git for Windows* provides both the official command-line binaries and *Git Bash*, a bash emulation environment with standard Unix utilities (`ssh`, `curl`, `find`). Package managers like `winget` make installation a single command.

On **macOS**, running `git --version` in Terminal prompts installation of Apple's Xcode Command Line Tools if Git is missing. Alternatively, the Homebrew package manager provides the latest upstream release directly from the Git core team.

On **Linux**, Git is distributed in official package repositories (`apt`, `dnf`, `pacman`). Linux distributions generally ship stable, hardened builds.

| Operating System | Recommended Installation Method | Included Extras |
|---|---|---|
| **Windows** | `winget install --id Git.Git -e --source winget` | Git Bash, Git GUI, Git Credential Manager |
| **macOS** | `brew install git` | Upstream Git updates independent of Apple releases |
| **Ubuntu / Debian** | `sudo apt update && sudo apt install -y git` | Core binary and command manpages |
| **Fedora / RHEL** | `sudo dnf install -y git` | Core binary and bash completion scripts |

## See it

Run the package manager command corresponding to your operating system and verify the version:

```bash
# Windows (via winget)
winget install --id Git.Git -e --source winget

# macOS (via Homebrew)
brew install git

# Debian / Ubuntu Linux
sudo apt update && sudo apt install -y git

# Verify installation across any operating system
git --version
```

## Go deeper

Windows users should be mindful of line-ending configurations. Windows uses Carriage Return + Line Feed (`CRLF`), while Linux and macOS use Line Feed (`LF`). The installer prompts for `core.autocrlf`, which converts CRLF to LF on commit and vice versa on checkout.

Having a modern version of Git is important because Git continuously evolves. Major ergonomics improvements—such as splitting `git checkout` into `git switch` and `git restore`—arrived in Git 2.23.

> **Tip:** Always verify your installation by printing the version string. Ensure your version is modern (Git 2.23+ introduces `switch` and `restore`).

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Using an outdated version of Git (pre-2.23) that lacks modern commands like `git switch` and `git restore`.
- Installing multiple conflicting Git binaries on Windows without managing system PATH environment variables.

## Remember

- Git is available through official package managers: winget (Windows), brew (macOS), and apt (Linux).
- Verify installation by executing `git --version` in your terminal shell.
- Modern versions of Git provide clearer branch and checkout ergonomics.
