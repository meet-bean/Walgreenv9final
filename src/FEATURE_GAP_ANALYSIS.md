# Feature Gap Analysis: Enhanced Builder vs Existing Builders

## 📊 Missing Features Analysis

### ✅ What Enhanced Builder HAS
- ✓ Grid-based canvas (12 columns)
- ✓ Drag & drop tiles from library
- ✓ Resize tiles
- ✓ Multi-select tiles (Shift+Click)
- ✓ Save tile groups as sections
- ✓ Tile library with categories
- ✓ Section library for reuse
- ✓ Grid toggle
- ✓ Dashboard name/description
- ✓ Proper scrolling
- ✓ Save & Publish buttons

### ❌ What Enhanced Builder LACKS (from DashboardBuilder)

#### 1. **Tile Configuration UI** 🔴 CRITICAL
**Current**: Settings icon exists but doesn't open anything
**Missing**: `MetricTileDialog` integration

Features needed:
- Data source selection (system/custom/both/none)
- System metric dropdown (Total Performance, Total Hours, Revenue, etc.)
- Custom value entry
- Display type (number, percentage, currency, trend)
- Icon picker
- Color theme (blue, green, purple, orange, red)
- Trend indicators (up, down, neutral)

**Impact**: Users can add tiles but can't configure their data sources

#### 2. **Custom Data Entry** 🔴 CRITICAL
**Missing**: `CustomDataEntryDialog` integration

Features needed:
- Manual table-based data entry
- CSV import/paste
- Data types (number, percentage, currency, text)
- Field names and units
- Row add/remove/edit

**Impact**: No way to add custom data to tiles

#### 3. **Dashboard-Level Settings** 🟡 IMPORTANT
**Missing**:
- Target role selection (Executive, Site Manager, Supervisor)
- Filters configuration:
  - Allow date range filter
  - Allow site filter
  - Allow aggregation
  - Show underperforming only
- Description field (exists but not saved properly)

**Impact**: Dashboards aren't properly scoped to roles

#### 4. **Preview Mode** 🟡 IMPORTANT
**Current**: Preview tab shows placeholder
**Missing**: `BuilderPreviewWrapper` integration

Features needed:
- Live preview with actual data
- Role switching (view as Executive/Site Manager/Supervisor)
- Drill-down simulation (top/mid/bottom level)
- Site selection for preview
- Job function selection for preview

**Impact**: Can't see what dashboard will actually look like

#### 5. **Version History** 🟢 NICE-TO-HAVE
**Missing**: `DashboardVersionHistory` component

Features needed:
- Track all changes
- Show who changed what and when
- Restore previous versions
- Compare versions
- Change summaries

**Impact**: No audit trail or undo capability

#### 6. **Template Loading** 🟢 NICE-TO-HAVE
**Current**: Only "Create from Template" option in ManageDashboards
**Missing**: In-builder template selection

Features needed:
- Browse system dashboard templates
- Load template into canvas
- Start with pre-configured layouts

**Impact**: Can't leverage existing templates

#### 7. **Formula Builder Integration** 🟡 IMPORTANT
**Missing**: `FormulaBuilder` integration for calculated metrics

Features needed:
- Create custom formulas
- Reference other metrics
- Apply functions (SUM, AVG, MIN, MAX, etc.)
- Save calculated metrics

**Impact**: Can't create derived metrics

#### 8. **Section Integration from Section Builder** 🟢 NICE-TO-HAVE
**Current**: Only basic section save/load
**Missing**: Full integration with saved sections from Section Builder

Features needed:
- Import sections created in Section Builder
- Preserve section configuration
- Data source mapping

**Impact**: Can't reuse sections created in other tools

### ❌ What Enhanced Builder LACKS (from SectionBuilder/VisualSectionBuilder)

#### 9. **Advanced Chart Configuration** 🟡 IMPORTANT
**Missing**:
- Chart type specific options
- Color scheme selection
- Threshold indicators
- Target lines
- Axis configuration
- Legend options

**Impact**: Charts are generic, can't customize appearance

#### 10. **KPI Threshold Configuration** 🟡 IMPORTANT
**Missing**:
- Define thresholds (e.g., >95% = green, <95% = red)
- Color-coded indicators
- Conditional formatting
- Variance display options

**Impact**: KPIs don't show performance status visually

#### 11. **Table Configuration** 🟢 NICE-TO-HAVE
**Missing**:
- Column selection
- Sorting options
- Ranking display
- Conditional row formatting
- Aggregation options (sum, average, etc.)

**Impact**: Tables are basic, can't customize

#### 12. **Layout Options** 🟢 NICE-TO-HAVE
**Missing**:
- Column layouts (1, 2, 3, 4 columns)
- Responsive breakpoints
- Spacing controls
- Alignment options

**Impact**: Limited layout flexibility

## 🎯 Priority Ranking

### P0 - Must Have (Blocking)
1. **Tile Configuration Dialog** - Users MUST be able to configure tile data
2. **Custom Data Entry** - Users MUST be able to add custom data

### P1 - Should Have (Core Functionality)
3. **Dashboard-Level Settings** - Target roles and filters
4. **Preview Mode** - See what you're building
5. **Formula Builder** - Calculated metrics
6. **Advanced Chart Config** - Customize charts
7. **KPI Thresholds** - Visual indicators

