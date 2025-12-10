# Available Metrics - Visual Reference Guide

## Quick Answer: YES! All Sections Share the Same Data Source

**Data flows from** → `/lib/mockData.ts` → **All dashboard sections**

---

## Data Structure at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                    ORGANIZATION LEVEL                        │
│                    (All 5 Distribution Centers)              │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬──────────────┐
         ▼               ▼               ▼              ▼
    ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
    │ Philly │     │ Boston │     │Atlanta │     │Charlotte│
    │   DC   │     │   DC   │     │   DC   │     │   DC   │
    └───┬────┘     └───┬────┘     └───┬────┘     └───┬────┘
        │              │              │              │
    ┌───▼──────────────▼──────────────▼──────────────▼──────┐
    │              JOB FUNCTIONS (6 per site)                │
    │  Receiving | Breakdown | Put Away | Picking |         │
    │            Staging | Loading                           │
    └───┬────────────────────────────────────────────────────┘
        │
    ┌───▼──────────────────────────────────────────────────┐
    │              TASKS (7-12 per job function)           │
    │  Unload Trucks | Sort Products | Stock Shelves |    │
    │  Pick Orders | Organize Shipments | Load Trucks...  │
    └───┬──────────────────────────────────────────────────┘
        │
    ┌───▼──────────────────────────────────────────────────┐
    │        DAILY METRICS (180 days per task)             │
    │  Performance | Hours | Volume | Budget | Forecast    │
    └──────────────────────────────────────────────────────┘
```

---

## Core Metrics Available (Per Daily Record)

### 📊 **PLANNING METRICS** (Budgeted - Annual)
```
┌─────────────────────────────────────────────────┐
│ budgetedVolume     │ 3,500 units               │
│ budgetedRate       │ 175 UPH (units/hour)      │
│ budgetedHours      │ 20.0 hours                │
│ budgetedOT         │ 1.0 hours (5% overtime)   │
└─────────────────────────────────────────────────┘
```

### 📈 **FORECASTING METRICS** (Short-term Expected)
```
┌─────────────────────────────────────────────────┐
│ forecastedVolume   │ 3,200 units (91% of budget)│
│ expectedHours      │ 18.3 hours                │
│ totalHours         │ 19.3 hours (w/ OT budget) │
└─────────────────────────────────────────────────┘
```

### ✅ **ACTUAL METRICS** (Measured/Entered)
```
┌─────────────────────────────────────────────────┐
│ actualVolume       │ 3,200 units               │
│ actualHours        │ 20.5 hours                │
│ performance        │ 89.3% (expected/actual)   │
└─────────────────────────────────────────────────┘
```

---

## Calculated Metrics You Can Derive

### Variance Metrics
```typescript
Hours Variance     = actualHours - expectedHours
                   = 20.5 - 18.3 = +2.2 hours (over budget)

Volume Variance    = actualVolume - forecastedVolume
                   = 3,200 - 3,200 = 0 units

Budget Variance    = actualHours - budgetedHours
                   = 20.5 - 20.0 = +0.5 hours

Performance Gap    = 100% - performance
                   = 100% - 89.3% = 10.7% gap
```

### Efficiency Metrics
```typescript
Actual Rate        = actualVolume / actualHours
                   = 3,200 / 20.5 = 156 UPH

Rate Variance      = actualRate - budgetedRate
                   = 156 - 175 = -19 UPH (slower than standard)

Productivity %     = actualRate / budgetedRate × 100
                   = 156 / 175 × 100 = 89.1%
```

### Cost Metrics (Easily Added)
```typescript
Labor Cost         = actualHours × hourlyRate
Overtime Cost      = overtimeHours × overtimeRate
Cost per Unit      = totalCost / actualVolume
Budget Impact      = (actual - budget) × rate
```

---

## Aggregation Levels Available

### 1️⃣ TASK LEVEL (Finest Grain)
```
Pick Orders (Philadelphia DC → Picking)
  ↓
  Daily: 180 data points
  Weekly: 25 aggregated points
  Monthly: 6 aggregated points
```

### 2️⃣ JOB FUNCTION LEVEL
```
Picking (Philadelphia DC)
  ↓
  Combines 12 tasks
  Average performance across all picking tasks
```

### 3️⃣ SITE LEVEL
```
Philadelphia DC
  ↓
  Combines 6 job functions
  Total: ~51 tasks × 180 days = 9,180 records
```

### 4️⃣ ORGANIZATION LEVEL
```
All Distribution Centers
  ↓
  Combines 5 sites
  Total: ~275,400 records
