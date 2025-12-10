# Walgreens Supply Chain Performance Management Platform

A comprehensive web application that replaces Walgreens' manual spreadsheet system for managing supply chain performance across multiple distribution centers. Built with React, TypeScript, and Tailwind CSS.

---

## Overview

This platform enables **Executives**, **Site Managers**, and **Supervisors** across 5 distribution centers to:
- Create, publish, and view performance dashboards with role-based access
- Input daily operational data (volume, hours, performance metrics)
- Track performance against budgets and forecasts
- Receive automated alerts for performance issues
- Generate custom reports with 20+ visualization types
- Leverage ML-powered predictions and anomaly detection

**Key Innovation:** Dynamic publishing system where Executives can publish dashboards to any role across all sites, while Site Managers can only publish to their specific site.

---

## Architecture

### Role System (3 Roles)

1. **Executive** (formerly VP)
   - Full platform access
   - Can create/edit/publish dashboards to ALL sites and ALL roles
   - Can edit system-wide default dashboards (changes propagate to all users)
   - Can grant data input permissions
   - Can create/manage alerts
   - View data across all 5 distribution centers

2. **Site Manager**
   - Site-specific access (e.g., Philadelphia DC only)
   - Can create/edit/publish dashboards to their site only
   - Can publish to Site Manager and Supervisor roles
   - Requires VP approval for data input permissions
   - Can request alerts (VP must approve)
   - View data only for their site

3. **Supervisor**
   - Job function-specific access (e.g., "Receiving" at Philadelphia DC)
   - Cannot create or publish dashboards
   - Can view published dashboards relevant to their role
   - Has default data input permissions
   - View data only for their job function

### Navigation Structure (5 Main Tabs)

1. **Dashboards** - View published dashboards (system default + additional)
2. **Ideas** - Consolidated innovation hub with sub-tabs:
   - AI Assistant
   - Analytics & Predictions
   - Goals Tracking
   - Export & Reporting
3. **Data** - For users with permissions (data input flow + permissions management)
4. **Settings** - Administration panel:
   - Hierarchy Data View
   - Data Source Configuration (Executive only)
   - System Settings (Executive only)
   - Permissions Management
   - Audit Logs
   - User Management
   - Bulk Operations
5. **Alerts** - Alerts management and notifications

### Dashboard Publishing System

**Three Types of Dashboards:**

1. **System Dashboards** (3 total - one per role)
   - Pre-built defaults: "Executive Dashboard", "Site Manager Dashboard", "Supervisor Dashboard"
   - Always visible to their respective roles
   - Only Executives can edit them
   - Changes propagate to ALL users of that role
   - Cannot be unpublished (can only be deactivated)

2. **Executive-Published Dashboards**
   - Created by Executives
   - Can be published to any combination of roles
   - Can be published to all sites or specific sites
   - Order: 10 (appears early in dashboard list)

3. **Site Manager-Published Dashboards**
   - Created by Site Managers
   - Can only be published to their own site
   - Can publish to Site Manager and Supervisor roles (not Executive)
   - Order: 100 (appears later in dashboard list)

---

## Tech Stack

### Core Technologies
- **React** 18+ with TypeScript
- **Tailwind CSS** v4.0 (using CSS variables, no config file)
- **Vite** (build tool)

### UI Libraries
- **Shadcn/ui** - Component library (45+ components in `/components/ui`)
- **Lucide React** - Icon system
- **Motion** (formerly Framer Motion) - Animations
- **Recharts** - Charts and data visualizations
- **React Hook Form** v7.55.0 - Form management
- **Sonner** v2.0.3 - Toast notifications

### Data Management
- **React DnD** - Drag and drop functionality
- **React Slick** - Carousels
- **React Responsive Masonry** - Grid layouts

### State Management
- React Context + useState/useReducer (no external state library)
- Local storage for user preferences

---

## Data Structure

### Organizational Hierarchy

```
Platform
├── Sites (5 Distribution Centers)
│   ├── DC-001: Philadelphia DC
│   ├── DC-002: Boston DC
│   ├── DC-003: Atlanta DC
│   ├── DC-004: Charlotte DC
│   └── DC-005: Miami DC
│
├── Job Functions (6 per site = 30 total)
│   ├── Receiving
│   ├── Breakdown
│   ├── Put Away
│   ├── Picking
│   ├── Staging
│   └── Loading
│
└── Tasks (varies by job function)
    ├── Unload Trailer
    ├── Scan Pallets
    ├── Stage Units
    └── ... (10-15 tasks per function)
```

