---
id: lesson-01
slug: what-is-version-control
title: "What Is Version Control?"
level: beginner
order: 1
duration: 16
tags:
  - fundamentals
  - version-control
  - git-vs-github
  - distributed
  - history
summary: "What version control is, the local/centralized/distributed models, why Git is distributed and stores snapshots not diffs, and the essential Git-vs-GitHub distinction."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a **version-control system** is and the problem it solves.
- Tell apart the three families of version control: **local**, **centralized**, and **distributed**.
- Explain why Git is a **distributed** system and what that buys you.
- Describe the single most important idea in Git: it stores **snapshots, not differences**.
- Clearly distinguish **Git** (the tool) from **GitHub** (a service that hosts Git repositories).

# Why It Matters

Have you ever saved a file as `report-final.docx`, then `report-final-v2.docx`, then
`report-final-REALLY-final.docx`? That folder full of almost-identical files is a
manual, error-prone version-control system. It falls apart the moment two people edit
at once, or you need to know *what* changed between two versions and *why*.

**Version control** solves this properly. It records the history of your project so you
can go back to any earlier state, see exactly what changed between versions, and combine
work from many people without overwriting each other. For anyone who writes code — or
really any text — it is the single most useful tool to learn well. Git is the
version-control system the software world has standardized on, and GitHub is the most
popular place to store Git projects online. This whole course is about using them
confidently.

# Concept Explanation

A **version-control system (VCS)** is software that records changes to a set of files
over time, so you can recall any specific version later, compare versions, and see who
changed what. Version control has evolved through three generations.

### 1. Local version control

The earliest systems kept a simple database of changes **on your own computer**. A
classic example is **RCS**. This is better than copying folders by hand, but it has two
big limits: there is no easy way to collaborate with other people, and if that one disk
fails, the whole history is gone.

### 2. Centralized version control (CVCS)

To let teams collaborate, **centralized** systems put all the versioned files on a
**single server**. Everyone "checks out" the files they need from that server.
**Subversion (SVN)**, **CVS**, and **Perforce** work this way.

This was a big step forward — everyone can see what others are working on, and
administrators can control who does what. But the central server is a **single point of
failure**: if it goes down, nobody can collaborate or save new versions until it comes
back. And if the server's disk is lost without a backup, the entire project history goes
with it.

### 3. Distributed version control (DVCS)

In a **distributed** system, clients don't just check out the latest files — every
clone is a **full copy of the repository, including its entire history**. **Git**,
**Mercurial**, and **Bazaar** are distributed.

This one change fixes the big weaknesses of the centralized model:

- **Every clone is a complete backup.** If any server dies, any contributor's clone can
  restore it.
- **Almost everything works offline.** Because the full history is on your machine, you
  can commit, branch, and browse history with no network at all.
- **Flexible collaboration.** Teams can agree on many different workflows, not just "one
  central server."

### Git's big idea: snapshots, not differences

Most older systems store your history as a **list of changes to files** — "in version 3,
line 12 of `main.c` changed like this." Git works differently. Every time you commit,
Git takes a **snapshot** of what all your files look like at that moment and stores a
reference to that snapshot. To be efficient, files that **didn't** change aren't stored
again — Git just links to the identical previous version. Thinking of your history as a
series of snapshots (not a pile of diffs) is the mental model that makes the rest of Git
click.

Git also gives every snapshot a name that is a **checksum** — a 40-character SHA-1 hash
computed from its contents. Because the name comes from the content, nothing can change
in your history without Git noticing.

### A short history

Git was created in **2005** by **Linus Torvalds** and the Linux kernel community. The
kernel project had been using a distributed tool called BitKeeper, but lost free access
to it. Rather than go back to a centralized system, they built Git with a clear set of
goals: **speed**, a **simple design**, strong support for **non-linear development**
(thousands of parallel branches), being **fully distributed**, and being able to handle
a **huge project** like the Linux kernel efficiently. Those goals still describe Git
today.

### Git is not GitHub

This trips up almost everyone at the start, so let's be precise:

- **Git** is the free, open-source **version-control tool** that runs on your computer.
  It works completely on its own, with no account and no internet.
- **GitHub** is a **website and company** (launched in 2008; owned by Microsoft since
  2018) that **hosts Git repositories** online and adds collaboration features on top —
  pull requests, issue tracking, code review, and automation. GitHub is not the only
  option; **GitLab** and **Bitbucket** are popular alternatives.

