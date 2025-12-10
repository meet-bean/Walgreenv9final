# Enhanced Dashboard Builder - Quick Start 🚀

## Access the Builder

1. **Login** as Executive or Site Manager
2. Click **"+ Build"** tab
3. Click **"Create Dashboard"**
4. Select **"Enhanced Builder"** (green option)

## Create Your First Dashboard

### Step 1: Name Your Dashboard
```
Dashboard Name: "My Performance Dashboard"
Description: "Overview of key metrics"
```

### Step 2: Add Tiles
- **Drag** a tile from the left sidebar
- **Drop** it onto the canvas
- Tile auto-positions in empty space

### Step 3: Arrange Tiles
- **Move**: Drag tile by the grip handle
- **Resize**: Drag edges or corners
- **Delete**: Click trash icon

### Step 4: Multi-Select & Group (Optional)
- **Select**: Click first tile
- **Multi-select**: Shift+Click other tiles
- **Save**: Click "Save as Section" button
- **Name**: Enter section details
- **Done**: Section appears in "Saved" tab

### Step 5: Save & Publish
- Click **"Save"** to save draft
- Click **"Publish"** to share with users

## Tile Library

### KPIs (3×2 size)
- Performance KPI
- Total Hours
- Revenue
- Headcount

### Charts (6×3 size)
- Line Chart
- Bar Chart
- Area Chart
- Pie Chart (4×3)

### Tables (12×4 size)
- Data Table
- Ranking Table (6×4)

## Pro Tips 💡

### Selection
```
Click      → Select one tile
Shift+Click → Add/remove from selection
Cmd+Click  → Toggle selection
Click canvas → Deselect all
```

### Layout
```
Grid Lines  → Toggle with switch for alignment
Auto-snap   → Tiles snap to grid automatically
Min size    → 2 columns × 1 row
Max width   → 12 columns (full width)
```

### Sections
```
Create → Select 2+ tiles → "Save as Section"
Add    → "Saved" tab → "Add to Canvas"
Edit   → Sections expand to individual tiles
```

## Keyboard Shortcuts (Future)

```
Delete    → Remove selected tiles
Esc       → Deselect all
Ctrl+Z    → Undo
Ctrl+Y    → Redo
Ctrl+C    → Copy
Ctrl+V    → Paste
```

## Common Patterns

### Executive Dashboard
```
Row 1: [Revenue KPI] [Hours KPI] [Headcount KPI] [Performance KPI]
Row 2: [Line Chart - 6 cols]     [Bar Chart - 6 cols]
Row 3: [Data Table - Full width]
```

### Performance Overview
```
Row 1: [Performance KPI] [Trend Chart - 8 cols]
Row 2: [Ranking Table - Full width]
```

### Financial Summary
```
Row 1: [Revenue] [Costs] [Margin] [Growth]
Row 2: [Pie Chart] [Area Chart - 8 cols]
```

## Troubleshooting

### Tiles overlap when dropped
→ Canvas auto-finds space. If overlap persists, drag manually.

### Can't resize tile
→ Hover over edges to see resize handles. Minimum size is 2×1.

### Section not in library
→ Check "Saved" tab. Verify section saved successfully.

### Can't scroll
→ This was fixed! Page should scroll naturally now.

### Lost my work
→ Dashboards auto-save to localStorage. Click "Save" for permanent storage.

## Need Help?

- **Full Guide**: `/guidelines/EnhancedBuilderGuide.md`
- **Implementation**: `/ENHANCED_BUILDER_IMPLEMENTATION.md`
- **Code**: `/components/EnhancedDashboardBuilder.tsx`

---

**Ready to build amazing dashboards!** 🎨