### Daily Metrics Structure

Each task has daily metrics:
- **Budgeted Data:** Volume, Rate (UPH), Hours
- **Forecasted Data:** Volume, Expected Hours
- **Actual Data:** Volume (manual input), Hours (manual input)
- **Calculated:** Performance % = (Expected Hours / Actual Hours) × 100

**Performance Thresholds:**
- 🔴 Critical: < 90%
- 🟠 Warning: 90-94%
- 🟡 Caution: 95-99%
- 🟢 Good: 100-104%
- 🟢 Excellent: 105%+

---

## Key Features

### 1. Dashboard Builder (`/components/DashboardBuilder.tsx`)
- **Sections-Based Layout:** Organize dashboard into collapsible sections
- **15 Block Types:** Metric tiles, charts, tables, rankings, maps, etc.
- **Role Assignment:** Publish to specific roles (Executive, Site Manager, Supervisor)
- **Site Targeting:** Choose all sites or specific sites
- **Template System:** Start from pre-built templates
- **Drag & Drop:** Reorder sections and blocks
- **Single Metric Tile Workflow:** Add multiple tiles, then configure later
- **No Resizing:** Removed resize functionality for consistency

**Section Types:**
- Performance Overview
- Site Comparison
- Job Function Breakdown
- Task Details
- Alerts & Issues
- Custom (user-defined)

**Block Types:**
1. Single Metric Tile
2. Multi-Metric Grid
3. Performance Chart (Line/Bar/Area)
4. Site Rankings
5. Job Function Rankings
6. Task Rankings
7. Performance Table
8. Alerts Summary
9. Map View
10. Trend Analysis
11. Comparison Chart
12. Distribution Chart
13. Gauge Chart
14. Progress Bar
15. Custom HTML/Text

### 2. Report Builder (`/components/blocks/CustomReportBuilder.tsx`)
- **20+ Visualization Types:** Bar, line, pie, scatter, radar, heatmap, funnel, etc.
- **Data Source Selection:** Choose from sites, job functions, tasks
- **Date Range Picker:** Custom ranges with role-based limits
- **Dynamic Preview:** Real-time preview as you configure
- **Export Options:** PDF, Excel, PNG (planned)
- **Role Assignment:** Publish reports to specific roles

### 3. Data Input System (`/components/DataInputFlow.tsx`)
- **Desktop View:** Grid layout showing all tasks
- **Mobile View:** Card-based, swipe navigation
- **Permission-Based:** Only users with granted permissions can input data
- **Validation:** Real-time validation with warnings and hard stops
- **Auto-Save:** Periodic auto-save (30 seconds on desktop)
- **Historical Editing:** Can edit past days based on role (7/30/90 day limits)

**Permission System:** (`/components/DataInputPermissions.tsx`)
- Executives can grant permissions to any user
- Site Managers require VP approval
- Supervisors have default permissions
- Permissions can have expiration dates
- Audit trail for all permission changes

### 4. Alerts & Notifications (`/components/AlertsManagement.tsx`)
- **Severity Levels:** Critical, Warning, Info
- **Triggers:** Performance thresholds, volume variance, missing data
- **Delivery Methods:** In-app, Email, SMS (opt-in)
- **Digest Options:** Daily/Weekly summary emails
- **SLA Tracking:** Acknowledge/resolve timeframes
- **Auto-Resolve:** When next data entry fixes the issue

**Default Alerts:**
- Critical Performance Drop (< 90%)
- Site Performance Warning (< 96%)

### 5. ML Features (`/components/MLDashboard.tsx`, `/lib/mlEngine.ts`)
- **Performance Predictions:** 7-day forecast using linear regression
- **Anomaly Detection:** Z-score based outlier identification
- **Trend Analysis:** Moving averages and seasonality detection
- **Recommendations:** AI-generated action items
- **Confidence Scoring:** ML model accuracy indicators

### 6. AI Assistant (`/components/AIAssistant.tsx`)
- Natural language queries about data
- Dashboard creation suggestions
- Performance insights and explanations
- Trend interpretation

### 7. Goals Tracking (`/components/GoalsTracking.tsx`)
- Set performance targets by site/function/task
- Track progress over time
- Visualize goal attainment

### 8. Export & Reporting (`/components/ExportReporting.tsx`)
- Export dashboards to PDF/Excel
- Scheduled reports (planned)
- Custom report templates
- Email distribution lists

