# 🏗️ Application Hierarchy - Top Level

## High-Level Architecture Overview

This document shows the **top-level structure** of the entire application, from entry point to main features.

---

## 📱 Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.tsx (ROOT)                          │
│                    • Authentication State                        │
│                    • Error Boundaries                            │
│                    • Global Toast Notifications                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │  LoginScreen.tsx     │        │   MainApp.tsx        │
    │                      │        │  (After Login)       │
    │  • Role Selection    │        │                      │
    │  • User Input        │        │  • Header/Nav        │
    │  • Site/Job Fn       │        │  • Tab System        │
    └──────────────────────┘        │  • Role-based UI     │
                                    └──────────────────────┘
                                                │
        ┌───────────────────────────────────────┼───────────────────────────────────────┐
        │                                       │                                       │
        ▼                                       ▼                                       ▼
┌──────────────────┐                ┌──────────────────┐                ┌──────────────────┐
│   EXECUTIVE      │                │  SITE MANAGER    │                │   SUPERVISOR     │
│   (VP/Admin)     │                │                  │                │                  │
└──────────────────┘                └──────────────────┘                └──────────────────┘
        │                                       │                                       │
        ├─ Dashboards Tab ────────────────────┼──────────────────────────────────────┤
        ├─ Build Tab (Create/Edit) ──────────┼──────────────────────────────────────┘
        ├─ Data Input Tab ────────────────────┼──────────────────────────────────────┐
        ├─ Alerts Tab ────────────────────────┼──────────────────────────────────────┤
        ├─ Ideas Tab (AI/Analytics/Goals) ───┘                                       │
        └─ Administration Tab                                                         │
                                                                                      │
                                                                            Only if permitted
```

---

## 🎯 Detailed Component Breakdown

### **Level 1: Entry Point**

```
App.tsx
├─ State: user (User | null)
├─ Handlers: handleLogin(), handleLogout()
├─ Global: <Toaster /> (sonner)
└─ Renders:
    ├─ LoginScreen (when user is null)
    └─ MainApp (when user is authenticated)
```

**Responsibilities:**
- Manages authentication state
- Error handling (CSS access errors, unhandled rejections)
- Global toast notifications
- Routes to LoginScreen or MainApp

---

### **Level 2: Authentication**

```
LoginScreen.tsx
├─ Role Selection
│   ├─ Executive (VP)
│   ├─ Site Manager
│   └─ Supervisor
├─ User Details
│   ├─ Name input
│   ├─ Site selection (for Site Manager/Supervisor)
│   └─ Job Function selection (for Supervisor)
└─ Login Button → calls App.handleLogin()
```

**Responsibilities:**
- Capture user role
- Capture user identity (name)
- Capture context (site, job function)
- Pass data back to App for authentication

---

### **Level 3: Main Application Container**

```
MainApp.tsx
├─ Props: user, onLogout
├─ State:
│   ├─ viewMode (dashboards | build | data-input | alerts | administration | ideas)
│   ├─ activeDashboardId
│   ├─ isEditingDashboard
│   └─ dashboardRefreshKey
├─ Header
│   ├─ Logo & User Info
│   ├─ Navigation Tabs (role-based)
│   └─ Action Buttons (Alerts, Settings, Logout)
└─ Main Content
    └─ Tab Content (based on viewMode)
```

**Responsibilities:**
- Provides navigation structure
- Manages active view/tab
- Fetches published dashboards for user role
- Role-based UI rendering
- Handles dashboard lifecycle (create, edit, save, publish)

---

### **Level 4: Feature Areas (Tabs)**

#### **📊 Dashboards Tab** (All Roles)

```
PublishedDashboardsView.tsx
├─ Props: userRole, userId, siteId, activeDashboardId, allowEditing
├─ State: isEditing, refreshKey
├─ Renders:
│   ├─ Empty State (if no dashboards)
│   ├─ DashboardBuilder (if editing)
│   └─ Dashboard Display
│       ├─ Edit Button (if allowEditing)
│       ├─ Dashboard Title & Description
│       └─ BuilderPreviewWrapper
│           └─ SectionRenderer (for each section)
└─ Data: Fetches published dashboards via getPublishedDashboardsForUser()
```

**Responsibilities:**
- Display published dashboards
- Toggle between view and edit modes
- Fetch dashboard data for user's role
- Render sections using SectionRenderer

---

#### **🔨 Build Tab** (Executive & Site Manager Only)

```
DashboardBuilder.tsx
├─ Props: initialDashboard, userRole, onSave, onCancel, onPublish
├─ State:
│   ├─ dashboard (DashboardDefinition)
│   ├─ densityMode, previewRole
│   ├─ sections, filters, settings
│   └─ configuration dialogs state
├─ UI:
│   ├─ Header (Save, Publish buttons)
│   ├─ Dashboard Settings (name, description, role)
│   ├─ Live Preview (BuilderPreviewWrapper)
│   │   └─ DashboardRenderer (for each section)
│   └─ Floating Sidebar (Dashboard Sections)
│       ├─ Section Definitions List
│       ├─ Custom Sections (Metric Tiles, KPI Cards)
│       └─ Saved Sections (from library)
└─ Features:
    ├─ Add/Remove/Reorder sections
    ├─ Configure sections (data, appearance)
    ├─ Resize sections
    ├─ Test with different roles
    └─ Save to library