Put simply: Git is the engine; GitHub is one place you can park and share what the
engine produces. You will spend Phase 1 of this course on Git itself, then add GitHub in
Phase 2.

# Key Terminology

- **Version-control system (VCS):** software that records changes to files over time so
  you can recall, compare, or restore any version.
- **Repository ("repo"):** the project together with its complete history of versions.
- **Commit:** one saved snapshot of your project at a point in time (both the noun and
  the verb).
- **Local / Centralized / Distributed:** the three VCS models — history on your machine
  only; history on one shared server; a full copy of history in every clone.
- **Clone:** a full copy of a repository, including all of its history.
- **Snapshot:** Git's unit of history — a picture of *all* your files at commit time
  (contrast with a *diff*, which records only what changed).
- **Git:** the open-source distributed version-control tool.
- **GitHub:** a service that hosts Git repositories and adds collaboration features.

# Options and Trade-offs

| Model | How it works | Strengths | Watch out for |
| ----- | ------------ | --------- | ------------- |
| **Local** (e.g. RCS) | History kept only on your own machine | Dead simple; fully offline | No collaboration; one failed disk loses everything |
| **Centralized** (SVN, CVS, Perforce) | One server holds all history; clients check out a working copy | Everyone sees others' work; central admin control | Server outage stops collaboration; losing the server risks all history |
| **Distributed** (Git, Mercurial) | Every clone is a full copy of the repo *and* its history | Works offline; every clone is a backup; flexible workflows | More concepts to learn up front; history is everywhere, so purging a secret is hard |

# Worked Example

Let's trace how two people, Alice and Bob, collaborate on a project hosted on GitHub —
and notice where Git (local) ends and GitHub (the hub) begins.

```text
                 GitHub (a hosting service — the shared hub)
                        repo: full history  A---B
                          ^                        \
                    push  |                         v  clone / pull
                          |                                |
        Alice's laptop (Git)                        Bob's laptop (Git)
        full history: A---B---C                     full history: A---B
                    (commits offline)               (about to pull C)
```

1. Bob creates the repo on GitHub and pushes commits **A** and **B**.
2. Alice **clones** it. Her laptop now has the *entire* history (A and B), not just the
   latest files.
3. On a train with no Wi-Fi, Alice makes commit **C**. This works fine — **committing is
   a local Git operation**; GitHub is not involved yet.
4. Back online, Alice **pushes** C to GitHub. Now the hub has A–B–C.
5. Bob **pulls**, and his laptop catches up to A–B–C.

Notice the division of labor: Git did all the version tracking on each laptop; GitHub
served as the shared meeting point so Alice and Bob could exchange commits. If GitHub had
been down in step 3, Alice could still commit all day — she just couldn't push until it
came back.

# Real World Analogy

Think of a photographer shooting a stop-motion film. Each **commit** is a photo of the
*entire* scene at one moment — not a note that says "the left arm moved." To see how the
scene evolved, you flip through the photos. A **distributed** VCS is like giving every
member of the crew a complete copy of the whole photo album: if one copy is damaged, any
other can restore it, and anyone can keep adding photos even while off-site. GitHub, in
this analogy, is the shared shelf where the crew agrees to keep the master album so
everyone can sync up.

# Examples

## Example 1 — Basic: a solo writer

A novelist keeps their book in a Git repository. Every writing session ends with a
commit, so the full draft history is preserved. When a bold rewrite of chapter 5 doesn't
work out, they simply restore the previous snapshot — no `chapter5-old-DO-NOT-DELETE.doc`
required. They never touch GitHub; Git alone is enough for a personal project.

**Why this works:** Version control isn't only for teams or code. Any project made of
files benefits from a reliable, browsable history — and Git runs perfectly well entirely
offline on one machine.

## Example 2 — Real-world: the Linux kernel

Thousands of developers around the world contribute to the Linux kernel. There is no way
a single central server could gate every change without becoming a bottleneck. Because
Git is distributed, each maintainer has the full history locally, works independently,
and shares changes peer-to-peer or through hosted repositories. This is precisely the
problem Git was invented to solve.

**Why this works:** Distributed history means no single chokepoint and no single point of
failure — the exact properties a massive, fast-moving, worldwide project needs.

## Example 3 — Trade-off / pitfall: mistaking GitHub for Git

