---
slug: the-commit-dag
title: "The Directed Acyclic Graph (DAG)"
topic: internals
kind: concept
summary: "Understand Git history as a Directed Acyclic Graph (DAG) where commits have directed parent links that cannot cycle."
tags: [dag, graph-theory, internals]
related: [the-four-object-types, three-way-merges, rebase-fundamentals]
---
> **In one line:** Git history is a Directed Acyclic Graph (DAG) of immutable commits with parent pointers pointing backward in time.

## The idea

Computer scientists describe Git's historical model as a **Directed Acyclic Graph (DAG)**. While this sounds academic, understanding the graph makes every Git operation completely intuitive.

Breaking down the term:
- **Graph:** A network of nodes (commits) connected by edges (parent references).
- **Directed:** The connections have a direction. Crucially, in Git, **edges point backwards in time**: a commit points to its parent commit(s). A commit does not know who its children will be in the future.
- **Acyclic:** There are no loops or cycles. A commit can never point to itself or to one of its own descendants.

Because each commit's hash includes its parent's hash, altering a past commit changes its hash, which changes every downstream descendant's hash. This mathematical property guarantees that history is an immutable, acyclic web of parent pointers.

| Graph Node Type | Inbound Edges (Children) | Outbound Edges (Parents) |
|---|---|---|
| **Root Commit** | 1 or more child commits | 0 parents (the beginning of history) |
| **Normal Commit** | 0, 1, or more child commits | Exactly 1 parent commit |
| **Merge Commit** | 0, 1, or more child commits | 2 or more parent commits |
| **Branch Tip** | 0 children currently | 1 parent (moves forward as you commit) |

## See it

Inspect the DAG structure in your terminal:

```bash
# View the commit graph topology with branch and tag labels
git log --graph --oneline --decorate --all -n 8

# Check the parent pointer(s) of any commit object
git cat-file -p HEAD | grep parent

# Find the merge-base (common ancestor) between two nodes in the DAG
git merge-base main feature-branch
```

## Go deeper

Every Git command is simply an operation on this graph:
- **`git commit`:** Adds a new node pointing back to the current node, then slides the branch pointer to the new node.
- **`git branch`:** Adds a new named pointer to an existing node.
- **`git merge`:** Creates a new node pointing back to two parent nodes.
- **`git rebase`:** Copies a chain of nodes, creating duplicate nodes pointing to a different base node.

> **Tip:** When you delete a branch, you do not delete nodes from the DAG; you simply delete the pointer label. Unreferenced nodes are eventually cleared by garbage collection.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Thinking Git commits point forward to their children; commits point backward to their parents.
- Worrying about creating circular references; Git's content hashing mathematically prevents cycles.

## Remember

- Git history is a Directed Acyclic Graph (DAG) with parent pointers pointing backward in time.
- Every commit hash incorporates its parent hashes, guaranteeing cryptographic immutability.
- Branch and tag names are simply movable pointer labels attached to nodes in the DAG.