### 9. Comments & Annotations (`/components/CommentsAnnotations.tsx`)
- Add notes to specific metrics
- Tag users for collaboration
- Thread-based discussions
- Attach to dashboard elements

### 10. System Administration
- **Hierarchy Data View:** (`/components/HierarchyDataView.tsx`) - Browse sites, job functions, tasks
- **Data Source Config:** (`/components/blocks/DataSourceBlock.tsx`) - Configure data connections (Executive only)
- **User Management:** (`/components/UserManagement.tsx`) - Manage users and roles
- **Audit Logs:** (`/components/AuditLogs.tsx`) - Track all system changes
- **Bulk Operations:** (`/components/BulkOperations.tsx`) - Batch updates

---

## File Structure

```
/
├── App.tsx                          # Root component, login flow
├── components/
│   ├── MainApp.tsx                  # Main navigation and routing
│   ├── LoginScreen.tsx              # Role selection login
│   │
│   ├── Dashboard Components
│   ├── DashboardBuilder.tsx         # Dashboard creation/editing
│   ├── DashboardRenderer.tsx        # Render published dashboards
│   ├── PublishedDashboardsView.tsx  # View all published dashboards
│   ├── ManageDashboards.tsx         # Dashboard management interface
│   ├── DashboardPublishDialog.tsx   # Publishing workflow
│   ├── TemplateSelector.tsx         # Pre-built templates
│   ├── SectionBuilder.tsx           # Section management
│   ├── VisualSectionBuilder.tsx     # Visual section editor
│   ├── MetricsCatalog.tsx           # Browse available metrics
│   ├── MetricTileDialog.tsx         # Configure metric tiles
│   │
│   ├── Data Input
│   ├── DataInputFlow.tsx            # Data entry workflow
│   ├── DataInputPermissions.tsx     # Permission management
│   ├── CustomDataEntryDialog.tsx    # Data entry modal
│   ├── DateRangePicker.tsx          # Date selection
│   │
│   ├── Analytics & ML
│   ├── MLDashboard.tsx              # ML insights hub
│   ├── AnalyticsPredictions.tsx     # Predictions view
│   ├── MLInsightsWidget.tsx         # Widget for dashboards
│   ├── MLPerformanceComparison.tsx  # Compare predicted vs actual
│   ├── AIAssistant.tsx              # AI chat interface
│   │
│   ├── Alerts & Notifications
│   ├── AlertsManagement.tsx         # Alerts hub
│   ├── CreateAlertDialog.tsx        # Alert creation
│   │
│   ├── Reporting
│   ├── ExportReporting.tsx          # Export interface
│   ├── GoalsTracking.tsx            # Goals management
│   ├── CommentsAnnotations.tsx      # Comments system
│   │
│   ├── Admin
│   ├── SystemSettings.tsx           # System configuration
│   ├── UserManagement.tsx           # User admin
│   ├── AuditLogs.tsx                # Audit trail
│   ├── HierarchyDataView.tsx        # Data structure browser
│   ├── BulkOperations.tsx           # Batch operations
│   │
│   ├── blocks/
│   │   ├── CustomReportBuilder.tsx  # Report builder
│   │   ├── DataSourceBlock.tsx      # Data source config
│   │   ├── ReportBuilderBlock.tsx   # Report block for dashboards
│   │   ├── DataEntryDesktop.tsx     # Desktop data entry
│   │   ├── DataEntryMobile.tsx      # Mobile data entry
│   │   ├── SupervisorMapView.tsx    # Map visualization
│   │   └── SpreadsheetReferenceView.tsx  # Spreadsheet view
│   │
│   ├── ui/                          # Shadcn/ui components (45+)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ... (42 more components)
│   │
│   └── figma/
│       └── ImageWithFallback.tsx    # Protected system component
│
├── lib/
│   ├── mockData.ts                  # Data structures and mock data
│   ├── config.ts                    # System configuration (873 lines)
│   ├── mlEngine.ts                  # ML algorithms
│   ├── performanceUtils.ts          # Performance calculations
│   ├── sectionDefinitions.ts        # Section templates
│   └── userSettings.ts              # User preferences
│
├── hooks/
│   └── useLayoutManager.ts          # Dashboard layout logic
│
└── styles/
    └── globals.css                  # Tailwind v4 + typography defaults
```

---

## Configuration System

The entire system is configured through `/lib/config.ts` (873 lines), which includes:

### Role-Based Access Matrix
- `FEATURE_ACCESS` - What each role can do
- `DASHBOARD_CONFIG.publishing` - Who can publish where
- `DATA_INPUT_CONFIG.defaultPermissions` - Default data entry rights

