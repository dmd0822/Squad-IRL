// ─── Project Scanner ─────────────────────────────────────────────────────────
// Read-only file-system scanner that collects project structure, key files,
// and configuration patterns for compliance analysis.

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProjectScan {
  rootPath: string;
  fileTree: string[];
  totalFiles: number;
  totalDirs: number;
  keyFiles: KeyFileContent[];
  hasGitignore: boolean;
  hasEnvFile: boolean;
  envInGitignore: boolean;
  hasLicense: boolean;
  licenseSnippet: string | null;
  hasReadme: boolean;
  hasContributing: boolean;
  hasChangelog: boolean;
  packageManager: 'npm' | 'pip' | 'cargo' | 'go' | 'unknown';
  dependencies: string | null;
}

export interface KeyFileContent {
  path: string;
  content: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════════

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.hg', '.svn', 'dist', 'build', 'out',
  '.next', '.nuxt', '__pycache__', '.tox', '.venv', 'venv',
  'target', 'vendor', '.gradle', '.idea', '.vscode',
  'coverage', '.nyc_output', '.cache',
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.zip', '.tar', '.gz', '.bz2', '.7z', '.rar',
  '.exe', '.dll', '.so', '.dylib', '.bin',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.mp3', '.mp4', '.avi', '.mov', '.wav',
  '.sqlite', '.db',
]);

const KEY_FILE_NAMES = new Set([
  'readme.md', 'readme.txt', 'readme',
  'license', 'license.md', 'license.txt', 'licence', 'licence.md',
  'contributing.md', 'contributing',
  'changelog.md', 'changelog', 'changes.md', 'history.md',
  'package.json', 'package-lock.json',
  'requirements.txt', 'setup.py', 'pyproject.toml',
  'cargo.toml', 'go.mod', 'go.sum',
  '.gitignore', '.env', '.env.example', '.env.sample',
  'docker-compose.yml', 'docker-compose.yaml', 'dockerfile',
  '.eslintrc.json', '.eslintrc.js', '.eslintrc.yml',
  'tsconfig.json', 'jest.config.ts', 'jest.config.js',
  'vitest.config.ts', 'vitest.config.js',
  '.prettierrc', '.prettierrc.json',
  'security.md', 'security.txt', '.security',
  'codeowners', '.github/codeowners',
]);

const CONFIG_GLOBS = [
  '.github/workflows',
  '.github/dependabot.yml',
  '.github/dependabot.yaml',
];

const MAX_LINES_PER_FILE = 100;
const MAX_TREE_ENTRIES = 500;

// ═══════════════════════════════════════════════════════════════════════════════
// Scanner
// ═══════════════════════════════════════════════════════════════════════════════

async function walkDir(
  dir: string,
  root: string,
  entries: string[],
  depth: number,
): Promise<{ files: number; dirs: number }> {
  if (depth > 8 || entries.length >= MAX_TREE_ENTRIES) {
    return { files: 0, dirs: 0 };
  }

  let files = 0;
  let dirs = 0;

  let items: string[];
  try {
    items = await readdir(dir);
  } catch {
    return { files: 0, dirs: 0 };
  }

  for (const item of items) {
    if (entries.length >= MAX_TREE_ENTRIES) break;

    const fullPath = join(dir, item);
    const relPath = fullPath.slice(root.length + 1).replace(/\\/g, '/');

    let info;
    try {
      info = await stat(fullPath);
    } catch {
      continue;
    }

    if (info.isDirectory()) {
      if (SKIP_DIRS.has(item) || item.startsWith('.') && item !== '.github') continue;
      entries.push(relPath + '/');
      dirs++;
      const sub = await walkDir(fullPath, root, entries, depth + 1);
      files += sub.files;
      dirs += sub.dirs;
    } else {
      entries.push(relPath);
      files++;
    }
  }

  return { files, dirs };
}

async function readHead(filePath: string, maxLines: number): Promise<string> {
  try {
    const raw = await readFile(filePath, 'utf-8');
    const lines = raw.split('\n');
    const truncated = lines.length > maxLines;
    const content = lines.slice(0, maxLines).join('\n');
    return truncated ? content + `\n... (truncated at ${maxLines} lines)` : content;
  } catch {
    return '(unable to read)';
  }
}

function isKeyFile(relPath: string): boolean {
  const lower = relPath.toLowerCase();
  const name = basename(lower);
  if (KEY_FILE_NAMES.has(name)) return true;
  if (lower.startsWith('.github/workflows/') && (lower.endsWith('.yml') || lower.endsWith('.yaml'))) return true;
  for (const g of CONFIG_GLOBS) {
    if (lower === g) return true;
  }
  return false;
}