```

**Responsibilities:**
- Create new dashboards
- Edit existing dashboards
- Configure sections
- Preview with test roles
- Save and publish dashboards

---

#### **✏️ Data Input Tab** (If Permitted)

```
DataInputFlow.tsx
├─ Role-based data entry
├─ Mobile & Desktop views
├─ Spreadsheet-style input
└─ Supervisor map view
```

**Responsibilities:**
- Allow users to input performance data
- Provide different UIs for mobile/desktop
- Validate and save data

---

#### **🔔 Alerts Tab** (All Roles)

```
AlertsManagement.tsx
├─ View triggered alerts
├─ Create new alerts
├─ Configure alert rules
└─ Alert notifications
```

**Responsibilities:**
- Display active alerts
- Create/edit alert rules
- Manage alert recipients
- Show alert history

---

#### **💡 Ideas Tab** (Executive Only)

```
Tabs: AI | Analytics | Goals | Export
├─ AI: AIAssistant.tsx
├─ Analytics: AnalyticsPredictions.tsx, MLDashboard.tsx
├─ Goals: GoalsTracking.tsx
└─ Export: ExportReporting.tsx
```

**Responsibilities:**
- AI-powered insights
- Predictive analytics
- Goal tracking
- Data export and reporting

---

#### **⚙️ Administration Tab** (Executive Only)

```
Tabs: Hierarchy | Permissions | Settings | Data Sources | Audit | Users | Bulk
├─ Hierarchy: HierarchyDataView.tsx
├─ Permissions: DataInputPermissions.tsx
├─ Settings: SystemSettings.tsx
├─ Data Sources: DataSourceBlock.tsx
├─ Audit: AuditLogs.tsx
├─ Users: UserManagement.tsx
└─ Bulk: BulkOperations.tsx
```

**Responsibilities:**
- Manage organizational hierarchy
- Configure permissions
- System-wide settings
- Data source configuration
- View audit logs
- Manage users
- Bulk operations

---

## 🔑 Role-Based Access Control

```
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│ Feature         │ Executive    │ Site Manager │ Supervisor   │
├─────────────────┼──────────────┼──────────────┼──────────────┤
│ View Dashboards │ ✅ All        │ ✅ Site-level │ ✅ Job Fn     │
│ Build/Edit      │ ✅ Yes        │ ✅ Yes        │ ❌ No         │
│ Data Input      │ ✅ Optional   │ ✅ Optional   │ ✅ Optional   │
│ Alerts          │ ✅ All        │ ✅ Site-level │ ✅ Job Fn     │
│ Ideas (AI)      │ ✅ Yes        │ ❌ No         │ ❌ No         │
│ Administration  │ ✅ Yes        │ ❌ No         │ ❌ No         │
└─────────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 📂 File Organization

### **Core Application Files**
```
/
├── App.tsx                          # Entry point, auth state
└── components/
    ├── LoginScreen.tsx              # Authentication UI
    └── MainApp.tsx                  # Main container, navigation
```

### **Dashboard Files**
```
/components/
├── PublishedDashboardsView.tsx      # View published dashboards
├── DashboardBuilder.tsx             # Create/edit dashboards
├── BuilderPreviewWrapper.tsx        # Shared preview canvas
├── SectionRenderer.tsx              # Self-contained section rendering
└── DashboardRenderer.tsx            # Legacy renderer (being phased out)
```

### **Feature Area Files**
```
/components/
├── DataInputFlow.tsx                # Data entry
├── AlertsManagement.tsx             # Alerts
├── AIAssistant.tsx                  # AI features
├── AnalyticsPredictions.tsx         # Predictive analytics
├── GoalsTracking.tsx                # Goal tracking
├── ExportReporting.tsx              # Export/reporting
├── HierarchyDataView.tsx            # Org hierarchy
├── DataInputPermissions.tsx         # Permissions
├── SystemSettings.tsx               # System settings
├── AuditLogs.tsx                    # Audit logs
└── UserManagement.tsx               # User management
```

### **Data & Configuration**
```
/lib/
├── mockData.ts                      # All application data
├── sectionDefinitions.ts            # Section configurations
├── mlEngine.ts                      # ML/AI engine
├── performanceUtils.ts              # Performance calculations
└── userSettings.ts                  # User preferences
```

### **Design System**
```
/styles/
└── globals.css                      # All CSS variables (colors, spacing, typography, etc.)
```

---

## 🎨 Design System Usage

**All components follow this pattern:**

