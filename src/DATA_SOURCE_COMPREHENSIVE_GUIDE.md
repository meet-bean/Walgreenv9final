# Data Source & Available Metrics - Comprehensive Guide

## Yes, All Sections Use the Same Data Source! ✅

**All dashboard sections pull data from `/lib/mockData.ts`**, which provides a centralized, hierarchical data structure that mirrors a real supply chain performance management system.

---

## Data Structure Hierarchy

```
Organization (All Sites)
  ↓
Sites/Distribution Centers (5 DCs)
  ↓
Job Functions (6 per site: Receiving, Breakdown, Put Away, Picking, Staging, Loading)
  ↓
Tasks (7-12 tasks per job function, 51 total unique tasks)
  ↓
Daily Metrics (180 days of historical data per task)
```

---

## Complete Data Model

### 1. **Sites/Distribution Centers** (5 locations)
```typescript
interface Site {
  id: string;              // 'DC-001' through 'DC-005'
  name: string;            // 'Philadelphia DC', 'Boston DC', etc.
  location: string;        // 'Philadelphia, PA'
  region: string;          // 'Northeast', 'Southeast'
  latitude: number;        // For map visualization
  longitude: number;       // For map visualization
}
```

**Available Sites:**
- **DC-001**: Philadelphia DC (Northeast)
- **DC-002**: Boston DC (Northeast)
- **DC-003**: Atlanta DC (Southeast)
- **DC-004**: Charlotte DC (Southeast)
- **DC-005**: Miami DC (Southeast)

---

### 2. **Job Functions** (30 total: 6 per site)
```typescript
interface JobFunction {
  id: string;              // 'receiving', 'breakdown-dc2', etc.
  siteId: string;          // Links to Site
  name: string;            // 'Receiving', 'Breakdown', etc.
  supervisorName: string;  // 'Mike Rodriguez', etc.
  type: string;            // 'receiving', 'breakdown', 'putaway', etc.
}
```

**6 Job Function Types (per site):**
1. **Receiving** (8 tasks) - Unload, inspect, scan shipments
2. **Breakdown** (7 tasks) - Break pallets, sort, repackage
3. **Put Away** (9 tasks) - Transport, stock shelves, storage
4. **Picking** (12 tasks) - Order picking, batch/zone/wave picking
5. **Staging** (8 tasks) - Organize, label, consolidate shipments
6. **Loading** (7 tasks) - Prepare dock, load trucks, seal

---

### 3. **Tasks** (51 unique tasks across 6 job functions)

**Complete Task Breakdown:**

#### Receiving Tasks (8)
- Unload Trucks
- Inspect Shipments
- Scan & Process
- Damage Assessment
- Physical Count Verification
- Transfer to Staging
- Temperature Check (Pharma)
- Process Documentation

#### Breakdown Tasks (7)
- Break Down Pallets
- Sort Products
- Repackage Items
- Apply Labels
- Quality Check
- Consolidate Items
- Prepare for Put Away

#### Put Away Tasks (9)
- Transport to Shelves
- Stock Shelves
- High Bay Storage
- Floor Storage
- Bulk Storage
- Fast-Moving Items
- Slow-Moving Items
- Scan & Verify Location
- Refrigerated Storage

#### Picking Tasks (12)
- Pick Orders
- Verify Picks
- Batch Picking
- Zone Picking
- Wave Picking
- Priority Orders
- Bulk Picking
- Piece Picking
- Case Picking
- Pallet Picking
- Replenishment Picks
- Quality Audit Picks

#### Staging Tasks (8)
- Organize Shipments
- Label Shipments
- Consolidate Orders
- Sort by Route
- Wrap & Secure
- Verify Completeness
- Weigh Shipments
- Generate Manifests

#### Loading Tasks (7)
- Prepare Dock
- Load Trucks
- Sequence by Delivery
- Secure Cargo
- Final Inspection
- Complete Documentation
- Seal & Verify Truck

---

### 4. **Daily Metrics** (The Core Data)

**180 days of historical data** for every combination of:
- 5 Sites × 6 Job Functions × 7-12 Tasks × 180 Days = **~275,400 data records**

