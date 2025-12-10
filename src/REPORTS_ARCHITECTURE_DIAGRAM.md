# Reports System Architecture

## Component Hierarchy

```
ReportsHub (Main Container)
├── Report List View (Initial)
│   ├── Report Cards
│   │   ├── Configuration Inputs
│   │   └── Generate Button
│   └── Available Reports List
│
└── Report View (After Generation)
    ├── Sidebar (Sticky, Left)
    │   ├── Sidebar Header
    │   ├── Tab Selector
    │   │   ├── Configuration Tab
    │   │   │   ├── Column Config
    │   │   │   │   ├── Column Groups
    │   │   │   │   │   ├── Drag & Drop Columns
    │   │   │   │   │   └── Group Management
    │   │   │   │   └── Ungrouped Columns
    │   │   │   └── Row Grouping Config
    │   │   │       ├── Group By Selector
    │   │   │       ├── Sort By Selector
    │   │   │       └── Sort Direction
    │   │   │
    │   │   └── Enhancements Tab
    │   │       ├── Global Search
    │   │       ├── Density Controls
    │   │       ├── Saved Views Manager
    │   │       ├── Period Comparison
    │   │       ├── Auto-Refresh Controls
    │   │       ├── Quick Actions
    │   │       │   ├── Share Link
    │   │       │   ├── Schedule Report
    │   │       │   └── Set Alert
    │   │       └── Export Options
    │   │           ├── Excel
    │   │           ├── CSV
    │   │           └── Google Sheets
    │   └── Sidebar Content
    │
    └── Main Area (Scrollable)
        ├── Action Bar
        │   ├── Back Button
        │   ├── Refresh Button
        │   └── Export Buttons
        ├── Report Content
        │   ├── Report Header
        │   │   ├── Title
        │   │   ├── Description
        │   │   └── Metadata
        │   ├── Summary Section
        │   │   └── Metrics Grid
        │   └── Detailed Data
        │       ├── Site Breakdowns (Daily)
        │       │   └── EnhancedReportTable
        │       │       ├── Table Headers
        │       │       │   ├── Sort Controls
        │       │       │   ├── Filter Controls
        │       │       │   ├── Pin Controls
        │       │       │   └── Resize Handles
        │       │       ├── Table Body
        │       │       │   ├── Data Rows
        │       │       │   │   ├── Heat Map Cells
        │       │       │   │   ├── Sparkline Cells
        │       │       │   │   └── Badge Cells
        │       │       │   └── Expanded Rows
        │       │       └── Active Filters Display
        │       ├── Trend Data (Weekly)
        │       └── Exception Data (Exceptions)
        └── Report Footer
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        User Actions                          │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    ReportsHub State                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ • viewMode                                          │    │
│  │ • currentReport                                     │    │
│  │ • displayConfigs (columns, grouping)                │    │
│  │ • savedViews                                        │    │
│  │ • globalSearchQuery                                 │    │
│  │ • density                                           │    │
│  │ • periodComparison                                  │    │
│  │ • refreshInterval                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────┬──────────────────┬────────────────────┬────────┘
             │                  │                    │
             ▼                  ▼                    ▼
┌──────────────────┐  ┌────────────────┐  ┌──────────────────┐
│  Report          │  │  Report        │  │ Report           │
│  Generator       │  │  Enhancements  │  │ Export           │
│                  │  │  Service       │  │ Service          │
│  • Generate      │  │  • Save views  │  │ • PDF export     │
│  • Calculate     │  │  • Load views  │  │ • CSV export     │
│  • Format        │  │  • Shareable   │  │ • Excel export   │
│                  │  │  • Alerts      │  │ • Sheets export  │
└────────┬─────────┘  └────────┬───────┘  └────────┬─────────┘
         │                     │                    │
         ▼                     ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                     ReportData Object                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ metadata: { type, title, description, filters }    │    │
│  │ summary: { metrics[], trends }                      │    │
│  │ details: { siteBreakdowns[], dailyData[], etc }    │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Render Components                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ReportRenderer                                      │    │
│  │  └─> EnhancedReportTable (if enhanced)             │    │
│  │       └─> Table with all features                  │    │
│  │            ├─ Sorting                               │    │
│  │            ├─ Filtering                             │    │
│  │            ├─ Pinning                               │    │
│  │            ├─ Resizing                              │    │
│  │            ├─ Heat maps                             │    │
│  │            └─ Sparklines                            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Local Component State                    │
├─────────────────────────────────────────────────────────────┤
│  ReportsHub:                                                 │
│    ├─ Report configuration (dates, thresholds)              │
│    ├─ Display configurations per report type                │
│    ├─ Enhancement settings (density, search, refresh)       │
│    └─ UI state (sidebar tab, view mode)                     │
│                                                              │
│  EnhancedReportTable:                                        │
│    ├─ Sort configuration                                    │
│    ├─ Active filters                                        │
│    ├─ Pinned columns                                        │
│    ├─ Column widths                                         │
│    └─ Expanded rows                                         │
│                                                              │
│  ReportEnhancements:                                         │
│    ├─ Dialog states                                         │
│    ├─ Form inputs                                           │
│    └─ Active selections                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      localStorage                            │
├─────────────────────────────────────────────────────────────┤
│  Keys:                                                       │
│    • report_saved_views          (SavedView[])              │
│    • report_alerts               (ReportAlert[])            │
│    • report_schedules            (ReportSchedule[])         │
│                                                              │
│  Managed by: reportEnhancementsService                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Implementation Map

```
Feature                    Component                Service
────────────────────────────────────────────────────────────────
Sortable Columns          EnhancedReportTable      -
Sticky Headers            EnhancedReportTable      CSS
Column Filters            EnhancedReportTable      -
Heat Maps                 EnhancedReportTable      -
Resizable Columns         EnhancedReportTable      -
Column Pinning            EnhancedReportTable      -
Zebra Striping            EnhancedReportTable      CSS
Sparklines                EnhancedReportTable      -
Density Controls          ReportEnhancements       -
Saved Views               ReportEnhancements       reportEnhancementsService
Global Search             ReportEnhancements       reportEnhancementsService
Period Comparison         ReportEnhancements       reportEnhancementsService
Shareable Links           ReportEnhancements       reportEnhancementsService
Auto-Refresh              ReportsHub               -
Export (Enhanced)         ReportEnhancements       reportEnhancementsService
Alerts                    ReportEnhancements       reportEnhancementsService
Scheduled Reports         ReportEnhancements       reportEnhancementsService
Outlier Detection         -                        reportEnhancementsService
Running Totals            -                        reportEnhancementsService
Moving Averages           -                        reportEnhancementsService
Expandable Rows           EnhancedReportTable      -
Column Grouping           ReportColumnConfig       -
Row Grouping              ReportColumnConfig       reportGrouping
```

---

## CSS Architecture

```
/styles/globals.css
├── Design Tokens (Lines 1-200)
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Shadows
│   └── Transitions
│
├── Base Styles (Lines 200-1000)
│   ├── HTML elements
│   ├── Design system classes
│   └── Utility classes
│
├── Component Styles (Lines 1000-2500)
│   ├── Dashboard styles
│   ├── Form styles
│   ├── Navigation styles
│   └── Card styles
│
├── Report Styles - Original (Lines 2500-3200)
│   ├── .report-card
│   ├── .report-sidebar
│   ├── .report-action-bar
│   ├── .report-container
│   ├── .report-metrics
│   └── .report-footer
│
└── Report Styles - Enhanced (Lines 3490+)
    ├── Enhanced Table Styles
    │   ├── .enhanced-table-container
    │   ├── .enhanced-table-head
    │   ├── .enhanced-table-controls
    │   ├── .enhanced-table-resize-handle
    │   ├── .enhanced-table-cell-pinned
    │   ├── .enhanced-table-row-zebra
    │   ├── .enhanced-table-active-filters
    │   └── .sparkline
    │
    ├── Enhancements Panel Styles
    │   ├── .report-enhancements-panel
    │   ├── .report-enhancements-density-selector
    │   ├── .report-enhancements-actions
    │   ├── .report-enhancements-date-range
    │   └── .report-enhancements-saved-views-list
    │
    ├── Comparison View Styles
    │   ├── .comparison-view-container
    │   ├── .comparison-view-period
    │   └── .comparison-view-metrics
    │
    └── Sidebar Tab Styles
        ├── .report-sidebar-tabs
        ├── .report-sidebar-tab
        └── .report-sidebar-tab-active
