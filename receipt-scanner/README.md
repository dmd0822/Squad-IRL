# 🧾 Receipt Scanner & Expense Analyzer

A Squad-powered sample that reads receipt files from a folder and processes them
with a team of four AI financial specialists — extracting transaction data,
categorizing expenses, detecting anomalies, and building a summary report.

## Agents

| Agent | Role | What It Does |
|-------|------|-------------|
| **Receipt Parser** | Data Extractor | Extracts structured data from each receipt: vendor, date, amount, payment method, line items. Handles messy formats. |
| **Expense Categorizer** | Category Analyst | Assigns categories (Meals, Travel, Office Supplies, Software, etc.) and flags personal vs. business expenses. |
| **Anomaly Detector** | Fraud & Error Spotter | Spots duplicate charges, unusual amounts, potential fraud indicators, and missing receipts in date sequences. |
| **Report Builder** | Summary Generator | Creates an expense summary: totals by category, top vendors, monthly trends, and flagged items requiring attention. |

## How It Works

```
Receipt files (*.txt, *.md, *.csv) → Receipt Parser → Expense Categorizer
    → Anomaly Detector → Report Builder → Expense Summary
```

Point it at a folder of receipt files and the squad analyzes everything.

## Run

```bash
npm install && npm start
```

Uses the included `sample-receipts/` folder by default. Point to your own:

```bash
npm start -- /path/to/my/receipts
```

Supported file types: `.txt`, `.md`, `.csv`

## Privacy Note

Receipt data is sent to the AI model for analysis but is **not stored** by this
application. Receipt files are read-only — never modified. If your receipts
contain sensitive information (card numbers, personal details), be aware that
the content is transmitted to the configured AI provider for processing.

## Extension Ideas

- Connect to your bank's CSV export for automatic categorization
- Auto-generate expense reports for accounting software
- Track spending trends over time with scheduled runs
- Add OCR integration to process scanned paper receipts
