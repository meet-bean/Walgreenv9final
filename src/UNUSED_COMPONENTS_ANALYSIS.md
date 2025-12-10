# 🗂️ Unused Components Analysis

## 📊 Current Active Flow

```
App.tsx
  └─ LoginScreen.tsx
  └─ MainApp.tsx
      ├─ ModernDashboardBuilder.tsx (Dashboard builder/preview)
      │   └─ DashboardRenderer.tsx (Renders dashboards)
      │       ├─ TaskTile.tsx
      │       ├─ HierarchicalPerformanceTable.tsx
      │       ├─ SitePerformanceMap.tsx
      │       ├─ DynamicRankings.tsx
      │       ├─ PerformancePieChart.tsx
      │       ├─ BuilderPreviewWrapper.tsx
      │       ├─ DateRangePicker.tsx
      │       └─ SkeletonLoaders.tsx
      │   └─ ModernDateRangePicker.tsx
      ├─ DataInputFlow.tsx (Data input screen)
      ├─ AlertsManagement.tsx (Alerts screen)
      │   └─ CreateAlertDialog.tsx
      └─ UnifiedSettingsAdmin.tsx (Settings screen)
          ├─ SystemSettings.tsx
          ├─ UserManagement.tsx
          ├─ DataInputPermissions.tsx
          ├─ AuditLogs.tsx
          └─ BulkOperations.tsx
```

---

## ❌ UNUSED / DEPRECATED Components

### 🗑️ Old Dashboard Components (Replaced by ModernDashboardBuilder)

These were the original role-specific dashboards before we moved to the unified dashboard builder system:

- **`ExecutiveDashboard.tsx`** - Old executive dashboard (replaced)
- **`SiteManagerDashboard.tsx`** - Old site manager dashboard (replaced)
- **`SupervisorDashboard.tsx`** - Old supervisor dashboard (replaced)
- **`SupervisorDashboardWithLayout.tsx`** - Old supervisor dashboard variant (replaced)
- **`DashboardBuilder.tsx`** - Original dashboard builder (replaced by ModernDashboardBuilder)

**Status**: Can be deleted - superseded by ModernDashboardBuilder + DashboardRenderer

---

### 🗑️ Old Dialog/Sidebar Components

These may have been replaced by newer implementations:

- **`AddSectionDialog.tsx`** - Old add section dialog
  - Modern version uses inline sidebar in ModernDashboardBuilder
  - Check if still used before deleting

- **`DashboardSectionsSidebar.tsx`** - Old sections sidebar
  - ModernDashboardBuilder has its own sidebar
  - Likely deprecated

- **`SaveSectionDialog.tsx`** - Section saving dialog
  - Check if still used for saving section presets

- **`SectionContextMenu.tsx`** - Context menu for sections
  - Check if used in DashboardRenderer

- **`SectionLibrary.tsx`** - Section library/catalog
  - Replaced by inline sidebar with SECTION_DEFINITIONS

---

### 🗑️ Tile System Components (Old Architecture)

These were part of an older tile-based system:

- **`TileLibrary.tsx`** - Tile library
- **`TileConfigDialog.tsx`** - Tile configuration
- **`TileDataRenderer.tsx`** - Tile data renderer
- **`DraggableTile.tsx`** - Draggable tile component
- **`GridCanvas.tsx`** - Grid canvas for tiles
- **`MetricTileDialog.tsx`** - Metric tile dialog
- **`TaskTile.tsx`** - ✅ STILL USED in DashboardRenderer

**Status**: Most can be deleted except TaskTile which is actively used

---

### 🗑️ Old/Unused Features

- **`SharedDashboardGrid.tsx`** - Old shared grid component
  - Check if used by DashboardRenderer

- **`DashboardPublishDialog.tsx`** - Publishing dialog
  - Published dashboards feature was removed per PUBLISHED_DASHBOARDS_VIEW_REMOVED.md

- **`DashboardSearch.tsx`** - Dashboard search component
  - Not visible in current UI flow

- **`DashboardVersionHistory.tsx`** - Version history component
  - Feature exists but might not be actively displayed

- **`DashboardChangeNotification.tsx`** - Change notifications
  - Not visible in current UI

- **`TemplateSelector.tsx`** - Template selection
  - Not used in current builder

---

### 🗑️ Advanced/Optional Features (Not Currently Active)