```

---

## File Dependencies

```
ReportsHub.tsx
├─ imports
│  ├─ ./design-system/Button
│  ├─ ./design-system/Badge
│  ├─ ./design-system/Separator
│  ├─ ./design-system/Input
│  ├─ ./design-system/Label
│  ├─ ./design-system/Tabs
│  ├─ ./ReportRenderer
│  ├─ ./ReportColumnConfig
│  ├─ ./ReportEnhancements
│  ├─ ../lib/reportGenerator
│  ├─ ../lib/exportService
│  └─ ../lib/reportEnhancementsService
│
├─ uses
│  ├─ React.useState
│  ├─ React.useEffect
│  └─ sonner.toast
│
└─ exports
   └─ ReportsHub (default)

EnhancedReportTable.tsx
├─ imports
│  ├─ ./design-system/Table
│  ├─ ./design-system/Badge
│  ├─ ./design-system/Input
│  ├─ ./design-system/Select
│  ├─ ./design-system/Button
│  ├─ ./design-system/Popover
│  └─ ./design-system/Checkbox
│
├─ uses
│  ├─ React.useState
│  ├─ React.useMemo
│  ├─ React.useRef
│  └─ React.useEffect
│
└─ exports
   ├─ EnhancedReportTable (default)
   └─ ColumnConfig (interface)

