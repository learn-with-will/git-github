---
slug: git-hooks
title: "Local Automation with Client-Side Git Hooks"
topic: ci-workflows
kind: tool
summary: "Automate local linting and commit message checks using client-side Git hooks in .git/hooks/, and understand why hooks are bypassable."
tags: [git-hooks, automation, pre-commit]
related: [branch-protection-rules, conventional-commits, github-actions-fundamentals]
---
> **In one line:** Git hooks are executable scripts in .git/hooks/ that run automatically before commits or pushes to enforce local quality.

## The idea

Git provides a built-in event-driven hook system. Inside every `.git/` folder, a hidden directory called `.git/hooks/` contains executable scripts that Git runs before or after core actions like committing, merging, or pushing.

Popular client-side hooks:
- **`pre-commit`:** Runs before a commit is created. Ideal for running fast linters, formatters, and secret scanners. If the script exits with non-zero, **Git aborts the commit**.
- **`commit-msg`:** Validates the text of the commit message (e.g. enforcing Conventional Commits formatting or requiring an issue ticket number).
- **`pre-push`:** Runs before commits are uploaded to a remote. Ideal for running unit test suites.

**Critical Security Reality: Client-side hooks are NOT an enforcement mechanism!**
Because `.git/hooks/` lives on the developer's local machine, developers can bypass hooks anytime by running `git commit --no-verify` (or `-n`). Furthermore, `.git/hooks/` is not tracked by Git and is not cloned. Therefore, always enforce mandatory security and testing rules on the server via GitHub Actions and branch protection.

| Hook Name | Execution Timing | Common Use Case |
|---|---|---|
| `pre-commit` | After `git commit`, before editor opens | Linter, Prettier, secret detection |
| `commit-msg` | After message is written | Enforcing Conventional Commits format |
| `pre-push` | Before `git push` transmits data | Fast sanity test suite |
| `post-merge` | After `git pull` or `git merge` | Reinstalling dependencies (`npm install`) |

## See it

Create a simple `pre-commit` hook that blocks unformatted code:

```bash
# Create an executable pre-commit hook in .git/hooks/
cat << 'EOF' > .git/hooks/pre-commit
#!/bin/sh
echo "Running pre-commit linter checks..."
npm run lint --silent
if [ $? -ne 0 ]; then
  echo "Error: Linting failed. Fix issues before committing."
  exit 1
fi
EOF

# Make the hook script executable
chmod +x .git/hooks/pre-commit

# Note: Developers can bypass local hooks with --no-verify
# git commit --no-verify -m "Emergency fix"
```

## Go deeper

Because `.git/hooks/` is not committed to the repository, teams use tools like **Husky** or the **`pre-commit` framework** (`pre-commit.com`) to manage hook scripts inside tracked repository files (e.g. `.husky/`), automatically installing them into `.git/hooks/` when developers run `npm install`.

> **Tip:** Keep `pre-commit` hooks extremely fast (under 3 seconds). If local hooks take 45 seconds, developers will bypass them with `--no-verify`.

## Watch out

- Relying on client-side hooks for organizational security; anyone can run `git commit --no-verify` to bypass them.
- Creating slow pre-commit hooks that run entire multi-minute integration test suites locally.

## Remember

- Client-side hooks in `.git/hooks/` run scripts before commits or pushes.
- A non-zero exit code halts the Git operation.
- Client-side hooks are easily bypassed with `--no-verify`; enforce true security on the server via CI.
