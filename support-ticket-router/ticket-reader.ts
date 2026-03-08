// ─── Ticket Reader — File System Integration ────────────────────────────────
// Reads support tickets from .txt and .md files in a given directory,
// or accepts a single ticket pasted as a string.

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

export interface SupportTicket {
  id: string;
  filename: string;
  content: string;
}

const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md']);

/**
 * Read all support ticket files from a directory.
 * Each .txt or .md file is treated as one ticket.
 */
export async function readTicketsFromDir(dirPath: string): Promise<SupportTicket[]> {
  const info = await stat(dirPath);
  if (!info.isDirectory()) {
    throw new Error(`Not a directory: ${dirPath}`);
  }

  const entries = await readdir(dirPath);
  const ticketFiles = entries
    .filter((f) => SUPPORTED_EXTENSIONS.has(extname(f).toLowerCase()))
    .sort();

  const tickets: SupportTicket[] = [];

  for (const file of ticketFiles) {
    const filePath = join(dirPath, file);
    const content = await readFile(filePath, 'utf-8');
    tickets.push({
      id: basename(file, extname(file)),
      filename: file,
      content: content.trim(),
    });
  }

  return tickets;
}

/**
 * Wrap a pasted ticket string as a single SupportTicket.
 */
export function wrapPastedTicket(text: string): SupportTicket[] {
  return [
    {
      id: 'pasted-ticket',
      filename: '(pasted)',
      content: text.trim(),
    },
  ];
}

/**
 * Format tickets into a prompt string for the squad.
 */
export function formatTicketsForPrompt(tickets: SupportTicket[]): string {
  const header = `I have ${tickets.length} support ticket(s) that need triage. Please classify each one, check for known patterns, draft responses, and produce a prioritized action queue.\n`;

  const body = tickets
    .map(
      (t, i) =>
        `--- Ticket ${i + 1}: ${t.filename} ---\n${t.content}\n--- End Ticket ${i + 1} ---`,
    )
    .join('\n\n');

  return `${header}\n${body}`;
}