```

---

## Metrics Available for Charts

### ✅ **Line Charts** (Trends over Time)
- Performance % trend
- Actual Hours trend
- Volume trend
- Variance trend
- Budget vs Actual trend

### ✅ **Bar Charts** (Comparisons)
- Performance by Site
- Hours by Job Function
- Volume by Task
- Variance by Entity
- Top/Bottom performers

### ✅ **KPI Cards** (Summary Statistics)
- Total Expected Hours
- Total Actual Hours
- Average Performance
- Total Volume
- Completion Rate
- Sites On/Off Target

### ✅ **Tables** (Detailed Data)
- Task-level breakdown
- Daily metrics
- Drill-down tables
- Hierarchical views

### ✅ **Maps** (Geographic)
- Site locations
- Performance by location
- Regional performance
- Distance/routing

---

## Time Ranges Supported

```
┌────────────────────────────────────────────────────┐
│  Daily        │  Single day metrics               │
│  Weekly       │  7-day aggregation                │
│  Monthly      │  30-day aggregation               │
│  Quarterly    │  90-day aggregation               │
│  Custom       │  Any start/end date range         │
│  Last N Days  │  7, 30, 60, 90, 180               │
│  MTD          │  Month-to-date                    │
│  YTD          │  Year-to-date (180 day limit)     │
└────────────────────────────────────────────────────┘
```

---

## Data Filtering Options

### By Entity
```typescript
✅ All Sites
✅ Single Site (DC-001, DC-002, etc.)
✅ Multiple Sites (custom selection)
✅ By Region (Northeast, Southeast)

✅ All Job Functions
✅ Single Job Function (Receiving, Picking, etc.)
✅ By Type (Operations, Logistics, etc.)

✅ All Tasks
✅ Single Task (Pick Orders, Load Trucks, etc.)
✅ By Category (manual, automated, etc.)
```

### By Date
```typescript
✅ Specific Date (2024-01-15)
✅ Date Range (2024-01-01 to 2024-01-31)
✅ Relative (Last 7 days)
✅ Comparison (This week vs Last week)
```

### By Status
```typescript
✅ Has Actuals (actualVolume !== null)
✅ Missing Actuals (actualVolume === null)
✅ On Target (performance >= 95%)
✅ Off Target (performance < 95%)
✅ Over Budget (actualHours > expectedHours)
✅ Under Budget (actualHours < expectedHours)
```

---

## How Different Section Types Use Data

### 📈 **Trend Charts** (Performance, Hours, Volume)
```typescript
Source: getMetricsByDateRange(startDate, endDate)
Group By: Date
Aggregate: Average or Sum
Display: Line chart with multiple series
Filter: By site, job function, or task
```

### 📊 **Bar Charts** (Variance, Comparison)
```typescript
Source: getMetricsBySiteAndDateRange(...)
Group By: Entity (site/function/task)
Aggregate: Sum or Average
Display: Bar chart with categories
Sort: By performance or variance
```

### 🎯 **KPI Cards** (Summary Tiles)
```typescript
Source: contextMetrics (filtered by role/drill-down)
Aggregate: Sum, Average, Count
Display: Single large number with comparison
Icon: Based on performance vs target
```

### 📋 **Tables** (Detailed Views)
```typescript
Source: getMetricsByJobFunctionAndDateRange(...)
Group By: Task or Date
Display: Expandable rows, sortable columns
Actions: Drill-down, edit, export
```

### 🗺️ **Maps** (Geographic Views)
```typescript
Source: sites + aggregated metrics
Calculate: Performance per site
Display: Markers colored by status
Interact: Hover, click for details
```

---

## Example Data Flow

### User Action: "Show Performance Trend for Philadelphia DC"

```
1. User: Selects "Philadelphia DC" + "Last 30 Days"
   ↓
2. App: Calls getMetricsBySiteAndDateRange('DC-001', startDate, endDate)
   ↓
3. Data: Returns ~9,000 records (51 tasks × 6 functions × 30 days)
   ↓
4. Processing: Group by date, calculate average performance per day
   ↓
5. Calculation: 
   Day 1: [100 tasks with actuals] → Avg Performance: 96.3%
   Day 2: [100 tasks with actuals] → Avg Performance: 98.1%
   ...
   ↓
6. Chart: Displays 30-point line chart
   ↓
7. User: Clicks "Picking" job function to drill down
   ↓
8. Re-filter: Only show Picking tasks (12 tasks × 30 days = 360 records)
   ↓
9. Chart: Updates to show 30-point line for Picking only
```

---

## Design System Variables Used

### Colors for Data Visualization
```css
/* Performance Status */
✅ On Target (≥95%)    → var(--color-success)      → #10b981
⚠️  Warning (90-95%)   → var(--color-warning)      → #f59e0b
❌ Off Target (<90%)   → var(--color-error)        → #ef4444

/* Chart Series */
Series 1 (Primary)     → var(--color-chart-1)     → #3b82f6 (Blue)
Series 2 (Secondary)   → var(--color-chart-2)     → #10b981 (Green)
Series 3 (Tertiary)    → var(--color-chart-3)     → #f59e0b (Amber)
Series 4 (Quaternary)  → var(--color-chart-4)     → #ef4444 (Red)
Series 5 (Quinary)     → var(--color-chart-5)     → #a855f7 (Purple)

/* UI Elements */
Text                   → var(--color-foreground)  → #0f172a
Borders                → var(--color-border)      → #e2e8f0
Background             → var(--color-background)  → #ffffff
Muted Text             → var(--color-muted-foreground) → #64748b
```

### Typography for Data Display
```css
/* Headers */
Chart Title            → var(--text-h3)           → 24px
Section Title          → var(--text-h4)           → 20px

