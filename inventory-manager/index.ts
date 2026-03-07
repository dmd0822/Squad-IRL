// Inventory Manager — 6 AI agents managing e-commerce inventory
// Stock monitoring, demand forecasting, EOQ optimization, supplier ranking, cost analysis, health reporting

// ── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const fmt = (n: number) => "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const fmtInt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const pct = (n: number, d = 0) => (n * 100).toFixed(d) + "%";
const padRight = (s: string, len: number) => s + " ".repeat(Math.max(0, len - s.length));
const padLeft = (s: string, len: number) => " ".repeat(Math.max(0, len - s.length)) + s;

function gauge(current: number, max: number, width = 20): string {
  const ratio = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(ratio * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function sparkline(data: number[]): string {
  const chars = "▁▂▃▄▅▆▇█";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data.map(v => chars[Math.min(chars.length - 1, Math.floor(((v - min) / range) * (chars.length - 1)))]).join("");
}

// ANSI colors
const R = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const MAGENTA = "\x1b[35m";
const WHITE = "\x1b[37m";
const BG_GREEN = "\x1b[42m";
const BG_YELLOW = "\x1b[43m";
const BG_RED = "\x1b[41m";

// Seeded PRNG for deterministic output
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);

// ── Data Model ───────────────────────────────────────────────────────────────

interface SKU {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  sellingPrice: number;
  leadTimeDays: number;
}

interface SalesHistory {
  skuId: string;
  dailySales: number[]; // 90 days
}

interface Supplier {
  name: string;
  costPerUnit: number;
  reliabilityPct: number;
  leadTimeDays: number;
  minOrderQty: number;
}

interface Forecast {
  skuId: string;
  predictedDaily: number[];
  trend: "rising" | "falling" | "stable";
  confidence: number;
}

interface EOQResult {
  skuId: string;
  eoq: number;
  annualDemand: number;
  orderingCost: number;
  carryingCostPct: number;
  reorderPoint: number;
  safetyStock: number;
}

interface SupplierRank {
  supplier: Supplier;
  score: number;
  costScore: number;
  reliabilityScore: number;
  leadTimeScore: number;
}

// ── SKU Data ─────────────────────────────────────────────────────────────────

const skus: SKU[] = [
  // Electronics
  { id: "SKU-001", name: "Wireless Earbuds",   category: "Electronics",    currentStock: 45,  maxStock: 200, reorderPoint: 50,  unitCost: 12,   sellingPrice: 29.99, leadTimeDays: 7 },
  { id: "SKU-002", name: "USB-C Hub",          category: "Electronics",    currentStock: 120, maxStock: 300, reorderPoint: 60,  unitCost: 8,    sellingPrice: 24.99, leadTimeDays: 5 },
  { id: "SKU-003", name: "Phone Case",         category: "Electronics",    currentStock: 15,  maxStock: 500, reorderPoint: 100, unitCost: 2,    sellingPrice: 14.99, leadTimeDays: 10 },
  { id: "SKU-004", name: "Bluetooth Speaker",  category: "Electronics",    currentStock: 80,  maxStock: 150, reorderPoint: 30,  unitCost: 18,   sellingPrice: 49.99, leadTimeDays: 8 },
  { id: "SKU-005", name: "Screen Protector",   category: "Electronics",    currentStock: 350, maxStock: 600, reorderPoint: 100, unitCost: 0.50, sellingPrice: 9.99,  leadTimeDays: 4 },
  // Clothing
  { id: "SKU-006", name: "Cotton T-Shirt",     category: "Clothing",       currentStock: 200, maxStock: 400, reorderPoint: 80,  unitCost: 4,    sellingPrice: 19.99, leadTimeDays: 14 },
  { id: "SKU-007", name: "Running Shorts",     category: "Clothing",       currentStock: 65,  maxStock: 200, reorderPoint: 40,  unitCost: 6,    sellingPrice: 29.99, leadTimeDays: 12 },
  { id: "SKU-008", name: "Winter Beanie",      category: "Clothing",       currentStock: 180, maxStock: 250, reorderPoint: 50,  unitCost: 3,    sellingPrice: 16.99, leadTimeDays: 10 },
  { id: "SKU-009", name: "Yoga Pants",         category: "Clothing",       currentStock: 30,  maxStock: 300, reorderPoint: 60,  unitCost: 8,    sellingPrice: 39.99, leadTimeDays: 14 },
  { id: "SKU-010", name: "Denim Jacket",       category: "Clothing",       currentStock: 25,  maxStock: 100, reorderPoint: 20,  unitCost: 22,   sellingPrice: 69.99, leadTimeDays: 18 },
  // Home & Kitchen
  { id: "SKU-011", name: "Coffee Mug",         category: "Home & Kitchen", currentStock: 400, maxStock: 800, reorderPoint: 150, unitCost: 1.50, sellingPrice: 12.99, leadTimeDays: 6 },
  { id: "SKU-012", name: "Cutting Board",      category: "Home & Kitchen", currentStock: 55,  maxStock: 150, reorderPoint: 30,  unitCost: 5,    sellingPrice: 22.99, leadTimeDays: 8 },
  { id: "SKU-013", name: "Kitchen Scale",      category: "Home & Kitchen", currentStock: 8,   maxStock: 100, reorderPoint: 20,  unitCost: 7,    sellingPrice: 29.99, leadTimeDays: 10 },
  { id: "SKU-014", name: "Dish Towels (set)",  category: "Home & Kitchen", currentStock: 90,  maxStock: 200, reorderPoint: 40,  unitCost: 2,    sellingPrice: 11.99, leadTimeDays: 5 },
  { id: "SKU-015", name: "Spice Rack",         category: "Home & Kitchen", currentStock: 42,  maxStock: 120, reorderPoint: 25,  unitCost: 9,    sellingPrice: 34.99, leadTimeDays: 12 },
  // Sports
  { id: "SKU-016", name: "Yoga Mat",           category: "Sports",         currentStock: 70,  maxStock: 200, reorderPoint: 40,  unitCost: 6,    sellingPrice: 24.99, leadTimeDays: 7 },
  { id: "SKU-017", name: "Resistance Bands",   category: "Sports",         currentStock: 150, maxStock: 400, reorderPoint: 80,  unitCost: 1.50, sellingPrice: 14.99, leadTimeDays: 5 },
  { id: "SKU-018", name: "Water Bottle",       category: "Sports",         currentStock: 220, maxStock: 500, reorderPoint: 100, unitCost: 3,    sellingPrice: 18.99, leadTimeDays: 4 },
  { id: "SKU-019", name: "Jump Rope",          category: "Sports",         currentStock: 95,  maxStock: 200, reorderPoint: 30,  unitCost: 2,    sellingPrice: 12.99, leadTimeDays: 6 },
  { id: "SKU-020", name: "Foam Roller",        category: "Sports",         currentStock: 12,  maxStock: 80,  reorderPoint: 15,  unitCost: 8,    sellingPrice: 29.99, leadTimeDays: 9 },
  // Books
  { id: "SKU-021", name: "TypeScript Handbook", category: "Books",         currentStock: 60,  maxStock: 150, reorderPoint: 30,  unitCost: 5,    sellingPrice: 34.99, leadTimeDays: 3 },
  { id: "SKU-022", name: "Node.js Guide",       category: "Books",         currentStock: 45,  maxStock: 120, reorderPoint: 25,  unitCost: 5,    sellingPrice: 32.99, leadTimeDays: 3 },
  { id: "SKU-023", name: "Design Patterns",     category: "Books",         currentStock: 30,  maxStock: 100, reorderPoint: 20,  unitCost: 6,    sellingPrice: 39.99, leadTimeDays: 4 },
  { id: "SKU-024", name: "Clean Code",          category: "Books",         currentStock: 80,  maxStock: 200, reorderPoint: 40,  unitCost: 4,    sellingPrice: 29.99, leadTimeDays: 3 },
  { id: "SKU-025", name: "AI Fundamentals",     category: "Books",         currentStock: 10,  maxStock: 100, reorderPoint: 25,  unitCost: 7,    sellingPrice: 44.99, leadTimeDays: 5 },
];

// Base daily demand by SKU index (rough units/day)
const baseDemand = [
  4.2, 3.5, 8.1, 2.8, 12.0,    // Electronics
  5.0, 3.2, 2.5, 4.5, 1.2,     // Clothing
  7.0, 2.0, 1.8, 3.5, 1.5,     // Home & Kitchen
  3.0, 5.5, 6.0, 2.5, 1.0,     // Sports
  2.0, 1.8, 1.5, 3.0, 2.2,     // Books
];

function generateSalesHistory(): SalesHistory[] {
  return skus.map((sku, idx) => {
    const base = baseDemand[idx];
    const dailySales: number[] = [];
    for (let day = 0; day < 90; day++) {
      let seasonal = 1.0;
      // Electronics: slight uptrend
      if (sku.category === "Electronics") seasonal = 1.0 + (day / 90) * 0.15;
      // Books: summer dip in middle
      if (sku.category === "Books") seasonal = 1.0 - 0.2 * Math.sin((day / 90) * Math.PI);
      // Clothing: stable with slight variation
      if (sku.category === "Clothing") seasonal = 1.0 + 0.05 * Math.sin((day / 45) * Math.PI);
      const noise = 1.0 + (rand() - 0.5) * 0.6; // ±30%
      dailySales.push(Math.max(0, Math.round(base * seasonal * noise)));
    }
    return { skuId: sku.id, dailySales };
  });
}

function generateSuppliers(): Map<string, Supplier[]> {
  const supplierMap = new Map<string, Supplier[]>();
  const namePoolA = ["ValueParts Inc", "BudgetSource Co", "EconoSupply Ltd", "BulkDeal Corp", "SaveMore Inc"];
  const namePoolB = ["MidRange Supply", "BalanceTrade Co", "SteadyShip Inc", "CoreStock Ltd", "ReliaParts Co"];
  const namePoolC = ["QuickShip Co", "PrimeSource Ltd", "ExpressGoods Inc", "RapidFill Corp", "EliteParts Co"];

  skus.forEach((sku, idx) => {
    const baseCost = sku.unitCost;
    const nameIdx = idx % 5;
    const suppliers: Supplier[] = [
      // Supplier A: cheapest, longest lead, lower reliability
      {
        name: namePoolA[nameIdx],
        costPerUnit: +(baseCost * (0.85 + rand() * 0.10)).toFixed(2),
        reliabilityPct: Math.round(85 + rand() * 7),
        leadTimeDays: sku.leadTimeDays + Math.round(3 + rand() * 4),
        minOrderQty: Math.max(10, Math.round(sku.maxStock * 0.05)),
      },
      // Supplier B: moderate price, moderate lead, good reliability
      {
        name: namePoolB[nameIdx],
        costPerUnit: +(baseCost * (0.95 + rand() * 0.10)).toFixed(2),
        reliabilityPct: Math.round(90 + rand() * 6),
        leadTimeDays: sku.leadTimeDays + Math.round(1 + rand() * 2),
        minOrderQty: Math.max(5, Math.round(sku.maxStock * 0.03)),
      },
      // Supplier C: most expensive, fastest, highest reliability
      {
        name: namePoolC[nameIdx],
        costPerUnit: +(baseCost * (1.10 + rand() * 0.15)).toFixed(2),
        reliabilityPct: Math.round(95 + rand() * 4),
        leadTimeDays: Math.max(1, sku.leadTimeDays - Math.round(1 + rand() * 2)),
        minOrderQty: Math.max(1, Math.round(sku.maxStock * 0.01)),
      },
    ];
    supplierMap.set(sku.id, suppliers);
  });
  return supplierMap;
}

const salesHistory = generateSalesHistory();
const supplierData = generateSuppliers();

// ── Utility functions for analysis ───────────────────────────────────────────

function movingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

function stdDev(data: number[]): number {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((sum, v) => sum + (v - mean) ** 2, 0) / data.length;
  return Math.sqrt(variance);
}

function sum(data: number[]): number {
  return data.reduce((a, b) => a + b, 0);
}

function mean(data: number[]): number {
  return data.length === 0 ? 0 : sum(data) / data.length;
}

// ── Agent 1: Stock Monitor ───────────────────────────────────────────────────

async function agentStockMonitor() {
  console.log(`\n${BOLD}${CYAN}━━━ AGENT 1: STOCK MONITOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${R}`);
  console.log(`${DIM}  Scanning inventory levels across all warehouses...${R}\n`);
  await sleep(300);

  const categories = ["Electronics", "Clothing", "Home & Kitchen", "Sports", "Books"];
  let okCount = 0, belowCount = 0, criticalCount = 0;
  const urgentItems: { sku: SKU; ratio: number; status: string }[] = [];

  for (const cat of categories) {
    const catSkus = skus.filter(s => s.category === cat);
    const border = "─".repeat(72);
    console.log(`  ${BOLD}┌─ ${cat.toUpperCase()} ${border.slice(0, 68 - cat.length)}┐${R}`);

    for (const sku of catSkus) {
      const ratio = sku.currentStock / sku.maxStock;
      const g = gauge(sku.currentStock, sku.maxStock);
      const stockStr = padLeft(`${sku.currentStock}/${sku.maxStock}`, 9);
      const pctStr = padLeft(`(${Math.round(ratio * 100)}%)`, 6);

      let status: string;
      if (ratio < 0.10) {
        status = `${RED}🔴 CRITICAL${R}`;
        criticalCount++;
        urgentItems.push({ sku, ratio, status: "CRITICAL" });
      } else if (sku.currentStock <= sku.reorderPoint) {
        status = `${YELLOW}⚠️  BELOW RP${R}`;
        belowCount++;
        urgentItems.push({ sku, ratio, status: "BELOW RP" });
      } else {
        status = `${GREEN}✓ OK${R}`;
        okCount++;
      }

      console.log(`  │ ${padRight(sku.name, 20)} ${g}  ${stockStr} ${pctStr}  ${status}  │`);
    }
    console.log(`  ${BOLD}└${border}┘${R}`);
    await sleep(200);
  }

  console.log(`\n  ${BOLD}Summary:${R} ${GREEN}${okCount} OK${R}  │  ${YELLOW}${belowCount} Below Reorder${R}  │  ${RED}${criticalCount} Critical${R}`);

  urgentItems.sort((a, b) => a.ratio - b.ratio);
  console.log(`\n  ${BOLD}Top ${Math.min(5, urgentItems.length)} Most Urgent Reorders:${R}`);
  for (let i = 0; i < Math.min(5, urgentItems.length); i++) {
    const u = urgentItems[i];
    const icon = u.status === "CRITICAL" ? "🔴" : "⚠️";
    console.log(`  ${i + 1}. ${icon} ${padRight(u.sku.name, 22)} ${u.sku.currentStock} units left (${Math.round(u.ratio * 100)}% capacity) — ${u.sku.category}`);
  }

  // Value at risk table
  console.log(`\n  ${BOLD}Inventory Value at Risk:${R}`);
  console.log(`  ${"─".repeat(65)}`);
  console.log(`  ${padRight("Item", 22)} ${padLeft("Stock", 7)} ${padLeft("Unit Cost", 10)} ${padLeft("Value", 10)} ${padLeft("Risk Level", 12)}`);
  console.log(`  ${"─".repeat(65)}`);
  let totalAtRisk = 0;
  for (const u of urgentItems) {
    const val = u.sku.currentStock * u.sku.unitCost;
    totalAtRisk += val;
    const riskColor = u.status === "CRITICAL" ? RED : YELLOW;
    console.log(`  ${padRight(u.sku.name, 22)} ${padLeft(String(u.sku.currentStock), 7)} ${padLeft(fmt(u.sku.unitCost), 10)} ${padLeft(fmt(val), 10)} ${riskColor}${padLeft(u.status, 12)}${R}`);
  }
  console.log(`  ${"─".repeat(65)}`);
  console.log(`  ${padRight("Total at-risk value:", 22)} ${" ".repeat(17)} ${BOLD}${padLeft(fmt(totalAtRisk), 10)}${R}`);

  // Category utilization summary
  console.log(`\n  ${BOLD}Category Utilization:${R}`);
  for (const cat of categories) {
    const catSkus = skus.filter(s => s.category === cat);
    const totalCap = catSkus.reduce((s, sk) => s + sk.maxStock, 0);
    const totalCur = catSkus.reduce((s, sk) => s + sk.currentStock, 0);
    const util = totalCur / totalCap;
    const color = util < 0.3 ? RED : util < 0.5 ? YELLOW : GREEN;
    console.log(`  ${padRight(cat, 16)} ${gauge(totalCur, totalCap, 25)}  ${color}${(util * 100).toFixed(0)}%${R}  (${fmtInt(totalCur)}/${fmtInt(totalCap)})`);
  }
}

// ── Agent 2: Demand Forecaster ───────────────────────────────────────────────

function buildForecasts(): Forecast[] {
  const forecasts: Forecast[] = [];
  for (let idx = 0; idx < skus.length; idx++) {
    const sku = skus[idx];
    const history = salesHistory[idx].dailySales;
    const last30 = history.slice(60);
    const ma7 = movingAverage(history, 7);
    const recentAvg = mean(ma7.slice(-7));
    const olderAvg = mean(ma7.slice(-30, -7));
    const trendRatio = olderAvg === 0 ? 1 : recentAvg / olderAvg;

    let trend: "rising" | "falling" | "stable";
    if (trendRatio > 1.08) trend = "rising";
    else if (trendRatio < 0.92) trend = "falling";
    else trend = "stable";

    // Seasonal adjustment based on category
    let seasonalMult = 1.0;
    if (sku.category === "Electronics") seasonalMult = 1.05;
    if (sku.category === "Books") seasonalMult = 0.92;

    const predictedDaily: number[] = [];
    for (let d = 0; d < 30; d++) {
      const trendAdjust = trend === "rising" ? 1 + (d / 30) * 0.05 : trend === "falling" ? 1 - (d / 30) * 0.03 : 1.0;
      const noise = 1 + (rand() - 0.5) * 0.2;
      predictedDaily.push(Math.max(0, Math.round(recentAvg * seasonalMult * trendAdjust * noise)));
    }

    const confidence = 0.7 + 0.2 * (1 - stdDev(last30) / (mean(last30) || 1));
    forecasts.push({ skuId: sku.id, predictedDaily, trend, confidence: Math.min(0.95, Math.max(0.5, confidence)) });
  }
  return forecasts;
}

async function agentDemandForecaster(forecasts: Forecast[]) {
  console.log(`\n${BOLD}${CYAN}━━━ AGENT 2: DEMAND FORECASTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${R}`);
  console.log(`${DIM}  Analyzing 90-day sales history and projecting demand...${R}\n`);
  await sleep(300);

  // Rank by total sales volume
  const ranked = skus.map((sku, idx) => ({
    sku,
    idx,
    totalSales: sum(salesHistory[idx].dailySales),
  })).sort((a, b) => b.totalSales - a.totalSales);

  const top10 = ranked.slice(0, 10);

  console.log(`  ${BOLD}${padRight("Product", 22)} Last 30d Sales         Avg/Day   30d Forecast   Trend    Stockout${R}`);
  console.log(`  ${"─".repeat(95)}`);

  for (const item of top10) {
    const history = salesHistory[item.idx].dailySales;
    const last30 = history.slice(60);
    const spark = sparkline(last30);
    const avgDaily = mean(last30);
    const forecast = forecasts.find(f => f.skuId === item.sku.id)!;
    const forecastTotal = sum(forecast.predictedDaily);
    const trendIcon = forecast.trend === "rising" ? `${GREEN}↑ Rising${R}` : forecast.trend === "falling" ? `${RED}↓ Falling${R}` : `${YELLOW}→ Stable${R}`;
    const daysUntilStockout = avgDaily > 0 ? Math.floor(item.sku.currentStock / avgDaily) : 999;

    let stockoutWarning: string;
    if (daysUntilStockout <= 7) {
      stockoutWarning = `${RED}🔴 ${daysUntilStockout}d${R}`;
    } else if (daysUntilStockout <= 30) {
      stockoutWarning = `${YELLOW}⚠️  ${daysUntilStockout}d${R}`;
    } else {
      stockoutWarning = `${GREEN}${daysUntilStockout}d${R}`;
    }

    console.log(`  ${padRight(item.sku.name, 22)} ${spark}  ${padLeft(avgDaily.toFixed(1), 5)}/day  ${padLeft(fmtInt(forecastTotal), 6)} units   ${padRight(trendIcon, 20)} ${stockoutWarning}`);
  }

  const atRisk = top10.filter(item => {
    const avgDaily = mean(salesHistory[item.idx].dailySales.slice(60));
    return avgDaily > 0 && item.sku.currentStock / avgDaily < 30;
  });

  if (atRisk.length > 0) {
    console.log(`\n  ${BOLD}${RED}⚠️  STOCKOUT RISK (within 30 days):${R}`);
    for (const item of atRisk) {
      const avgDaily = mean(salesHistory[item.idx].dailySales.slice(60));
      const days = Math.floor(item.sku.currentStock / avgDaily);
      console.log(`  • ${item.sku.name}: ${item.sku.currentStock} units left ÷ ${avgDaily.toFixed(1)}/day = ${RED}stockout in ~${days} days${R}`);
    }
  }

  // Forecast confidence and weekly breakdown
  console.log(`\n  ${BOLD}Weekly Demand Forecast (next 4 weeks, top 5 items):${R}`);
  console.log(`  ${"─".repeat(80)}`);
  console.log(`  ${padRight("Product", 22)} ${padLeft("Week 1", 8)} ${padLeft("Week 2", 8)} ${padLeft("Week 3", 8)} ${padLeft("Week 4", 8)} ${padLeft("Total", 8)} ${padLeft("Conf.", 7)}`);
  console.log(`  ${"─".repeat(80)}`);
  for (const item of top10.slice(0, 5)) {
    const forecast = forecasts.find(f => f.skuId === item.sku.id)!;
    const weeks = [0, 1, 2, 3].map(w => sum(forecast.predictedDaily.slice(w * 7, (w + 1) * 7)));
    const total = sum(forecast.predictedDaily);
    const confColor = forecast.confidence > 0.8 ? GREEN : forecast.confidence > 0.65 ? YELLOW : RED;
    console.log(`  ${padRight(item.sku.name, 22)} ${padLeft(String(Math.round(weeks[0])), 8)} ${padLeft(String(Math.round(weeks[1])), 8)} ${padLeft(String(Math.round(weeks[2])), 8)} ${padLeft(String(Math.round(weeks[3])), 8)} ${padLeft(String(Math.round(total)), 8)} ${confColor}${padLeft(pct(forecast.confidence, 0), 7)}${R}`);
  }

  // Demand volatility analysis
  console.log(`\n  ${BOLD}Demand Volatility (Coefficient of Variation):${R}`);
  const volatility = top10.map(item => {
    const last30 = salesHistory[item.idx].dailySales.slice(60);
    const avg = mean(last30);
    const sd = stdDev(last30);
    const cv = avg > 0 ? sd / avg : 0;
    return { name: item.sku.name, cv, avg, sd };
  }).sort((a, b) => b.cv - a.cv);

  for (const v of volatility.slice(0, 5)) {
    const level = v.cv > 0.5 ? `${RED}HIGH${R}` : v.cv > 0.3 ? `${YELLOW}MEDIUM${R}` : `${GREEN}LOW${R}`;
    console.log(`  ${padRight(v.name, 22)} CV: ${v.cv.toFixed(2)}  (σ=${v.sd.toFixed(1)}, μ=${v.avg.toFixed(1)})  ${level}`);
  }
}

// ── Agent 3: Reorder Calculator ──────────────────────────────────────────────

function calculateEOQ(sku: SKU, avgDailyDemand: number, demandStdDev: number): EOQResult {
  const annualDemand = avgDailyDemand * 365;
  const orderingCost = 25; // $25 per order
  const carryingCostPct = 0.20;
  const carryingCostPerUnit = sku.unitCost * carryingCostPct;

  // EOQ = sqrt(2 * D * S / H)
  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / carryingCostPerUnit);

  // Safety Stock = Z * σ_d * √L  (Z=1.65 for 95% service level)
  const safetyStock = 1.65 * demandStdDev * Math.sqrt(sku.leadTimeDays);

  // Reorder Point = (avg daily demand * lead time) + safety stock
  const reorderPoint = avgDailyDemand * sku.leadTimeDays + safetyStock;

  return {
    skuId: sku.id,
    eoq: Math.round(eoq),
    annualDemand: Math.round(annualDemand),
    orderingCost,
    carryingCostPct,
    reorderPoint: Math.round(reorderPoint),
    safetyStock: Math.round(safetyStock),
  };
}

