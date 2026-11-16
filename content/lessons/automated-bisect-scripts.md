---
slug: automated-bisect-scripts
title: "Automating Bisect with Test Scripts"
topic: debugging-large-repos
kind: technique
summary: "Automate git bisect using test scripts with git bisect run, pinpointing regressions with zero human interaction."
tags: [bisect, automation, testing]
related: [git-bisect-hunt, git-blame-and-log-search, github-actions-fundamentals]
---
> **In one line:** git bisect run executes an automated test script at every midpoint, finding the bad commit completely hands-free.

## The idea

While interactive `git bisect` is fast, manually running tests, checking browsers, and typing `good`/`bad` ten times in a row is still manual work.

If you can write a script, test command, or one-liner that exits with `0` when the code is good and a non-zero exit code (like `1`) when the code is broken, **Git can run the entire bisect automatically in seconds without human intervention**.

The command is **`git bisect run <script>`**.

Git repeatedly checks out each midpoint commit, executes your script, checks its exit code:
- **Exit code `0`:** Git marks the commit **good**.
- **Exit code `1`–`127` (except 125):** Git marks the commit **bad**.
- **Exit code `125`:** Git **skips** the commit (untestable build).

Git iterates autonomously until it prints the culprit commit and terminates.

| Script Exit Code | How Git Interprets It |
|---|---|
| `0` | Commit is **good** (test passed) |
| `1`–`127` (non-zero) | Commit is **bad** (test failed, bug present) |
| `125` | **Skip** commit (cannot compile or run test) |

## See it

Automate bisect with a test script or one-line command:

```bash
# Start bisect and mark boundaries
git bisect start HEAD v1.0.0

# Run automated bisect using npm test
git bisect run npm test -- --grep "calculates billing discount"

# Or run using a custom bash test script
# git bisect run ./scripts/test-regression.sh

# When Git announces the culprit commit, exit bisect
git bisect reset
```

## Go deeper

Exit code `125` is a special convention in Git bisect. If your script runs into an unbuildable state (e.g. a broken npm dependency during a past refactor), exiting with `125` tells Git: 'This commit cannot be evaluated; pick an adjacent commit.' Standard tools like `make` or `npm test` exit with 1 on test failure, which Git properly marks as `bad`.

> **Tip:** You can write a tiny one-line inline command: `git bisect run python -c "import app; assert app.calculate(10) == 20"`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Using a test script that takes minutes per run; bisect runs it ~10 times, so keep the test script fast.
- Testing a script that returns non-zero when the code is good; ensure 0 means passing and 1 means failing.

## Remember

- `git bisect run <cmd>` automates regression hunting across commit history.
- The test command must exit with 0 for good/passing and non-zero for bad/failing.
- Exit code 125 tells Git to skip an untestable commit.
