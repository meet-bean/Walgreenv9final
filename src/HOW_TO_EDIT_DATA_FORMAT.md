# How to Edit the Expected Data Format

## 📍 Main Configuration File

**Location:** `/lib/dataImportConfig.ts`

This single file controls **everything** about your data import format:
- ✅ Column names and descriptions
- ✅ Required vs optional fields  
- ✅ Validation rules
- ✅ Template sample data
- ✅ All UI text

## 🎯 Quick Start: Common Edits

### 1. **Add a New Column**

Edit the `COLUMN_DEFINITIONS` array in `/lib/dataImportConfig.ts`:

```typescript
export const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  // ... existing columns ...
  
  // ADD YOUR NEW COLUMN HERE:
  {
    field: 'myNewField',                    // Internal field name (camelCase)
    displayName: 'My New Field',            // Name shown in UI
    description: 'Description of what this field contains',
    columnHint: 'Column I',                 // Optional: "Column A", "Column B", etc.
    required: false,                        // true = required, false = optional
    type: 'string',                         // 'string' | 'number' | 'date'
    matchKeywords: ['my field', 'new'],     // Keywords to auto-detect this column
  },
];
```

**That's it!** The system will automatically:
- ✅ Show it in the "Expected Data Format" UI
- ✅ Parse it from uploaded files
- ✅ Include it in the template download
- ✅ Validate it based on the type

### 2. **Remove a Column**

Simply **delete** or **comment out** the column from `COLUMN_DEFINITIONS`:

```typescript
// {
//   field: 'forecastedVolume',
//   displayName: 'Forecasted Volume',
//   ... (removed)
// },
```

### 3. **Change Column Names**

Edit the `displayName` and `matchKeywords`:

```typescript
{
  field: 'budgetedVolume',
  displayName: 'Planned Volume',           // Changed from "Budgeted Volume"
  description: 'Expected units to process',
  columnHint: 'Column B',
  required: true,
  type: 'number',
  matchKeywords: ['planned', 'volume', 'target'],  // Updated keywords
},
```

### 4. **Make a Field Required/Optional**

Change the `required` property:

```typescript
{
  field: 'siteId',
  displayName: 'Site ID',
  description: 'Distribution center identifier',
  required: true,        // Changed from false to true
  type: 'string',
  matchKeywords: ['site', 'dc', 'location'],
},
```

### 5. **Update Validation Rules**

Edit `VALIDATION_RULES` in `/lib/dataImportConfig.ts`:

```typescript
export const VALIDATION_RULES = {
  allowNegativeNumbers: false,              // true = allow, false = reject
  warnOnZeroValues: true,                   // true = show warning, false = ignore
  validateCalculatedHours: true,            // true = check math, false = skip
  calculatedHoursTolerance: 0.5,            // Changed from 0.1 to 0.5
  minimumRows: 5,                           // Changed from 1 to 5
  maximumRows: 1000,                        // Changed from 0 (unlimited) to 1000
};
```

### 6. **Change Template Sample Data**

Edit `TEMPLATE_SAMPLE_DATA` in `/lib/dataImportConfig.ts`:

```typescript
export const TEMPLATE_SAMPLE_DATA = [
  {
    task: 'Your Task Name',
    budgetedVolume: 1000,
    budgetedRate: 100,
    budgetedHours: 10,
    // Add your custom fields here
    myNewField: 'Sample value',
  },
  // Add more sample rows...
];
```

### 7. **Change UI Text**

Edit `UI_TEXT` in `/lib/dataImportConfig.ts`:

```typescript
export const UI_TEXT = {
  pageTitle: 'Your Custom Title',
  pageDescription: 'Your custom description',
  
  uploadTab: {
    title: 'Upload Data',
    cardTitle: 'Upload Your Files',
    // ... edit any text shown in the UI
  },
  
  integrationTab: {
    title: 'SharePoint Connection',
    // ... edit SharePoint tab text
  },
};
```

## 📋 Complete Example: Adding a "Shift" Column

**Step 1:** Open `/lib/dataImportConfig.ts`

**Step 2:** Add to `COLUMN_DEFINITIONS`:

```typescript
export const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  // ... existing columns ...
  
  {
    field: 'shift',
    displayName: 'Shift',
    description: 'Day, Night, or Swing shift',
    columnHint: 'Column I',
    required: false,
    type: 'string',
    matchKeywords: ['shift', 'period', 'time'],
  },
];
```