- **`AIAssistant.tsx`** - AI assistant feature
- **`CommentsAnnotations.tsx`** - Comments/annotations
- **`GoalsTracking.tsx`** - Goals tracking
- **`AnalyticsPredictions.tsx`** - Analytics predictions
- **`MLDashboard.tsx`** - Machine learning dashboard
- **`MLInsightsWidget.tsx`** - ML insights widget
- **`MLPerformanceComparison.tsx`** - ML performance comparison
- **`ExportReporting.tsx`** - Export/reporting features
- **`MetricsCatalog.tsx`** - Metrics catalog
- **`FormulaBuilder.tsx`** - Formula builder
- **`ChartTypePicker.tsx`** - Chart type picker

**Status**: These are "nice to have" features that aren't currently integrated into the main flow

---

### 🧪 Demo/Test Components

- **`DraggableDashboardDemo.tsx`** - Demo component
- **`UIImprovementsDemo.tsx`** - Demo component
- **`DesignTestCanvas.tsx`** - Test canvas

**Status**: Can be deleted or moved to a /demos folder

---

### 📱 Data Input Blocks

- **`DataEntryDesktop.tsx`** - ✅ USED by DataInputFlow
- **`DataEntryMobile.tsx`** - ✅ USED by DataInputFlow
- **`DataSourceBlock.tsx`** - ❓ Check if used
- **`SpreadsheetReferenceView.tsx`** - ❓ Check if used
- **`SupervisorMapView.tsx`** - ❓ Check if used

**Status**: DataEntryDesktop and DataEntryMobile are ACTIVE

---

### 🔧 Dialogs (Need to Check)

- **`CustomDataEntryDialog.tsx`** - Custom data entry
- **`DataSourceConfigDialog.tsx`** - Data source config
- **`GrantPermissionDialog.tsx`** - Permission granting
- **`KPICardsConfigDialog.tsx`** - KPI cards configuration

**Status**: Need to verify if these are used by active screens

---

### 📈 Visualization Components (Check Usage)

- **`HierarchyDataView.tsx`** - Hierarchy data view
  - Might be used by DashboardRenderer

---

## ✅ CONFIRMED ACTIVE Components

### Core Navigation & Layout

- ✅ `LoginScreen.tsx`
- ✅ `MainApp.tsx`
- ✅ `ErrorBoundary.tsx`

### Dashboard System

- ✅ `ModernDashboardBuilder.tsx`
- ✅ `DashboardRenderer.tsx`
- ✅ `BuilderPreviewWrapper.tsx`

### Dashboard Section Renderers

- ✅ `TaskTile.tsx`
- ✅ `HierarchicalPerformanceTable.tsx`
- ✅ `SitePerformanceMap.tsx`
- ✅ `DynamicRankings.tsx`
- ✅ `PerformancePieChart.tsx`

### Date/Time

- ✅ `ModernDateRangePicker.tsx`
- ✅ `DateRangePicker.tsx`

### Main Screens

- ✅ `DataInputFlow.tsx`
  - ✅ `DataEntryDesktop.tsx` (blocks/)
  - ✅ `DataEntryMobile.tsx` (blocks/)
- ✅ `AlertsManagement.tsx`
- ✅ `UnifiedSettingsAdmin.tsx`

### Settings Tabs

- ✅ `SystemSettings.tsx`
- ✅ `UserManagement.tsx`
- ✅ `DataInputPermissions.tsx`
- ✅ `AuditLogs.tsx`
- ✅ `BulkOperations.tsx`

### Settings Dialogs

- ✅ `CreateAlertDialog.tsx`

### UI Components

- ✅ `SkeletonLoaders.tsx`
- ✅ All `/components/ui/*` shadcn components

---

## 🎯 Recommended Actions

### Phase 1: ✅ DELETED (Completed November 14, 2024)

```
✅ ExecutiveDashboard.tsx - DELETED (replaced by unified system)
✅ SiteManagerDashboard.tsx - DELETED (replaced by unified system)
✅ SupervisorDashboard.tsx - DELETED (replaced by unified system)
✅ SupervisorDashboardWithLayout.tsx - DELETED (replaced by unified system)
✅ DashboardBuilder.tsx - DELETED (replaced by ModernDashboardBuilder)
✅ DashboardPublishDialog.tsx - DELETED (feature removed per PUBLISHED_DASHBOARDS_VIEW_REMOVED.md)
✅ DraggableDashboardDemo.tsx - DELETED (demo component)
✅ UIImprovementsDemo.tsx - DELETED (demo component)
✅ DesignTestCanvas.tsx - DELETED (test component)
```

