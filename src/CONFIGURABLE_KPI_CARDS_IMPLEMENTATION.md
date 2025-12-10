# Configurable KPI Cards - Implementation Guide

## ✅ What's Been Completed

### 1. New Component Created
- **File:** `/components/KPICardsConfigDialog.tsx`
- A dialog component for managing KPI Cards configuration
- Displays list of configured cards
- Buttons to add, edit, and delete cards
- Shows auto-layout preview based on card count

### 2. Section Definition Updated
- **File:** `/lib/sectionDefinitions.ts`
- Updated "KPI Cards" description to reflect configurability
- Changed description to: "Configurable metric cards - add 1-12 cards with custom or system data sources. Auto-layout based on card count."

### 3. Dashboard Builder State Added
- **File:** `/components/DashboardBuilder.tsx`
- Added states:
  - `configuringKPICards`: boolean for showing config dialog
  - `kpiCardsBeingEdited`: string (section ID being edited)
  - `currentKPICardIndex`: number (which card is being edited)

### 4. Dashboard Builder Handlers Added
- **File:** `/components/DashboardBuilder.tsx`
- `handleAddKPICard()`: Opens dialog to add new card
- `handleEditKPICard(index)`: Opens dialog to edit existing card
- `handleDeleteKPICard(index)`: Removes a card
- `handleSaveKPICard(config)`: Saves card configuration
- `handleCloseKPICardsConfig()`: Closes the config dialog

### 5. Metric Tile Button Removed
- **File:** `/components/DashboardBuilder.tsx`
- Removed "Create Single Metric Tile" button
- Removed associated helper text

### 6. Configure Data Handler Updated
- **File:** `/components/DashboardBuilder.tsx`
- Modified `handleConfigureData()` to detect KPI Cards sections
- Opens KPICardsConfigDialog for kpi-cards type
- Keeps legacy support for old metric-tile sections

---

## 🚧 What Still Needs to Be Done

### 1. Update DashboardRenderer.tsx - renderKPICards()

**Location:** `/components/DashboardRenderer.tsx` around line 607

**Current State:** Renders 4 hardcoded cards (Performance, Total Hours, Data Completion, Tasks Tracked)

**Needed Changes:**
```typescript
const renderKPICards = (section: DashboardSection) => {
  // Check if section has configured cards
  const configuredCards = (section as any).kpiCards as any[] | undefined;
  
  if (!configuredCards || configuredCards.length === 0) {
    // Show placeholder
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">No KPI cards configured</p>
            <p className="text-xs mt-1">Click "Configure Data" to add metric cards</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine grid layout based on card count
  const cardCount = configuredCards.length;
  const gridClass = 
    cardCount === 1 ? 'grid-cols-1' :
    cardCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
    cardCount === 3 ? 'grid-cols-1 md:grid-cols-3' :
    cardCount === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
    cardCount >= 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  // Render each configured card
  return (
    <div className={`grid ${gridClass} gap-4`}>
      {configuredCards.map((cardConfig, index) => (
        <Card key={index} className={`${getColorClass(cardConfig.colorTheme)} border-2`}>
          <CardContent className="p-6">
            {/* Use renderMetricTile logic here - reuse the metric tile rendering */}
            {renderSingleKPICard(cardConfig, index)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper function to render individual card (reuse metric tile logic from renderMetricTile)
const renderSingleKPICard = (config: any, index: number) => {
  // Calculate display value (copy logic from renderMetricTile function lines 172-228)
  let displayValue = '—';
  
  if (config.dataSource === 'custom') {
    displayValue = config.customValue || '—';
  } else if (config.dataSource === 'system' && config.systemMetric) {
    // Calculate system metrics (copy from existing renderMetricTile)
    const metricsWithData = contextMetrics.filter(m => m.performance !== null);
    
    switch (config.systemMetric) {
      case 'avg-performance':
        if (metricsWithData.length > 0) {
          const avgPerf = metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length;
          displayValue = `${avgPerf.toFixed(1)}%`;
        } else {
          displayValue = 'N/A';
        }
        break;
      case 'total-hours':
        const totalHours = contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
        displayValue = totalHours.toLocaleString('en-US', { maximumFractionDigits: 0 });
        break;
      // ... add all other metric types from renderMetricTile
    }
  }

  // Color theme
  const colorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {config.icon && <span className="text-2xl">{config.icon}</span>}
          <p className="text-sm text-gray-600">{config.label}</p>
        </div>
        <p className="text-3xl text-gray-900">{displayValue}</p>
        {config.trend !== 'neutral' && config.trendValue && (
          <div className={`flex items-center gap-1 mt-2 ${getTrendColor(config.trend)}`}>
            {config.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm">{config.trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};
```

**Key Points:**
- Check for `(section as any).kpiCards` array
- If empty/undefined, show placeholder with "Configure Data" hint
- Calculate grid columns based on card count
- Reuse the metric tile rendering logic from `renderMetricTile` function (lines 142-272)
- Support all the same system metrics and custom values