```typescript
interface DailyMetrics {
  // Identifiers
  id: string;
  date: string;              // 'YYYY-MM-DD' format
  siteId: string;
  jobFunctionId: string;
  taskId: string;
  
  // BUDGETED DATA (Annual planning)
  budgetedVolume: number;    // Units planned (e.g., 3500 cases)
  budgetedRate: number;      // Units per hour - UPH (150-250 range)
  budgetedHours: number;     // Calculated: budgetedVolume / budgetedRate
  budgetedOT: number;        // 5% overtime budget
  
  // FORECASTED DATA (Short-term planning)
  forecastedVolume: number;  // Expected units (85-115% of budget)
  expectedHours: number;     // Calculated: forecastedVolume / budgetedRate
  totalHours: number;        // expectedHours + budgetedOT
  
  // ACTUAL DATA (Manual input/measured)
  actualVolume: number | null;   // Actual units completed
  actualHours: number | null;    // Actual hours worked
  
  // CALCULATED PERFORMANCE
  performance: number | null;    // (expectedHours / actualHours) × 100
                                 // >100% = under budget (good)
                                 // <100% = over budget (bad)
}
```

---

## Available Metrics for Visualization

### Primary Metrics (Always Available)
1. **Performance %** - Efficiency percentage (expectedHours / actualHours × 100)
2. **Actual Hours** - Total hours worked
3. **Expected Hours** - Forecasted hours needed
4. **Budgeted Hours** - Annual planned hours
5. **Actual Volume** - Units completed
6. **Forecasted Volume** - Expected units
7. **Budgeted Volume** - Planned units
8. **Budgeted Rate (UPH)** - Units per hour standard

### Calculated Metrics (Derived)
9. **Hours Variance** - actualHours - expectedHours
10. **Volume Variance** - actualVolume - forecastedVolume
11. **Budget Variance** - actualHours - budgetedHours
12. **Completion Rate** - % of tasks with actual data entered
13. **Average Performance** - Mean performance across entities
14. **Total Overtime** - budgetedOT across entities

### Aggregations Available
- **By Date**: Daily, Weekly, Monthly
- **By Site**: Individual DC or All Sites
- **By Job Function**: Individual function or All Functions
- **By Task**: Individual task or All Tasks
- **By Region**: Northeast vs Southeast

---

## Data Access Functions (From mockData.ts)

### Basic Queries
```typescript
// Get specific site
getSiteById(id: string): Site

// Get job functions for a site
getJobFunctionsBySite(siteId: string): JobFunction[]

// Get tasks for a job function
getTasksByJobFunction(jobFunctionId: string): Task[]

// Get metrics for a specific date
getMetricsByDate(date: string): DailyMetrics[]
getMetricsBySiteAndDate(siteId: string, date: string): DailyMetrics[]
getMetricsByJobFunctionAndDate(jobFunctionId: string, date: string): DailyMetrics[]
```

### Date Range Queries (For Trends)
```typescript
// Historical analysis
getMetricsByDateRange(startDate: string, endDate: string): DailyMetrics[]
getMetricsBySiteAndDateRange(siteId: string, start: string, end: string): DailyMetrics[]
getMetricsByJobFunctionAndDateRange(jobFunctionId: string, start: string, end: string): DailyMetrics[]
```

### Aggregated Queries
```typescript
// Executive summaries
getAggregateMetricsByDate(date: string) // All sites combined
getSitePerformanceSummary(date: string) // Per-site summary
getWeeklyAggregateMetrics(start: string, end: string) // Weekly rollups
getMonthlyAggregateMetrics(start: string, end: string) // Monthly rollups
getPerformanceTrend(siteId?: string, jobFunctionId?: string, days: number) // Trend analysis
```

### Date Range Info
```typescript
getAvailableDateRange() // Returns start/end dates and total records
// Returns: { startDate, endDate, totalDays, totalRecords }
```

---

## How Sections Use This Data