async function agentReorderCalculator(forecasts: Forecast[]) {
  console.log(`\n${BOLD}${CYAN}━━━ AGENT 3: REORDER CALCULATOR (EOQ) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${R}`);
  console.log(`${DIM}  Computing Economic Order Quantities for items needing reorder...${R}\n`);
  await sleep(300);

  // Find items below reorder or at risk
  const needsReorder: { sku: SKU; idx: number; avgDaily: number; sd: number }[] = [];
  for (let idx = 0; idx < skus.length; idx++) {
    const sku = skus[idx];
    const last30 = salesHistory[idx].dailySales.slice(60);
    const avgDaily = mean(last30);
    const sd = stdDev(last30);
    const daysUntilStockout = avgDaily > 0 ? sku.currentStock / avgDaily : 999;
    if (sku.currentStock <= sku.reorderPoint || daysUntilStockout < 30) {
      needsReorder.push({ sku, idx, avgDaily, sd });
    }
  }

  const eoqResults: EOQResult[] = [];

  for (const item of needsReorder) {
    const eoq = calculateEOQ(item.sku, item.avgDaily, item.sd);
    eoqResults.push(eoq);

    const H = item.sku.unitCost * 0.20;
    const innerVal = 2 * eoq.annualDemand * eoq.orderingCost / H;

    console.log(`  ${BOLD}${item.sku.name} (${item.sku.id})${R}`);
    console.log(`  ${"─".repeat(35)}`);
    console.log(`  Annual Demand (D):     ${padLeft(fmtInt(eoq.annualDemand), 8)} units`);
    console.log(`  Ordering Cost (S):     ${padLeft(fmt(eoq.orderingCost), 8)}/order`);
    console.log(`  Carrying Cost (H):     ${padLeft(fmt(H), 8)}/unit/year  (20% × ${fmt(item.sku.unitCost)})`);
    console.log(`  `);
    console.log(`  EOQ = √(2 × ${fmtInt(eoq.annualDemand)} × ${eoq.orderingCost} / ${H.toFixed(2)})`);
    console.log(`  EOQ = √(${fmtInt(Math.round(innerVal))})`);
    console.log(`  EOQ = ${BOLD}${fmtInt(eoq.eoq)} units${R}`);
    console.log(`  `);
    console.log(`  Reorder Point:  ${item.avgDaily.toFixed(1)} × ${item.sku.leadTimeDays} + ${eoq.safetyStock} = ${BOLD}${eoq.reorderPoint} units${R}`);
    console.log(`  Safety Stock:   1.65 × ${item.sd.toFixed(1)} × √${item.sku.leadTimeDays} = ${BOLD}${eoq.safetyStock} units${R}`);
    console.log(`  `);
    console.log(`  ${GREEN}✅ RECOMMENDED: Order ${fmtInt(eoq.eoq)} units now${R}  (current: ${item.sku.currentStock})`);
    console.log(``);
    await sleep(200);
  }

  // Summary table
  console.log(`  ${BOLD}Order Summary:${R}`);
  console.log(`  ${"─".repeat(75)}`);
  console.log(`  ${padRight("SKU", 22)} ${padLeft("Current", 8)} ${padLeft("EOQ", 8)} ${padLeft("Safety", 8)} ${padLeft("Est Cost", 10)} ${padLeft("Priority", 10)}`);
  console.log(`  ${"─".repeat(75)}`);
  for (const item of needsReorder) {
    const eoq = eoqResults.find(e => e.skuId === item.sku.id)!;
    const estCost = eoq.eoq * item.sku.unitCost;
    const ratio = item.sku.currentStock / item.sku.maxStock;
    const priority = ratio < 0.10 ? `${RED}URGENT${R}` : ratio < 0.25 ? `${YELLOW}HIGH${R}` : `${WHITE}MEDIUM${R}`;
    console.log(`  ${padRight(item.sku.name, 22)} ${padLeft(String(item.sku.currentStock), 8)} ${padLeft(fmtInt(eoq.eoq), 8)} ${padLeft(String(eoq.safetyStock), 8)} ${padLeft(fmt(estCost), 10)} ${padLeft(priority, 20)}`);
  }
}