/* Content */
Metric Value           → var(--text-large)        → 18px
Labels                 → var(--text-label)        → 14px
Details                → var(--text-detail)       → 12px

/* Font Face (Always) */
All Text              → var(--font-family-inter) → 'Inter'
```

### Spacing for Layout
```css
/* Card Padding */
Card Interior          → var(--spacing-6)         → 24px
Section Gap            → var(--spacing-4)         → 16px

/* Element Spacing */
Between Labels         → var(--spacing-2)         → 8px
Between Sections       → var(--spacing-8)         → 32px
Icon Margins           → var(--spacing-3)         → 12px
```

---

## Most Common Metrics by Section Type

### KPI Cards (Summary)
- ✅ Total Expected Hours
- ✅ Total Actual Hours
- ✅ Average Performance %
- ✅ Total Volume
- ✅ Sites On Target

### Performance Charts (Trends)
- ✅ Performance % over time
- ✅ Actual Hours over time
- ✅ Volume over time

### Variance Charts (Comparison)
- ✅ Hours Variance (actual - expected)
- ✅ Volume Variance (actual - forecast)
- ✅ Performance by Entity

### Rankings (Leaderboards)
- ✅ Top Performers (highest performance %)
- ✅ Bottom Performers (lowest performance %)
- ✅ Most Efficient (lowest actual hours vs expected)
- ✅ Highest Volume

### Tables (Details)
- ✅ Task Name
- ✅ Expected Hours
- ✅ Actual Hours
- ✅ Performance %
- ✅ Volume
- ✅ Status

---

## Data Update Patterns

### Historical Data (Read-Only)
```
Day -180 to Day -1: All metrics populated ✅
  - actualVolume: Set
  - actualHours: Set
  - performance: Calculated
```

### Today's Data (Entry Mode)
```
Day 0 (Today): Only planned metrics ⚠️
  - budgetedVolume: Set
  - forecastedVolume: Set
  - expectedHours: Set
  - actualVolume: null (awaiting input)
  - actualHours: null (awaiting input)
  - performance: null (cannot calculate)
```

### Update Flow
```
1. User enters actualVolume
   ↓
2. System calculates actualHours = actualVolume / budgetedRate
   ↓
3. System calculates performance = (expectedHours / actualHours) × 100
   ↓
4. All charts/tables automatically update
   ↓
5. Next day, becomes historical data
```

---

## Performance Calculation Deep Dive

### The Formula
```
Performance % = (Expected Hours / Actual Hours) × 100
```

### Interpretation
```
Performance > 100%  →  GOOD! Under budget (more efficient)
                       Completed work in less time than expected
                       
Performance = 100%  →  ON TARGET! Exactly as planned
                       Met expectations perfectly
                       
Performance < 100%  →  BAD! Over budget (less efficient)
                       Took more time than expected
```

### Example Scenarios

#### Scenario A: Excellent Performance (105%)
```
Expected: 20 hours
Actual:   19 hours
Performance: (20 / 19) × 100 = 105.3%
Result: Saved 1 hour! ✅
```

#### Scenario B: Poor Performance (85%)
```
Expected: 20 hours
Actual:   23.5 hours
Performance: (20 / 23.5) × 100 = 85.1%
Result: Over by 3.5 hours ❌
```

#### Scenario C: On Target (100%)
```
Expected: 20 hours
Actual:   20 hours
Performance: (20 / 20) × 100 = 100.0%
Result: Perfect! 🎯
```

---

## Quick Reference: Metric Selection Guide

### When to Use Each Metric

**Performance %** → Compare efficiency across entities  
**Actual Hours** → Track labor consumption  
**Expected Hours** → Show planning accuracy  
**Volume** → Monitor output/productivity  
**Variance** → Identify over/under budget situations  
**Budget** → Analyze against annual plan  
**Forecast** → Evaluate short-term accuracy  

---

## Summary

### ✅ Single Data Source
All sections pull from `/lib/mockData.ts`

### ✅ Rich Dataset
- 5 Sites
- 30 Job Functions (6 per site)
- 51 Unique Tasks
- 180 Days of History
- ~275,400 Total Records

### ✅ Multiple Metrics
- Performance, Hours, Volume
- Budget, Forecast, Actual
- Calculated variances
- Aggregated summaries

### ✅ Flexible Filtering
- By entity, date, status
- Drill-down hierarchy
- Time range selection
- Custom combinations

### ✅ Design System Integration
All visualizations use CSS variables:
- Colors: `var(--color-*)`
- Typography: `var(--font-family-inter)`
- Spacing: `var(--spacing-*)`

### ✅ Extensible
Easy to add:
- New metrics
- New dimensions
- New aggregations
- Real data sources

---

**Every section has access to the same comprehensive, hierarchical dataset with consistent styling through design system variables.**

Need to change colors? → Edit CSS  
Need to add a metric? → Extend interface  
Need to filter data? → Use existing query functions  
Need to aggregate differently? → Add calculation logic  

It all flows from one source! 🎯