### Example 1: Performance Trend Chart (What We Just Fixed!)
```typescript
// Gets metrics based on drill-down level
let filteredMetrics = contextMetrics;

// Can filter by site
if (trendDrillDown.siteId) {
  filteredMetrics = contextMetrics.filter(m => m.siteId === trendDrillDown.siteId);
}

// Can filter by job function
if (trendDrillDown.jobFunctionId) {
  filteredMetrics = contextMetrics.filter(m => m.jobFunctionId === trendDrillDown.jobFunctionId);
}

// Calculates based on selected metric
switch (trendMetric) {
  case 'performance': return avgPerformance;
  case 'hours': return sum of actualHours;
  case 'volume': return sum of actualVolume;
}
```

### Example 2: KPI Cards
```typescript
// Aggregates across filtered metrics
const totalExpectedHours = contextMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
const totalActualHours = contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
const avgPerformance = calculateAverage(contextMetrics.map(m => m.performance));
```

### Example 3: Hours Variance Chart
```typescript
// Groups by entity (site/job function/task)
const chartData = entities.map(entity => {
  const entityMetrics = contextMetrics.filter(m => m.entityId === entity.id);
  return {
    name: entity.name,
    expected: sum(entityMetrics.expectedHours),
    actual: sum(entityMetrics.actualHours),
    variance: actual - expected
  };
});
```

### Example 4: Site Performance Map
```typescript
// Calculates metrics per site
sites.map(site => {
  const siteMetrics = metrics.filter(m => m.siteId === site.id);
  const avgPerformance = calculateAverage(siteMetrics);
  return { site, avgPerformance, status: getStatus(avgPerformance) };
});
```

---

## Data Characteristics

### Realistic Patterns Built-In
1. **Weekend Effect**: Volumes 40-60% of weekday volumes
2. **Efficiency Patterns**: Some sites/tasks consistently over/under budget
3. **Seasonal Trends**: Slight growth/decline over 180-day period
4. **Variance Distribution**: 
   - 30% under budget (efficient)
   - 40% near budget (normal)
   - 30% over budget (inefficient)

### Data Quality
- **Historical Coverage**: 180 days (6 months)
- **Completeness**: 100% of past days have actuals, today has none
- **Granularity**: Task-level detail (finest grain)
- **Consistency**: Same budgeted rates across date ranges

---

## Design System Integration

All sections rendering this data now use CSS variables from `/styles/globals.css`:

### Typography Variables
```css
--font-family-inter: 'Inter', sans-serif;
--text-h1: 48px;
--text-h2: 30px;
--text-h3: 24px;
--text-h4: 20px;
--text-base: 16px;
--text-label: 14px;
--text-detail: 12px;
```

### Color Variables
```css
/* Core Colors */
--color-foreground: rgba(15, 23, 42, 1.00);
--color-background: rgba(255, 255, 255, 1.00);
--color-border: rgba(226, 232, 240, 1.00);
--color-muted-foreground: rgba(100, 116, 139, 1.00);

/* Chart Colors */
--color-chart-1: rgba(59, 130, 246, 1.00);   /* Blue */
--color-chart-2: rgba(16, 185, 129, 1.00);   /* Green */
--color-chart-3: rgba(245, 158, 11, 1.00);   /* Amber */
--color-chart-4: rgba(239, 68, 68, 1.00);    /* Red */
--color-chart-5: rgba(168, 85, 247, 1.00);   /* Purple */

/* State Colors */
--color-success: rgba(16, 185, 129, 1.00);
--color-warning: rgba(245, 158, 11, 1.00);
--color-error: rgba(239, 68, 68, 1.00);
--color-info: rgba(59, 130, 246, 1.00);
```

### Spacing Variables
```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
```

### Usage in Components
```tsx
// Typography
<h2 style={{ fontFamily: 'var(--font-family-inter)', fontSize: 'var(--text-h2)' }}>

// Colors
<div style={{ color: 'var(--color-foreground)', borderColor: 'var(--color-border)' }}>

// Spacing
<div style={{ padding: 'var(--spacing-4)', gap: 'var(--spacing-2)' }}>

// Chart colors
<Line stroke="var(--color-chart-1)" />
```

