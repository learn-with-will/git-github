---
id: lesson-02
slug: installing-and-configuring-git
title: "Installing & Configuring Git"
level: beginner
order: 2
duration: 15
tags:
  - setup
  - configuration
  - git-config
  - identity
summary: "Install Git on any OS, set your commit identity, and understand Git's three config levels (system, global, local) — plus the settings worth changing on day one."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Install Git on Windows, macOS, or Linux and confirm it works.
- Set the **name and email** Git records in your commits.
- Explain Git's **three configuration levels** — system, global, and local — and which one wins.
- Inspect your settings with `git config --list` and find where each value comes from.
- Change a few first-day settings: default branch name and default editor.

# Why It Matters

Every commit you make is stamped with an author name and email. If you skip this
one-time setup, your history gets stamped with a guessed identity (something like
`you@your-laptop`), and later — when you push to GitHub — those commits won't be linked
to your account. Two minutes of configuration now saves a messy, mislabeled history
later. Configuration is also where you make Git comfortable: your editor, your default
branch name, handy shortcuts.

# Concept Explanation

### Installing Git

Git is free and runs everywhere. Install it the way that fits your system, then verify.

```bash
# Windows: download the installer from git-scm.com/download/win
#          (it includes "Git Bash", a terminal for running these commands)

# macOS: this prompts to install the Command Line Tools, which include Git…
git --version
# …or use Homebrew:
brew install git

# Debian/Ubuntu Linux:
sudo apt install git

# Fedora Linux:
sudo dnf install git
```

Confirm it worked — any recent version is fine:

```bash
git --version
```

```text
git version 2.43.0
```

### Your identity

Tell Git who you are. Do this once, and every repository will use it:

```bash
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"
```

These two values go into the author and committer fields of every commit you make.
The email is what GitHub later uses to connect commits to your account, so use an email
your GitHub account will recognize.

### The three configuration levels

Git reads settings from three files, each broader than the last. When the same setting
appears in more than one, **the most specific one wins**.

- **System** (`--system`, file `/etc/gitconfig`): applies to **every user** on the
  machine. Rarely edited; needs admin rights.
- **Global** (`--global`, file `~/.gitconfig`): applies to **your user account** across
  all your repositories. This is where `user.name` / `user.email` usually live.
- **Local** (`--local`, file `.git/config` inside a repo): applies to **that one
  repository**. This is the default when you run `git config` inside a repo without a
  level flag.

Precedence, from lowest to highest: **system → global → local**. A local value overrides
a global one, which overrides a system one.

Git config files are plain **INI-format** text. Your global file might look like this:

```ini
[user]
	name = Ada Lovelace
	email = ada@example.com
[init]
	defaultBranch = main
[core]
	editor = code --wait
```

### Seeing your settings

```bash
git config --list                 # every effective setting
git config --list --show-origin   # …and which file each came from
git config user.email             # just one value
```

### A couple of first-day settings

```bash
# Name the initial branch "main" in new repos (Git 2.28+)
git config --global init.defaultBranch main

# Pick the editor Git opens for commit messages, etc.
git config --global core.editor "code --wait"   # VS Code; or "vim", "nano", …
```

# Key Terminology

- **`git config`:** the command that reads and writes Git settings.
- **System / Global / Local:** the three config scopes — whole machine, your user
  account, one repository.
- **`user.name` / `user.email`:** the identity stamped onto your commits.
- **`init.defaultBranch`:** the name Git gives the first branch in a new repository.
- **`core.editor`:** the text editor Git launches when it needs a message from you.
- **`--show-origin`:** flag that reveals which config file a setting came from.

# Options and Trade-offs

| Scope | Flag | File | Applies to | Use it for |
| ----- | ---- | ---- | ---------- | ---------- |
| System | `--system` | `/etc/gitconfig` | Every user on the machine | Org-wide defaults (rare) |
| Global | `--global` | `~/.gitconfig` | Your user, all repos | Your name, email, editor |
| Local | `--local` (default in a repo) | `.git/config` | One repository | A per-project override (e.g. work email) |

# Worked Example

You set a personal identity globally, then override the email in a work repository so
those commits use your work address.

```bash
# Once, globally:
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@personal.com"

# Inside the work project only:
cd ~/work/payroll
git config --local user.email "ada@bigcorp.com"

# Check what this repo will actually use, and where it comes from:
git config --show-origin user.email
```