### P2 - Nice to Have (Enhanced UX)
8. **Version History** - Track changes
9. **Template Loading** - Quick start
10. **Section Builder Integration** - Reuse existing work
11. **Table Configuration** - Customize tables
12. **Layout Options** - Fine-tune spacing

## 🚀 Recommended Implementation Plan

### Phase 1: Critical Features (NOW)
**Goal**: Make Enhanced Builder fully functional

1. **Integrate MetricTileDialog**
   - Wire up Settings button on tiles
   - Pass tile config to dialog
   - Save config back to tile
   - Update tile display based on config

2. **Integrate CustomDataEntryDialog**
   - Add data source option in MetricTileDialog
   - When "Custom" selected, open CustomDataEntryDialog
   - Store custom data with tile
   - Display custom data in tile preview

3. **Add Dashboard Settings Panel**
   - Target role selector
   - Filters configuration
   - Description field

### Phase 2: Preview & Validation (NEXT)
**Goal**: Let users see what they're building

4. **Implement Preview Mode**
   - Use BuilderPreviewWrapper
   - Role switching dropdown
   - Render tiles with real/sample data
   - Show filters in action

5. **Add Formula Builder**
   - Create calculated metric option
   - Reference other tiles
   - Save formulas with dashboard

### Phase 3: Polish & Power Features (LATER)
**Goal**: Professional-grade builder

6. **Version History**
   - Track all changes
   - Restore capability

7. **Advanced Configuration**
   - Chart customization
   - KPI thresholds
   - Table options

8. **Integration & Templates**
   - Import from Section Builder
   - Template library
   - Section marketplace

## 📝 Quick Wins

These can be added quickly:

1. **Tile Name Editing** - Double-click tile title to edit
2. **Duplicate Tile** - Right-click → Duplicate
3. **Keyboard Shortcuts** - Delete key, Ctrl+C/V
4. **Alignment Guides** - Show when dragging near other tiles
5. **Undo/Redo** - Track tile positions
6. **Auto-save** - Save draft to localStorage every 30s

## 🔧 Code Changes Needed

### For MetricTileDialog Integration:

```tsx
// In DraggableTile.tsx
const handleSettings = () => {
  onConfigure?.(tile.id, tile.config);
};

// In EnhancedDashboardBuilder.tsx
const [configuringTile, setConfiguringTile] = useState<string | null>(null);

<MetricTileDialog
  isOpen={!!configuringTile}
  onClose={() => setConfiguringTile(null)}
  onSave={(config) => {
    updateTile(configuringTile!, { config });
    setConfiguringTile(null);
  }}
  initialConfig={tiles.find(t => t.id === configuringTile)?.config}
/>
```

### For CustomDataEntryDialog Integration:

```tsx
// When user selects "Custom" data source in MetricTileDialog
<CustomDataEntryDialog
  open={showCustomDataDialog}
  onClose={() => setShowCustomDataDialog(false)}
  onSave={(customData) => {
    // Store with tile config
  }}
/>
```

### For Dashboard Settings:

```tsx
// Add to EnhancedDashboardBuilder state
const [targetRole, setTargetRole] = useState<UserRole>('supervisor');
const [filters, setFilters] = useState({
  allowDateRange: true,
  allowSiteFilter: false,
  allowAggregation: true,
  showUnderperformingOnly: false,
});
```

## 📊 Comparison Table

| Feature | Standard Builder | Enhanced Builder (Current) | Enhanced Builder (With Fixes) |
|---------|-----------------|----------------------------|-------------------------------|
| **Layout** | Linear sections | Free-form grid | Free-form grid |
| **Tile Config** | ✓ Full dialog | ✗ Settings button only | ✓ Full dialog |
| **Custom Data** | ✓ CSV + Manual | ✗ None | ✓ CSV + Manual |
| **Data Sources** | ✓ System/Custom/Both | ✗ Placeholder only | ✓ System/Custom/Both |
| **Formulas** | ✓ Formula builder | ✗ None | ✓ Formula builder |
| **Preview** | ✓ With role switch | ✗ Placeholder | ✓ With role switch |
| **Filters** | ✓ Date/Site/Agg | ✗ None | ✓ Date/Site/Agg |
| **Version History** | ✓ Full tracking | ✗ None | ✓ Full tracking |
| **Multi-select** | ✗ No | ✓ Yes | ✓ Yes |
| **Resize** | ✗ Fixed sizes | ✓ Drag to resize | ✓ Drag to resize |
| **Section Save** | ✗ No | ✓ Yes | ✓ Yes |
| **Templates** | ✓ Load system | ✗ External only | ✓ Load system |
| **Chart Config** | ✓ Advanced | ✗ None | ✓ Advanced |
| **KPI Thresholds** | ✓ Color coded | ✗ None | ✓ Color coded |

## ✅ Next Steps

**Immediate (This Session)**:
1. Add MetricTileDialog integration
2. Add CustomDataEntryDialog integration
3. Add Dashboard settings panel

**Short-term (Next Session)**:
4. Implement preview mode
5. Add formula builder
6. Add chart/KPI configuration

**Long-term**:
7. Version history
8. Template integration
9. Section Builder import
10. Advanced features

Would you like me to start implementing Phase 1 (Critical Features)?