### Date Range Configuration
- `DATE_RANGE_CONFIG.dataRetention` - How far back users can edit
- `DATE_RANGE_CONFIG.maxDateRangeByRole` - Query limits by role
- `DATE_RANGE_CONFIG.defaultDateRange` - Default view on login

### Alert Configuration
- `ALERT_CONFIG.defaultRules` - Pre-configured alerts
- `ALERT_CONFIG.thresholds` - Performance thresholds
- `ALERT_CONFIG.fatiguePrevention` - Prevent alert spam

### Format Configuration
- `FORMAT_CONFIG.performance` - How to display percentages
- `FORMAT_CONFIG.date` - Date format standards
- `THEME_CONFIG.colors.performance` - Color thresholds

### Security & Monitoring
- `SECURITY_CONFIG.session` - Session timeout rules
- `MONITORING_CONFIG.healthChecks` - System health monitoring
- `BACKUP_CONFIG` - Backup and recovery settings

---

## Dashboard Builder Workflow

1. **Create Dashboard**
   - Click "New Dashboard" button
   - Choose template (optional) or start from scratch
   - Enter dashboard name and description

2. **Add Sections**
   - Click "Add Section" dropdown
   - Choose section type (Performance Overview, Site Comparison, etc.)
   - Sections are collapsible containers for blocks

3. **Add Blocks to Sections**
   - Click "Add Block" within a section
   - Choose block type (Single Metric, Chart, Table, etc.)
   - Configure block settings (metric, data source, filters)

4. **Configure Single Metric Tiles** (Special Workflow)
   - Click "Create Single Metric Tile" multiple times to add placeholders
   - Unconfigured tiles show orange dashed border
   - Click "Configure" button on each tile when ready
   - Configure tiles in any order

5. **Arrange Layout**
   - Drag sections to reorder
   - Drag blocks within sections to reorder
   - Expand/collapse sections for easier editing

6. **Publish Dashboard**
   - Click "Publish Dashboard"
   - Select target roles (Executive, Site Manager, Supervisor)
   - Select target sites (All sites or specific sites)
   - Confirm publication

---

## Report Builder Workflow

1. Navigate to Ideas → Export
2. Click "Create New Report"
3. Choose visualization type (20+ options)
4. Select data source (sites, job functions, tasks)
5. Choose metrics to visualize
6. Set date range
7. Configure chart options (colors, labels, etc.)
8. Preview report in real-time
9. Save and/or export

---

## Data Input Workflow

### Desktop Experience
1. Navigate to Data tab
2. Select date (today or historical based on permissions)
3. View grid of all tasks for your job function
4. Enter actual volume and hours for each task
5. System auto-calculates performance %
6. Validation warnings appear for outliers
7. Click "Submit All" to save
8. Auto-save every 30 seconds as draft

### Mobile Experience
1. Navigate to Data tab
2. Swipe through task cards (one task per screen)
3. Enter volume and hours
4. Swipe to next task
5. Attach photos (optional)
6. Add voice notes (optional)
7. Submit when complete
8. Works offline, syncs when connected

---

## Mock Data Structure (`/lib/mockData.ts`)

### Key Interfaces
```typescript
interface Site {
  id: string;              // 'DC-001'
  name: string;            // 'Philadelphia DC'
  location: string;        // 'Philadelphia, PA'
  region: string;          // 'Northeast'
  latitude: number;
  longitude: number;
}

interface JobFunction {
  id: string;              // 'receiving'
  siteId: string;          // 'DC-001'
  name: string;            // 'Receiving'
  supervisorName: string;  // 'Mike Rodriguez'
  type: string;            // 'receiving', 'breakdown', etc.
}

interface Task {
  id: string;              // 'unload-trailer'
  jobFunctionType: string; // 'receiving'
  name: string;            // 'Unload Trailer'
}

interface DailyMetrics {
  id: string;
  date: string;            // ISO date
  siteId: string;
  jobFunctionId: string;
  taskId: string;
  budgetedVolume: number;
  budgetedRate: number;    // UPH (Units Per Hour)
  budgetedHours: number;
  forecastedVolume: number;
  expectedHours: number;
  actualVolume: number | null;    // Manual input
  actualHours: number | null;     // Manual input
  performance: number | null;     // Calculated
}
```

### Mock Data Sets
- **5 Sites** (Distribution Centers)
- **30 Job Functions** (6 per site)
- **100+ Tasks** (varies by job function)
- **30+ days of historical metrics** per task
- **3 System Dashboards** (one per role)
- **5+ Example Alerts**
- **User Permissions** mock data

