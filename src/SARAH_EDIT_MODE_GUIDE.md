# Where Sarah Customizes: Complete Guide

## ⚠️ UPDATE: Architecture Simplified!

**Previous behavior**: Two edit modes (Layout Customization + Full Builder)  
**New behavior**: One edit mode only (Full Builder)

Users can NO longer customize layouts in published dashboards. All editing happens in DashboardBuilder.

---

## One Edit Mode in Your Application

### Full Dashboard Builder (Complete Editing)
**Component**: `DashboardBuilder`
**Location**: Lines 179-187 of `PublishedDashboardsView.tsx`

**User Flow**:
```
1. Sarah views her published dashboard
2. Clicks "Edit Dashboard" button (only if allowEditing = true)
3. isEditing = true (state in PublishedDashboardsView)
4. Entire UI switches to DashboardBuilder component
5. UI shows:
   - Full builder interface
   - Add Section button
   - Section Library
   - Configure/Remove buttons on each section
   - Zoom/Density controls
   - Section data source configuration
6. Sarah can:
   - Add/remove entire sections ✅
   - Configure section settings ✅
   - Change dashboard name/description ✅
   - Modify data sources ✅
   - Everything a full builder can do ✅
7. Clicks "Save Dashboard"
8. Updates entire dashboard definition
9. isEditing = false (back to normal view)
```

**What Persists**:
- Entire dashboard structure
- All sections and their configurations
- Dashboard metadata (name, description, etc.)
- Section data sources
- Section types and settings

**Storage Mechanism**:
```typescript
// Saved via saveDashboard() or updateSystemDashboard()
{
  id: "dashboard-1",
  name: "My Dashboard",
  description: "...",
  sections: [
    {
      id: "section-1",
      type: "kpi-cards",
      title: "KPIs",
      order: 1,
      columnSpan: 12,
      config: { /* section configuration */ }
    }
  ]
}
```

---

## Simplified Architecture

### Published Dashboard (View Mode) - READ ONLY
```
┌─────────────────────────────────────┐
│  My Dashboard                       │
│                  [Edit Dashboard]   │  ← Only button visible
├─────────────────────────────────────┤
│                                     │
│  [KPI Cards Section]                │
│  [Performance Chart]                │
│  [Task List]                        │
│                                     │
│  ❌ No drag handles                 │
│  ❌ No resize handles               │
│  ❌ No customization                │
│  ✅ View & interact only            │
└─────────────────────────────────────┘
```

### Edit Mode (Dashboard Builder) - FULL EDITOR
```
┌─────────────────────────────────────┐
│  Builder Mode                       │
│  [Add Section] [Library] [Zoom]     │
├─────────────────────────────────────┤
│                                     │
│  [≡ KPI Cards]     [Configure] [X]  │  ← Drag & configure
│  [≡ Chart]         [Configure] [X]  │
│  [≡ Task List]     [Configure] [X]  │
│                                     │
│  ✅ Drag to reorder                 │
│  ✅ Resize sections                 │
│  ✅ Add/remove sections             │
│  ✅ Configure data sources          │
│  ✅ Change everything               │
│                                     │
│  [Save Dashboard] [Cancel]          │
└─────────────────────────────────────┘
```

---

## Code Flow

### Layout Customization Flow:
```typescript
// 1. User clicks "Edit Layout" in LayoutControls
<LayoutControls
  editMode={editMode}
  onEditModeToggle={() => startEditing()}  // ← Enters edit mode
  onSave={() => saveChanges()}             // ← Saves to localStorage
  onCancel={() => cancelChanges()}         // ← Discards changes
/>

// 2. DraggableDashboardWrapper shows drag handles
<DraggableDashboardWrapper 
  dashboardId={dashboard.id}
  sections={dashboardSections}
  forceEditMode={inlineEditMode}           // ← Controls edit state
/>

// 3. useLayoutManager handles persistence
const { editMode, saveChanges, moveSection, resizeSection } = useLayoutManager(dashboardId, defaultSections);
// Saves to: localStorage.setItem(`dashboard-layout-${dashboardId}`, ...)
```

### Full Builder Flow:
```typescript
// 1. User clicks "Edit Dashboard" in PublishedDashboardsView
<Button onClick={handleStartEdit}>
  Edit Dashboard
</Button>

// 2. State changes to show builder
const handleStartEdit = () => {
  setIsEditing(true);  // ← Switch to builder
};

// 3. DashboardBuilder renders
if (isEditing && allowEditing) {
  return (
    <DashboardBuilder
      initialDashboard={dashboard}
      onSave={handleSaveDashboard}  // ← Saves entire dashboard
      onCancel={handleCancelEdit}   // ← Returns to normal view
    />
  );
}

// 4. Save updates the dashboard definition
const handleSaveDashboard = (updatedDashboard) => {
  saveDashboard(updatedDashboard);  // ← Saves to mockData
  setIsEditing(false);
};
```

---

## Answer to "What if we lose persistence?"

If we used `BuilderPreviewWrapper` everywhere (which has NO persistence):

**Without Layout Customization Persistence**:
- Sarah drags sections → Works! ✅
- Sarah resizes sections → Works! ✅
- Sarah hides sections → Works! ✅
- Sarah clicks refresh → **ALL CHANGES LOST!** ❌
- Sarah logs in tomorrow → **BACK TO DEFAULTS!** ❌
- Sarah makes a mistake → **NO UNDO!** ❌
- Sarah wants to cancel → **NO CANCEL!** ❌

**Why it matters**:
Users expect their personalizations to **stick**. Without persistence:
- No point in customizing (changes disappear)
- Frustrating user experience
- Can't experiment (no undo)
- Can't recover from mistakes
- Have to recustomize every session

That's why we keep `DraggableDashboardWrapper` with `useLayoutManager` for published dashboards!