// ── Agent 4: Supplier Ranker ─────────────────────────────────────────────────

function rankSuppliers(suppliers: Supplier[]): SupplierRank[] {
  const costs = suppliers.map(s => s.costPerUnit);
  const leads = suppliers.map(s => s.leadTimeDays);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const minLead = Math.min(...leads);
  const maxLead = Math.max(...leads);
  const costRange = maxCost - minCost || 1;
  const leadRange = maxLead - minLead || 1;

  return suppliers.map(s => {
    const costScore = ((maxCost - s.costPerUnit) / costRange) * 100;
    const reliabilityScore = s.reliabilityPct;
    const leadTimeScore = ((maxLead - s.leadTimeDays) / leadRange) * 100;
    const score = costScore * 0.40 + reliabilityScore * 0.35 + leadTimeScore * 0.25;
    return { supplier: s, score, costScore, reliabilityScore, leadTimeScore };
  }).sort((a, b) => b.score - a.score);
}

async function agentSupplierRanker() {
  console.log(`\n${BOLD}${CYAN}━━━ AGENT 4: SUPPLIER RANKER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${R}`);
  console.log(`${DIM}  Evaluating suppliers for items needing reorder (40% cost, 35% reliability, 25% lead time)...${R}\n`);
  await sleep(300);

  const needsReorder = skus.filter(sku => {
    const idx = skus.indexOf(sku);
    const last30 = salesHistory[idx].dailySales.slice(60);
    const avgDaily = mean(last30);
    const daysLeft = avgDaily > 0 ? sku.currentStock / avgDaily : 999;
    return sku.currentStock <= sku.reorderPoint || daysLeft < 30;
  });

  for (const sku of needsReorder) {
    const suppliers = supplierData.get(sku.id)!;
    const ranked = rankSuppliers(suppliers);

    console.log(`  ${BOLD}${sku.name} Suppliers:${R}`);
    console.log(`  ┌${"─".repeat(16)}┬${"─".repeat(10)}┬${"─".repeat(13)}┬${"─".repeat(11)}┬${"─".repeat(9)}┐`);
    console.log(`  │${padRight(" Supplier", 16)}│${padLeft("Cost/Unit", 9)} │${padLeft("Reliability", 12)} │${padLeft("Lead Time", 10)} │${padLeft("Score", 8)} │`);
    console.log(`  ├${"─".repeat(16)}┼${"─".repeat(10)}┼${"─".repeat(13)}┼${"─".repeat(11)}┼${"─".repeat(9)}┤`);

    ranked.forEach((r, i) => {
      const star = i === 0 ? " ★" : "  ";
      console.log(`  │${padRight(" " + r.supplier.name, 16)}│${padLeft(fmt(r.supplier.costPerUnit), 9)} │${padLeft(r.supplier.reliabilityPct + "%", 12)} │${padLeft(r.supplier.leadTimeDays + " days", 10)} │${padLeft(r.score.toFixed(1) + star, 8)} │`);
    });

    console.log(`  └${"─".repeat(16)}┴${"─".repeat(10)}┴${"─".repeat(13)}┴${"─".repeat(11)}┴${"─".repeat(9)}┘`);
    console.log(``);
    await sleep(200);
  }

  // Supplier recommendation summary
  console.log(`  ${BOLD}Recommended Suppliers Summary:${R}`);
  console.log(`  ${"─".repeat(70)}`);
  console.log(`  ${padRight("Item", 22)} ${padRight("Best Supplier", 18)} ${padLeft("Cost/Unit", 10)} ${padLeft("Lead", 7)} ${padLeft("Score", 7)}`);
  console.log(`  ${"─".repeat(70)}`);
  let totalEstOrderCost = 0;
  for (const sku of needsReorder) {
    const suppliers = supplierData.get(sku.id)!;
    const ranked = rankSuppliers(suppliers);
    const best = ranked[0];
    const idx = skus.indexOf(sku);
    const avgDaily = mean(salesHistory[idx].dailySales.slice(60));
    const annualD = avgDaily * 365;
    const H = sku.unitCost * 0.20;
    const eoq = Math.round(Math.sqrt((2 * annualD * 25) / (H || 0.01)));
    const orderCost = eoq * best.supplier.costPerUnit;
    totalEstOrderCost += orderCost;
    console.log(`  ${padRight(sku.name, 22)} ${padRight(best.supplier.name, 18)} ${padLeft(fmt(best.supplier.costPerUnit), 10)} ${padLeft(best.supplier.leadTimeDays + "d", 7)} ${padLeft(best.score.toFixed(1), 7)}`);
  }
  console.log(`  ${"─".repeat(70)}`);
  console.log(`  ${BOLD}Estimated total order cost: ${fmt(totalEstOrderCost)}${R}`);
}

