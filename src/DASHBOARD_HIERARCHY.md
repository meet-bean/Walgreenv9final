# Dashboard & Preview Component Hierarchy

## Complete Component Structure

This document explains the hierarchy of all dashboard-related components and how the preview/rendering system works.

---

## 🏗️ Architecture Overview

The dashboard system has **two main user flows**:

1. **Dashboard Builder** - For creating/editing dashboards (Executive & Site Managers)
2. **Published Dashboards View** - For viewing published dashboards (All roles)

Both flows now use the **same shared preview canvas** (`BuilderPreviewWrapper`) for consistent rendering.

---

## 📊 Component Hierarchy Diagram

```
App.tsx (Root)
│
└─── MainApp.tsx (Main Application Container)
     │
     ├─── [BUILDER FLOW] DashboardBuilder.tsx
     │    │
     │    ├─── BuilderPreviewWrapper.tsx (Shared Preview Canvas)
     │    │    │
     │    │    └─── DraggablePreviewSection (for each section)
     │    │         │
     │    │         └─── DashboardRenderer.tsx
     │    │              │
     │    │              └─── [Section Components]
     │    │                   ├─── PerformanceOverview
     │    │                   ├─── JobFunctionPerformance
     │    │                   ├─── HierarchicalPerformanceTable
     │    │                   ├─── SitePerformanceMap
     │    │                   ├─── DynamicRankings
     │    │                   ├─── PerformancePieChart
     │    │                   ├─── TaskTile
     │    │                   └─── (Charts, etc.)
     │    │
     │    └─── DashboardSectionsSidebar (Floating Overlay Panel)
     │         └─── Section Definitions List
     │
     └─── [PUBLISHED FLOW] PublishedDashboardsView.tsx
          │
          └─── BuilderPreviewWrapper.tsx (Same Shared Canvas)
               │
               └─── DraggablePreviewSection (for each section)
                    │
                    └─── SectionRenderer.tsx (NEW - Self-contained)
                         │
                         └─── [Rendered Section Content]
                              ├─── renderKPICards()
                              │    ├─── Card (for each KPI)
                              │    │    ├─── CardHeader
                              │    │    │    └─── DateRangePicker
                              │    │    └─── CardContent
                              │    │         └─── Grid of KPI tiles
                              │    │              └─── Individual metric cards
                              │    │
                              ├─── renderMetricTile()
                              │    └─── Single metric card with value
                              │
                              └─── [Future Section Types]
                                   ├─── renderChart()
                                   ├─── renderTable()
                                   └─── renderMap()
```

---

## 🔍 Detailed Component Breakdown

### **1. App.tsx**
- **Role**: Application root
- **Renders**: `MainApp` (when logged in) or `LoginScreen`
- **State**: User authentication state

---

### **2. MainApp.tsx**
- **Role**: Main application container with navigation
- **Renders**: 
  - Header with navigation tabs
  - Tab content (Dashboards, Build, Data Input, Administration, etc.)
- **Key Features**:
  - Role-based navigation (Executive, Site Manager, Supervisor)
  - Dashboard tab switching
  - Manages active dashboard ID

---

### **3. DashboardBuilder.tsx** *(Builder Flow)*
- **Role**: Dashboard creation and editing interface
- **Location**: "Build" tab in MainApp
- **Key Features**:
  - Dashboard metadata editing (name, description, target role)
  - Section management (add, remove, reorder, configure)
  - Preview with test roles (Executive, Site Manager, Supervisor)
  - Density mode control (Compact, Normal, Comfortable)
  - Drill-down simulation
- **Children**:
  - `BuilderPreviewWrapper` - Live preview of dashboard
  - `DashboardRenderer` - Renders each section
  - Floating sidebar for adding sections
  - Configuration dialogs (Metric Tile, KPI Cards, Data Source, Chart Type)

---

### **4. PublishedDashboardsView.tsx** *(Published Flow)*
- **Role**: Display published dashboards to end users
- **Location**: "Dashboards" tab in MainApp
- **Key Features**:
  - Read-only dashboard viewing
  - Optional edit mode (for authorized users)
  - Switches to `DashboardBuilder` when editing