```tsx
// ✅ CORRECT - Use CSS variables
<div style={{ 
  backgroundColor: 'var(--color-background)',
  padding: 'var(--spacing-6)',
  borderRadius: 'var(--radius-lg)',
  fontFamily: 'var(--font-family-inter)'
}}>
  <p style={{ color: 'var(--color-foreground)' }}>
    Text content
  </p>
</div>

// ❌ WRONG - Don't use Tailwind typography classes
<div className="text-2xl font-bold leading-tight">
  Text content
</div>

// ✅ CORRECT - Use CSS variables via style prop
<div style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)' }}>
  Text content
</div>
```

**Available CSS Variables:**

```css
/* Colors */
--color-background, --color-foreground, --color-card, --color-border
--color-primary, --color-muted, --color-success, --color-destructive
--color-chart-1 through --color-chart-5

/* Spacing */
--spacing-1 through --spacing-12
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, --spacing-2xl
--grid-gap, --grid-outer-gap, --spacing-section

/* Typography */
--font-family-inter, --font-family-mono
--text-label, --text-body, --text-h1, --text-h2, --text-h3
--font-weight-normal, --font-weight-medium, --font-weight-semibold, --font-weight-bold

/* Radius */
--radius-sm, --radius-md, --radius-lg, --radius-xl

/* Shadows */
--shadow-elevation-sm, --shadow-elevation-md, --shadow-elevation-lg
```

---

## 🔄 State Management Flow

```
App.tsx (user state)
   │
   ├─► LoginScreen.tsx
   │   └─► handleLogin(role, name, siteId, jobFunctionId)
   │       └─► setUser({ id, role, name, siteId, jobFunctionId })
   │
   └─► MainApp.tsx (receives user)
       │
       ├─► State: viewMode, activeDashboardId, isEditingDashboard
       │
       ├─► Fetch: publishedDashboards for user.role
       │
       └─► Render based on viewMode:
           ├─► dashboards → PublishedDashboardsView
           ├─► build → DashboardBuilder
           ├─► data-input → DataInputFlow
           ├─► alerts → AlertsManagement
           ├─► ideas → AI/Analytics/Goals/Export tabs
           └─► administration → Hierarchy/Permissions/Settings/etc.
```

---

## 🚀 User Journey Examples

### **Example 1: Executive Views Dashboard**
```
1. User logs in as "Executive"
   └─► App.tsx: setUser({ role: 'executive', ... })

2. MainApp.tsx renders with executive permissions
   └─► Shows: Dashboards, Build, Alerts, Ideas, Administration tabs

3. User clicks "Dashboards" tab
   └─► MainApp.tsx: setViewMode('dashboards')

4. PublishedDashboardsView renders
   ├─► Fetches published dashboards for 'executive' role
   └─► Renders first dashboard (or selected dashboard)

5. BuilderPreviewWrapper displays sections
   └─► Each section rendered by SectionRenderer
       ├─► KPI Cards with date picker
       ├─► Performance charts
       └─► Tables/maps/etc.
```

### **Example 2: Site Manager Creates Dashboard**
```
1. User logs in as "Site Manager" for "Philadelphia DC"
   └─► App.tsx: setUser({ role: 'site-manager', siteId: 'DC-001', ... })

2. User clicks "Build" tab (Plus icon)
   └─► MainApp.tsx: setViewMode('build')

3. DashboardBuilder renders
   ├─► Empty dashboard with "Untitled Dashboard"
   └─► Floating sidebar with available sections

4. User clicks "KPI Cards" section
   └─► Section added to dashboard

5. User clicks "Configure" on KPI Cards
   └─► KPICardsConfigDialog opens
   └─► User configures 4 cards (Performance, Hours, Efficiency, Tasks)

6. User previews with different roles
   └─► Test as: Executive / Site Manager / Supervisor

7. User clicks "Save"
   └─► Dashboard saved to mockData.ts

8. User clicks "Publish"
   └─► DashboardPublishDialog opens
   └─► User selects roles/sites to publish to
   └─► Dashboard added to publishedDashboards
```

---

## 📊 Data Sources

All data comes from `/lib/mockData.ts`:

```typescript
// Core data structures
export const sites: Site[]
export const jobFunctions: JobFunction[]
export const dailyMetrics: DailyMetrics[]
export const tasks: Task[]

// Dashboard configurations
export const customDashboards: DashboardDefinition[]
export const publishedCustomDashboards: PublishedDashboard[]

// Permissions & access
export const dataInputPermissions: DataInputPermission[]
export const alerts: Alert[]

// Fetching functions
getPublishedDashboardsForUser(role, siteId): PublishedDashboard[]
getDashboardById(id): DashboardDefinition
getMetricsBySiteAndDateRange(siteId, start, end): DailyMetrics[]
// ... and many more
```

---

This is the **complete top-level architecture** of your application! 🎉

Everything flows from **App.tsx** → **MainApp.tsx** → **Feature Components**, with design system CSS variables used throughout for consistent styling.
