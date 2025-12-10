# Section Stacking Demo & Quick Start 🚀

## Quick Example - Copy & Paste Ready!

Here's a working example you can use immediately. This creates a dashboard with stacked sections:

```typescript
const exampleDashboard: DashboardDefinition = {
  id: 'demo-stacked',
  name: 'Stacked Sections Demo',
  description: 'Example dashboard showing section stacking',
  createdBy: 'demo-user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  targetRole: 'executive',
  sections: [
    // Row 1: Full-width KPI cards
    {
      id: 'section-header-kpis',
      type: 'kpi-cards',
      title: 'Key Performance Indicators',
      order: 0,
      columnSpan: 12, // Full width
      heightPx: 200,
    },
    
    // Row 2: Three columns - left single, middle stacked, right single
    {
      id: 'section-left-chart',
      type: 'trend-chart',
      title: 'Performance Trend',
      order: 1,
      columnSpan: 4, // 1/3 width
      heightPx: 400,
    },
    {
      id: 'section-middle-top',
      type: 'pie-chart',
      title: 'Task Distribution',
      order: 2,
      columnSpan: 4, // 1/3 width
      heightPx: 400,
      stackGroup: 'middle-stack', // ← STACKED with section-middle-bottom
    },
    {
      id: 'section-middle-bottom',
      type: 'bar-chart',
      title: 'Site Comparison',
      order: 3,
      columnSpan: 4, // 1/3 width (must match middle-top!)
      heightPx: 400,
      stackGroup: 'middle-stack', // ← STACKED with section-middle-top
    },
    {
      id: 'section-right-rankings',
      type: 'rankings',
      title: 'Top Performers',
      order: 4,
      columnSpan: 4, // 1/3 width
      heightPx: 400,
    },
  ],
  filters: {
    allowDateRange: true,
    allowSiteFilter: true,
  },
};
```

### Visual Result

```
┌──────────────────────────────────────────────────────┐
│           Key Performance Indicators                 │
│                  (Full Width)                        │
└──────────────────────────────────────────────────────┘

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │   Task      │  │             │
│ Performance │  │ Distribution│  │     Top     │
│    Trend    │  ├─────────────┤  │  Performers │
│             │  │    Site     │  │             │
│             │  │ Comparison  │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
   col-span-4       col-span-4       col-span-4
                    (2 stacked!)
```

## How To Implement

### Step 1: Add `stackGroup` to Your Sections

```typescript
// These two sections will stack vertically:
{
  id: 'top-section',
  stackGroup: 'my-stack', // ← Same ID = stacked together
  columnSpan: 3,
},
{
  id: 'bottom-section',
  stackGroup: 'my-stack', // ← Same ID = stacked together
  columnSpan: 3, // ← Must match!
}
```

### Step 2: View in Builder or Published Dashboard

The stacking happens automatically! No UI changes needed - the grid system handles it.

## More Examples

### Example 1: Sidebar Layout (3 widgets stacked)

```typescript
sections: [
  // Left sidebar - 3 small widgets stacked
  {
    id: 'widget-1',
    type: 'kpi-cards',
    title: 'Today\'s Volume',
    columnSpan: 3,
    stackGroup: 'sidebar',
  },
  {
    id: 'widget-2',
    type: 'pie-chart',
    title: 'Task Mix',
    columnSpan: 3,
    stackGroup: 'sidebar',
  },
  {
    id: 'widget-3',
    type: 'rankings',
    title: 'Quick Stats',
    columnSpan: 3,
    stackGroup: 'sidebar',
  },
  
  // Main content area
  {
    id: 'main-chart',
    type: 'trend-chart',
    title: 'Performance Over Time',
    columnSpan: 9, // Takes up remaining 3/4 of width
  },
]
```

**Result:**
```
┌──────┐  ┌─────────────────────────────┐
│Widget│  │                             │
│  1   │  │                             │
├──────┤  │                             │
│Widget│  │      Performance Trend      │
│  2   │  │                             │
├──────┤  │                             │
│Widget│  │                             │
│  3   │  │                             │
└──────┘  └─────────────────────────────┘
```

### Example 2: Comparison Dashboard (Two Stacks)

```typescript
sections: [
  // Full-width header
  {
    id: 'header',
    type: 'kpi-cards',
    title: 'Overview',
    columnSpan: 12,
  },
  
  // Left stack - Site A metrics
  {
    id: 'site-a-volume',
    type: 'bar-chart',
    title: 'Site A Volume',
    columnSpan: 6,
    stackGroup: 'site-a',
  },
  {
    id: 'site-a-performance',
    type: 'trend-chart',
    title: 'Site A Performance',
    columnSpan: 6,
    stackGroup: 'site-a',
  },
  
  // Right stack - Site B metrics
  {
    id: 'site-b-volume',
    type: 'bar-chart',
    title: 'Site B Volume',
    columnSpan: 6,
    stackGroup: 'site-b',
  },
  {
    id: 'site-b-performance',
    type: 'trend-chart',
    title: 'Site B Performance',
    columnSpan: 6,
    stackGroup: 'site-b',
  },
]
```

**Result:**
```
┌────────────────────────────────────┐
│             Overview               │
└────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐
│  Site A      │  │  Site B      │
│  Volume      │  │  Volume      │
├──────────────┤  ├──────────────┤
│  Site A      │  │  Site B      │
│  Performance │  │  Performance │
└──────────────┘  └──────────────┘
```