function isBinary(relPath: string): boolean {
  return BINARY_EXTENSIONS.has(extname(relPath).toLowerCase());
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════════════════════

export async function scanProject(rootPath: string): Promise<ProjectScan> {
  const fileTree: string[] = [];
  const { files: totalFiles, dirs: totalDirs } = await walkDir(rootPath, rootPath, fileTree, 0);

  // Collect key file contents
  const keyFiles: KeyFileContent[] = [];
  for (const relPath of fileTree) {
    if (relPath.endsWith('/')) continue;
    if (isBinary(relPath)) continue;
    if (isKeyFile(relPath)) {
      const content = await readHead(join(rootPath, relPath), MAX_LINES_PER_FILE);
      keyFiles.push({ path: relPath, content });
    }
  }

  // Detect specific files
  const lowerTree = new Set(fileTree.map(f => f.toLowerCase()));
  const hasGitignore = lowerTree.has('.gitignore');
  const hasEnvFile = fileTree.some(f => {
    const name = basename(f).toLowerCase();
    return name === '.env' || name.startsWith('.env.');
  });

  let envInGitignore = false;
  if (hasGitignore) {
    try {
      const gi = await readFile(join(rootPath, '.gitignore'), 'utf-8');
      envInGitignore = /^\.env$/m.test(gi) || /^\.env\b/m.test(gi);
    } catch { /* ignore */ }
  }

  const hasLicense = fileTree.some(f => /^licen[sc]e/i.test(basename(f)));
  let licenseSnippet: string | null = null;
  if (hasLicense) {
    const licFile = fileTree.find(f => /^licen[sc]e/i.test(basename(f)));
    if (licFile) {
      licenseSnippet = await readHead(join(rootPath, licFile), 20);
    }
  }

  const hasReadme = fileTree.some(f => /^readme/i.test(basename(f)));
  const hasContributing = fileTree.some(f => /^contributing/i.test(basename(f)));
  const hasChangelog = fileTree.some(f => /^(changelog|changes|history)/i.test(basename(f)));

  // Detect package manager
  let packageManager: ProjectScan['packageManager'] = 'unknown';
  let dependencies: string | null = null;

  if (lowerTree.has('package.json')) {
    packageManager = 'npm';
    dependencies = keyFiles.find(f => f.path.toLowerCase() === 'package.json')?.content ?? null;
  } else if (lowerTree.has('requirements.txt')) {
    packageManager = 'pip';
    dependencies = keyFiles.find(f => f.path.toLowerCase() === 'requirements.txt')?.content ?? null;
  } else if (lowerTree.has('cargo.toml')) {
    packageManager = 'cargo';
    dependencies = keyFiles.find(f => f.path.toLowerCase() === 'cargo.toml')?.content ?? null;
  } else if (lowerTree.has('go.mod')) {
    packageManager = 'go';
    dependencies = keyFiles.find(f => f.path.toLowerCase() === 'go.mod')?.content ?? null;
  }

  return {
    rootPath,
    fileTree,
    totalFiles,
    totalDirs,
    keyFiles,
    hasGitignore,
    hasEnvFile,
    envInGitignore,
    hasLicense,
    licenseSnippet,
    hasReadme,
    hasContributing,
    hasChangelog,
    packageManager,
    dependencies,
  };
}

export function formatScanForPrompt(scan: ProjectScan): string {
  const sections: string[] = [];

  sections.push(`# Project Compliance Scan: ${scan.rootPath}`);
  sections.push(`\n## Project Structure (${scan.totalFiles} files, ${scan.totalDirs} directories)\n`);

  const treePreview = scan.fileTree.slice(0, 80);
  sections.push('```');
  sections.push(treePreview.join('\n'));
  if (scan.fileTree.length > 80) {
    sections.push(`... and ${scan.fileTree.length - 80} more entries`);
  }
  sections.push('```');

  sections.push('\n## Quick Facts\n');
  sections.push(`- **Package manager:** ${scan.packageManager}`);
  sections.push(`- **.gitignore present:** ${scan.hasGitignore ? 'Yes' : '❌ No'}`);
  sections.push(`- **.env file found:** ${scan.hasEnvFile ? 'Yes' : 'No'}`);
  sections.push(`- **.env in .gitignore:** ${scan.envInGitignore ? '✅ Yes' : (scan.hasEnvFile ? '⚠️ No — potential secret leak' : 'N/A')}`);
  sections.push(`- **LICENSE present:** ${scan.hasLicense ? 'Yes' : '❌ No'}`);
  sections.push(`- **README present:** ${scan.hasReadme ? 'Yes' : '❌ No'}`);
  sections.push(`- **CONTRIBUTING guide:** ${scan.hasContributing ? 'Yes' : 'No'}`);
  sections.push(`- **CHANGELOG:** ${scan.hasChangelog ? 'Yes' : 'No'}`);

  if (scan.licenseSnippet) {
    sections.push('\n## License (first 20 lines)\n');
    sections.push('```');
    sections.push(scan.licenseSnippet);
    sections.push('```');
  }

  sections.push('\n## Key File Contents\n');
  for (const kf of scan.keyFiles) {
    sections.push(`### ${kf.path}\n`);
    sections.push('```');
    sections.push(kf.content);
    sections.push('```\n');
  }

  return sections.join('\n');
}
