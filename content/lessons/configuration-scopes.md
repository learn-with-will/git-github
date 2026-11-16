---
slug: configuration-scopes
title: "Configuration Scopes: System, Global & Local"
topic: foundations
kind: concept
summary: "Explore Git's three configuration tiers—system, global, and local—and how precedence rules resolve overrides."
tags: [git-config, scopes, settings]
related: [git-user-identity, essential-git-settings, installing-git]
---
> **In one line:** Git resolves settings across system, global, and local scopes, with more specific scopes overriding broader ones.

## The idea

Git looks for configuration parameters across three distinct file locations. These scopes allow you to establish baseline machine defaults while customizing project-specific options when needed.

1. **System (`--system`):** Applied to every user on the entire machine and all their repositories. Stored in a system file (e.g. `/etc/gitconfig` or `C:\Program Files\Git\etc\gitconfig`). Rarely modified directly.
2. **Global (`--global`):** Specific to your user account on the operating system. Applies to all repositories you open. Stored in your user home directory (`~/.gitconfig` or `~/.config/git/config`). This is where your default identity, aliases, and editor live.
3. **Local (`--local`):** Specific to a single Git repository. Stored inside that repository's `.git/config` file. Local settings take precedence over global and system settings.

| Scope Flag | Storage File Location | Target Audience | Precedence Level |
|---|---|---|---|
| `--system` | `/etc/gitconfig` | All OS users & repositories | Lowest (Fallback) |
| `--global` | `~/.gitconfig` | Current OS user's repositories | Medium |
| `--local` | `.git/config` | Only the active repository | Highest (Overrides global) |

## See it

You can inspect your settings and pinpoint the exact configuration file where each key originates:

```bash
# List all active settings along with their source configuration file
git config --list --show-origin

# Override your author email for a specific work repository only
cd ~/work/client-portal
git config --local user.email "alex@corporate.com"

# Verify the local setting overrides global
git config user.email
```

## Go deeper

Git also supports conditional includes via the `includeIf` directive in `~/.gitconfig`. This allows you to automatically load separate config files based on the directory path of the active repository (e.g., using corporate credentials for all repos inside `~/work/`).

Under the hood, all these configuration files share standard INI format with sections like `[user]`, `[core]`, and `[remote]`. When Git queries a configuration key, it checks local, then global, then system, returning the first match found.

> **Tip:** Pass `--show-scope` to `git config --list` to see whether each setting is currently resolving from local, global, or system scope.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Running `git config --local` when you are not inside a Git repository folder, which raises an error.
- Editing `.git/config` manually and creating malformed INI syntax when `git config` safely writes keys for you.

## Remember

- Local (`.git/config`) overrides Global (`~/.gitconfig`), which overrides System (`/etc/gitconfig`).
- Use `--global` for your standard identity, editor, and personal workflow aliases.
- Use `--local` inside a specific project when overriding client or corporate email addresses.
