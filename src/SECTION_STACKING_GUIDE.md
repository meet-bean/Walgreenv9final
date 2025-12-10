# Section Stacking Guide 📚

## What is Section Stacking?

Section stacking allows you to **vertically stack multiple sections within the same column space** on your dashboard. This creates a more compact, organized layout.

## Visual Example

### Without Stacking (Normal Layout)
```
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ Section 1 │ │ Section 2 │ │ Section 3 │ │ Section 4 │
│ col-span-3│ │ col-span-3│ │ col-span-3│ │ col-span-3│
└───────────┘ └───────────┘ └───────────┘ └───────────┘
```

### With Stacking (Sections 3 & 4 stacked)
```
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ Section 1 │ │ Section 2 │ │ Section 3 │ │ Section 5 │
│ col-span-3│ │ col-span-3│ ├───────────┤ │ col-span-3│
│           │ │           │ │ Section 4 │ │           │
└───────────┘ └───────────┘ └───────────┘ └───────────┘
```

Sections 3 and 4 share the same column space (col-span-3) but are stacked vertically!

## How to Use Stack Groups

### Step 1: Define a Stack Group ID

Give sections the same `stackGroup` property to stack them together:

```typescript
const dashboard: DashboardDefinition = {
  sections: [
    {
      id: 'section-1',
      type: 'kpi-cards',
      title: 'Key Metrics',
      columnSpan: 3,
      // No stackGroup - standalone section
    },
    {
      id: 'section-2',
      type: 'trend-chart',
      title: 'Trend Chart',
      columnSpan: 3,
      // No stackGroup - standalone section
    },
    {
      id: 'section-3',
      type: 'pie-chart',
      title: 'Distribution',
      columnSpan: 3,
      stackGroup: 'group-A', // ← Stack with other sections in 'group-A'
    },
    {
      id: 'section-4',
      type: 'bar-chart',
      title: 'Comparison',
      columnSpan: 3,
      stackGroup: 'group-A', // ← Stacked with section-3
    },
    {
      id: 'section-5',
      type: 'rankings',
      title: 'Top Performers',
      columnSpan: 3,
      // No stackGroup - standalone section
    },
  ]
}
```

### Step 2: Ensure Consistent Column Span

**Important:** All sections in the same stack group should have the **same `columnSpan`** value. The first section's `columnSpan` determines the width of the entire stack.

✅ **Good:**
```typescript
{ id: 'a', columnSpan: 3, stackGroup: 'stack-1' }
{ id: 'b', columnSpan: 3, stackGroup: 'stack-1' } // ✓ Same as 'a'
```

❌ **Bad:**
```typescript
{ id: 'a', columnSpan: 3, stackGroup: 'stack-1' }
{ id: 'b', columnSpan: 6, stackGroup: 'stack-1' } // ✗ Different span!
```

## Stack Group Properties

### `stackGroup` (optional string)

**What it does:**
- Sections with the same `stackGroup` ID are rendered in a vertical stack
- The stack occupies a single column in the grid
- Sections are evenly distributed with `flex: 1`

**Valid values:**
- Any string (e.g., `'group-A'`, `'stack-1'`, `'sidebar-widgets'`)
- Must be unique per stack group
- Omit to render section normally (not stacked)

**Default:** `undefined` (no stacking)

## Layout Behavior

### Height Distribution

Stacked sections share the available height **equally by default**:

```tsx
<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  gap: 'var(--grid-gap)',
  height: '100%',
}}>
  <div style={{ flex: 1 }}>Section A</div>  {/* Takes 50% height */}
  <div style={{ flex: 1 }}>Section B</div>  {/* Takes 50% height */}
</div>
```

For 3 stacked sections, each gets ~33% height, and so on.

### Gap Between Stacked Sections

The gap between stacked sections uses the same `--grid-gap` CSS variable as the main grid:

```css
/* In /styles/globals.css */
--grid-gap: 1rem; /* 16px - controls both horizontal AND vertical gaps */
```

To adjust stacking tightness, change `--grid-gap` (see `/DASHBOARD_SPACING_CONTROL.md`).

## Example Layouts

### Example 1: Sidebar Dashboard

```typescript
sections: [
  // Left sidebar - 3 stacked widgets
  { id: 'widget-1', columnSpan: 3, stackGroup: 'sidebar' },
  { id: 'widget-2', columnSpan: 3, stackGroup: 'sidebar' },
  { id: 'widget-3', columnSpan: 3, stackGroup: 'sidebar' },
  
  // Main content
  { id: 'main-chart', columnSpan: 9 },
]
```

**Result:**
```
┌───────────┐ ┌─────────────────────────────┐
│ Widget 1  │ │                             │
├───────────┤ │                             │
│ Widget 2  │ │       Main Chart            │
├───────────┤ │                             │
│ Widget 3  │ │                             │
└───────────┘ └─────────────────────────────┘
```

### Example 2: Comparison Dashboard

