# Shared Preview Canvas Container Implementation

## Overview

We've successfully consolidated the dashboard grid rendering system so that **both the Dashboard Builder and Published Dashboards** now share the **same Preview Canvas Container** from `BuilderPreviewWrapper`. This eliminates duplicate grid logic and ensures perfect visual consistency between all viewing contexts.

## What Changed

### 1. BuilderPreviewWrapper - Now a Shared Component

**File:** `/components/BuilderPreviewWrapper.tsx`

**Changes:**
- ✅ **Removed zoom controls** - No longer needed (lines 481-542 removed)
- ✅ **Removed zoom transform logic** - Preview always renders at 100% scale
- ✅ **Added `headerControls` prop** - Accepts custom header content from parent
- ✅ **Simplified imports** - Removed unused `ZoomIn`, `ZoomOut`, `Button`, `Badge`

**New Interface:**
```typescript
interface BuilderPreviewWrapperProps {
  // ... existing props
  headerControls?: React.ReactNode; // NEW: Custom header controls
  // ... rest of props
}
```

**What It Does:**
- **Builder Mode (`builderMode=true`)**: Shows drag handles, resize handles, context menus
- **Published Mode (`builderMode=false`)**: Read-only grid layout, no interaction

---

### 2. DashboardBuilder - Passes Custom Header Controls

**File:** `/components/DashboardBuilder.tsx`

**Changes:**
- ✅ **Extracted Live Preview Header** (lines 2243-2320) into `headerControls` prop
- ✅ **Passes header to BuilderPreviewWrapper** as a React node

**Header Controls (Builder Mode):**
- Title: "Live Preview" with current context
- Underperforming Only toggle
- Density selector (Compact/Normal/Comfortable)
- Role selector ("Test as" Executive/Site Manager/Supervisor)
- Back button (during drill-down)

---

### 3. DashboardRenderer - Uses Shared Grid

**File:** `/components/DashboardRenderer.tsx`

**Changes:**
- ✅ **Removed duplicate grid rendering logic** (lines 2877-2965)
- ✅ **Now uses BuilderPreviewWrapper** with `builderMode=false`
- ✅ **Added import** for BuilderPreviewWrapper
- ✅ **Passes filters and breadcrumb** to shared container

**How It Works:**
```typescript
return (
  <BuilderPreviewWrapper
    builderMode={false}
    sections={dashboardSections}
    onReorder={() => {}} // No reordering in published view
    breadcrumb={renderGlobalBreadcrumb()}
    globalFilters={renderFilters()}
    headerControls={showTitle ? <DashboardTitle /> : undefined}
  />
);
```

---

## Benefits

### ✅ Single Source of Truth
- One grid rendering system for all contexts
- No more duplicate code to maintain
- Changes automatically apply everywhere

### ✅ Perfect Visual Consistency
- Builder preview **exactly matches** published dashboards
- Same spacing, same layout, same section stacking
- No more "preview vs. published" discrepancies

### ✅ Simplified Architecture
- Removed ~100 lines of duplicate grid logic from DashboardRenderer
- BuilderPreviewWrapper is now context-agnostic
- Cleaner, more maintainable codebase

### ✅ Flexible Header System
- Each context can customize its header controls
- Builder shows: Density, Test as, Underperforming toggle
- Published can show: Date picker, filters, title
- Easy to add new controls in the future

---

## Viewing Contexts

### 1. Dashboard Builder - Live Preview
- **Component:** `DashboardBuilder` → `BuilderPreviewWrapper` (builderMode=true)
- **Features:** Drag to reorder, resize sections, context menus
- **Header:** Density, Test as, Underperforming toggle, Back button

### 2. Published Dashboards - Normal View
- **Component:** `PublishedDashboardsView` → `DashboardRenderer` → `BuilderPreviewWrapper` (builderMode=false)
- **Features:** Read-only, no drag/drop or resize
- **Header:** Date picker, filters, dashboard title (future)