// ── Agent 5: Cost Optimizer ──────────────────────────────────────────────────

async function agentCostOptimizer(forecasts: Forecast[]) {
  console.log(`\n${BOLD}${CYAN}━━━ AGENT 5: COST OPTIMIZER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${R}`);
  console.log(`${DIM}  Analyzing inventory costs and optimization opportunities...${R}\n`);
  await sleep(300);

  let totalInventoryValue = 0;
  let totalCarryingCostAnnual = 0;
  let totalOrderingCostAnnual = 0;
  let totalStockoutCostMonthly = 0;
  let totalAnnualSales = 0;
  let totalAvgInventoryValue = 0;

  const itemCosts: { sku: SKU; carrying: number; ordering: number; turnover: number; safetyOpt: number }[] = [];

  for (let idx = 0; idx < skus.length; idx++) {
    const sku = skus[idx];
    const last30 = salesHistory[idx].dailySales.slice(60);
    const avgDaily = mean(last30);
    const sd = stdDev(last30);
    const annualDemand = avgDaily * 365;

    const inventoryValue = sku.currentStock * sku.unitCost;
    totalInventoryValue += inventoryValue;

    // Carrying cost: stock × unit_cost × 20% per year
    const carryingCost = sku.currentStock * sku.unitCost * 0.20;
    totalCarryingCostAnnual += carryingCost;

    // Ordering cost: (annual demand / EOQ) × $25
    const H = sku.unitCost * 0.20;
    const eoq = Math.sqrt((2 * annualDemand * 25) / (H || 0.01));
    const ordersPerYear = eoq > 0 ? annualDemand / eoq : 0;
    const orderingCost = ordersPerYear * 25;
    totalOrderingCostAnnual += orderingCost;

    // Stockout cost estimate: if below reorder, lost margin per day × days short
    if (sku.currentStock < sku.reorderPoint) {
      const margin = sku.sellingPrice - sku.unitCost;
      const daysShort = Math.max(0, Math.ceil((sku.reorderPoint - sku.currentStock) / (avgDaily || 1)));
      totalStockoutCostMonthly += margin * avgDaily * Math.min(daysShort, 30) * 0.15;
    }

    totalAnnualSales += annualDemand * sku.sellingPrice;
    totalAvgInventoryValue += (sku.maxStock / 2) * sku.unitCost;

    // Optimal safety stock
    const optSafety = 1.65 * sd * Math.sqrt(sku.leadTimeDays);
    const turnover = annualDemand > 0 ? (annualDemand * sku.unitCost) / inventoryValue : 0;

    itemCosts.push({ sku, carrying: carryingCost, ordering: orderingCost, turnover, safetyOpt: Math.round(optSafety) });
  }

  const monthlyCarrying = totalCarryingCostAnnual / 12;
  const monthlyOrdering = totalOrderingCostAnnual / 12;
  const totalMonthly = monthlyCarrying + monthlyOrdering + totalStockoutCostMonthly;
  const avgTurnover = totalAvgInventoryValue > 0 ? totalAnnualSales / totalAvgInventoryValue : 0;

  // Cost gauge display
  const maxBar = 20;
  const carryPct = monthlyCarrying / totalMonthly;
  const orderPct = monthlyOrdering / totalMonthly;
  const stockPct = totalStockoutCostMonthly / totalMonthly;

  console.log(`  ${BOLD}Cost Breakdown (Monthly):${R}`);
  console.log(`  Carrying Cost    ${gauge(carryPct, 1, maxBar)}  ${padLeft(fmt(monthlyCarrying), 10)}/month  (${(carryPct * 100).toFixed(0)}%)`);
  console.log(`  Ordering Cost    ${gauge(orderPct, 1, maxBar)}  ${padLeft(fmt(monthlyOrdering), 10)}/month  (${(orderPct * 100).toFixed(0)}%)`);
  console.log(`  Stockout Cost    ${gauge(stockPct, 1, maxBar)}  ${padLeft(fmt(totalStockoutCostMonthly), 10)}/month  (${(stockPct * 100).toFixed(0)}%)`);
  console.log(`  ${"─".repeat(65)}`);
  console.log(`  ${BOLD}Total${R}              ${" ".repeat(maxBar)}  ${padLeft(fmt(totalMonthly), 10)}/month`);
  console.log(``);
  console.log(`  ${BOLD}Inventory Metrics:${R}`);
  console.log(`  • Total Inventory Value:     ${fmt(totalInventoryValue)}`);
  console.log(`  • Avg Inventory Turnover:    ${avgTurnover.toFixed(1)}x /year`);
  console.log(`  • Annual Carrying Cost:      ${fmt(totalCarryingCostAnnual)}`);
  console.log(`  • Annual Ordering Cost:      ${fmt(totalOrderingCostAnnual)}`);
  console.log(``);

  // Optimal safety stock table
  console.log(`  ${BOLD}Optimal Safety Stock (Top 10 by volume):${R}`);
  console.log(`  ${"─".repeat(75)}`);
  console.log(`  ${padRight("Product", 22)} ${padLeft("Current RP", 11)} ${padLeft("Optimal SS", 11)} ${padLeft("Turnover", 10)} ${padLeft("Savings", 10)}`);
  console.log(`  ${"─".repeat(75)}`);

  const topItems = [...itemCosts].sort((a, b) => b.turnover - a.turnover).slice(0, 10);
  let totalSavings = 0;
  for (const item of topItems) {
    const currentSafety = Math.max(0, item.sku.reorderPoint - Math.round(mean(salesHistory[skus.indexOf(item.sku)].dailySales.slice(60)) * item.sku.leadTimeDays));
    const diff = currentSafety - item.safetyOpt;
    const saving = diff > 0 ? diff * item.sku.unitCost * 0.20 / 12 : 0;
    totalSavings += saving;
    console.log(`  ${padRight(item.sku.name, 22)} ${padLeft(String(item.sku.reorderPoint), 11)} ${padLeft(String(item.safetyOpt), 11)} ${padLeft(item.turnover.toFixed(1) + "x", 10)} ${padLeft(saving > 0 ? fmt(saving) + "/mo" : "—", 10)}`);
  }
  console.log(`  ${"─".repeat(75)}`);
  console.log(`  ${BOLD}Potential monthly savings from safety stock optimization: ${GREEN}${fmt(totalSavings)}/month${R}`);
}

