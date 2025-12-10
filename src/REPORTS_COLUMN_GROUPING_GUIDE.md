# Reports Column Configuration & Grouping Guide

## Overview

The Reports system now supports advanced **column customization** and **data grouping** capabilities, allowing users to tailor their view of report data exactly how they need it.

## Features

### 🎯 Column Customization

**Show/Hide Columns**
- Enable or disable any column in the report
- Columns are organized by category:
  - **Core**: Essential data fields (Date, Site, Function, etc.)
  - **Volume**: Budget, Forecast, and Actual volume data
  - **Performance**: Performance metrics and percentages
  - **Calculated**: Derived metrics (Units/Hour, Variance, Efficiency)

**Reorder Columns**
- Use ↑ and ↓ buttons to reorder columns
- Changes apply immediately to the report view

**Additional Calculated Columns**
- **Volume Variance %**: Comparison of Actual vs Budgeted volumes
- **Efficiency %**: Rate of actual production vs budgeted rate
- **Day of Week**: Full day name for date-based reports

---

### 📊 Data Grouping

**Available Grouping Options:**

#### Exception Report
- **Group by Site**: Organize exceptions by distribution center
- **Group by Job Function**: Group by operational function (Receiving, Picking, etc.)
- **Group by Performance Level**: Categorize by Critical, Warning, Good, or Excellent

#### Weekly Trend Report
- **Group by Site**: See each site's weekly trend separately
- **Group by Week**: Roll up data into weekly buckets

#### Daily Performance Report
- Data already organized by site, grouping applies to job functions within each site

---

## How to Use

### 1. Open Column Configuration

In any report view, click the **"Customize View"** button in the action bar.

### 2. Configure Columns

**Enable/Disable Columns:**
- Check/uncheck columns to show/hide them
- See live count of enabled columns at the top

**Reorder Columns:**
- Click ↑ to move a column up in the order
- Click ↓ to move a column down in the order
- First column appears leftmost in the table

### 3. Set Up Grouping

**Choose Group By:**
- Select grouping option from dropdown
- Options vary by report type

**Sort Groups:**
- **By Name**: Alphabetical order
- **By Performance**: Sort by average performance
- **By Volume**: Sort by total volume

**Sort Direction:**
- **Ascending**: Lowest to highest
- **Descending**: Highest to lowest

### 4. Apply Changes

Click **"Apply Changes"** to update the report view.

---

## Column Reference by Report Type

### Daily Performance Report

| Column ID | Label | Category | Default |
|-----------|-------|----------|---------|
| function | Function | Core | ✅ |
| performance | Avg Performance | Performance | ✅ |
| budgeted | Budgeted Volume | Volume | ✅ |
| forecasted | Forecasted Volume | Volume | ✅ |
| actual | Actual Volume | Volume | ✅ |
| hours | Total Hours | Core | ✅ |
| unitsPerHour | Avg Units/Hour | Calculated | ✅ |
| variance | Volume Variance | Calculated | ❌ |
| efficiency | Efficiency % | Calculated | ❌ |

### Weekly Trend Report

| Column ID | Label | Category | Default |
|-----------|-------|----------|---------|
| date | Date | Core | ✅ |
| performance | Performance | Performance | ✅ |
| budgeted | Budgeted Volume | Volume | ✅ |
| forecasted | Forecasted Volume | Volume | ✅ |
| actual | Actual Volume | Volume | ✅ |
| hours | Hours | Core | ✅ |
| unitsPerHour | Units/Hour | Calculated | ✅ |
| variance | Volume Variance % | Calculated | ❌ |
| dayOfWeek | Day of Week | Core | ❌ |

### Exception Report

| Column ID | Label | Category | Default |
|-----------|-------|----------|---------|
| date | Date | Core | ✅ |
| site | Site | Core | ✅ |
| jobFunction | Job Function | Core | ✅ |
| task | Task | Core | ✅ |
| performance | Performance | Performance | ✅ |
| budgeted | Budgeted | Volume | ✅ |
| forecasted | Forecasted | Volume | ✅ |
| actual | Actual | Volume | ✅ |
| variance | Variance | Calculated | ✅ |
| hours | Hours | Core | ❌ |
| unitsPerHour | Units/Hour | Calculated | ❌ |

---

## Grouping Behavior

### Collapsible Groups