**Total Deleted**: 9 files
**Lines of Code Removed**: ~5,000+ lines

### Phase 2: ✅ DELETED (Completed November 14, 2024)

**Standalone Unused (9 files)**
```
✅ AddSectionDialog.tsx - DELETED
✅ DashboardSectionsSidebar.tsx - DELETED
✅ SectionLibrary.tsx - DELETED
✅ TileLibrary.tsx - DELETED
✅ SharedDashboardGrid.tsx - DELETED
✅ DashboardSearch.tsx - DELETED
✅ DashboardVersionHistory.tsx - DELETED
✅ DashboardChangeNotification.tsx - DELETED
✅ TemplateSelector.tsx - DELETED
```

**Tile System - Circular Dependencies (4 files)**
```
✅ GridCanvas.tsx - DELETED (circular with DraggableTile)
✅ DraggableTile.tsx - DELETED (circular with GridCanvas)
✅ TileConfigDialog.tsx - DELETED (only used by tile system)
✅ TileDataRenderer.tsx - DELETED (only used by tile system)
```

**Unused Dialogs (3 files)**
```
✅ KPICardsConfigDialog.tsx - DELETED (not imported)
✅ SaveSectionDialog.tsx - DELETED (only used by KPICardsConfigDialog)
✅ MetricTileDialog.tsx - DELETED (only used by KPICardsConfigDialog)
```

**KEPT (Actively Used - 2 files)**
```
✅ SectionContextMenu.tsx - ACTIVE (used by BuilderPreviewWrapper)
✅ BuilderPreviewWrapper.tsx - ACTIVE (used by DashboardRenderer)
```

**Total Deleted**: 16 files  
**Lines of Code Removed**: ~8,000+ lines

### Phase 3: Future Features (Keep for Now)

These might be useful later:

```
◐ AIAssistant.tsx
◐ CommentsAnnotations.tsx
◐ GoalsTracking.tsx
◐ AnalyticsPredictions.tsx
◐ MLDashboard.tsx
◐ MLInsightsWidget.tsx
◐ MLPerformanceComparison.tsx
◐ ExportReporting.tsx
◐ MetricsCatalog.tsx
◐ FormulaBuilder.tsx
◐ ChartTypePicker.tsx
```

### Phase 4: Data Input Components

```
✅ DataEntryDesktop.tsx - ACTIVE (used by DataInputFlow)
✅ DataEntryMobile.tsx - ACTIVE (used by DataInputFlow)
? DataSourceBlock.tsx
? SpreadsheetReferenceView.tsx
? SupervisorMapView.tsx
? CustomDataEntryDialog.tsx
? DataSourceConfigDialog.tsx
? GrantPermissionDialog.tsx
? KPICardsConfigDialog.tsx
```

---

## 📋 Next Steps

1. **Run import analysis** - Search entire codebase for each component
2. **Create /deprecated folder** - Move unused components there first
3. **Test thoroughly** - Ensure nothing breaks
4. **Delete after confirmation** - Remove deprecated components
5. **Document** - Update this file with findings

---

## 🔍 How to Check If Component Is Used

Run this command for each component:

```bash
# Example: Check if ExecutiveDashboard is used
grep -r "ExecutiveDashboard" --include="*.tsx" --include="*.ts" .
```

If only the component file itself shows up, it's unused and safe to delete.

---

## 🎉 Cleanup Progress

| Phase | Status | Files | Notes |
|-------|--------|-------|-------|
| Phase 1 | ✅ **COMPLETE** | 9/9 deleted | Old dashboards, demos, removed features |
| Phase 2 | ✅ **COMPLETE** | 16/16 deleted | Old tile system, unused dialogs, circular dependencies |
| Phase 3 | ⏸️ On Hold | 11 files | Future features - keeping for now |
| Phase 4 | ⏳ Pending | 7 to verify | Data input components |

**Total Progress**: **25 files deleted**, **~13,000+ lines of code removed**, **28% component reduction**

---

**Last Updated**: November 14, 2024  
**Phase 1 Status**: ✅ COMPLETE (see /PHASE_1_CLEANUP_COMPLETE.md)  
**Phase 2 Status**: ✅ COMPLETE (see /PHASE_2_CLEANUP_COMPLETE.md)  
**Next Action**: Phase 3/4 - Review future features and data input components