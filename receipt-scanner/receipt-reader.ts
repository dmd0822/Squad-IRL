// ─── Receipt Reader — File System Scanner ───────────────────────────────────
// Reads receipt files from a folder and formats them for Squad analysis.
// Read-only: never modifies receipt files.

import { readdir, readFile, stat, access } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';

const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md', '.csv']);

export interface ReceiptFile {
  filename: string;
  content: string;
}

/**
 * Validate that a folder path exists and is a directory.
 * Returns the resolved absolute path or throws with a clear message.
 */
export async function validateFolder(folderPath: string): Promise<string> {
  const resolved = resolve(folderPath);

  try {
    await access(resolved);
  } catch {
    throw new Error(`Folder not found: ${resolved}`);
  }

  const info = await stat(resolved);
  if (!info.isDirectory()) {
    throw new Error(`Not a directory: ${resolved}`);
  }

  return resolved;
}

/**
 * Scan a folder for receipt files (.txt, .md, .csv).
 * Returns file contents sorted by filename for deterministic output.
 */
export async function scanReceipts(folderPath: string): Promise<ReceiptFile[]> {
  const resolved = await validateFolder(folderPath);
  const entries = await readdir(resolved);

  const receiptFiles: ReceiptFile[] = [];

  for (const entry of entries.sort()) {
    const ext = extname(entry).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

    const fullPath = join(resolved, entry);
    const info = await stat(fullPath);
    if (!info.isFile()) continue;

    const content = await readFile(fullPath, 'utf-8');
    if (content.trim().length === 0) continue;

    receiptFiles.push({ filename: entry, content: content.trim() });
  }

  return receiptFiles;
}

/**
 * Format scanned receipts into a prompt for the Squad.
 */
export function formatReceiptsForPrompt(receipts: ReceiptFile[]): string {
  const header = `I have ${receipts.length} receipt(s) to analyze. Please process all of them through the full squad pipeline: parse the data, categorize expenses, detect anomalies, and build a summary report.\n`;

  const formatted = receipts.map((r, i) => {
    return `--- Receipt ${i + 1}: ${r.filename} ---\n${r.content}`;
  }).join('\n\n');

  return `${header}\n${formatted}`;
}
