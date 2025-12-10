# 📊 Complete Dashboard Workflow Guide

## Overview
This document explains what happens after you finish designing a dashboard, from creation to end-user viewing.

---

## 🔄 The Complete Lifecycle

### **Phase 1: BUILD/DESIGN**
**Location:** Dashboard Manager → "Create New Dashboard" or "Edit" button

**What you do:**
1. Click "Create New Dashboard" in Dashboard Manager
2. ModernDashboardBuilder opens with:
   - Live preview canvas (right side)
   - Section library sidebar (left side)
   - Global filters at top
3. Add sections by clicking them in the sidebar
4. Configure each section (metrics, chart types, filters)
5. Arrange sections (drag to reorder, resize width)
6. See real-time preview as you build

**Current State:** DRAFT (not saved yet)

---

### **Phase 2: SAVE**
**Location:** Dashboard Builder → "Save Dashboard" button (top right)

**What happens when you click Save:**
```typescript
1. Dashboard definition is created/updated:
   {
     id: 'unique-id',
     name: 'My Dashboard',
     description: 'Description',
     createdBy: 'Your Name',
     sections: [
       { id: 'section-1', type: 'overview-tiles', ... },
       { id: 'section-2', type: 'performance-trend', ... }
     ],
     createdAt: '2025-01-15',
     lastModifiedAt: '2025-01-15'
   }

2. Saved to customDashboards array in mockData.ts

3. Success toast appears: "Dashboard saved successfully!"

4. Returns to Dashboard Manager

5. Your dashboard appears in "My Dashboards" tab
```

**Important:**
- ✅ Dashboard is SAVED to storage
- ✅ You can edit it anytime
- ✅ It appears in Dashboard Manager
- ❌ **NOT visible to other users yet** (not published)
- ❌ **NOT in production** (just a draft)

---

### **Phase 3: PREVIEW** (Optional - Quality Check)
**Location:** Dashboard Manager → Eye icon (👁️) next to your dashboard

**What happens:**
1. Modal dialog opens showing your dashboard
2. Read-only view (no editing)
3. All sections render with real data
4. Can test:
   - Date range filters
   - "Show Underperforming Only" toggle
   - Data interactions
5. Close dialog to return to Dashboard Manager

**Purpose:** Quality check before publishing to end users

**Current Implementation:**
```tsx
{/* Preview Dialog in ManageDashboards.tsx */}
<Dialog open={!!previewDashboard}>
  <DialogContent className="max-w-7xl max-h-[90vh]">
    <DialogHeader>
      <DialogTitle>{previewDashboard?.name}</DialogTitle>
    </DialogHeader>
    <DashboardRenderer
      dashboard={previewDashboard}
      siteId={siteId}
      allowEditing={false}
      showTitle={false}
    />
  </DialogContent>
</Dialog>
```

---

### **Phase 4: PUBLISH** (Make it Live)
**Location:** Dashboard Manager → "Publish" button next to your dashboard

**What happens:**
1. `DashboardPublishDialog` opens
2. You configure WHO can see it:

```typescript
Publication Settings:
┌─────────────────────────────────────┐
│ Publish Dashboard                   │
├─────────────────────────────────────┤
│ Select Roles:                       │
│ ☑ Executive (VPs)                   │
│ ☑ Site Manager                      │
│ ☑ Supervisor                        │
│                                     │
│ Select Sites:                       │
│ ○ All Sites                         │
│ ● Specific Sites                    │
│   ☑ Philadelphia DC                 │
│   ☑ Atlanta DC                      │
│   ☐ Seattle DC                      │
│                                     │
│ Display Order: [1]                  │
│                                     │
│ Replace existing publication?       │
│ [Dropdown if re-publishing]         │
│                                     │
│         [Cancel]  [Publish]         │
└─────────────────────────────────────┘
```

3. When you click "Publish":
```typescript
publishDashboard({
  id: 'pub-12345',
  dashboardId: 'custom-philly-operations',
  roles: ['site-manager', 'supervisor'],
  siteIds: ['DC-001', 'DC-002'],
  publishedBy: 'Your Name',
  publishedAt: '2025-01-15T10:30:00Z',
  isActive: true,
  order: 1
});
```

4. Success toast: "Dashboard published successfully!"

**Result:**
- ✅ Dashboard is now **LIVE**
- ✅ Users with assigned roles see it
- ✅ Only at assigned sites
- ✅ Appears in their dashboard list
- ✅ Can be re-published with updated settings

---

### **Phase 5: END USER VIEWING**
**Location:** End users log in and see published dashboards

**Who sees it:**
- Only users with matching role AND site
- Example: A Supervisor at Philadelphia DC sees dashboards published to:
  - Role: "Supervisor" 
  - Site: "Philadelphia DC" OR "All Sites"

**What they see:**
```
Main Application
├── Header Navigation
│   └── Build | Data Input | Alerts | Administration
│
└── Published Dashboards (automatically loaded)
    ├── Dashboard 1 (published, order: 1)
    ├── Dashboard 2 (published, order: 2)
    └── Dashboard 3 (published, order: 3)
```