- **Children**:
  - `BuilderPreviewWrapper` - Same canvas as builder
  - `SectionRenderer` - NEW self-contained section rendering

---

### **5. BuilderPreviewWrapper.tsx** *(Shared Preview Canvas)*
- **Role**: Unified grid system and canvas for all dashboards
- **Used By**: Both `DashboardBuilder` AND `PublishedDashboardsView`
- **Key Features**:
  - 12-column CSS Grid layout
  - Drag & drop reordering (builder mode only)
  - Resizable sections (builder mode only)
  - Section stacking (stackGroup support)
  - Density mode support
  - Context menu on sections (builder mode only)
- **Props**:
  - `builderMode` - Controls drag/resize/context menu features
  - `sections` - Array of section objects with content
  - `densityMode` - Spacing between sections
  - `onReorder`, `onResize`, `onConfigure`, etc. - Event handlers
- **Children**:
  - `DraggablePreviewSection` - Wraps each section
  - `SectionContextMenu` - Right-click menu (builder only)

---

### **6. DraggablePreviewSection** *(Internal to BuilderPreviewWrapper)*
- **Role**: Individual section wrapper with drag/resize/context menu
- **Features**:
  - Drag handle (builder mode only)
  - Resize handles (builder mode only)
  - Grid column span calculation
  - Height management
  - Hover effects and visual feedback

---

### **7. DashboardRenderer.tsx** *(Used in Builder Flow)*
- **Role**: Renders dashboard sections for the builder preview
- **Used By**: `DashboardBuilder` only
- **Features**:
  - Renders all section types
  - Global date range and filters
  - Drill-down navigation
  - Section-specific data fetching
- **Will Be Deprecated**: Being replaced by `SectionRenderer`

---

### **8. SectionRenderer.tsx** *(NEW - Used in Published Flow)*
- **Role**: Self-contained section rendering with embedded controls
- **Used By**: `PublishedDashboardsView` (will expand to `DashboardBuilder`)
- **Key Features**:
  - **Self-contained state** - Each section manages its own:
    - Date range picker (embedded in CardHeader)
    - Filter states
    - Loading states
    - Drill-down states
  - **No global filters** - Sections are independent
  - **Consistent rendering** - Same section looks identical in builder & published views
- **Current Section Types**:
  - `kpi-cards` - Grid of KPI metric cards
  - `metric-tile` - Single metric tile
  - `saved-section` - Recursively renders saved section
  - Default fallback for unimplemented types
- **Future Section Types**:
  - `job-function-table`
  - `site-performance-chart`
  - `hierarchical-table`
  - `performance-map`
  - `rankings`
  - `pie-chart`
  - Charts (line, bar, area, combo)

---

## 🎨 Design System Integration

All components use **CSS variables** from `/styles/globals.css`:

### **Colors**
```css
--color-background
--color-foreground
--color-card
--color-border
--color-primary
--color-muted
--color-muted-foreground
--color-success
--color-destructive
--color-chart-1 through --color-chart-5
```

### **Spacing**
```css
--spacing-1 through --spacing-12
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, --spacing-2xl
--spacing-section (for dashboard section spacing)
--grid-gap (for grid spacing)
--grid-outer-gap (for outer grid spacing)
```

### **Typography**
```css
--font-family-inter
--font-family-mono
--text-label, --text-body, --text-h1, --text-h2, etc.
--font-weight-normal, --font-weight-medium, --font-weight-semibold, --font-weight-bold
```

### **Radius**
```css
--radius-sm, --radius-md, --radius-lg, --radius-xl
```

---

## 🔄 Data Flow

### **Builder Flow**
1. User edits dashboard in `DashboardBuilder`
2. Sections added via floating sidebar
3. Preview renders via `BuilderPreviewWrapper` → `DashboardRenderer`
4. User saves dashboard → stored in `mockData.ts`
5. User publishes → creates entry in `publishedDashboards`