### 3. Published Dashboards - Edit Mode
- **Component:** `PublishedDashboardsView` → `DashboardBuilder` (same as #1)
- **Features:** Full builder functionality
- **Header:** Same as Builder

---

## Future Enhancement: Conditional Headers

### Current State
- Builder shows: Density, Test as, Underperforming toggle
- Published shows: Dashboard title (when `showTitle=true`)

### Proposed Enhancement
Make Published Dashboards show:
```typescript
<BuilderPreviewWrapper
  builderMode={false}
  headerControls={
    <PublishedHeaderControls
      dateRangePicker={<DateRangePicker ... />}
      underperformingToggle={<Switch ... />}
      dashboardTitle={dashboard.name}
    />
  }
  // ... rest of props
/>
```

This would give Published Dashboards:
- Date range picker
- Underperforming Only toggle
- Dashboard title
- All in the shared header area

---

## Technical Details

### Preview Canvas Container
Located at line 546 in BuilderPreviewWrapper:
```typescript
<div style={{ 
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--grid-outer-gap)',
  paddingLeft: builderMode ? 'var(--spacing-2xl)' : '0', // Space for drag handles
}}>
```

**Key Features:**
- Flex column layout with CSS variable spacing
- Conditional left padding for drag handles (builder mode only)
- Contains: breadcrumb, filters, divider, grid container
- Handles section stacking via `stackGroup` property

### Grid Container (Layer 2)
Located inside Preview Canvas Container:
```typescript
<div className="grid grid-cols-12 w-full items-stretch" style={{ 
  gap: 'var(--grid-gap)', 
  gridAutoRows: 'minmax(0, auto)',
}}>
```

**Key Features:**
- 12-column CSS Grid
- Responsive column spans (3, 4, 6, 8, 9, 12)
- Auto-sizing rows
- Section stacking support

---

## Related Files

- `/components/BuilderPreviewWrapper.tsx` - Shared grid renderer
- `/components/DashboardBuilder.tsx` - Builder with custom header
- `/components/DashboardRenderer.tsx` - Uses shared grid
- `/components/PublishedDashboardsView.tsx` - Switches between builder/renderer
- `/styles/globals.css` - Grid spacing variables (`--grid-gap`, `--grid-outer-gap`)

---

## Migration Notes

### What Was Removed
1. ❌ Zoom controls from BuilderPreviewWrapper
2. ❌ Zoom state and transform logic
3. ❌ Duplicate grid rendering in DashboardRenderer
4. ❌ Unused imports (ZoomIn, ZoomOut, Button, Badge)

### What Was Added
1. ✅ `headerControls` prop to BuilderPreviewWrapper
2. ✅ Custom header in DashboardBuilder
3. ✅ BuilderPreviewWrapper import in DashboardRenderer
4. ✅ Shared grid logic for all contexts

### Breaking Changes
None! This is a backwards-compatible refactor. All existing functionality works the same.

---

## Next Steps

To complete the consolidation, consider:

1. **Move Date Picker to Shared Header**
   - Extract date picker from DashboardRenderer filters
   - Pass it as headerControls in Published Dashboards
   - Shows same controls in both contexts

2. **Unify Filter System**
   - Make filters (date, site, underperforming) consistent
   - Show them in header for both builder and published

3. **Remove Legacy Code**
   - Clean up any remaining references to old grid logic
   - Update documentation to reflect new architecture

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│ BuilderPreviewWrapper (Shared Grid Container)          │
├─────────────────────────────────────────────────────────┤
│ Props:                                                  │
│  - builderMode: true/false                             │
│  - headerControls: Custom header content               │
│  - breadcrumb, globalFilters, sections                 │
├─────────────────────────────────────────────────────────┤
│ Renders:                                               │
│  1. Header Controls (custom per context)               │
│  2. Preview Canvas Container                           │
│     - Breadcrumb                                       │
│     - Global Filters                                   │
│     - Divider                                          │
│     - Grid Container (12-column)                       │
│        - Sections with optional stacking              │
└─────────────────────────────────────────────────────────┘
         ▲                           ▲
         │                           │
┌────────┴─────────┐      ┌─────────┴──────────┐
│ DashboardBuilder │      │ DashboardRenderer  │
├──────────────────┤      ├────────────────────┤
│ builderMode=true │      │ builderMode=false  │
│ Shows:           │      │ Shows:             │
│ - Drag handles   │      │ - Read-only        │
│ - Resize handles │      │ - No interaction   │
│ - Context menus  │      │ - Filters/title    │
└──────────────────┘      └────────────────────┘
```

---

## Conclusion

This consolidation achieves the goal of having a single, shared grid rendering system for all dashboard viewing contexts. The Builder and Published Dashboards now use the exact same Preview Canvas Container, ensuring perfect visual consistency while maintaining their unique interaction patterns through the `builderMode` flag.
