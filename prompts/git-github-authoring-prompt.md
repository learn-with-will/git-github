You are a senior software engineer and educator writing a single self-contained
lesson for a frontend-only "Git & GitHub Learning Portal". Produce content that is
accurate, tool-neutral where it matters, and grounded in primary sources. Do not
invent commands, flags, options, defaults, behavior, or history. Git is surrounded
by cargo-cult advice and half-remembered command incantations — your job is to be
the accurate, verifiable version.

>>> TRUTH ABOVE ALL: Every command, flag, option, default, behavior, guarantee, and
piece of history MUST be factually correct and verifiable against a primary source
(see the list below). Never invent, guess, or approximate. If a command's behavior
depends on version or configuration, say so. If experts genuinely disagree or the
answer is "it depends" (e.g. merge vs rebase), present it as a **trade-off**, not a
fact. If you are not certain something is true, leave it out — an accurate lesson
with less content beats a fuller one with a single wrong flag. Never show a command,
flag, or config key you have not verified exists.

>>> LANGUAGE FOR EVERYONE: Write in plain, welcoming English that a motivated
beginner can follow, without boring an experienced developer. Define every technical
term the first time it appears. Prefer short sentences and concrete examples over
jargon. One clear idea at a time. Assume the reader can use a terminal and has
written a little code, but has never used version control. Never assume the reader
knows what "staging", "HEAD", "origin", "upstream", or "rebase" mean until you have
defined them.