### **Published Flow**
1. User logs in with role (Executive, Site Manager, Supervisor)
2. `MainApp` fetches published dashboards for user's role
3. `PublishedDashboardsView` displays active dashboard
4. Sections render via `BuilderPreviewWrapper` → `SectionRenderer`
5. Each section fetches its own data independently

---

## 📐 Grid System

### **12-Column Grid**
Both builder and published views use a **12-column CSS Grid**:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--grid-gap);
}
```

### **Column Spans**
Sections can span 3, 4, 6, 8, or 12 columns:
- **12 columns** = Full width
- **6 columns** = Half width
- **4 columns** = Third width
- **3 columns** = Quarter width

### **Section Stacking**
Sections with the same `stackGroup` property are vertically stacked in a single column.

---

## 🎯 Key Differences: Builder vs Published

| Feature | Builder Mode | Published Mode |
|---------|-------------|----------------|
| **Drag & Drop** | ✅ Enabled | ❌ Disabled |
| **Resize** | ✅ Enabled | ❌ Disabled |
| **Context Menu** | ✅ Enabled | ❌ Disabled |
| **Date Picker** | 🔄 Global (via DashboardRenderer) | ✅ Per-section (via SectionRenderer) |
| **Filters** | 🔄 Global | ✅ Per-section |
| **Section Renderer** | DashboardRenderer | SectionRenderer |
| **Floating Sidebar** | ✅ Visible | ❌ Hidden |
| **Edit Controls** | ✅ Visible | ❌ Hidden (unless in edit mode) |

---

## 🚀 Current Migration Status

### ✅ Completed
- [x] Created `BuilderPreviewWrapper` as shared canvas
- [x] `PublishedDashboardsView` uses `BuilderPreviewWrapper`
- [x] Created `SectionRenderer` with self-contained sections
- [x] Date pickers embedded in section CardHeaders
- [x] KPI Cards section fully implemented
- [x] All CSS variables integrated

### 🔄 In Progress
- [ ] Migrate `DashboardBuilder` to use `SectionRenderer` (instead of `DashboardRenderer`)
- [ ] Add remaining section types to `SectionRenderer`:
  - [ ] `job-function-table`
  - [ ] `site-performance-chart`
  - [ ] `hierarchical-table`
  - [ ] `performance-map`
  - [ ] `rankings`
  - [ ] Charts (line, bar, area, pie, combo)

### 📋 Next Steps
1. Add all missing section types to `SectionRenderer`
2. Update `DashboardBuilder` to use `SectionRenderer` instead of `DashboardRenderer`
3. Delete `DashboardRenderer.tsx` (consolidation complete)
4. Test all section types in both builder and published views
5. Verify all drill-down, filtering, and date range features work independently per section

---

## 📁 File Locations

```
/components/
├── App.tsx
├── MainApp.tsx
├── DashboardBuilder.tsx (Builder interface)
├── PublishedDashboardsView.tsx (Published view)
├── BuilderPreviewWrapper.tsx (Shared canvas)
├── DashboardRenderer.tsx (Legacy - will be deprecated)
├── SectionRenderer.tsx (NEW - self-contained sections)
├── DateRangePicker.tsx (Embedded in sections)
└── [Individual section components]

/lib/
├── mockData.ts (Dashboard data)
└── sectionDefinitions.ts (Section configurations)

/styles/
└── globals.css (Design system CSS variables)
```

---

## 🎓 Understanding the Architecture

### **Why Two Renderers?**
- **DashboardRenderer** (Legacy): Used in builder, has global filters/date range
- **SectionRenderer** (New): Self-contained, each section manages own state

### **Why Shared Canvas?**
- **Single source of truth** for grid layout
- **Consistent rendering** between builder and published views
- **Eliminates duplication** of grid/drag/resize logic

### **Why Self-Contained Sections?**
- **Independent functionality** - Sections don't interfere with each other
- **Flexible date ranges** - Different sections can have different date ranges
- **Easier testing** - Each section is isolated
- **Better UX** - Users can configure each section independently

---

This architecture creates a **powerful, flexible, and maintainable** dashboard system that adheres to your design system and scales to support complex enterprise dashboards! 🎉