**Step 3:** Update `TEMPLATE_SAMPLE_DATA`:

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
    shift: 'Day',          // Added shift
  },
  // ... add shift to all sample rows
];
```

**Done!** The UI, parser, validator, and template will all automatically include the "Shift" column.

## 🎨 Column Definition Properties

### `field` (string)
- Internal variable name
- Use camelCase (e.g., `budgetedVolume`)
- Must be unique
- Will be used in the data structure

### `displayName` (string)
- Name shown to users in the UI
- Used as header in downloaded template
- Can include spaces and special characters

### `description` (string)
- Help text shown under the column name
- Explains what data belongs in this column

### `columnHint` (string, optional)
- Visual hint like "Column A", "Column B"
- Helps users map their Excel columns
- Not required but recommended

### `required` (boolean)
- `true` = Users must provide this data (validation error if missing)
- `false` = Optional field (can be empty)

### `type` ('string' | 'number' | 'date')
- `'string'` = Text data
- `'number'` = Numeric data (will be converted to number)
- `'date'` = Date data (stored as string but indicates date format)

### `matchKeywords` (string[])
- **IMPORTANT:** Keywords to auto-detect columns
- Lowercase only
- System checks if header includes ANY of these words
- Examples:
  - `['task', 'activity']` → Matches "Task Name", "Task", "Activity"
  - `['budget', 'volume']` → Matches "Budgeted Volume", "Budget Vol"

## 🔧 Validation Rules Explained

### `allowNegativeNumbers`
```typescript
allowNegativeNumbers: false
```
- `false` = Reject negative values in volume/rate/hours (show error)
- `true` = Allow negative values

### `warnOnZeroValues`
```typescript
warnOnZeroValues: true
```
- `true` = Show warning when volume or rate is zero (but still import)
- `false` = Ignore zero values

### `validateCalculatedHours`
```typescript
validateCalculatedHours: true
```
- `true` = Check if `budgetedHours ≈ budgetedVolume / budgetedRate`
- `false` = Don't validate the math

### `calculatedHoursTolerance`
```typescript
calculatedHoursTolerance: 0.1
```
- Maximum acceptable difference in hours calculation
- Example: If calculated = 20.5 and budgeted = 20.0, difference = 0.5
  - With tolerance 0.1: Shows warning (0.5 > 0.1)
  - With tolerance 1.0: No warning (0.5 < 1.0)

### `minimumRows`
```typescript
minimumRows: 1
```
- Minimum number of data rows required
- Set to `1` to require at least one row
- Set higher to enforce minimum dataset size

### `maximumRows`
```typescript
maximumRows: 0
```
- Maximum number of rows allowed
- `0` = unlimited
- Set to a number (e.g., `10000`) to prevent huge files

## 📊 Data Type Reference

### TypeScript Interface

After you configure columns, data is imported as:

```typescript
interface ImportedDataRow {
  // Required fields (from your configuration)
  task: string;
  budgetedVolume: number;
  budgetedRate: number;
  budgetedHours: number;
  
  // Optional fields (from your configuration)
  forecastedVolume?: number;
  siteId?: string;
  jobFunction?: string;
  date?: string;
  
  // Any additional fields you add
  [key: string]: any;
}
```

## 🎯 Tips & Best Practices

### Column Ordering
Columns appear in the UI in the **same order** as `COLUMN_DEFINITIONS`:
```typescript
// This order:
['task', 'budgetedVolume', 'budgetedRate', ...]

// Shows in UI as:
Column A: Tasks
Column B: Budgeted Volume
Column C: Budgeted Rate
```

### Match Keywords Strategy
Use **multiple keywords** to catch variations:
```typescript
matchKeywords: [
  'budget volume',      // Exact match
  'budgeted volume',    // Variation
  'planned volume',     // Synonym
  'target volume',      // Another synonym
  'volume',             // Fallback
]
```

### Required vs Optional
**Make required:**
- Core business data (task, volume, rate, hours)
- Data needed for calculations
- Data used in dashboards

**Make optional:**
- Metadata (site, date, function)
- Nice-to-have fields
- Fields that vary by site/department

### Type Selection
- Use `'number'` for:
  - Quantities, rates, hours, percentages
  - Any data used in math/calculations
  
- Use `'string'` for:
  - Names, IDs, descriptions
  - Categories (even if they're numbers like "DC-001")
  
- Use `'date'` for:
  - Dates, timestamps
  - Currently stored as string but indicates date format

## 🚀 Testing Your Changes

After editing `/lib/dataImportConfig.ts`:

1. **Check the UI:**
   - Go to Settings → Integrations
   - Scroll to "Expected Data Format" card
   - Verify your columns appear correctly

2. **Download Template:**
   - Click "Download Template"
   - Open the CSV file
   - Verify headers match your `displayName` values

3. **Upload Test File:**
   - Create a test Excel/CSV file with your columns
   - Upload it
   - Check validation messages

4. **Verify Imported Data:**
   - Look at "Imported Datasets" section
   - Check the row count and metadata

## 📁 Files You'll Edit

### Primary File (Edit This!)
```
/lib/dataImportConfig.ts
```
**This is the only file you need to edit for most changes.**

### Advanced: Other Files (Don't Edit Unless Necessary)

```
/lib/dataImportService.ts
```
- ✅ Already integrated with config
- ⚠️ Only edit for advanced parsing logic changes

```
/components/blocks/DataSourceBlock.tsx
```
- ✅ Already uses config for UI
- ⚠️ Only edit for UI layout changes

## 🎉 Summary

**To customize your data import format:**

1. Open `/lib/dataImportConfig.ts`
2. Edit `COLUMN_DEFINITIONS` to add/remove/modify columns
3. Edit `VALIDATION_RULES` to change validation behavior
4. Edit `TEMPLATE_SAMPLE_DATA` to update template examples
5. Edit `UI_TEXT` to customize user-facing text
6. Save and test!

**Everything automatically updates:**
- ✅ UI displays your columns
- ✅ Parser recognizes your columns
- ✅ Validator enforces your rules
- ✅ Template includes your data
- ✅ All uses your CSS design system variables

No need to touch any other files! 🚀
