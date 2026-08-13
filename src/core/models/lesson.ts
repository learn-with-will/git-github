export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

/** A single entry in course-manifest.json. */
export interface LessonMeta {
  id: string;
  slug: string;
  title: string;
  level: LessonLevel;
  order: number;
  /** Estimated reading time in minutes. */
  duration: number;
  /** Path to the markdown file, relative to /content. */
  file: string;
  /** Optional short description shown on cards. */
  summary?: string;
  tags?: string[];
}

/** A heading extracted from lesson markdown, used to build the table of contents. */
export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/** A fully loaded lesson: metadata plus rendered-ready markdown body. */
export interface Lesson {
  meta: LessonMeta;
  /** Raw markdown with front-matter stripped. */
  content: string;
  toc: TocEntry[];
}

export const LEVELS: LessonLevel[] = ['beginner', 'intermediate', 'advanced'];

export const LEVEL_LABELS: Record<LessonLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const LEVEL_BLURBS: Record<LessonLevel, string> = {
  beginner:
    'The Git fundamentals — version control basics, installing and configuring Git, the staging area and your first commit, viewing and ignoring history, undoing changes, branching, merging, and working with remotes.',
  intermediate:
    'GitHub and collaboration — repositories and authentication, the GitHub flow with pull requests, forking and contributing, merge vs squash vs rebase, interactive rebasing, resolving conflicts, issues and projects, and tags and releases.',
  advanced:
    'Power tools and automation — stashing, cherry-picking and the reflog, rewriting history safely, bisect and blame, submodules and Git LFS, Git internals, GitHub Actions CI, branch protection and hooks, and team workflows.',
};

/** Badge utility class per level; defined in index.css. */
export const LEVEL_BADGES: Record<LessonLevel, string> = {
  beginner: 'badge-beginner',
  intermediate: 'badge-intermediate',
  advanced: 'badge-advanced',
};

/** Gradient stops for each level's accent bar — a distinct hue per difficulty. */
export const LEVEL_ACCENTS: Record<LessonLevel, string> = {
  beginner: 'from-emerald-400 to-teal-500',
  intermediate: 'from-amber-400 to-orange-500',
  advanced: 'from-violet-400 to-purple-600',
};
