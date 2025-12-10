# How to Add Tile Canvas to Design Test Tab

## Quick Integration

To add the new Tile Canvas functionality to the Design Test tab in DashboardBuilder, follow these simple steps:

## Option 1: Add as New Sub-Tab (Recommended)

### Step 1: Import the Component
In `/components/DashboardBuilder.tsx`, add at the top:

```typescript
import { DesignTestCanvas } from './DesignTestCanvas';
```

### Step 2: Add Sub-Tabs to Design Test
Find the "Design Test" TabsContent (around line 2345) and wrap the content in nested Tabs:

```tsx
<TabsContent value="design-test" className="space-y-6 mt-6">
  {/* Alert about test mode */}
  <Alert style={{ borderColor: 'var(--color-chart-5)', backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
    <Info className="h-4 w-4" style={{ color: 'var(--color-chart-5)' }} />
    <AlertDescription style={{ color: 'var(--color-foreground)' }}>
      <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>Test Mode:</strong> This tab has independent system sections from the Design tab but shares the same live preview.
    </AlertDescription>
  </Alert>

  {/* NEW: Add Sub-Tabs */}
  <Tabs defaultValue="sections" className="w-full">
    <TabsList style={{ marginBottom: 'var(--spacing-4)' }}>
      <TabsTrigger value="sections">Sections</TabsTrigger>
      <TabsTrigger value="canvas">Tile Canvas</TabsTrigger>
    </TabsList>

    {/* Existing sections content */}
    <TabsContent value="sections">
      {/* All existing Design Test content goes here */}
      {/* Dashboard Settings Card */}
      {/* Sections Management */}
      {/* etc. */}
    </TabsContent>

    {/* NEW: Canvas Tab */}
    <TabsContent value="canvas">
      <DesignTestCanvas />
    </TabsContent>
  </Tabs>
</TabsContent>
```

## Option 2: Replace Sections (Alternative)

If you want to completely replace the existing sections approach:

### Step 1: Import
```typescript
import { DesignTestCanvas } from './DesignTestCanvas';
```

### Step 2: Replace Content
```tsx
<TabsContent value="design-test" className="space-y-6 mt-6">
  <DesignTestCanvas />
</TabsContent>
```

## Option 3: Add as Separate Tab (Clean)

Add a completely new top-level tab:

### Step 1: Import
```typescript
import { DesignTestCanvas } from './DesignTestCanvas';
```

### Step 2: Add Tab Trigger
Find the TabsList (around line 1838) and add:

```tsx
<TabsList className="mb-6">
  <TabsTrigger value="design">Design</TabsTrigger>
  <TabsTrigger value="design-test">Design Test</TabsTrigger>
  <TabsTrigger value="canvas">Tile Canvas</TabsTrigger>  {/* NEW */}
  <TabsTrigger value="sections">Sections</TabsTrigger>
  <TabsTrigger value="data">Data</TabsTrigger>
  <TabsTrigger value="preview">Preview</TabsTrigger>
</TabsList>
```

### Step 3: Add Tab Content
```tsx
{/* NEW: Tile Canvas Tab */}
<TabsContent value="canvas" className="space-y-6 mt-6">
  <DesignTestCanvas />
</TabsContent>
```

## What Users Will See

After integration, users will be able to:

### In the Tile Canvas Tab:
1. **Global Filters** (top card)
   - Date Range picker
   - Site dropdown
   - Show Grid toggle

2. **Main Layout** (grid)
   - Left: Tile Library (3 columns)
     - KPI Cards
     - Charts (Line, Bar, Area, Pie)
     - Tables
   - Right: Canvas (9 columns)
     - Drag tiles here
     - Configure tiles
     - See live data

3. **Instructions** (bottom card)
   - How to use
   - Key features

## User Workflow Example

```
1. User selects "Tile Canvas" tab
2. Sets filters:
   - Date Range: Last 30 days
   - Site: Atlanta DC
3. Drags "KPI Card" from library to canvas
4. Clicks settings icon on the tile
5. Configures:
   - Metric: Performance %
   - Aggregation: Average
   - Title: "Atlanta Performance"
6. Clicks Save
7. Sees: "95.4%" with trend arrow ↑ 2.3%
```

## Features Available

✅ **4 Core Tile Types**
- KPI Cards (2x2 grid)
- Line Charts (6x3 grid)
- Bar Charts (6x3 grid)
- Data Tables (12x4 grid)