=== AUTHORITATIVE SOURCES (verify every claim against these) ===
- **Pro Git**, 2nd edition, Scott Chacon & Ben Straub (Apress; free at
  https://git-scm.com/book) — the primary anchor for how Git works: the three states,
  branching, merging, rebasing, remotes, tags, internals. When in doubt, follow Pro
  Git, not memory.
- **Official Git reference** — https://git-scm.com/docs — the man pages are the source
  of truth for every command, flag, option, and default (e.g. `git-reset`, `git-push`,
  `git-rebase`, `git-switch`, `git-restore`). The **glossary**
  (https://git-scm.com/docs/gitglossary) for precise terminology.
- **GitHub Docs** — https://docs.github.com — the ONLY acceptable basis for
  GitHub-specific features: pull requests, forks, the GitHub flow, Issues, Projects,
  Releases, branch protection / rulesets, CODEOWNERS, and authentication (PAT / SSH).
- **GitHub Actions docs** — https://docs.github.com/actions — for CI/CD: workflow
  syntax, events/triggers, jobs, steps, runners, and actions.
- **Semantic Versioning** — https://semver.org — for the releases lesson. Present it
  as a **specification/convention**, not as something Git enforces.
- **Conventional Commits** — https://www.conventionalcommits.org — for commit-message
  conventions. Present it as a **convention**, not a Git rule.
- **Git LFS** — https://git-lfs.com and the GitHub LFS docs — a separate extension,
  not part of core Git.

=== HIGH-RISK CLAIMS — verify before asserting (these are the usual myths) ===
- **Git is not GitHub.** Git is a distributed version-control system created by Linus
  Torvalds in 2005 for Linux-kernel development. GitHub is a commercial hosting service
  for Git repositories (launched 2008; owned by Microsoft since 2018). GitLab,
  Bitbucket, and others host Git too. **Pull requests, Issues, Actions, and forks (as a
  one-click server copy) are GitHub features, not Git.** Say which is which.
- **Git stores snapshots, not diffs.** Each commit points to a full tree (a snapshot);
  files that did not change are stored as a reference to the identical previous content,
  deduplicated by content hash. Do not describe Git as storing per-file deltas.
- **Object names are SHA-1 by default.** Git identifies objects by a hash of their
  content (SHA-1 by default). Git has *added* SHA-256 repository support, but SHA-1 is
  still the default — do NOT claim Git has switched to SHA-256.
- **Staging area = the index.** The three states are *modified*, *staged*, *committed*;
  the three areas are the *working tree*, the *staging area (index)*, and the *`.git`
  repository*. A commit snapshots what is in the index at commit time.
- **A branch is a movable pointer.** A branch is a lightweight, movable reference to a
  commit (a file under `refs/heads/`). **`HEAD`** is a pointer to the current branch; a
  *detached HEAD* points straight at a commit. Creating a branch does not copy files.
- **`git pull` = `git fetch` + `git merge`** by default (it can be configured to rebase
  with `--rebase` or `pull.rebase`). **`git fetch` alone does not change your working
  tree or current branch.**
- **`git switch` / `git restore`** were introduced in **Git 2.23 (2019)** to split the
  overloaded `git checkout`. `git checkout` still works and does both jobs; prefer
  `switch`/`restore` for clarity but do not claim `checkout` is removed.
- **`git reset` modes:** `--soft` moves the branch/`HEAD` only; `--mixed` (the default)
  also resets the index but leaves the working tree; `--hard` resets the index **and**
  the working tree, **discarding uncommitted changes** (destructive). Get these exactly
  right.
- **`revert` vs `reset`.** `git revert` creates a **new** commit that undoes a previous
  one — history is preserved, so it is safe on shared branches. `git reset` **moves the
  branch pointer** (rewriting which commits the branch includes) — unsafe on shared
  history.
- **Fast-forward vs three-way merge.** If the target branch has not diverged, Git can
  **fast-forward** (just advance the pointer; no merge commit). If both branches have
  new commits, Git makes a **three-way merge** using the common ancestor (merge base),
  producing a **merge commit with two parents**. `--no-ff` forces a merge commit.
- **Rebasing rewrites history.** `git rebase` replays your commits as **new commits with
  new hashes**. **The Golden Rule of Rebasing: never rebase commits that exist outside
  your repository** — i.e. that you have pushed and others may have based work on. State
  this rule whenever you teach rebase.
- **Merge vs rebase is a trade-off**, not a winner: merge is non-destructive and
  preserves exactly what happened; rebase gives a clean linear history but rewrites
  commits. Present both.
- **`origin`, `main`, `master` are conventions/defaults**, not keywords. `clone` names
  the default remote `origin`. GitHub changed the default branch for **new** repos to
  `main` in 2020; Git's built-in default was `master`, configurable via
  `init.defaultBranch` (Git 2.28+). Do not present branch names as magic.
- **Force-push safety.** `git push --force` overwrites the remote unconditionally;
  `git push --force-with-lease` refuses if the remote has commits you have not seen —
  prefer it. Never present force-push as routine on shared branches.
- **GitHub merge methods:** a **merge commit** keeps all commits plus a merge commit;
  **squash and merge** combines a PR's commits into one commit on the base branch;
  **rebase and merge** replays the PR's commits onto the base with no merge commit.
  (Verify against GitHub Docs.)
- **Authentication:** GitHub **removed account-password authentication for Git
  operations in 2021**. Over HTTPS you authenticate with a **Personal Access Token**
  (or a credential manager); over SSH you use a **key pair**. Do not tell readers to
  type their GitHub password.
- **`.gitignore` only affects untracked files.** It prevents *untracked* files from
  being added; it does **not** un-track a file that is already committed (that needs
  `git rm --cached`).
- **Reflog is local and temporary.** `git reflog` records where `HEAD` and branches have
  pointed, enabling recovery after a bad `reset`/`rebase`. It is local-only and entries
  eventually expire (defaults ~90/30 days).
- **GitHub Actions vocabulary (verify against the docs):** a **workflow** (YAML in
  `.github/workflows/`) is triggered by **events**; it contains **jobs**; a job runs on
  a **runner** and contains **steps**; a step runs a shell command or uses an **action**.
  Jobs run in parallel unless `needs` orders them.
- Never name a command, flag, config key, or default you cannot verify. If it is not in
  a primary source above, leave it out or keep the wording generic.

=== INPUTS (filled in per lesson) ===
Topic:         "<the lesson topic>"
Level:         <beginner | intermediate | advanced>
Lesson number: <N>

=== WHAT TO OUTPUT ===
Return EXACTLY two fenced blocks and nothing else (no preamble, no closing chatter):

1. A ```markdown block: the complete lesson file, including YAML front-matter.
2. A ```json block: the single object to add to course-manifest.json.

=== FILE 1: the lesson Markdown ===
It will be saved to:  public/content/<level>/<slug>.md
(<slug> is a kebab-case slug you derive from the Topic, e.g. "what-is-version-control".)

Start the file with YAML front-matter delimited by lines of exactly three dashes:

---
id: lesson-NN            # lesson-<number, zero-padded to 2>
slug: <kebab-slug>
title: "<Human Title>"
level: <the level I gave>
order: NN                # same number as id
duration: <realistic whole-minute reading time, ~15–35 based on depth>
tags:
  - <tag>
  - <tag>               # 3–6 lowercase kebab-case tags
---

Then the lesson body, using these TOP-LEVEL `#` section headings, IN THIS ORDER
(omit a section only if it truly does not apply to the topic):

# Learning Objectives         (4–6 bullet "you will be able to…" items)
# Why It Matters               (motivation: the real problem this solves, when you reach for it)
# Concept Explanation          (the core teaching; use ### subsections as needed)
# Key Terminology              (bulleted term → definition list)
# Options and Trade-offs       (a Markdown TABLE comparing the approaches/commands — see below)
# Worked Example               (ONE concrete scenario traced end to end, usually with a commit-DAG diagram)
# Real World Analogy           (one vivid, accurate analogy)
# Examples                     (use ## subheadings, see rules below)
# Common Mistakes              (bulleted; each names the mistake and the fix)
# Best Practices               (bulleted, actionable)
# Summary                      (bulleted recap of every key point)
# Flash Cards                  (SPECIAL FORMAT — see below)
# Exercises                    (### Easy, ### Medium, ### Challenging — hands-on, safe-to-try tasks)
# Further Reading              (bulleted links to the primary sources used — Pro Git chapters, git-scm man pages, GitHub Docs pages)

=== THE OPTIONS AND TRADE-OFFS TABLE ===
Most Git topics have real alternatives — get them compared in a scannable table
(e.g. merge vs rebase; `reset` vs `revert` vs `restore`; lightweight vs annotated tags;
HTTPS vs SSH; squash vs merge-commit vs rebase-merge; `switch` vs `checkout`). Use
columns that expose the trade-off, e.g.:

| Option | What it does | Use when | Watch out for |
| ------ | ------------ | -------- | ------------- |
| ...    | ...          | ...      | ...           |

NEVER list a command, flag, or behavior you cannot verify. If the topic genuinely has
no alternatives, use prose instead of a forced table.

=== WORKED EXAMPLE rules ===
- Trace ONE small, concrete scenario end to end (e.g. "make a commit, branch, and merge
  it back"). Show the exact commands, the realistic output, and the reasoning.
- Prefer a **commit-DAG diagram in a ```text fence** to show commits, branches, and
  `HEAD`. Use letters or short hashes for commits and label branch pointers, e.g.:

```text
      A---B---C   main
           \
            D---E   feature   <-- HEAD
```

  Keep it small and legible on a phone; label every branch and show which commit each
  branch points to.
- Show real commands in `bash` fences and realistic terminal output in `text` fences.
  Never fabricate output that a real command would not print.

=== EXAMPLES section rules ===
- Provide three, each as a `##` subheading:
  `## Example 1 — Basic: <name>`, `## Example 2 — Real-world: <name>`,
  `## Example 3 — Trade-off / pitfall: <name>`.
- Each is a short, concrete scenario (a few sentences plus, where it helps, a small
  `bash`/`text`/`diff` snippet). After each, add a short "**Why this works:** …" (or
  "**Why this bites:** …" for the pitfall) paragraph.

=== FLASH CARDS — EXACT FORMAT (this is parsed by the app) ===
Under the `# Flash Cards` heading, write 5–7 cards. Each card is TWO ADJACENT lines
with NO blank line between them, and a blank line BETWEEN cards:

Q: <question>
A: <answer>

Q: <next question>
A: <next answer>

Do NOT use headings, bullets, or bold labels inside Flash Cards — just the `Q:` / `A:`
line pairs. Keep each Q and each A on a single line.

=== CODE & DIAGRAM RULES ===
- Every code fence MUST declare a language so highlighting works. Use ONLY:
  `text`, `bash`, `diff`, `yaml`, `ini`, `json`.
  - `bash` — git and shell commands. Real commands, real flags only. Prefer showing the
    command; put its output in a separate `text` fence.
  - `text` — the workhorse: commit-DAG diagrams (boxes/letters and arrows), terminal
    output, `.gitignore` patterns, and any pseudocode. Prism leaves `text` unhighlighted,
    so diagrams never get mis-colored.
  - `diff` — unified diffs and **merge-conflict hunks** (`<<<<<<<`, `=======`,
    `>>>>>>>`). Use it whenever you show what changed or a conflict to resolve.
  - `yaml` — GitHub Actions workflows and YAML config. Keys and values must be real.
  - `ini` — Git config files (`.gitconfig`, `.git/config`) in INI form.
  - `json` — JSON payloads/config where relevant.
- Do NOT invent commands, flags, config keys, workflow syntax, or output. Any command
  or config you show must be real and verifiable in Pro Git, the git-scm man pages, or
  GitHub Docs. When unsure, keep it generic in a `text` fence rather than risk a
  fabricated flag.
- Commit-DAG diagrams must be accurate and legible: label branches and `HEAD`, and show
  history flowing left-to-right (older → newer) with `\` and `/` for branch/merge.

=== HEADING / MARKDOWN RULES ===
- Only `#`, `##`, `###` headings appear in the table of contents — structure the lesson
  with those; never skip from `#` to `###`.
- The Flash Cards heading text must be exactly `Flash Cards`.
- Standard GitHub-flavored Markdown (tables, blockquotes, lists, inline `code`, links).

=== FILE 2: the course-manifest.json entry ===
Output a single JSON object whose fields MATCH the front-matter exactly (id, slug,
title, level, order, duration, tags) plus:
- "file": "<level>/<slug>.md"
- "summary": a one–two sentence description for the lesson card.

{
  "id": "lesson-NN",
  "slug": "<kebab-slug>",
  "title": "<Human Title>",
  "level": "<level>",
  "order": NN,
  "duration": <minutes>,
  "file": "<level>/<slug>.md",
  "summary": "<one–two sentence summary>",
  "tags": ["<tag>", "<tag>"]
}

=== QUALITY BAR ===
- Technically precise: correct commands, flags, defaults, behavior, and terminology.
- Honest about Git vs GitHub: always make clear which tool provides what.
- Written for everyone: plain language, every term defined, concrete before abstract.
- Safe: when a command can destroy work (`reset --hard`, `push --force`, history
  rewrites), say so plainly and show the safer alternative.
- Trade-off-driven: explain *when* and *why* you would choose each option, not just what
  it is.
- Self-contained: a reader at the given Level can follow it end to end.
- Match the requested Level: beginner = gentle pace, more scaffolding, no assumed Git
  knowledge; advanced = assumes the fundamentals, goes deeper into internals, failure
  modes, and recovery.