When grouping is enabled:
- Each group has a collapsible header
- Click the header to expand/collapse the group
- Groups show summary statistics:
  - Average Performance
  - Item count
  - Total Volume (where applicable)

### Group Summary Cards

Each group displays:
- **Group Name**: The category value
- **Performance Badge**: Average performance for the group
- **Item Count**: Number of records in the group

### Default State

- All groups start expanded
- Click any group header to collapse it
- Collapsed groups only show the summary header

---

## Use Cases

### 📌 Example 1: Focus on Problem Areas
**Goal**: See only exceptions with critical performance

**Configuration**:
- Group by: Performance Level
- Sort by: Performance
- Sort direction: Ascending
- Enabled columns: Date, Site, Job Function, Performance, Variance

**Result**: Critical exceptions appear first, organized by severity level.

---

### 📌 Example 2: Site comparison
**Goal**: Compare weekly performance across sites

**Configuration**:
- Group by: Site
- Sort by: Performance
- Sort direction: Descending
- Enabled columns: Date, Performance, Budgeted, Forecasted, Actual, Variance

**Result**: Top-performing sites listed first, with full volume breakdown.

---

### 📌 Example 3: Volume analysis
**Goal**: Deep dive into volume variances

**Configuration**:
- Enable all volume columns: Budgeted, Forecasted, Actual, Variance
- Add calculated: Units/Hour, Efficiency
- Group by: Job Function (for exceptions)

**Result**: Comprehensive volume analysis by operational function.

---

## Persistence

**Session-Based Storage:**
- Column configurations persist during your current session
- Configurations are stored per report type
- Reset to defaults using the "Reset to Default" button

---

## Print & Export Behavior

### PDF/Print
- Grouped views print with groups expanded
- Column order matches your configuration
- Hidden columns are excluded from print

### CSV Export
- All enabled columns are exported
- Groups are flattened with group name as a prefix
- CSV maintains your column order

---

## Best Practices

### ✅ Do's
- **Start Simple**: Enable core columns first, add calculated columns as needed
- **Group Meaningfully**: Group by the dimension you want to analyze
- **Sort Strategically**: Sort to surface the most important data first
- **Hide Noise**: Disable columns you don't need for the current analysis

### ❌ Don'ts
- **Don't Over-Group**: Multiple grouping levels can make data hard to scan
- **Don't Hide Core Columns**: Date, Site, and Performance are usually essential
- **Don't Forget to Reset**: Use "Reset to Default" if your view becomes cluttered

---

## Troubleshooting

### Issue: Column order doesn't match expectations
**Solution**: Check the order number in the configuration dialog. Lower numbers appear first.

### Issue: Groups won't expand
**Solution**: Click directly on the group header (not the badges). The chevron icon indicates clickability.

### Issue: Configuration disappeared
**Solution**: Configurations are session-based. Refresh resets to defaults. We recommend taking a screenshot of your preferred setup.

---

## Technical Details

### Files Modified
- `/components/ReportColumnConfig.tsx` - Configuration UI component
- `/components/ReportRenderer.tsx` - Updated to support custom columns and grouping
- `/components/ReportsHub.tsx` - Integration of column config
- `/lib/reportGrouping.ts` - Grouping logic and utilities
- `/lib/reportGenerator.ts` - Enhanced data structures
- `/styles/globals.css` - Group header styling

### Data Flow
1. User configures columns and grouping
2. Configuration stored in ReportsHub state
3. Passed to ReportRenderer as `displayConfig` prop
4. ReportRenderer uses `groupReportData()` to organize data
5. Custom `renderGroupedTable()` function renders the output

---

## Future Enhancements (Potential)

- [ ] Save favorite column configurations
- [ ] Multiple grouping levels (e.g., Site → Job Function)
- [ ] Custom calculated column formulas
- [ ] Column width customization
- [ ] Conditional formatting rules
- [ ] Saved report templates

---

## Related Documentation

- [REPORTS_USER_GUIDE.md](./REPORTS_USER_GUIDE.md) - Basic reports usage
- [REPORTS_FEATURE_COMPLETE.md](./REPORTS_FEATURE_COMPLETE.md) - Feature overview
- [REPORTS_VALIDATION_CHECKLIST.md](./REPORTS_VALIDATION_CHECKLIST.md) - Testing guide

---

**Last Updated**: Session Complete
**Feature Status**: ✅ Production Ready