// ── Agent 6: Report Generator ────────────────────────────────────────────────

async function agentReportGenerator(forecasts: Forecast[]) {
  console.log(`\n${BOLD}${CYAN}━━━ AGENT 6: REPORT GENERATOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${R}`);
  console.log(`${DIM}  Generating inventory health dashboard...${R}\n`);
  await sleep(400);

  // Compute KPIs
  let totalValue = 0;
  let healthyCount = 0, atRiskCount = 0, criticalCount = 0;
  let totalDaysOfSupply = 0;
  let totalCarrying = 0;
  let stockoutRisk30d = 0;
  let totalFillRate = 0;

  const categoryHealth: Map<string, { total: number; current: number }> = new Map();

  for (let idx = 0; idx < skus.length; idx++) {
    const sku = skus[idx];
    const last30 = salesHistory[idx].dailySales.slice(60);
    const avgDaily = mean(last30);
    const daysLeft = avgDaily > 0 ? sku.currentStock / avgDaily : 999;

    totalValue += sku.currentStock * sku.unitCost;
    totalCarrying += sku.currentStock * sku.unitCost * 0.20 / 12;
    totalDaysOfSupply += Math.min(daysLeft, 365);

    const ratio = sku.currentStock / sku.maxStock;
    if (ratio < 0.10) criticalCount++;
    else if (sku.currentStock <= sku.reorderPoint || daysLeft < 14) atRiskCount++;
    else healthyCount++;

    if (daysLeft < 30) stockoutRisk30d++;

    // Fill rate: approximate as stock availability ratio
    const demandInLead = avgDaily * sku.leadTimeDays;
    const fillRate = demandInLead > 0 ? Math.min(1, sku.currentStock / demandInLead) : 1;
    totalFillRate += fillRate;

    const cat = categoryHealth.get(sku.category) || { total: 0, current: 0 };
    cat.total += sku.maxStock;
    cat.current += sku.currentStock;
    categoryHealth.set(sku.category, cat);
  }

  const avgDaysOfSupply = Math.round(totalDaysOfSupply / skus.length);
  const avgFillRate = totalFillRate / skus.length;

  // Compute turnover
  let totalAnnualCOGS = 0;
  let totalAvgInv = 0;
  for (let idx = 0; idx < skus.length; idx++) {
    const avgDaily = mean(salesHistory[idx].dailySales.slice(60));
    totalAnnualCOGS += avgDaily * 365 * skus[idx].unitCost;
    totalAvgInv += (skus[idx].currentStock) * skus[idx].unitCost;
  }
  const turnoverRatio = totalAvgInv > 0 ? totalAnnualCOGS / totalAvgInv : 0;

  // Dashboard
  const W = 64;
  const line = "═".repeat(W);
  const dline = "─".repeat(W);
  console.log(`  ╔${line}╗`);
  console.log(`  ║${padRight("            INVENTORY HEALTH DASHBOARD", W)}║`);
  console.log(`  ╠${line}╣`);
  console.log(`  ║${padRight("", W)}║`);
  console.log(`  ║${padRight(`  Total SKUs: ${skus.length}    │  Total Value: ${fmt(totalValue)}`, W)}║`);
  console.log(`  ║${padRight(`  Healthy: ${healthyCount} (${Math.round(healthyCount / skus.length * 100)}%) │  At Risk: ${atRiskCount} (${Math.round(atRiskCount / skus.length * 100)}%)  │  Critical: ${criticalCount} (${Math.round(criticalCount / skus.length * 100)}%)`, W)}║`);
  console.log(`  ║${padRight("", W)}║`);
  console.log(`  ║${padRight("  KPIs:", W)}║`);

  const turnoverStatus = turnoverRatio > 6 ? "✓" : "⚠️";
  console.log(`  ║${padRight(`  • Inventory Turnover Ratio:  ${turnoverRatio.toFixed(1)}x  (Industry avg: 6.0x) ${turnoverStatus}`, W)}║`);
  console.log(`  ║${padRight(`  • Stockout Risk (30d):       ${stockoutRisk30d} items  ${stockoutRisk30d > 3 ? "⚠️" : "✓"}`, W)}║`);
  console.log(`  ║${padRight(`  • Total Carrying Cost:       ${fmt(totalCarrying)}/mo`, W)}║`);
  console.log(`  ║${padRight(`  • Avg Days of Supply:        ${avgDaysOfSupply} days`, W)}║`);
  console.log(`  ║${padRight(`  • Fill Rate:                 ${(avgFillRate * 100).toFixed(1)}%`, W)}║`);
  console.log(`  ║${padRight("", W)}║`);
  console.log(`  ║${padRight("  Category Health:", W)}║`);

  const categories = ["Electronics", "Clothing", "Home & Kitchen", "Sports", "Books"];
  for (const cat of categories) {
    const h = categoryHealth.get(cat)!;
    const catPct = h.current / h.total;
    const catGauge = gauge(h.current, h.total);
    const label = cat === "Home & Kitchen" ? "Home/Kitchen" : cat;
    console.log(`  ║${padRight(`  ${padRight(label, 14)} ${catGauge}  ${Math.round(catPct * 100)}%`, W)}║`);
  }

  console.log(`  ║${padRight("", W)}║`);
  console.log(`  ║${padRight("  Top Actions:", W)}║`);

  // Build action list
  const actions: { priority: number; text: string }[] = [];
  for (let idx = 0; idx < skus.length; idx++) {
    const sku = skus[idx];
    const avgDaily = mean(salesHistory[idx].dailySales.slice(60));
    const daysLeft = avgDaily > 0 ? Math.floor(sku.currentStock / avgDaily) : 999;
    const ratio = sku.currentStock / sku.maxStock;
    if (ratio < 0.10) {
      actions.push({ priority: 0, text: `🔴 Reorder ${sku.name} immediately (${sku.currentStock} units left)` });
    } else if (sku.currentStock <= sku.reorderPoint) {
      actions.push({ priority: 1, text: `⚠️  Reorder ${sku.name} (${sku.currentStock} units, stockout in ${daysLeft}d)` });
    }
  }
  actions.sort((a, b) => a.priority - b.priority);
  const topActions = actions.slice(0, 5);

  for (let i = 0; i < topActions.length; i++) {
    console.log(`  ║${padRight(`  ${i + 1}. ${topActions[i].text}`, W)}║`);
  }

  console.log(`  ║${padRight("", W)}║`);
  console.log(`  ╚${line}╝`);

  // Margin analysis per category
  console.log(`\n  ${BOLD}Gross Margin by Category:${R}`);
  console.log(`  ${"─".repeat(70)}`);
  console.log(`  ${padRight("Category", 16)} ${padLeft("Avg Cost", 10)} ${padLeft("Avg Price", 10)} ${padLeft("Margin", 10)} ${padLeft("Margin %", 10)}`);
  console.log(`  ${"─".repeat(70)}`);
  for (const cat of categories) {
    const catSkus = skus.filter(s => s.category === cat);
    const avgCost = mean(catSkus.map(s => s.unitCost));
    const avgPrice = mean(catSkus.map(s => s.sellingPrice));
    const margin = avgPrice - avgCost;
    const marginPct = avgPrice > 0 ? margin / avgPrice : 0;
    const label = cat === "Home & Kitchen" ? "Home/Kitchen" : cat;
    const color = marginPct > 0.7 ? GREEN : marginPct > 0.5 ? YELLOW : RED;
    console.log(`  ${padRight(label, 16)} ${padLeft(fmt(avgCost), 10)} ${padLeft(fmt(avgPrice), 10)} ${padLeft(fmt(margin), 10)} ${color}${padLeft(pct(marginPct, 1), 10)}${R}`);
  }

  // 90-day sales trend sparklines per category
  console.log(`\n  ${BOLD}90-Day Sales Trend by Category:${R}`);
  for (const cat of categories) {
    const catIdxs = skus.map((s, i) => s.category === cat ? i : -1).filter(i => i >= 0);
    const weeklyTotals: number[] = [];
    for (let w = 0; w < 12; w++) {
      let weekSum = 0;
      for (const idx of catIdxs) {
        const weekSlice = salesHistory[idx].dailySales.slice(w * 7, (w + 1) * 7);
        weekSum += sum(weekSlice);
      }
      weeklyTotals.push(weekSum);
    }
    const label = cat === "Home & Kitchen" ? "Home/Kitchen" : cat;
    const spark = sparkline(weeklyTotals);
    const total = sum(weeklyTotals);
    console.log(`  ${padRight(label, 14)} ${spark}  ${fmtInt(total)} units (90d)`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  console.log(`\n${BOLD}${BG_GREEN}${WHITE}                                                                        ${R}`);
  console.log(`${BOLD}${BG_GREEN}${WHITE}   📦  INVENTORY MANAGEMENT SYSTEM — Squad AI Agents                      ${R}`);
  console.log(`${BOLD}${BG_GREEN}${WHITE}                                                                        ${R}`);
  console.log(`${DIM}  ${dateStr}${R}`);
  console.log(`${DIM}  Powered by 6 specialized AI agents${R}\n`);

  console.log(`  ${BOLD}Scanning 25 SKUs across 5 categories...${R}`);
  await sleep(400);

  // Agent 1: Stock Monitor
  await agentStockMonitor();
  await sleep(500);

  // Build forecasts (shared data)
  const forecasts = buildForecasts();

  // Agent 2: Demand Forecaster
  await agentDemandForecaster(forecasts);
  await sleep(500);

  // Agent 3: Reorder Calculator
  await agentReorderCalculator(forecasts);
  await sleep(500);

  // Agent 4: Supplier Ranker
  await agentSupplierRanker();
  await sleep(500);

  // Agent 5: Cost Optimizer
  await agentCostOptimizer(forecasts);
  await sleep(500);

  // Agent 6: Report Generator
  await agentReportGenerator(forecasts);

  console.log(`\n${DIM}  ─────────────────────────────────────────────────────────────────────${R}`);
  console.log(`${DIM}  All 6 agents completed. Inventory analysis is up to date.${R}`);
  console.log(`${DIM}  Next scheduled run: ${new Date(now.getTime() + 86400000).toLocaleDateString("en-US")}${R}\n`);
}

main().catch(console.error);