```typescript
sections: [
  // Left column - 2 metrics stacked
  { id: 'metric-a', columnSpan: 4, stackGroup: 'left' },
  { id: 'metric-b', columnSpan: 4, stackGroup: 'left' },
  
  // Middle column - single chart
  { id: 'trend', columnSpan: 4 },
  
  // Right column - 2 rankings stacked
  { id: 'top-sites', columnSpan: 4, stackGroup: 'right' },
  { id: 'top-tasks', columnSpan: 4, stackGroup: 'right' },
]
```

**Result:**
```
┌───────────┐ ┌───────────┐ ┌───────────┐
│ Metric A  │ │           │ │ Top Sites │
├───────────┤ │   Trend   │ ├───────────┤
│ Metric B  │ │           │ │ Top Tasks │
└───────────┘ └───────────┘ └───────────┘
```

### Example 3: Executive Dashboard

```typescript
sections: [
  // Full-width header
  { id: 'kpis', columnSpan: 12 },
  
  // Second row - 3 columns, middle column stacked
  { id: 'chart-1', columnSpan: 4 },
  { id: 'small-a', columnSpan: 4, stackGroup: 'center' },
  { id: 'small-b', columnSpan: 4, stackGroup: 'center' },
  { id: 'chart-2', columnSpan: 4 },
]
```

**Result:**
```
┌────────────────────────────────────────┐
│              KPI Cards                 │
└────────────────────────────────────────┘
┌──────────┐ ┌──────────┐ ┌──────────┐
│          │ │ Small A  │ │          │
│ Chart 1  │ ├──────────┤ │ Chart 2  │
│          │ │ Small B  │ │          │
└──────────┘ └──────────┘ └──────────┘
```

## Best Practices

### ✅ Do

- Use consistent `columnSpan` within each stack group
- Use descriptive stack group names (e.g., `'sidebar'`, `'metrics-stack'`)
- Keep 2-3 sections per stack for readability
- Ensure stacked content has similar information density

### ❌ Don't

- Mix different `columnSpan` values in the same stack group
- Stack more than 4 sections (gets cramped)
- Use the same `stackGroup` ID for sections that should be in different columns
- Forget to test on different screen sizes

## Implementation Details

### How It Works

1. **BuilderPreviewWrapper** (builder mode):
   - Groups sections by `stackGroup` property
   - Creates a flex container for each stack group
   - Renders grouped sections with `flex: 1` for equal height distribution

2. **DashboardRenderer** (published mode):
   - Uses the same grouping logic
   - Ensures visual consistency between builder and published views

3. **Grid Integration**:
   - Stack groups occupy a single grid cell
   - The grid cell spans the column width defined by the first section's `columnSpan`
   - Nested flex layout handles vertical stacking

### Code Example

```tsx
// BuilderPreviewWrapper.tsx (simplified)
{sections.forEach((section) => {
  if (section.stackGroup && !processedGroups.has(section.stackGroup)) {
    const groupSections = sections.filter(s => s.stackGroup === section.stackGroup);
    
    return (
      <div className={gridClass}> {/* Grid cell */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-gap)' }}>
          {groupSections.map(s => (
            <div style={{ flex: 1 }}>{s.content}</div>
          ))}
        </div>
      </div>
    );
  }
})}
```

## Customization

### Custom Height Distribution

Currently, all stacked sections get equal height (`flex: 1`). To customize:

**Future enhancement:** Add a `flexGrow` property to DashboardSection:

```typescript
{
  id: 'section-a',
  stackGroup: 'stack-1',
  flexGrow: 2, // Takes 2x the space of section-b
}
{
  id: 'section-b',
  stackGroup: 'stack-1',
  flexGrow: 1, // Takes 1x space
}
```

### Custom Gap Between Stacked Sections

Use the global `--grid-gap` CSS variable (see `/DASHBOARD_SPACING_CONTROL.md`):

```css
/* Tighter stacking */
--grid-gap: 0.5rem; /* 8px */

/* Looser stacking */
--grid-gap: 1.5rem; /* 24px */
```

## Files Modified

- ✅ `/lib/mockData.ts` - Added `stackGroup?: string` to `DashboardSection` interface
- ✅ `/components/BuilderPreviewWrapper.tsx` - Stack group rendering logic
- ✅ `/components/DashboardRenderer.tsx` - Stack group rendering logic (published view)

## Testing

To test section stacking:

1. Open Dashboard Builder
2. Edit a dashboard's section definitions in code or via UI (future)
3. Add `stackGroup: 'test-stack'` to 2-3 sections with the same `columnSpan`
4. View in builder preview - sections should stack vertically
5. Publish dashboard - published view should match exactly

## Future Enhancements

- 🔄 UI controls to assign/unassign stack groups (drag-and-drop)
- 🔄 Custom `flexGrow` per section for unequal height distribution
- 🔄 Visual indicator showing which sections are stacked together
- 🔄 Drag to reorder sections within a stack group
- 🔄 Stack group templates (e.g., "3-panel sidebar", "comparison layout")

**Stack your sections for cleaner, more organized dashboards!** 📊
