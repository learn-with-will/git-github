---
slug: version-control-models
title: "Version Control: Local, Centralized & Distributed"
topic: foundations
kind: concept
summary: "Understand how local, centralized, and distributed version control systems differ in architecture, availability, and collaboration."
tags: [fundamentals, dvcs, architecture]
related: [snapshots-vs-diffs, git-design-philosophy, git-vs-github]
---
> **In one line:** A distributed version control system gives every contributor a complete clone of the repository history, eliminating single points of failure.

## The idea

Before modern version control, developers copied directory trees manually or relied on simple local databases like RCS (Revision Control System) that recorded file patches on a single disk. Centralized version control systems (CVCS) such as Subversion (SVN) and Perforce introduced a central server where all versioned files lived. Developers checked out files from that central authority, meaning offline commits and local branch exploration were impossible. If the central server went down or experienced disk corruption without backups, developers lost the ability to collaborate or even view historical logs.

Distributed version control systems (DVCS) like Git changed this paradigm entirely. In a DVCS, clients do not simply check out the latest snapshot of the files; they fully mirror the repository, including its complete historical graph. Every clone functions as a full backup of the server data. If any server fails, any client repository can be copied back up to the server to restore it.

| Architecture | Representative Tool | Offline Capabilities | Single Point of Failure |
|---|---|---|---|
| **Local** | RCS, SCCS | Full (single user only) | Local disk failure loses history |
| **Centralized** | SVN, CVS, Perforce | Read-only cache; no offline commits | Central server downtime blocks all commits |
| **Distributed** | Git, Mercurial | Complete commit, branch, and log operations | None; every clone is a redundant backup |

## See it

You can clone an entire project repository from a remote host to create a complete local mirror:

```bash
# Clone the complete history of a repository
git clone https://github.com/example/project.git

# Inspect the full project log while completely offline
git log --oneline -n 5

# Inspect the configured remote connections
git remote -v
```

## Go deeper

Because all history lives on your local disk, almost every everyday Git operation executes in milliseconds without network latency. Git does not need to query a remote server to show you a diff from two years ago, compute branch divergence, or commit new changes. You commit locally and synchronize with remotes when you choose.

In centralized architectures, developers often delayed committing because a commit pushed unfinished changes to everyone. In a distributed workflow, you commit frequently to your local branch to track checkpoints without disturbing team members until you explicitly choose to push.

> **Tip:** In Git, a repository clone is not an export or a checkout of the latest files—it is an exact clone of the entire object database and history graph.

## Watch out

- Assuming you need internet connectivity or a remote server account to create repositories and commit changes.
- Treating Git like Subversion by attempting to check out single subdirectories without cloning repository history.

## Remember

- Centralized VCS relies on a single central server for all commits and historical queries.
- Distributed VCS gives every clone a complete mirror of all commits, trees, and refs.
- Git operations run locally and offline with near-instant speed and full fault tolerance.
