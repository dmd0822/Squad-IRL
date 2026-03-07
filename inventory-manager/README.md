# Inventory Manager

A Squad sample showing 6 AI agents managing e-commerce inventory — stock monitoring, demand forecasting, EOQ optimization, supplier ranking, cost analysis, and health reporting.

## Agents

| Agent | Role | What it does |
|-------|------|--------------|
| **Stock Monitor** | Inventory Tracking | Shows current levels with visual gauge bars, flags items below reorder point |
| **Demand Forecaster** | Prediction | Predicts next 30 days demand using moving average + seasonal adjustment |
| **Reorder Calculator** | EOQ Optimization | Uses Economic Order Quantity formula to determine optimal order sizes |
| **Supplier Ranker** | Vendor Analysis | Ranks 3 suppliers per item on cost, reliability, and lead time |
| **Cost Optimizer** | Financial Analysis | Calculates carrying cost, ordering cost, finds optimal safety stock levels |
| **Report Generator** | Dashboard | Creates a dashboard-style inventory health report with KPIs |

## Data

- **25 SKUs** across categories: Electronics, Clothing, Home & Kitchen, Sports, Books
- **3 suppliers** per item with cost, reliability, and lead time data
- **90-day sales history** per SKU with seasonal patterns

## Run

```bash
npm install && npm start
```

No external APIs required — all data is generated internally.