---

## Styling System

### Tailwind v4 with CSS Variables
- **No `tailwind.config.js` file** - Tailwind v4 uses CSS variables in `globals.css`
- **Typography defaults** in `globals.css` for each HTML element
- **Do NOT use** Tailwind font size/weight/line-height classes unless specifically needed
- **Color system** based on performance thresholds (red/amber/yellow/green)

### Important Styling Rules
1. Never use `text-2xl`, `font-bold`, `leading-none` unless user requests
2. Use semantic HTML elements (h1, h2, p) - they have default styles
3. Performance colors auto-apply based on thresholds
4. Responsive breakpoints: mobile (768px), tablet (1024px), desktop (1920px)

---

## Development Notes for Rebuilding

### Starting Point
1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Login as any role (no authentication required in this demo)

### Key Files to Understand First
1. `/App.tsx` - Root component and login flow
2. `/components/MainApp.tsx` - Main navigation and tab structure
3. `/lib/mockData.ts` - Data structures (use this as API schema reference)
4. `/lib/config.ts` - System configuration (all business rules)

### Converting to Production
This is currently a **frontend-only demo** with mock data. To make it production-ready:

1. **Backend API:** Create endpoints matching the mock data interfaces
2. **Database:** PostgreSQL or similar with tables for:
   - Sites, JobFunctions, Tasks
   - DailyMetrics (partitioned by date)
   - Dashboards, PublishedDashboards
   - Users, Permissions
   - Alerts, AlertRules
   - AuditLogs

3. **Authentication:** Replace `LoginScreen.tsx` with real auth (OAuth, SAML, etc.)
4. **Real-Time Updates:** Add WebSocket for live data refresh
5. **File Storage:** Add S3/Azure Blob for report exports and attachments
6. **Email Service:** SendGrid/AWS SES for alert notifications
7. **ML Backend:** Python service for predictions (current ML runs client-side)

### Libraries Used (Import Reference)
```typescript
// Standard imports
import { Button } from "./components/ui/button"
import { Database, TrendingUp } from "lucide-react"
import { motion } from "motion/react"
import { toast } from "sonner@2.0.3"

// Versioned imports
import { useForm } from "react-hook-form@7.55.0"

// Charts
import { LineChart, BarChart, PieChart } from "recharts"

// Drag and Drop
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
```

### Protected Files
**Do not modify:**
- `/components/figma/ImageWithFallback.tsx` (System component)

### User Context for AI Assistants
When continuing development with AI tools (Cursor, Claude, etc.):
1. Read this README for foundation
2. Paste the user's "Background" statement for current state
3. Check `/lib/config.ts` for business rules
4. Check `/lib/mockData.ts` for data structures

---

## Recent Major Updates

1. **Navigation Streamlining** - Reduced from 9 tabs to 5 tabs by consolidating Analytics, Goals, Export into Ideas tab
2. **Report Builder** - Comprehensive report builder with 20+ visualizations and dynamic preview
3. **Dashboard Builder Enhancements** - Sections management, role assignment, template system
4. **Single Metric Tile Workflow** - Multi-add before configure workflow with visual indicators
5. **Resize Feature Removal** - Removed resizing from Dashboard Builder for consistency
6. **ML Features** - Predictions, anomaly detection, and AI assistant
7. **Alerts System** - Comprehensive alerting with SLA tracking
8. **Data Input Permissions** - Granular permission system with approval workflow
9. **Role Standardization** - Changed all 'vp' references to 'executive' throughout platform

---

## Demo Credentials

**Login as any role (no password required):**
- **Executive:** Full access, all sites
- **Site Manager:** Choose a site (e.g., DC-001), site-specific access
- **Supervisor:** Choose a site and job function, function-specific access

**Recommended Test Scenarios:**
1. Login as Executive → Create dashboard → Publish to all roles and sites
2. Login as Site Manager (DC-001) → Create dashboard → Publish only to DC-001
3. Login as Supervisor (DC-001, Receiving) → View dashboards → Input daily data

---

## Support & Questions

For questions about the platform architecture or rebuilding on another platform:
1. Review this README
2. Check `/lib/config.ts` for business rules
3. Check `/lib/mockData.ts` for data structures
4. Examine component files for implementation details

---

**Built for Walgreens Supply Chain Operations**  
**Last Updated:** November 5, 2025  
**Version:** 1.0.0
