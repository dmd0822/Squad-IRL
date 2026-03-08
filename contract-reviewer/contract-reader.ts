// ─── Contract File Reader ────────────────────────────────────────────────────
// Reads a contract from the file system or accepts pasted text.
// Supports .txt and .md files. Validates existence and size before reading.

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md']);
const MAX_FILE_SIZE_BYTES = 512_000; // 500 KB — generous for text contracts

export interface ContractInput {
  source: 'file' | 'paste';
  filePath?: string;
  content: string;
  wordCount: number;
}

/**
 * Read contract text from a file path. Validates extension and size.
 */
export async function readContractFile(filePath: string): Promise<ContractInput> {
  const resolved = resolve(filePath);

  if (!existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  const ext = extname(resolved).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new Error(
      `Unsupported file type "${ext}". Supported: ${[...SUPPORTED_EXTENSIONS].join(', ')}`
    );
  }

  const content = await readFile(resolved, 'utf-8');

  if (Buffer.byteLength(content, 'utf-8') > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / 1000} KB. Consider splitting into sections.`
    );
  }

  const trimmed = content.trim();
  if (trimmed.length === 0) {
    throw new Error('File is empty.');
  }

  return {
    source: 'file',
    filePath: resolved,
    content: trimmed,
    wordCount: trimmed.split(/\s+/).length,
  };
}

/**
 * Prompt the user to paste contract text via stdin.
 * Reads until a blank line is entered (double Enter).
 */
export async function readContractFromStdin(): Promise<ContractInput> {
  const rl = createInterface({ input: stdin, output: stdout });

  console.log();
  console.log('  Paste your contract text below.');
  console.log('  When finished, press Enter twice (empty line) to submit.');
  console.log();

  const lines: string[] = [];

  try {
    while (true) {
      const line = await rl.question('');
      if (line === '' && lines.length > 0) break;
      lines.push(line);
    }
  } finally {
    rl.close();
  }

  const content = lines.join('\n').trim();
  if (content.length === 0) {
    throw new Error('No contract text provided.');
  }

  return {
    source: 'paste',
    content,
    wordCount: content.split(/\s+/).length,
  };
}

/**
 * Format contract content into a prompt for the squad.
 */
export function formatContractForPrompt(input: ContractInput): string {
  const sourceNote = input.source === 'file'
    ? `Source: ${input.filePath}`
    : 'Source: pasted text';

  return `Please review the following contract in full. Coordinate all four specialists: extract key clauses, assess risk for each clause, suggest negotiation alternatives for high/medium risk items, and produce an executive summary with risk flags.

---
**Contract for Review** (${input.wordCount} words — ${sourceNote})

${input.content}
---

Provide a complete, structured analysis. Use 🔴 🟡 🟢 risk flags throughout.`;
}
