// ─── Inventory CSV Reader ────────────────────────────────────────────────────
// Reads and parses a CSV or text file of inventory data.
// Read-only — never modifies the source file.

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

export interface InventoryItem {
  product: string;
  sku: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  lastRestock: string;
  dailyUsage: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Parse
// ═══════════════════════════════════════════════════════════════════════════════

const EXPECTED_HEADERS = ['product', 'sku', 'quantity', 'unit_cost', 'supplier', 'last_restock', 'daily_usage'];

function parseLine(line: string): string[] {
  return line.split(',').map(cell => cell.trim());
}

function validateHeaders(headers: string[]): void {
  const normalised = headers.map(h => h.toLowerCase().replace(/\s+/g, '_'));
  const missing = EXPECTED_HEADERS.filter(h => !normalised.includes(h));
  if (missing.length > 0) {
    throw new Error(`CSV is missing required columns: ${missing.join(', ')}`);
  }
}

function parseRow(cells: string[], headerMap: Map<string, number>, lineNumber: number): InventoryItem {
  const get = (col: string): string => {
    const idx = headerMap.get(col);
    if (idx === undefined) throw new Error(`Missing column "${col}" at line ${lineNumber}`);
    return cells[idx] ?? '';
  };

  const quantity = Number(get('quantity'));
  const unitCost = Number(get('unit_cost'));
  const dailyUsage = Number(get('daily_usage'));

  if (Number.isNaN(quantity)) throw new Error(`Invalid quantity at line ${lineNumber}`);
  if (Number.isNaN(unitCost)) throw new Error(`Invalid unit_cost at line ${lineNumber}`);
  if (Number.isNaN(dailyUsage)) throw new Error(`Invalid daily_usage at line ${lineNumber}`);

  return {
    product: get('product'),
    sku: get('sku'),
    quantity,
    unitCost,
    supplier: get('supplier'),
    lastRestock: get('last_restock'),
    dailyUsage,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════════════════════

export async function readInventoryFile(filePath: string): Promise<InventoryItem[]> {
  const absPath = resolve(filePath);
  const raw = await readFile(absPath, 'utf-8');

  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#'));

  if (lines.length < 2) {
    throw new Error('CSV file must contain a header row and at least one data row.');
  }

  const headerLine = lines[0]!;
  const headers = parseLine(headerLine).map(h => h.toLowerCase().replace(/\s+/g, '_'));
  validateHeaders(headers);

  const headerMap = new Map<string, number>();
  headers.forEach((h, i) => headerMap.set(h, i));

  const items: InventoryItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]!);
    items.push(parseRow(cells, headerMap, i + 1));
  }

  return items;
}

export function formatInventoryForPrompt(items: InventoryItem[]): string {
  const header = [
    'Product'.padEnd(24),
    'SKU'.padEnd(10),
    'Qty'.padStart(7),
    'Cost'.padStart(9),
    'Supplier'.padEnd(18),
    'Last Restock'.padEnd(14),
    'Daily Use'.padStart(10),
  ].join(' ');

  const divider = '-'.repeat(header.length);

  const rows = items.map(item => [
    item.product.padEnd(24),
    item.sku.padEnd(10),
    String(item.quantity).padStart(7),
    `$${item.unitCost.toFixed(2)}`.padStart(9),
    item.supplier.padEnd(18),
    item.lastRestock.padEnd(14),
    String(item.dailyUsage).padStart(10),
  ].join(' '));

  return [
    `Inventory snapshot — ${items.length} products:`,
    '',
    header,
    divider,
    ...rows,
  ].join('\n');
}
