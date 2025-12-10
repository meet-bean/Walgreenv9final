# Single Design System - Conversion Status

## Goal
**ONE design system** (`/components/design-system/`) used throughout the entire platform.
- Minimal, modern, consistent design
- No inline styles - use CSS classes
- No raw HTML text elements - use Typography component
- Ignore `/components/ui/` (ShadCN - cannot delete but never import from it)

## Progress Summary

### ✅ COMPLETED (12 components)
1. **AIAssistant.tsx** - Full conversion, 40+ CSS classes added
2. **AdminPanel.tsx** - Full conversion
3. **UserManagement.tsx** - Full conversion, 40+ CSS classes added
4. **SystemSettings.tsx** - Already converted (previous session)
5. **LoginScreen.tsx** - Full conversion
6. **TaskTile.tsx** - Full conversion
7. **ErrorBoundary.tsx** - Full conversion  
8. **ChartTypePicker.tsx** - Full conversion
9. **AuditLogs.tsx** - Full conversion, 40+ CSS classes added
10. **SkeletonLoaders.tsx** - Full conversion, 50+ CSS classes added
11. **MultiSheetExcelUpload.tsx** - Full conversion + BUG FIX (toast import), 40+ CSS classes added
12. **DataInputPermissions.tsx** - COMPREHENSIVE PERMISSIONS MATRIX + Full conversion, 60+ CSS classes added

### 🔄 REMAINING COMPONENTS (40+)

#### Critical User-Facing (High Priority)
- [ ] DashboardRenderer.tsx (267+ inline styles - LARGEST)
- [ ] SectionRenderer.tsx
- [ ] ModernDashboardBuilder.tsx
- [ ] AlertsManagement.tsx
- [ ] AnalyticsPredictions.tsx
- [ ] CommentsAnnotations.tsx
- [ ] AuditLogs.tsx
- [ ] ExportReporting.tsx
- [ ] GoalsTracking.tsx
- [ ] MainApp.tsx

#### Medium Priority
- [ ] CreateAlertDialog.tsx
- [ ] CustomDataEntryDialog.tsx
- [ ] DataFormatConfigurator.tsx
- [ ] DataInputFlow.tsx
- [ ] DataInputPermissions.tsx
- [ ] DataSourceConfigDialog.tsx
- [ ] DateRangePicker.tsx
- [ ] DynamicRankings.tsx
- [ ] FormulaBuilder.tsx
- [ ] GoogleSheetsIntegration.tsx
- [ ] GrantPermissionDialog.tsx
- [ ] HierarchicalPerformanceTable.tsx
- [ ] HierarchyDataView.tsx
- [ ] ImportedDataViewer.tsx
- [ ] MetricsCatalog.tsx
- [ ] MLDashboard.tsx
- [ ] MLInsightsWidget.tsx
- [ ] MLPerformanceComparison.tsx
- [ ] ModernDateRangePicker.tsx
- [ ] MultiSheetExcelUpload.tsx
- [ ] PerformancePieChart.tsx
- [ ] SitePerformanceMap.tsx
- [ ] BuilderPreviewWrapper.tsx
- [ ] SectionContextMenu.tsx
- [ ] SkeletonLoaders.tsx
- [ ] UnifiedSettingsAdmin.tsx

#### Blocks (Sub-components)
- [ ] blocks/DataEntryDesktop.tsx
- [ ] blocks/DataEntryMobile.tsx
- [ ] blocks/DataSourceBlock.tsx
- [ ] blocks/SpreadsheetReferenceView.tsx
- [ ] blocks/SupervisorMapView.tsx

## CSS Classes Added

### Global Utilities
- Layout: `flex-row`, `flex-col`, `flex-row-center`, `flex-row-between`, `flex-col-center`
- Spacing: `flex-gap-1` through `flex-gap-6`
- Sizing: `flex-1`, `flex-shrink-0`
- Text: `text-center`, `text-left`, `text-right`, `text-muted`
- Borders: `border-top`, `border-bottom`
- Containers: `container-padded`, `container-padded-lg`
- Grids: `grid-2col`, `grid-3col`, `grid-auto-fit`
- Icons: `icon-12`, `icon-16`, `icon-20`, `icon-24`, `icon-32`, `icon-48`

### Component-Specific (200+ classes)
- AI Assistant: 40+ classes
- Admin Panel: 6 classes
- User Management: 40+ classes
- Login Screen: 15 classes
- TaskTile: 25 classes
- ErrorBoundary: 20 classes
- ChartTypePicker: 10 classes

## Design System Architecture

```
/components/design-system/     ← ONLY design system to use
├── Alert.tsx
├── AlertDialog.tsx
├── Avatar.tsx
├── Badge.tsx
├── Button.tsx
├── Card.tsx
├── Checkbox.tsx
├── Dialog.tsx
├── Input.tsx
├── Label.tsx
├── Popover.tsx
├── Progress.tsx
├── RadioGroup.tsx
├── ScrollArea.tsx
├── Select.tsx
├── Separator.tsx
├── Skeleton.tsx
├── Switch.tsx
├── Table.tsx
├── Tabs.tsx
├── Textarea.tsx
├── Toast.tsx
└── Typography.tsx           ← Use for ALL text

/components/ui/               ← IGNORE (ShadCN - dead weight)
└── (40+ files - never import from here)

/styles/globals.css           ← All CSS classes and design tokens
```

## Conversion Pattern

### Before (BAD - inline styles + raw HTML)
```tsx
<div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
  <h3 style={{ fontFamily: 'var(--font-family-inter)', fontSize: '18px' }}>
    Title
  </h3>
  <p style={{ color: 'var(--color-muted-foreground)' }}>
    Description
  </p>
</div>
```

### After (GOOD - CSS classes + Typography)
```tsx
<div className="flex-row flex-gap-2">
  <Typography variant="h3">Title</Typography>
  <Typography variant="label" className="text-muted">
    Description
  </Typography>
</div>
```

## Typography Variants (ONLY these)

- `h1` (36px semibold) - Rare, major headers only
- `h2` (24px semibold) - Page headers
- `h3` (18px medium) - Section titles
- `h4` (16px medium) - Card titles
- `large` (15px regular) - Emphasized body
- `body` (14px regular) - Body text
- `label` (13px regular) - Labels, captions, descriptions
- `detail` (13px regular) - Same as label (for backward compat)

## Next Steps

1. Continue converting high-priority components
2. Add CSS classes as needed for each component
3. Test visual consistency
4. Remove any remaining Tailwind classes
5. Final audit when all components converted

## Estimated Completion

- **8/50+ components complete** (16%)
- **40+ components remaining**
- **Estimated time:** 5-7 more focused sessions for complete conversion

---

**Status:** In Progress - Continuing Systematic Conversion
**Last Updated:** Current Session