### 2. Add KPICardsConfigDialog to DashboardBuilder.tsx

**Location:** End of file, before closing tag

**Add these imports:**
```typescript
import { KPICardsConfigDialog } from './KPICardsConfigDialog';
```

**Add dialog before closing </> tag:**
```tsx
{/* KPI Cards Configuration Dialog */}
{configuringKPICards && kpiCardsBeingEdited && (
  <KPICardsConfigDialog
    isOpen={configuringKPICards}
    onClose={handleCloseKPICardsConfig}
    cards={(dashboard.sections.find(s => s.id === kpiCardsBeingEdited) as any)?.kpiCards || []}
    onAddCard={handleAddKPICard}
    onEditCard={handleEditKPICard}
    onDeleteCard={handleDeleteKPICard}
  />
)}

{/* Metric Tile Dialog - Reused for individual card configuration */}
{showMetricTileDialog && (
  <MetricTileDialog
    isOpen={showMetricTileDialog}
    onClose={() => {
      setShowMetricTileDialog(false);
      setEditingMetricTile(undefined);
      setCurrentKPICardIndex(null);
    }}
    onSave={handleSaveMetricTile}
    initialConfig={editingMetricTile}
  />
)}
```

### 3. Clean Up Old Metric Tile References (Optional)

**Files to check:**
- Remove `handleCreateMetricTile` function (no longer called)
- Remove fallback handling for `metric-tile` sections in DraggableSectionItem (lines 1166-1179)
- Keep `handleResizeMetricTile` as it's used for all section resizing

---

## 📊 Data Structure

### Section with Configured KPI Cards:
```typescript
{
  id: 'section-123',
  type: 'kpi-cards',
  title: 'KPI Cards',
  order: 1,
  columnSpan: 12,
  kpiCards: [  // Array of MetricTileConfig
    {
      label: 'Performance',
      icon: '📊',
      dataSource: 'system',
      systemMetric: 'avg-performance',
      colorTheme: 'blue',
      trend: 'up',
      trendValue: '+5.2%'
    },
    {
      label: 'Total Hours',
      icon: '⏰',
      dataSource: 'system',
      systemMetric: 'total-hours',
      colorTheme: 'green',
      trend: 'neutral'
    },
    {
      label: 'Custom Metric',
      icon: '💰',
      dataSource: 'custom',
      customValue: '$1,234',
      colorTheme: 'purple',
      trend: 'down',
      trendValue: '-2.1%'
    }
  ]
}
```

---

## 🎯 Auto-Layout Grid Logic

| Card Count | Grid Classes |
|------------|--------------|
| 1 card | `grid-cols-1` (full width) |
| 2 cards | `grid-cols-1 md:grid-cols-2` (2 per row on desktop) |
| 3 cards | `grid-cols-1 md:grid-cols-3` (3 per row) |
| 4 cards | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` (4 per row on large) |
| 5-6 cards | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (3 per row, wraps) |
| 7+ cards | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` (4 per row, wraps) |

---

## ✅ Testing Checklist

1. **Add KPI Cards section** to dashboard
2. **Click "Configure Data"** button
3. **Dialog opens** showing empty state
4. **Click "Add Card"** button
5. **MetricTileDialog opens** for configuration
6. **Configure card** with label, icon, data source, etc.
7. **Save card** - should appear in list
8. **Add 2-3 more cards** with different configurations
9. **Edit a card** - values should populate correctly
10. **Delete a card** - should remove from list
11. **Close dialog** and verify preview shows cards
12. **Check auto-layout** - cards should arrange based on count
13. **Test different card counts** (1, 2, 3, 4, 5+)
14. **Save dashboard** - configuration should persist
15. **Reload dashboard** - cards should render correctly

---

## 🎨 UI/UX Flow

1. User adds "KPI Cards" section → Shows placeholder "No cards configured"
2. User clicks "Configure Data" → Opens KPICardsConfigDialog
3. User clicks "Add Card" → Opens MetricTileDialog
4. User configures card settings → Saves
5. Card appears in list → User can add more cards
6. User clicks "Done" → Dialog closes
7. Dashboard preview shows configured cards in auto-layout grid
8. User can resize section width (4/6/8/12 columns)
9. Cards wrap responsively within section width

---

## 🔧 Quick Implementation Steps

1. ✅ KPICardsConfigDialog component created
2. ✅ DashboardBuilder states added
3. ✅ DashboardBuilder handlers added
4. ✅ handleConfigureData updated
5. ✅ Metric tile button removed
6. 🚧 Update DashboardRenderer renderKPICards (CRITICAL)
7. 🚧 Import and add KPICardsConfigDialog to DashboardBuilder JSX
8. 🚧 Test the full flow

The most critical remaining task is updating `renderKPICards` in DashboardRenderer.tsx to read from the `kpiCards` array and render dynamically.
