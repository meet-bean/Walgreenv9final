# D-1 Dashboard Backup & Recovery Guide

## 🔒 Protected Dashboard

The **d-1 "Supply Chain Overview"** dashboard is the default starter dashboard that all users see. It has been permanently backed up and protected from accidental deletion or modification.

## 📁 Backup Location

The permanent backup is stored in:
```
/lib/d1-dashboard-backup.ts
```

**⚠️ DO NOT DELETE OR MODIFY THIS FILE ⚠️**

## 🔄 How It Works

1. **Protected Source**: The d-1 dashboard definition is stored in `/lib/d1-dashboard-backup.ts`
2. **Automatic Import**: `/lib/mockData.ts` imports the dashboard from the backup file
3. **Read-Only Reference**: The actual dashboard data comes from the protected backup

## 🛠️ Recovery Process

If the d-1 dashboard ever gets accidentally modified or deleted, you can restore it using one of these methods:

### Method 1: Automatic Recovery (Recommended)
The dashboard is automatically loaded from the backup file on every app start. Simply refresh the page or restart the application.

### Method 2: Manual Recovery via Code
```typescript
import { restoreD1Dashboard } from './lib/d1-dashboard-backup';

// Get a fresh copy of the d-1 dashboard
const restoredDashboard = restoreD1Dashboard();

// Save it back to your dashboard collection
saveDashboard(restoredDashboard);
```

### Method 3: Manual Recovery via LocalStorage
If you need to reset local storage:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this command:
```javascript
localStorage.removeItem('custom-dashboards');
location.reload();
```

## 📋 Dashboard Contents

The d-1 dashboard includes 6 comprehensive sections:

1. **Key Performance Indicators** (Full width, 4 columns)
   - Overall Performance
   - Total Volume
   - Labor Efficiency
   - Active Sites

2. **30-Day Performance Trend** (Half width, 2 columns)
   - Line chart showing trends over time
   - Target line overlay

3. **Top Performing Sites** (Half width, 2 columns)
   - Rankings of top 5 sites
   - Performance metrics and trends

4. **Labor Hours: Budgeted vs Actual** (Full width, 4 columns)
   - Grouped bar chart
   - Comparison across all sites

5. **Geographic Performance Overview** (Full width, 4 columns)
   - Interactive map view
   - Performance metrics by location

6. **Detailed Performance Breakdown** (Full width, 4 columns)
   - Hierarchical table
   - Site → Job Function → Task drill-down

## 🎯 Dashboard Properties

- **ID**: `d-1`
- **Name**: Supply Chain Overview
- **Visible to Roles**: All (Executive, Site Manager, Supervisor)
- **Filters**: Date range, Site filter, Aggregation, Underperforming filter
- **Grid System**: 4-column layout
- **Created**: 2024-01-01
- **Last Updated**: 2024-01-01

## 🔐 Protection Features

✅ **Version Control**: The backup file serves as version control  
✅ **Import Protection**: Dashboard loaded from backup on startup  
✅ **Helper Functions**: `restoreD1Dashboard()` and `isD1Dashboard()` utilities  
✅ **Documentation**: This README for recovery procedures  
✅ **Deep Clone**: Recovery function provides deep copy to prevent reference issues  

## 🚨 Emergency Contact

If you encounter issues with the d-1 dashboard that cannot be resolved using the above methods, the backup file contains the complete, pristine definition that can be used to restore it manually.

## 📝 Modification Policy

The d-1 dashboard backup file should **NEVER** be modified except for:
- Critical bug fixes
- Security patches
- Intentional design system updates approved by the team

Any changes to the backup file should be:
1. Documented in version control
2. Reviewed by the team
3. Tested thoroughly before deployment

---

**Last Updated**: November 14, 2024  
**Maintained By**: System Team  
**Status**: ✅ Active & Protected
