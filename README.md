# Git & GitHub Learning Portal

A **frontend-only** Git & GitHub course: read Markdown lessons, take quizzes, and track
your progress — all in the browser. No sign-up, no backend.

## What this is

The portal shell is built with React 19, Vite, TypeScript, React Router, Tailwind CSS v4,
`marked`, and PrismJS. It renders a **24-lesson curriculum** that takes you from "what is
version control?" through everyday Git, collaborating on GitHub, and on to power tools,
internals, and CI/CD automation. Every lesson is written in plain, welcoming English and
verified against primary sources (see **Sources** below).

Progress, bookmarks, and quiz scores live in `localStorage` under `git-github-learning-*`
keys, so nothing leaves your machine.

## Run it locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## How the content works

The app is **data-driven** — adding a lesson needs no code changes:

1. Write the lesson Markdown in `public/content/<level>/<slug>.md` with YAML front-matter
   (including a `summary`).
2. Add a quiz at `public/quizzes/lesson-NN.json`.
3. Regenerate `public/content/course-manifest.json` from the front-matter (the manifest is
   generated, so it can't drift).

> **Code fences** must declare one of the highlighted languages: `bash`, `diff`, `yaml`,
> `ini`, `json`, or `text` (commit diagrams and terminal output use `text`; see
> `src/core/prism.ts`).

## Curriculum

**Beginner — Git fundamentals:** what is version control · installing & configuring Git ·
the three states & your first commit · viewing & ignoring history · undoing things ·
branching basics · merging & conflicts · working with remotes.

**Intermediate — GitHub & collaboration:** GitHub repos & authentication · the GitHub flow
& pull requests · forking & contributing · PR merge strategies (merge/squash/rebase) ·
rebasing · resolving conflicts in depth · issues, labels, milestones & projects · tags,
releases & semantic versioning.

**Advanced — power tools & automation:** stash, cherry-pick & reflog · rewriting history
safely · debugging with bisect & blame · submodules & Git LFS · Git internals (objects,
refs & the DAG) · GitHub Actions CI · branch protection, reviews & hooks · a team-workflows
capstone.

## Accuracy: no hallucination

Every command, flag, default, and behavior is verified against primary sources. The
per-lesson authoring contract lives in `prompts/git-github-authoring-prompt.md`, and the
phase-by-phase overview in `prompts/git-github-study-pathway.md`.

**Sources:**

- **Pro Git**, 2nd ed. (Scott Chacon & Ben Straub) — <https://git-scm.com/book> — the
  primary anchor for how Git works.
- **Official Git reference** — <https://git-scm.com/docs> — the man pages, for every
  command, flag, and default.
- **GitHub Docs** — <https://docs.github.com> — for GitHub-specific features (pull
  requests, forks, Issues, Releases, branch protection, authentication) and **GitHub
  Actions**.
- **Semantic Versioning** — <https://semver.org> — and **Conventional Commits** —
  <https://www.conventionalcommits.org> (presented as conventions).
- **Git LFS** — <https://git-lfs.com>.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`BASE_PATH=/<repo>/` and publishes `dist/` to GitHub Pages.

---

React 19 · Vite · TypeScript · React Router · Tailwind CSS v4 · marked · PrismJS ·
localStorage.