---

## What You Can Configure

### 1. **Metric Selection** (Now Available!)
Choose which metric to display:
- Performance %
- Actual Hours
- Expected Hours
- Volume
- Variance
- Budget comparison

### 2. **Time Range**
- Daily
- Weekly
- Monthly
- Custom date range
- Last 7/30/60/90 days

### 3. **Aggregation Level**
- All Sites (VP view)
- Single Site (Site Manager view)
- Single Job Function (Supervisor view)
- Single Task

### 4. **Drill-Down Path**
- Sites → Job Functions → Tasks (VP)
- Job Functions → Tasks (Site Manager)
- Tasks only (Supervisor)

### 5. **Visualization Type**
- Line charts (trends)
- Bar charts (comparisons)
- KPI cards (summaries)
- Tables (detailed)
- Maps (geographic)
- Rankings (performance)

### 6. **Styling** (Via CSS Variables!)
Update `/styles/globals.css` to change:
- All colors throughout app
- All spacing/padding
- All typography
- All borders/radius
- Light/dark mode

---

## Future Data Extensions

### Easy to Add:
1. **Additional Metrics**
   - Cost per unit
   - Quality scores
   - Safety incidents
   - Employee satisfaction

2. **Additional Dimensions**
   - Employee shifts (morning/afternoon/night)
   - Equipment utilization
   - Weather impact
   - Special events (holidays, promotions)

3. **Additional Entities**
   - Departments
   - Teams
   - Equipment
   - Vendors

4. **Real-Time Data**
   - API integration ready
   - WebSocket support for live updates
   - Polling for recent data

---

## Key Takeaways

✅ **Single Source of Truth**: All sections use `/lib/mockData.ts`  
✅ **Hierarchical Structure**: Site → Job Function → Task → Daily Metrics  
✅ **Rich Dataset**: 180 days × 5 sites × 30 job functions × 51 tasks  
✅ **Multiple Metrics**: Performance, Hours, Volume, Budget, Forecast  
✅ **Flexible Queries**: By date, date range, entity, aggregation  
✅ **Design System**: All UI uses CSS variables for centralized styling  
✅ **Extensible**: Easy to add metrics, dimensions, or real data sources  

---

## Example: How to Add a New Metric

Want to add "Cost" as a metric? Here's how:

### Step 1: Add to DailyMetrics interface
```typescript
interface DailyMetrics {
  // ... existing fields
  costPerUnit: number;
  totalCost: number;
}
```

### Step 2: Update data generation
```typescript
const costPerUnit = 2.50 + Math.random() * 1.50; // $2.50-$4.00
const totalCost = actualVolume * costPerUnit;
```

### Step 3: Add to metric selector
```tsx
<SelectItem value="cost">Total Cost</SelectItem>
```

### Step 4: Add to calculator
```typescript
case 'cost':
  return metrics.reduce((sum, m) => sum + (m.totalCost || 0), 0);
```

### Step 5: Update chart with design system variables
```tsx
<YAxis 
  tick={{ fontFamily: 'var(--font-family-inter)' }}
  stroke="var(--color-muted-foreground)"
/>
```

**That's it!** The new metric is available across all sections.

---

## Questions?

- **Q: Can I filter by multiple sites?**  
  A: Yes, filter the metrics array before aggregation

- **Q: Can I show multiple metrics on one chart?**  
  A: Yes, create multiple Line/Bar components with different dataKeys

- **Q: Can I change the date range?**  
  A: Yes, use DateRangePicker component or pass startDate/endDate props

- **Q: Can I add custom calculations?**  
  A: Yes, create derived metrics from the base DailyMetrics data

- **Q: How do I change colors/fonts across the entire app?**  
  A: Edit `/styles/globals.css` CSS variables - changes apply everywhere

- **Q: Can sections share the same filters?**  
  A: Yes, pass the same date range/site filter to multiple sections

---

**Status**: ✅ **Complete and Documented**

All sections have access to the same comprehensive dataset with full design system integration. You can now select metrics, drill down through hierarchies, and customize styling centrally through CSS variables.
