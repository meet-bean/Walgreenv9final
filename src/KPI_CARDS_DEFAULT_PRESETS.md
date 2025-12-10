# KPI Cards - Default Presets Feature

## Overview
KPI Cards now come pre-populated with all 6 default metric cards when first added to a dashboard. Users can then configure (add/remove cards) as needed, providing the best of both worlds: quick start with sensible defaults + full customization.

## How It Works

### 1. Add KPI Cards Section
When you select "KPI Cards" from the section library:
- **All 6 preset cards are automatically added** to the section
- Cards appear immediately in the live preview
- No configuration required to see something useful
- Toast message confirms: "KPI Cards added with 6 default metrics"

### 2. Default Cards Included

The 6 default preset cards are:

1. **📊 Average Performance** (Blue)
   - System metric: `avg-performance`
   - Description: Team avg %
   
2. **⏱️ Total Hours** (Green)
   - System metric: `total-hours`
   - Description: Sum of hours
   
3. **✅ Completion Rate** (Purple)
   - System metric: `completion-rate`
   - Description: Tasks completed
   
4. **💰 Cost Savings** (Orange)
   - System metric: `cost-savings`
   - Description: Total savings
   
5. **⚡ Efficiency Rate** (Blue)
   - System metric: `efficiency-rate`
   - Description: Output ratio
   
6. **🎯 Quality Score** (Green)
   - System metric: `quality-score`
   - Description: Quality rating

### 3. Configure to Customize
Click the **"Configure"** button on the KPI Cards section to:
- **Remove cards** you don't need
- **Reorder cards** by dragging in the preview
- **Edit individual cards** to change icons, colors, or data sources
- **Add more cards** (up to 12 total)

### 4. Save for Reuse
After customizing your cards:
- Click **"Save as Section"** to save your configuration to the Section Library
- Name it (e.g., "Executive Top 4 KPIs")
- Choose a category and add tags
- Reuse across multiple dashboards

## User Experience Flow

### Quick Start (No Configuration)
```
1. Select "KPI Cards" → 6 cards appear instantly
2. View in preview → All 6 cards displayed with mock data
3. Click "Done" → Dashboard saved with all 6 cards
```

### Customized Start
```
1. Select "KPI Cards" → 6 cards appear instantly
2. Click "Configure" → Opens configuration dialog
3. Remove unwanted cards → Keep only what you need
4. Drag to reorder → Arrange in priority order
5. Click "Done" → Dashboard saved with your selection
```

### Save for Reuse
```
1. Configure your ideal card set → Remove/reorder as needed
2. Click "Save as Section" → Opens save dialog
3. Name and categorize → E.g., "Site Manager KPIs"
4. Next time → Load from Section Library with your exact configuration
```

## Benefits

### ✅ For New Users
- **No blank canvas anxiety** - See something useful immediately
- **Learn by example** - See what cards look like before customizing
- **Quick setup** - Get started in seconds, not minutes

### ✅ For Power Users
- **Faster workflow** - Start with 6 cards, remove what you don't need
- **Consistent defaults** - Same starting point every time
- **Full flexibility** - Still have complete control over final configuration

### ✅ For Teams
- **Standardization** - Everyone starts with the same 6 metrics
- **Best practices** - Default selection represents common use cases
- **Easy customization** - Teams can create role-specific variations

## Technical Implementation

### Dashboard Builder
When a KPI Cards section is added:
```typescript
if (sectionDef.type === 'kpi-cards' && !(sectionDef as any).isSavedSection) {
  const defaultKPICards: MetricTileConfig[] = [
    // ... 6 default cards
  ];
  (newSection as any).kpiCards = defaultKPICards;
}
```

### Saved Sections
When loading a saved KPI Cards section from the library:
```typescript
if ((sectionDef as any).isSavedSection && savedSection.type === 'kpi-cards') {
  (newSection as any).kpiCards = savedSection.config.cards;
}
```

### Visual Indicators
- **Badge**: Shows "📊 6 Cards" (or current count) in section list
- **Toast**: Different message for pre-populated vs saved sections
- **Icon**: 📊 emoji used consistently for KPI Cards

## Comparison: Before vs After

### Before (Blank Canvas)
```
1. Select "KPI Cards" → Empty section added
2. Click "Configure" → Empty dialog opens
3. Click "Add Card" → Configure first card
4. Repeat 5 more times → Configure remaining cards
5. Click "Done" → Finally see something
```
**Time: ~5-10 minutes for 6 cards**

### After (Pre-Populated)
```
1. Select "KPI Cards" → 6 cards appear instantly
2. View in preview → See all 6 cards immediately
3. (Optional) Configure → Remove/edit as needed
4. Click "Done" → Dashboard ready
```
**Time: ~30 seconds with defaults, ~2-3 minutes if customizing**

## Use Cases

### Executive Dashboard
```
Default 6 cards → Perfect for executive summary
No configuration needed
```

### Site Manager Dashboard
```
Default 6 cards → Remove 2-3 less relevant cards
Keep 3-4 most important for operations
Configure in ~1 minute
```

### Supervisor Dashboard
```
Default 6 cards → Remove all but Completion Rate & Total Hours
Add 2 custom cards for specific tasks
Configure in ~2 minutes
```

### Custom Role Dashboard
```
Default 6 cards → Remove all
Add custom cards specific to role
Start from familiar base
```

## Configuration Dialog Updates

### Live Preview Section
- Shows all configured cards (default 6 on first open)
- Drag-and-drop reordering enabled
- Real-time preview with mock data
- Badge: "Drag to reorder • Live preview with mock data"

### Quick Add Section
- Shows which presets are already added
- ✓ Check mark on cards already in dashboard
- "All Added" button when all 6 presets are configured
- Can still add more cards beyond the 6 presets

### Card Management
- **Edit**: Modify existing cards
- **Delete**: Remove unwanted cards
- **Reorder**: Drag in preview or configuration list
- **Add**: Quick add or custom configurator

## Best Practices

### When to Keep All 6 Cards
- ✅ Executive dashboards needing comprehensive overview
- ✅ Initial dashboards for new users
- ✅ General-purpose performance dashboards

### When to Remove Cards
- ✅ Role-specific dashboards (Site Manager, Supervisor)
- ✅ Focused dashboards (only financial, only operations)
- ✅ Dashboards with space constraints

### When to Add More Cards
- ✅ Comprehensive monitoring dashboards
- ✅ Multi-department dashboards
- ✅ Dashboards combining different metric categories

## Future Enhancements

### Potential Improvements
- **Role-based defaults**: Different default sets for Executive, Site Manager, Supervisor
- **Smart suggestions**: Recommend cards based on dashboard type
- **Preset variations**: "Financial Focus", "Operations Focus", etc.
- **Card templates**: Pre-configured card sets for common scenarios
- **Usage analytics**: Track which cards are most often removed/kept

---

## Quick Reference

### Adding KPI Cards
1. Open Dashboard Builder
2. Go to "Design" tab
3. Check "KPI Cards" in section library
4. See 6 cards appear in preview immediately

### Customizing Cards
1. Click "Configure" on KPI Cards section
2. Remove unwanted cards (click trash icon)
3. Drag to reorder in preview
4. Click "Done" to save

### Saving Configuration
1. Configure your desired card set
2. Click "Save as Section" (bottom-left)
3. Name, categorize, and tag
4. Find in Section Library for reuse

### Loading Saved Configuration
1. Go to Section Library in Dashboard Builder
2. Find your saved KPI Cards section
3. Click to add to dashboard
4. Your exact configuration is restored