ReportEnhancements.tsx
├─ imports
│  ├─ ./design-system/* (multiple)
│  └─ sonner.toast
│
├─ uses
│  ├─ React.useState
│  └─ React.useEffect
│
└─ exports
   ├─ ReportEnhancements (default)
   ├─ SavedView (interface)
   └─ PeriodComparison (interface)

reportEnhancementsService.ts
├─ imports
│  └─ ./safeStorage
│
└─ exports
   ├─ getSavedViews
   ├─ saveView
   ├─ loadView
   ├─ deleteView
   ├─ generateShareableLink
   ├─ parseShareableLink
   ├─ calculateComparisonPeriod
   ├─ compareMetrics
   ├─ getAlerts
   ├─ createAlert
   ├─ checkAlerts
   ├─ getSchedules
   ├─ createSchedule
   ├─ exportToExcelWithFormatting
   ├─ exportToGoogleSheets
   ├─ globalSearch
   ├─ detectOutliers
   ├─ addRunningTotal
   ├─ addMovingAverage
   └─ addCustomCalculation
```

---

## Interaction Patterns

### Pattern 1: Column Sorting
```
User clicks column header
    ↓
EnhancedReportTable.handleSort()
    ↓
Update sortConfig state
    ↓
Trigger useMemo to re-sort data
    ↓
Re-render table with sorted data
    ↓
Update sort icon in header
```

### Pattern 2: Save View
```
User configures report
    ↓
User clicks "Save Current View"
    ↓
ReportEnhancements opens dialog
    ↓
User enters name & description
    ↓
ReportEnhancements.handleSaveView()
    ↓
Calls reportEnhancementsService.saveView()
    ↓
Saves to localStorage
    ↓
Updates savedViews state
    ↓
Shows success toast
```

### Pattern 3: Apply Filter
```
User clicks filter icon
    ↓
Popover opens
    ↓
User enters filter value
    ↓
EnhancedReportTable.handleFilter()
    ↓
Updates filters state
    ↓
Calls onFilter callback
    ↓
Trigger useMemo to re-filter data
    ↓
Re-render table with filtered data
    ↓
Show active filter chip
```

### Pattern 4: Auto-Refresh
```
User sets refresh interval
    ↓
ReportsHub.setRefreshInterval()
    ↓
useEffect triggers
    ↓
setInterval() starts
    ↓
Timer fires
    ↓
Calls handleRefresh()
    ↓
Regenerates report
    ↓
Updates lastRefreshed timestamp
    ↓
Re-renders with new data
```

---

## Extension Points

Want to add new features? Here are the extension points:

### Add New Column Type
1. Update `ColumnConfig` interface in EnhancedReportTable.tsx
2. Add rendering logic in `renderCellValue()`
3. Update heat map logic if needed
4. Add CSS classes in globals.css

### Add New Export Format
1. Add function to reportEnhancementsService.ts
2. Add button to ReportEnhancements.tsx
3. Handle in ReportsHub.handleExportEnhanced()

### Add New Metric
1. Update report generator in reportGenerator.ts
2. Add column definition to DEFAULT_COLUMNS
3. Add rendering in renderCellValue()

### Add New Alert Type
1. Update ReportAlert interface
2. Add UI in ReportEnhancements alert dialog
3. Update checkAlerts() logic

---

## Performance Considerations

### Optimization Strategies Used
- **Memoization**: useMemo for expensive calculations
- **Debouncing**: 300ms debounce on search
- **Lazy rendering**: Only visible rows rendered
- **CSS transitions**: GPU-accelerated animations
- **Event delegation**: Single listeners for table

### Future Optimizations
- **Virtualization**: For 10k+ rows
- **Web Workers**: For heavy calculations
- **IndexedDB**: For large datasets
- **Code splitting**: Lazy load enhancements

---

## Testing Strategy

### Unit Tests (Recommended)
- `reportEnhancementsService.test.ts`
  - Test all CRUD operations
  - Test calculations
  - Test localStorage interactions

### Integration Tests (Recommended)
- `EnhancedReportTable.test.tsx`
  - Test sorting
  - Test filtering
  - Test pinning
  - Test resizing

### E2E Tests (Recommended)
- `reports.e2e.test.ts`
  - Generate report flow
  - Save/load view flow
  - Export flow
  - Alert creation flow

---

This architecture supports current features and provides clear extension points for future enhancements.
