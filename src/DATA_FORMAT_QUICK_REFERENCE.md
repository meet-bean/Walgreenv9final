# Data Format Configuration - Quick Reference

## 🎯 Edit This File: `/lib/dataImportConfig.ts`

```typescript
┌─────────────────────────────────────────────────────────────┐
│  /lib/dataImportConfig.ts                                   │
│  ════════════════════════════════════════════════════       │
│                                                             │
│  ✏️ EDIT THESE SECTIONS:                                    │
│                                                             │
│  1️⃣ COLUMN_DEFINITIONS  ← Add/remove/edit columns         │
│  2️⃣ VALIDATION_RULES    ← Change validation behavior      │
│  3️⃣ TEMPLATE_SAMPLE_DATA ← Update template examples       │
│  4️⃣ UI_TEXT             ← Customize all UI text           │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Section 1: Column Definitions

### Current Default Columns:

| Column | Display Name | Type | Required | Description |
|--------|--------------|------|----------|-------------|
| A | Tasks | string | ✅ Yes | Task name or description |
| B | Budgeted Volume | number | ✅ Yes | Expected units for the day |
| C | Budgeted Rate (UPH) | number | ✅ Yes | Units per hour rate |
| D | Budgeted Hours | number | ✅ Yes | Calculated or provided hours |
| E | Forecasted Volume | number | ⚪ No | Updated daily forecast |
| F | Site ID | string | ⚪ No | Distribution center identifier |
| G | Job Function | string | ⚪ No | Department or function |
| H | Date | date | ⚪ No | Date for this data |

### How to Edit:

```typescript
export const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  {
    field: 'task',                    // ← Internal name (code)
    displayName: 'Tasks',             // ← UI label
    description: 'Task name...',      // ← Help text
    columnHint: 'Column A',           // ← Position hint
    required: true,                   // ← true/false
    type: 'string',                   // ← string/number/date
    matchKeywords: ['task', 'name'],  // ← Auto-detect keywords
  },
  // ... more columns
];
```

## 🔍 Section 2: Validation Rules

### Current Defaults:

| Rule | Value | Effect |
|------|-------|--------|
| allowNegativeNumbers | `false` | ❌ Reject negative values |
| warnOnZeroValues | `true` | ⚠️ Warn on zeros |
| validateCalculatedHours | `true` | ✅ Check math |
| calculatedHoursTolerance | `0.1` | Max 0.1 hour difference |
| minimumRows | `1` | Need at least 1 row |
| maximumRows | `0` | Unlimited rows |

### How to Edit:

```typescript
export const VALIDATION_RULES = {
  allowNegativeNumbers: false,      // ← Change to true to allow
  warnOnZeroValues: true,           // ← Change to false to ignore
  validateCalculatedHours: true,    // ← Change to false to skip
  calculatedHoursTolerance: 0.1,    // ← Increase for more tolerance
  minimumRows: 1,                   // ← Require more rows
  maximumRows: 0,                   // ← Set limit (0 = unlimited)
};
```

## 📊 Section 3: Template Sample Data

### Current Sample Rows:

```typescript
export const TEMPLATE_SAMPLE_DATA = [
  {
    task: 'Receiving',
    budgetedVolume: 5000,
    budgetedRate: 250,
    budgetedHours: 20,
    forecastedVolume: 5200,
    siteId: 'DC-001',
    jobFunction: 'Inbound',
    date: '2024-11-14',
  },
  // ... 4 more sample rows
];
```

**Customize:** Add your own sample data that represents your actual use case!

## 💬 Section 4: UI Text

### Editable Text Strings:

```typescript
export const UI_TEXT = {
  pageTitle: 'Data Integration Hub',                    // ← Main heading
  pageDescription: 'Upload Excel files or...',          // ← Subtitle
  
  uploadTab: {
    title: 'File Upload',                               // ← Tab label
    cardTitle: 'Upload Budget Data',                    // ← Card heading
    dragDropText: 'Click to upload or drag and drop',   // ← Upload area
    templateButtonText: 'Download Template',            // ← Button text
    // ... more text
  },
  
  integrationTab: {
    title: 'SharePoint / Excel Integration',            // ← Tab label
    // ... more text
  },
};
```

## 🎨 Design System Integration

All UI automatically uses your CSS variables:

```css
/* Typography */
--font-family-inter
--text-base, --text-label, --text-h3
--font-weight-medium, --font-weight-semibold

/* Colors */
--foreground, --muted-foreground
--border, --card, --background
--primary, --secondary
--chart-1, --chart-2, --chart-3, --chart-4