### Example 3: Executive Dashboard (Mixed Layout)

```typescript
sections: [
  // Row 1: Full width
  {
    id: 'exec-kpis',
    type: 'kpi-cards',
    title: 'Executive KPIs',
    columnSpan: 12,
  },
  
  // Row 2: Left chart, middle stacked, right chart
  {
    id: 'revenue-trend',
    type: 'trend-chart',
    title: 'Revenue Trend',
    columnSpan: 4,
  },
  {
    id: 'top-products',
    type: 'rankings',
    title: 'Top Products',
    columnSpan: 4,
    stackGroup: 'insights',
  },
  {
    id: 'alerts',
    type: 'custom',
    title: 'Active Alerts',
    columnSpan: 4,
    stackGroup: 'insights',
  },
  {
    id: 'efficiency',
    type: 'pie-chart',
    title: 'Efficiency Mix',
    columnSpan: 4,
  },
  
  // Row 3: Two columns, each with stacked content
  {
    id: 'east-volume',
    type: 'bar-chart',
    title: 'East Region Volume',
    columnSpan: 6,
    stackGroup: 'east',
  },
  {
    id: 'east-performance',
    type: 'trend-chart',
    title: 'East Region Performance',
    columnSpan: 6,
    stackGroup: 'east',
  },
  {
    id: 'west-volume',
    type: 'bar-chart',
    title: 'West Region Volume',
    columnSpan: 6,
    stackGroup: 'west',
  },
  {
    id: 'west-performance',
    type: 'trend-chart',
    title: 'West Region Performance',
    columnSpan: 6,
    stackGroup: 'west',
  },
]
```

## Column Span Reference

Use these values for `columnSpan`:

| Value | Width | Use Case |
|---|---|---|
| 3 | 25% | Small widgets, sidebar items |
| 4 | 33% | Three-column layouts |
| 6 | 50% | Half-width sections, two-column layouts |
| 8 | 67% | Large main content with small sidebar |
| 9 | 75% | Large main content with widget column |
| 12 | 100% | Full-width headers, large charts |

## Tips & Tricks

### 🎯 Create Balanced Layouts
```typescript
// Good: 4 + 4 + 4 = 12 (fills row)
columnSpan: 4, columnSpan: 4, columnSpan: 4

// Good: 3 + 9 = 12 (fills row)
columnSpan: 3, columnSpan: 9

// Good: 6 + 6 = 12 (fills row)
columnSpan: 6, columnSpan: 6
```

### 📏 Stack Sections with Same Width
```typescript
// ✓ Good - both sections are col-span-4
{
  id: 'a',
  columnSpan: 4,
  stackGroup: 'my-stack',
}
{
  id: 'b',
  columnSpan: 4,
  stackGroup: 'my-stack',
}

// ✗ Bad - different widths will cause layout issues
{
  id: 'a',
  columnSpan: 3,
  stackGroup: 'my-stack',
}
{
  id: 'b',
  columnSpan: 6, // ← Different from 'a'!
  stackGroup: 'my-stack',
}
```

### 🎨 Control Stacking Density

Adjust the gap between stacked sections in `/styles/globals.css`:

```css
/* Tighter stacking */
--grid-gap: 0.75rem; /* 12px */

/* Current (balanced) */
--grid-gap: 1rem; /* 16px */

/* Looser stacking */
--grid-gap: 1.5rem; /* 24px */
```

### 🔄 Reorder Sections

The `order` property determines the sequence:

```typescript
{
  id: 'section-1',
  order: 0, // Shows first
  stackGroup: 'stack-a',
}
{
  id: 'section-2',
  order: 1, // Shows second
  stackGroup: 'stack-a',
}
```

## Testing Your Stacked Layout

1. **In Dashboard Builder:**
   - Add sections with matching `stackGroup` values
   - Set the same `columnSpan` for stacked sections
   - Preview in builder - sections should stack vertically

2. **In Published Dashboard:**
   - Publish the dashboard
   - View as target role (executive, site-manager, supervisor)
   - Layout should match builder preview exactly

3. **Test Responsive Behavior:**
   - Resize browser window
   - Sections should maintain their relative positions
   - Stack groups stay together

## Common Issues & Solutions

### Issue: Sections Not Stacking

**Check:**
- ✓ Both sections have the **same** `stackGroup` value (case-sensitive!)
- ✓ Both sections have the **same** `columnSpan` value
- ✓ Sections are in the same dashboard

### Issue: Uneven Heights

**Explanation:** Stacked sections split height equally by default (`flex: 1`).

**Future:** Custom height distribution will be supported via `flexGrow` property.

### Issue: Too Much/Little Space

**Solution:** Adjust `--grid-gap` in `/styles/globals.css`:

```css
/* In :root section */
--grid-gap: 1rem; /* Change this value */
```

## Next Steps

1. ✅ Copy one of the examples above
2. ✅ Modify section types, titles, and spans to match your needs
3. ✅ Test in Dashboard Builder
4. ✅ Publish and verify in published view
5. ✅ Adjust `--grid-gap` if needed for tighter/looser spacing

**See `/SECTION_STACKING_GUIDE.md` for complete technical documentation!**