A new team treats GitHub as if it *were* Git: they believe code only exists once it's on
GitHub and that they can't work when the site has an outage. During a GitHub incident,
work grinds to a halt — even though every laptop already holds the full repository and
could keep committing locally the entire time.

**Why this bites:** Confusing the tool (Git, local) with the service (GitHub, remote)
leads to needless downtime and shaky mental models. Learn Git first; treat GitHub as a
convenient hub, not as the source of truth living somewhere else.

# Common Mistakes

- **Thinking Git and GitHub are the same thing.** Git is the local tool; GitHub is one
  online host for Git repos. You can use Git with no GitHub account at all.
- **Believing you need the internet to use Git.** Committing, branching, and viewing
  history are all local. You only need a network to *sync* with a remote.
- **Picturing history as a stack of diffs.** Git stores **snapshots**. Holding the wrong
  mental model makes branching and merging feel more mysterious than they are.
- **Assuming "it's on the server, so it's safe" — or the reverse.** In a distributed
  system every clone is a backup, but that only helps if people actually clone and push.
  Understand where copies live.

# Best Practices

- **Use version control for everything**, even solo projects — it's a safety net and a
  time machine.
- **Commit often, in small, logical steps.** Frequent snapshots make history useful and
  recovery easy (you'll learn the mechanics in the next lessons).
- **Learn the mental model before the commands.** "Snapshots, local-first, distributed"
  explains most of Git's behavior.
- **Push to a remote (like GitHub) regularly** once you collaborate — it's both an
  off-machine backup and the way you share work.
- **Keep Git and GitHub straight in your head.** Knowing which layer you're operating in
  saves hours of confusion later.

# Summary

- A **version-control system** records the history of your files so you can restore,
  compare, and combine versions.
- Version control comes in three families: **local** (history on one machine),
  **centralized** (history on one shared server), and **distributed** (a full copy of
  history in every clone).
- **Git is distributed**: every clone is a complete, offline-capable backup — which is
  why a server outage or disk failure isn't catastrophic.
- Git's core idea is **snapshots, not differences**; each snapshot is named by a
  content **checksum (SHA-1)**, so history can't change unnoticed.
- Git was built in **2005** for **Linux-kernel** development, prioritizing speed,
  branching, and full distribution.
- **Git ≠ GitHub.** Git is the open-source tool on your computer; **GitHub** is a service
  that hosts Git repositories and adds collaboration features (with GitLab and Bitbucket
  as alternatives).

# Flash Cards

Q: What is a version-control system?
A: Software that records changes to files over time so you can recall, compare, or restore any earlier version.

Q: What's the key difference between a centralized and a distributed VCS?
A: Centralized keeps all history on one shared server; distributed gives every clone a full copy of the entire history.

Q: Is Git the same as GitHub?
A: No — Git is the version-control tool that runs on your computer; GitHub is a service that hosts Git repositories and adds collaboration features.

Q: Does Git store your project as a set of file differences?
A: No. Git stores snapshots of your whole project at each commit; unchanged files are just references to the previous identical content.

Q: Do you need an internet connection to make a commit in Git?
A: No. Committing is a local operation; you only need the network to sync with a remote like GitHub.

Q: Who created Git, and why?
A: Linus Torvalds and the Linux community created it in 2005 to manage Linux-kernel development after losing access to their previous tool.

Q: Name two hosting services for Git besides GitHub.
A: GitLab and Bitbucket (Gitea and others exist too).

# Exercises

### Easy

In your own words, explain the difference between Git and GitHub. List two things Git
does on its own and two things GitHub adds on top.

### Medium

Compare the centralized and distributed models. If a project's central server suffered a
total disk failure with no backup, what could be recovered in each model, and why?

### Challenging

Git stores a full snapshot at every commit, yet changing one line in a huge project does
**not** duplicate every file on disk. Explain how "snapshots" plus **content-addressing**
(naming each file by a hash of its contents) make this efficient. What has to be true for
two files to share stored content?

# Further Reading

- Pro Git, Chapter 1 — *Getting Started*: [About Version Control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control), [A Short History of Git](https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git), and [What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F)
- [git-scm.com](https://git-scm.com/) — the official Git website and downloads
- GitHub Docs — [About Git](https://docs.github.com/en/get-started/using-git/about-git) and [Getting started](https://docs.github.com/en/get-started)