**What they can do:**
- ✅ View all sections
- ✅ Change date ranges
- ✅ Toggle filters (e.g., "Show Underperforming Only")
- ✅ See real-time data based on their permissions
- ❌ **Cannot edit** (read-only)
- ❌ **Cannot save changes**

**Data Scoping:**
- Supervisors: See only their job function data
- Site Managers: See all job functions at their site
- Executives: See all sites

---

## 🔁 RE-PUBLISHING (Updating Live Dashboards)

### **Scenario:** You want to update an already-published dashboard

**Process:**
1. Edit the dashboard in Dashboard Manager
2. Make your changes in the builder
3. Click "Save" (updates the dashboard definition)
4. Click "Publish" again
5. In the publish dialog, select "Replace existing publication"
6. Choose which publication to replace
7. Click "Publish"

**Result:**
- ✅ Published dashboard is updated
- ✅ End users see the new version immediately
- ✅ Publication settings (roles/sites) can be changed
- ✅ Old publication is replaced, not duplicated

---

## 📋 SUMMARY: AFTER DESIGNING, YOU SHOULD...

### **Immediate Actions:**
1. ✅ **Save** - Click "Save Dashboard" to persist your work
2. ✅ **Preview** - Click Eye (👁️) to test the dashboard
3. ✅ **Publish** - Click "Publish" to make it live

### **The Flow:**
```
Design → Save → Preview → Publish → Live for End Users
  ↓       ↓       ↓         ↓          ↓
 Draft  Saved   Test    Configure   Production
              Quality   Viewers
```

### **Key States:**
- **Unsaved**: Only in builder, will be lost if you cancel
- **Saved**: Persisted in storage, appears in Dashboard Manager
- **Published**: Live for end users with assigned roles/sites

### **Common Workflows:**

**Workflow 1: New Dashboard**
```
Create New → Add Sections → Configure → Save → Preview → Publish
```

**Workflow 2: Update Existing**
```
Edit → Make Changes → Save → Re-Publish (Replace existing)
```

**Workflow 3: Quick Test**
```
Edit → Make Changes → Preview (no save) → Cancel or Save
```

---

## 🎯 CURRENT VS DESIRED STATE

### **What CURRENTLY Happens (Restored Version):**
1. Save → Returns to Dashboard Manager ✅
2. Preview → Opens modal dialog ✅
3. Publish → Opens DashboardPublishDialog ✅
4. End Users → See published dashboards ✅

### **What SHOULD Happen (Your Requirements):**
Based on your earlier conversation, you wanted:
- ✅ Preview as full-screen view (not modal)
- ✅ Publish button in preview header
- ✅ Stay in preview after publishing

**Do you want me to re-implement the full-screen preview with publish button?**

---

## 💡 RECOMMENDATIONS

### **After Saving:**
1. **Show Preview** - Automatically show preview after first save
2. **Prompt to Publish** - Ask "Would you like to publish this dashboard?"
3. **Keep Editing** - Allow "Continue Editing" button in preview

### **Before Publishing:**
1. **Validation** - Check that dashboard has at least one section
2. **Preview First** - Encourage previewing before publishing
3. **Impact Warning** - Show how many users will see it

### **After Publishing:**
1. **Success Message** - "Published to 15 users at 3 sites"
2. **View Live** - Button to view as end user would see it
3. **Share Link** - (Future) Generate shareable link

---

## 🔧 TECHNICAL IMPLEMENTATION

### **Data Storage:**
```typescript
// lib/mockData.ts

// Saved dashboards (drafts + saved)
export const customDashboards: DashboardDefinition[] = [
  {
    id: 'custom-philly-operations',
    name: 'Philadelphia Operations',
    createdBy: 'Sarah Johnson',
    sections: [...],
    createdAt: '2025-01-15',
    lastModifiedAt: '2025-01-15'
  }
];

// Published dashboard mappings
export const publishedCustomDashboards: PublishedDashboard[] = [
  {
    id: 'pub-custom-philly',
    dashboardId: 'custom-philly-operations',
    roles: ['site-manager', 'supervisor'],
    siteIds: ['DC-001'],
    publishedBy: 'Sarah Johnson',
    publishedAt: '2025-01-15T10:30:00Z',
    isActive: true,
    order: 1
  }
];
```

### **Key Functions:**
```typescript
// Save dashboard
saveDashboard(dashboard: DashboardDefinition)

// Publish dashboard
publishDashboard(publication: PublishedDashboard)

// Get published dashboards for a user
getPublishedDashboardsForUser(userRole: UserRole, siteId: string)

// Update existing publication
updatePublishedDashboard(dashboardId: string, publication: PublishedDashboard, publicationId: string)
```

---

## ❓ QUESTIONS FOR YOU

1. **Preview Behavior:** Do you want:
   - A) Current: Modal dialog preview ✓ (restored version)
   - B) Previous: Full-screen preview with publish button
   - C) Both: Modal for quick preview, full-screen option

2. **After Save:** Should we:
   - A) Return to Dashboard Manager (current)
   - B) Stay in builder (continue editing)
   - C) Show preview automatically
   - D) Ask user what to do next

3. **Publish Flow:** Should we:
   - A) Require preview before publish
   - B) Allow direct publish from manager
   - C) Both options available

**Let me know which behaviors you prefer, and I'll implement them!**