```text
file:.git/config	ada@bigcorp.com
```

The local value won because local beats global. Every other repository still uses your
personal email.

# Real World Analogy

Config levels are like settings on a shared computer. **System** settings are the ones
an administrator sets for everyone. **Global** settings are your personal account
preferences. **Local** settings are a tweak you make for one specific document you're
working on. The most specific preference always takes precedence.

# Examples

## Example 1 — Basic: first-time setup

A new developer installs Git and runs the two `--global` identity commands. Every repo
they create from now on records commits under that name and email. No further setup is
needed to start committing.

**Why this works:** Identity is global by default because it's almost always the same
everywhere; setting it once covers all your projects.

## Example 2 — Real-world: separate work and personal emails

A contributor uses one email for open-source work and another for their employer. They
keep the personal email global and set the work email locally in each work repo, so
commits are attributed correctly on each side.

**Why this works:** Local config overrides global, letting one machine host repositories
with different identities without constant re-configuring.

## Example 3 — Trade-off / pitfall: commits not linked on GitHub

Someone pushes to GitHub and their commits show a generic avatar, unlinked to their
profile. The cause: `user.email` doesn't match any email verified on their GitHub
account. They fix `user.email` (and, if needed, re-attribute future commits).

**Why this bites:** GitHub links commits to accounts purely by the commit email. A
typo or an unverified address quietly detaches your work from your profile.

# Common Mistakes

- **Never setting `user.email`.** Commits get a guessed identity and won't link to your
  GitHub account.
- **Using `--global` when you meant a per-repo override** (or vice versa). Check with
  `--show-origin` when a value surprises you.
- **Editing the wrong file by hand.** Prefer `git config` commands; if you do edit the
  INI file, make sure it's the level you intend.
- **Assuming a work email is set when it isn't.** Run `git config user.email` inside the
  repo before your first commit there.

# Best Practices

- Set `user.name` and `user.email` **globally** right after installing.
- Use a **per-repo local email** when a project needs a different identity.
- Set `init.defaultBranch main` so new repos start on `main`.
- Choose a `core.editor` you're comfortable with — you'll meet it when writing commit
  messages and during interactive rebases.
- When a setting behaves unexpectedly, run `git config --list --show-origin` to see
  exactly what's set and where.

# Summary

- Install Git from your package manager or git-scm.com, and verify with `git --version`.
- `git config --global user.name` / `user.email` set the identity stamped on every
  commit; the email is what GitHub uses to link commits to your account.
- Git has **three config levels** — system, global, local — and the most specific one
  **wins** (local > global > system).
- Inspect settings with `git config --list` and `--show-origin`; read a single value
  with `git config <key>`.
- Worth setting on day one: `init.defaultBranch main` and your `core.editor`.

# Flash Cards

Q: Which command sets the email recorded in your commits, for all your repositories?
A: git config --global user.email "you@example.com"

Q: What are Git's three configuration levels, from broadest to narrowest?
A: System (whole machine), global (your user account), and local (one repository).

Q: If a setting is defined both globally and locally, which value does Git use?
A: The local one — local overrides global, which overrides system.

Q: How do you see every effective setting and the file each came from?
A: git config --list --show-origin

Q: Why might your pushed commits not link to your GitHub profile?
A: Because the commit email (user.email) doesn't match an email verified on your GitHub account.

Q: Which setting controls the name of the first branch in a new repository?
A: init.defaultBranch (e.g. set it to main).

# Exercises

### Easy

Install Git if you haven't, then set your global `user.name` and `user.email`. Run
`git config --list` and confirm both appear.

### Medium

Create a new folder, run `git init`, and set a **local** `user.email` different from your
global one. Use `git config --show-origin user.email` to prove the local value is the one
in effect, and explain why.

### Challenging

You have three settings for `core.editor`: one in the system file, one global, one local.
Predict which one `git config core.editor` reports, then verify with `--show-origin`.
What would you change to make a single repository use a different editor from the rest?

# Further Reading

- Pro Git, Chapter 1 — [Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [First-Time Git Setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)
- [git-scm.com/downloads](https://git-scm.com/downloads) — official installers for every OS
- [`git config` reference](https://git-scm.com/docs/git-config) — every setting, in detail