✅ **10 Metrics**
- Performance %
- Actual/Expected/Budgeted Hours
- Actual/Forecasted/Budgeted Volume
- Hours/Volume/Budget Variance

✅ **5 Aggregations**
- Sum, Average, Count, Min, Max

✅ **Global Filters**
- Date Range
- Site Selection
- All tiles respect these filters

✅ **Real Data**
- Pulls from same mockData.ts as System Sections
- 5 distribution centers
- 30 job functions
- 51 tasks
- 180 days of data

## Customization Options

### Change Default Filters
In `DesignTestCanvas.tsx`, modify the initial state:

```typescript
const [startDate, setStartDate] = useState(() => {
  const date = new Date();
  date.setDate(date.getDate() - 90); // Change to 90 days
  return date.toISOString().split('T')[0];
});

const [selectedSiteId, setSelectedSiteId] = useState('all'); // Start with all sites
```

### Change Layout
Adjust the grid columns in the main div:

```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-2"> {/* Smaller library */}
    <TileLibrary />
  </div>
  <div className="col-span-10"> {/* Bigger canvas */}
    <GridCanvas ... />
  </div>
</div>
```

### Hide Instructions
Remove or comment out the instructions Card at the bottom.

## Testing After Integration

### 1. Basic Functionality
```
☐ Tab appears in navigation
☐ Global filters are visible
☐ Tile library loads
☐ Canvas is empty initially
```

### 2. Tile Operations
```
☐ Can drag tile to canvas
☐ Settings icon appears on hover
�� Config dialog opens
☐ Can select metric
☐ Can save configuration
☐ Tile shows real data
```

### 3. Filters
```
☐ Change date range → data updates
☐ Change site → data updates
☐ Toggle grid → grid shows/hides
```

### 4. Charts
```
☐ KPI shows metric + trend
☐ Line chart shows time series
☐ Bar chart shows comparison
☐ Table shows top 10
```

## Troubleshooting

### Issue: Tile shows "No data"
**Solution**: Check that contextMetrics is being passed from DesignTestCanvas → GridCanvas → DraggableTile

### Issue: Config dialog doesn't open
**Solution**: Verify that onClick handler in GridCanvas calls handleConfigureTile

### Issue: Data doesn't match filters
**Solution**: Check that contextMetrics calculation uses startDate, endDate, selectedSiteId

### Issue: Styling looks wrong
**Solution**: Ensure /styles/globals.css has all CSS variables defined

## Next Steps After Integration

Once integrated, users can:

1. ✅ Create custom dashboard layouts with tiles
2. ✅ Configure each tile independently
3. ✅ See real data from the system
4. ✅ Export tile configurations (future)
5. ✅ Save tile layouts as templates (future)

## Files Involved

```
/components/
├── DesignTestCanvas.tsx      ← NEW: Main integration component
├── GridCanvas.tsx            ← Canvas with tiles
├── TileLibrary.tsx           ← Tile templates
├── DraggableTile.tsx         ← Individual tile
├── TileConfigDialog.tsx      ← Configuration UI
└── TileDataRenderer.tsx      ← Data visualization

/lib/
└── mockData.ts               ← Data source (unchanged)
```

## Code Example: Full Integration

Here's a complete example for Option 1 (sub-tabs):

```tsx
// In DashboardBuilder.tsx
import { DesignTestCanvas } from './DesignTestCanvas';

// Find the Design Test TabsContent (line ~2345)
<TabsContent value="design-test" className="space-y-6 mt-6">
  <Alert style={{ borderColor: 'var(--color-chart-5)', backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
    <Info className="h-4 w-4" style={{ color: 'var(--color-chart-5)' }} />
    <AlertDescription>
      <strong>Test Mode:</strong> Choose between section-based or tile-based design
    </AlertDescription>
  </Alert>

  <Tabs defaultValue="sections" className="w-full">
    <TabsList>
      <TabsTrigger value="sections">
        <Layers className="h-4 w-4 mr-2" />
        Sections
      </TabsTrigger>
      <TabsTrigger value="canvas">
        <Grid3x3 className="h-4 w-4 mr-2" />
        Tile Canvas
      </TabsTrigger>
    </TabsList>

    <TabsContent value="sections" className="space-y-6 mt-6">
      {/* All existing Design Test content */}
    </TabsContent>

    <TabsContent value="canvas" className="space-y-6 mt-6">
      <DesignTestCanvas />
    </TabsContent>
  </Tabs>
</TabsContent>
```

---

**Ready to integrate!** Choose your preferred option and add the code. The tile canvas will be immediately functional with real data from your system.
