# Self-Contained Section Architecture

## Overview

We've simplified the dashboard rendering architecture by making each section **completely self-contained** with its own state management, eliminating the need for DashboardRenderer as a middleman component.

## New Architecture

```
PublishedDashboardsView
  ↓
  → BuilderPreviewWrapper (builderMode=false)
      ↓
      → SectionRenderer (per section)
          • Own date range state
          • Own filter state
          • Own loading state
          • Own drill-down state
          • Own data fetching logic
```

## Key Components

### 1. **SectionRenderer** (`/components/SectionRenderer.tsx`)
A completely self-contained component that:
- **Manages its own state**: dates, filters, drill-downs, loading
- **Fetches its own data**: contextMetrics based on role and filters
- **Renders any section type**: metric-tile, kpi-cards, charts, tables, etc.
- **No dependencies**: doesn't rely on parent state or global filters

**Props:**
```tsx
interface SectionRendererProps {
  section: DashboardSection;
  siteId?: string;
  jobFunctionId?: string;
  previewRole?: 'vp' | 'site-manager' | 'supervisor';
  builderMode?: boolean;
  onConfigureMetricTile?: (sectionId: string) => void;
  hideDescription?: boolean;
  onDrillDown?: (drillDownInfo: {...}) => void;
}
```

**Self-Contained State:**
- `startDate` / `endDate` - Default: last 30 days
- `aggregation` - daily/weekly/monthly/total
- `showUnderperformingOnly` - Filter for items < 95%
- `selectedSiteId` - Site filter
- `isLoading` - 500ms simulated loading
- `drillDownPath` - Hierarchical navigation

### 2. **PublishedDashboardsView** (Updated)
Now uses BuilderPreviewWrapper directly:

```tsx
const sectionsWithContent = useMemo(() => {
  return dashboard.sections.map((section) => ({
    ...section,
    content: (
      <SectionRenderer
        section={section}
        siteId={siteId}
        jobFunctionId={jobFunctionId}
        builderMode={false}
      />
    ),
  }));
}, [dashboard.sections, siteId, jobFunctionId]);

<BuilderPreviewWrapper
  builderMode={false}
  sections={sectionsWithContent}
  onReorder={() => {}}
/>
```

### 3. **DashboardBuilder** (Next Update)
Will follow the same pattern as PublishedDashboardsView

## Benefits

✅ **Simpler Architecture**: No middleman (DashboardRenderer) component
✅ **Independent Sections**: Each section is fully self-contained
✅ **Easier to Maintain**: State is localized to each section
✅ **More Flexible**: Sections can have different date ranges/filters
✅ **Better Performance**: Each section manages its own loading state
✅ **Cleaner Code**: Clear separation of concerns

## Current Implementation Status

✅ SectionRenderer created with:
- Self-contained state management
- Data fetching logic
- metric-tile rendering
- kpi-cards rendering
- saved-section rendering
- Loading skeletons

✅ PublishedDashboardsView updated:
- Uses SectionRenderer + BuilderPreviewWrapper
- No longer uses DashboardRenderer

⏳ Next Steps:
1. Add remaining section types to SectionRenderer (charts, tables, etc.)
2. Update DashboardBuilder to use SectionRenderer
3. Delete DashboardRenderer (~2900 lines removed)

## Section Types to Implement

Currently implemented:
- ✅ `metric-tile`
- ✅ `kpi-cards`
- ✅ `saved-section`

To be added:
- ⏳ `hours-chart`
- ⏳ `trend-chart`
- ⏳ `top-tasks`
- ⏳ `rankings`
- ⏳ `budget-tracking`
- ⏳ `hierarchical-performance`
- ⏳ `site-map`
- ⏳ `task-distribution-pie`
- ⏳ `performance-pie-chart`
- ⏳ `custom-section`

## Migration Notes

Each section type needs:
1. **Copy render function** from DashboardRenderer
2. **Update to use local state** (contextMetrics, startDate, etc.)
3. **Ensure design system compliance** (CSS variables)
4. **Add loading skeleton** for better UX

## Design System Compliance

All sections use CSS variables from `/styles/globals.css`:
- Colors: `var(--color-*)` 
- Spacing: `var(--spacing-*)`
- Typography: `var(--font-family-inter)`, `var(--text-*)`
- Borders: `var(--color-border)`
- Radius: `var(--radius-*)`

This ensures the entire dashboard system respects your design tokens.