/* Spacing */
--spacing-1 through --spacing-8

/* Borders */
--radius
```

## 🚀 Common Customization Examples

### Example 1: Add "Shift" Column

```typescript
COLUMN_DEFINITIONS.push({
  field: 'shift',
  displayName: 'Shift',
  description: 'Day, Night, or Swing',
  columnHint: 'Column I',
  required: false,
  type: 'string',
  matchKeywords: ['shift', 'period'],
});
```

### Example 2: Make Site ID Required

```typescript
// Find the siteId column and change:
required: false,  // ← Change this
// To:
required: true,   // ← To this
```

### Example 3: Allow Negative Numbers

```typescript
VALIDATION_RULES = {
  allowNegativeNumbers: true,  // ← Changed from false
  // ... rest stays the same
};
```

### Example 4: Rename "Tasks" to "Activities"

```typescript
{
  field: 'task',                    // Keep same (internal)
  displayName: 'Activities',        // ← Changed from "Tasks"
  description: 'Activity name...',  // Updated description
  matchKeywords: ['activity', 'task', 'name'],  // Added 'activity'
  // ... rest stays the same
}
```

## 🔄 What Happens When You Edit Config

```
┌─────────────────────────┐
│  Edit Config File       │
│  /lib/dataImportConfig  │
└──────────┬──────────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
           ▼                                     ▼
┌──────────────────────┐            ┌──────────────────────┐
│  UI Updates          │            │  Parser Updates      │
│  ─────────────       │            │  ──────────────      │
│  • Column display    │            │  • Column detection  │
│  • Required markers  │            │  • Type conversion   │
│  • Help text         │            │  • Field mapping     │
└──────────┬───────────┘            └───────────┬──────────┘
           │                                     │
           ├─────────────────────────────────────┤
           │                                     │
           ▼                                     ▼
┌──────────────────────┐            ┌──────────────────────┐
│  Validator Updates   │            │  Template Updates    │
│  ────────────────    │            │  ───────────────     │
│  • Required checks   │            │  • Header row        │
│  • Type validation   │            │  • Sample data       │
│  • Math validation   │            │  • Column order      │
└──────────────────────┘            └──────────────────────┘
```

## 📍 Where Things Appear

### 1. Expected Data Format Card
```
Settings → Integrations → File Upload Tab
Scroll down to "Expected Data Format" card
```
Shows all your columns with:
- Column hint (A, B, C...)
- Display name
- Required marker (*)
- Description

### 2. Template Download
```
Settings → Integrations → File Upload Tab
Click "Download Template" button
```
CSV file contains:
- Headers from displayName
- Sample rows from TEMPLATE_SAMPLE_DATA
- Columns in COLUMN_DEFINITIONS order

### 3. Upload Validation
```
Upload any Excel/CSV file
```
System checks:
- Required columns present
- Data types correct
- Validation rules met
- Shows errors/warnings

### 4. Imported Datasets
```
Settings → Integrations → File Upload Tab
"Imported Datasets" card
```
Shows:
- Dataset name
- Row count
- Upload date
- Metadata from your columns

## ✅ Testing Checklist

After editing config:

- [ ] UI shows updated columns in "Expected Data Format"
- [ ] Required fields show red asterisk (*)
- [ ] Download Template has correct headers
- [ ] Template sample data includes new columns
- [ ] Upload recognizes new column names
- [ ] Validation respects new rules
- [ ] Imported data includes new fields
- [ ] All text matches UI_TEXT settings

## 🎯 Pro Tips

### Match Keywords
Be generous with keywords! Include:
- ✅ Exact match: `'budgeted volume'`
- ✅ Variations: `'budget volume'`, `'budgeted vol'`
- ✅ Synonyms: `'planned volume'`, `'target volume'`
- ✅ Short version: `'volume'`

### Column Hints
Use sequential letters:
- Column A, B, C, D... for required fields
- Continue with E, F, G... for optional fields
- Helps users organize their Excel files

### Sample Data
Make it realistic:
- Use actual site IDs (DC-001, DC-002)
- Use real job functions (Inbound, Outbound)
- Use current dates
- Show realistic numbers

### Required Fields
Only mark as required if:
- Absolutely necessary for app to function
- Used in calculations/dashboards
- Cannot be blank or default

## 📖 Full Documentation

See `/HOW_TO_EDIT_DATA_FORMAT.md` for comprehensive guide.

---

**Need help?** The configuration is designed to be simple - just edit the arrays and objects in `/lib/dataImportConfig.ts`!
