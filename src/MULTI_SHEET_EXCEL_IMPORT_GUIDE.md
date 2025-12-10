# Multi-Sheet Excel Import Guide 📚📊

## Overview

The Excel uploader now supports **importing data from multiple sheets** in a single Excel file! You can select one or more sheets from your workbook and import them all at once.

---

## 🎯 What's New

### **Before:**
- ❌ Only imported the **first sheet** in the Excel file
- ❌ No way to import other sheets without creating separate files
- ❌ Had to manually split workbooks to import different sheets

### **After:**
- ✅ **Detects all sheets** in the Excel file automatically
- ✅ **Select which sheets** to import (one or multiple)
- ✅ **Import multiple sheets** in a single upload
- ✅ Each sheet becomes a **separate dataset** with its own name

---

## 📍 Where to Find It

**Location:**
```
Settings (⚙️) → Integrations → File Upload Tab
```

**Toggle Button:**
Look for the toggle button in the top-right of the upload card:
```
┌─────────────────────────────────────────────────┐
│ Upload Budget Data            [📚 Multiple Sheets]│
│                                                  │
└─────────────────────────────────────────────────┘
```

Click to switch between:
- **📄 Single Sheet** - Import only the first sheet (default, quick)
- **📚 Multiple Sheets** - Select and import specific sheets

---

## 🚀 How to Use (Step by Step)

### **Step 1: Choose Multi-Sheet Mode**

1. Go to **Settings → Integrations → File Upload**
2. Click the **"📚 Multiple Sheets"** button in the top-right
3. Select your **dataset type** (Budget, Actual, or Combined)

---

### **Step 2: Upload Excel File**

1. Click the upload area or drag and drop your Excel file
2. System analyzes the file and detects all sheets
3. You'll see a message: **"Found X sheets in file"**

**Supported formats:**
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

**NOT supported:**
- `.csv` files (CSV files don't have multiple sheets)

---

### **Step 3: Select Sheets to Import**

You'll see a list of all sheets with:
- ✅ **Checkboxes** to select/deselect
- 📊 **Sheet name** (e.g., "January", "Q1 Budget", "Actuals")
- 📈 **Row and column counts** (e.g., "50 rows × 8 columns")

**Selection options:**
```
┌─────────────────────────────────────────────────┐
│ Select Sheets to Import      [Select All] [Deselect All]│
│                                                  │
│ ☑ January (50 rows × 8 columns)                │
│ ☑ February (48 rows × 8 columns)               │
│ ☐ Q1 Summary (150 rows × 10 columns)           │
│ ☑ Actuals (120 rows × 13 columns)              │
└─────────────────────────────────────────────────┘
```

**Actions:**
- Click **checkbox** or **sheet row** to toggle selection
- Click **"Select All"** to select all sheets
- Click **"Deselect All"** to clear all selections

---

### **Step 4: Import Selected Sheets**

1. Click **"Import X Sheets"** button (shows count of selected sheets)
2. System imports each selected sheet:
   - Validates data format
   - Checks required columns
   - Creates separate dataset for each sheet
3. See **import results** for each sheet (success or errors)

---

### **Step 5: View Imported Data**

Go to **Settings → Integrations → View Data** tab to see your datasets:

```
📄 Budget 2025 - January          📊 Budget     ✓ valid
   Jan 15, 2025
   50 rows • 8 columns

📄 Budget 2025 - February         📊 Budget     ✓ valid
   Jan 15, 2025
   48 rows • 8 columns

📄 Budget 2025 - Actuals          ✅ Actual     ✓ valid
   Jan 15, 2025
   120 rows • 13 columns
```

Each sheet is saved as a separate dataset with format:
```
[Original Filename] - [Sheet Name]
```

---

## 🎨 User Interface

### **Multi-Sheet Upload Flow:**

```
1. Upload File
   ↓
┌─────────────────────────────────────────────────┐
│ 📄 Budget_2025.xlsx contains 4 sheets           │
│ Select which sheets to import below             │
│                          [Choose Different File]│
└─────────────────────────────────────────────────┘

2. Select Sheets
   ↓
┌─────────────────────────────────────────────────┐
│ Select Sheets to Import      [Select All] [Deselect All]│
│                                                  │
│ ☑ 📊 January                                    │
│    50 rows × 8 columns                          │
│                                                  │
│ ☑ 📊 February                                   │
│    48 rows × 8 columns                          │
│                                                  │
│ ☐ 📊 Q1 Summary                                 │
│    150 rows × 10 columns                        │
│                                                  │
│ ☑ 📊 Actuals                                    │
│    120 rows × 13 columns                        │
└─────────────────────────────────────────────────┘

                    [Cancel]  [Import 3 Sheets]

3. Import Results
   ↓
┌─────────────────────────────────────────────────┐
│ Import Results                                   │
│ 3 of 3 sheets imported successfully             │
│                                                  │
│ ✓ January                                        │
│   Successfully imported 50 rows                  │
│                                                  │
│ ✓ February                                       │
│   Successfully imported 48 rows                  │
│                                                  │
│ ✓ Actuals                                        │
│   Successfully imported 120 rows                 │
│                                                  │
│            [Import Another File]                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 Example Use Cases

### **Use Case 1: Monthly Budget Sheets**

**Excel File Structure:**
```
Budget_2025.xlsx
├── January
├── February
├── March
├── April
├── May
├── June
└── ...12 sheets total
```

**Workflow:**
1. Upload `Budget_2025.xlsx`
2. Select **all 12 monthly sheets**
3. Click **"Import 12 Sheets"**
4. Result: **12 separate datasets**, one for each month
5. Each named: "Budget_2025 - January", "Budget_2025 - February", etc.

**Benefits:**
- Import entire year of budgets in one upload
- Each month is a separate dataset for filtering
- Easy to update individual months later

---

### **Use Case 2: Multi-Site Data**

**Excel File Structure:**
```
Multi_Site_Actuals.xlsx
├── DC-001
├── DC-002
├── DC-003
├── DC-004
└── Summary
```

**Workflow:**
1. Upload `Multi_Site_Actuals.xlsx`
2. Select **all site sheets** (deselect "Summary" if not needed)
3. Click **"Import 4 Sheets"**
4. Result: **4 datasets**, one per site

**Benefits:**
- Import all sites at once
- Keep Summary sheet separate if needed
- Easy to analyze per-site performance

---

### **Use Case 3: Budget vs Actual Comparison**

**Excel File Structure:**
```
Q1_Performance.xlsx
├── Budget
├── Actual
└── Variance
```

**Workflow:**
1. Upload `Q1_Performance.xlsx`
2. Select **"Budget"** sheet → Set type to **Budget** → Import
3. Upload same file again
4. Select **"Actual"** sheet → Set type to **Actual** → Import
5. Upload same file again
6. Select **"Variance"** sheet → Set type to **Combined** → Import

**Benefits:**
- Import different data types from same file
- Each sheet tagged with appropriate type
- Complete performance analysis setup

---

### **Use Case 4: Selective Import**

**Excel File Structure:**
```
Data_Export.xlsx
├── Raw Data (do not import)
├── Formatted Budget ✓
├── Working Calculations (do not import)
├── Final Actuals ✓
└── Archive (do not import)
```

**Workflow:**
1. Upload `Data_Export.xlsx`
2. **Deselect All**
3. Select **only** "Formatted Budget" and "Final Actuals"
4. Click **"Import 2 Sheets"**

**Benefits:**
- Import only the sheets you need
- Skip intermediate/calculation sheets
- Cleaner dataset list

---

## 🆚 Single Sheet vs Multi-Sheet Mode

| Feature | Single Sheet Mode | Multi-Sheet Mode |
|---------|------------------|------------------|
| **Speed** | ✅ Fastest (1 click) | Moderate (select sheets) |
| **Sheets Imported** | First sheet only | Selected sheets (one or more) |
| **Selection** | ❌ No choice | ✅ Choose which sheets |
| **Use Case** | Simple files, one sheet | Complex workbooks, multiple sheets |
| **When to Use** | Quick uploads, single-sheet files | Monthly budgets, multi-site data |
| **Datasets Created** | 1 dataset | 1 dataset per selected sheet |

---

## 📋 Sheet Naming

### **Automatic Dataset Names:**

When importing multiple sheets, each dataset is named:
```
[Original Filename without extension] - [Sheet Name]
```

**Examples:**

| File | Sheet | Dataset Name |
|------|-------|-------------|
| Budget_2025.xlsx | January | Budget_2025 - January |
| Budget_2025.xlsx | February | Budget_2025 - February |
| Q1_Data.xlsx | Actuals | Q1_Data - Actuals |
| Sites.xlsx | DC-001 | Sites - DC-001 |

### **Single Sheet Import:**

When importing only **1 sheet**, the dataset name is just the filename:
```
[Original Filename without extension]
```

**Example:**
- File: `Budget_2025.xlsx`
- Sheet: January (only one selected)
- Dataset Name: `Budget_2025`

---

## ✅ Best Practices

### **Excel File Organization**

✅ **DO:**
- Use clear, descriptive sheet names ("January 2025", "DC-001 Budget")
- Keep consistent structure across sheets
- Use same column headers in all sheets
- Put data sheets at the beginning, summary/archive sheets at the end
- Name files descriptively ("2025_Annual_Budget.xlsx")

❌ **DON'T:**
- Use vague names ("Sheet1", "Sheet2", "Data")
- Mix different data structures in one file
- Have blank or hidden sheets
- Use special characters in sheet names (stick to alphanumeric)

---

### **Import Strategy**

**For Monthly Data:**
```
✅ Import all months at once
   - Upload once, select all 12 sheets
   - Get 12 datasets immediately
```

**For Different Data Types:**
```
✅ Import separately by type
   - Upload file, select budget sheets, set type to Budget
   - Upload again, select actual sheets, set type to Actual
```

**For Large Files:**
```
✅ Import in batches
   - Select Q1 sheets first
   - Import and verify
   - Upload again for Q2, Q3, Q4
```

---

### **Sheet Validation**

Before importing, verify each sheet has:
- ✅ Headers in row 1
- ✅ Consistent column names
- ✅ Required columns present (task, budgetedVolume, etc.)
- ✅ No blank rows at the top
- ✅ Data starts in row 2
- ✅ No merged cells in data area

---

## 🔍 Validation & Error Handling

### **Per-Sheet Validation**

Each sheet is validated **independently**:

```
┌─────────────────────────────────────────────────┐
│ Import Results                                   │
│ 2 of 3 sheets imported successfully             │
│                                                  │
│ ✓ January                         [Success]     │
│   Successfully imported 50 rows                  │
│                                                  │
│ ✗ February                        [Failed]      │
│   Validation failed: 3 errors                   │
│                                                  │
│ ✓ March                           [Success]     │
│   Successfully imported 45 rows                  │
└─────────────────────────────────────────────────┘
```

**If a sheet fails:**
- ❌ That sheet is **not imported**
- ✅ Other sheets **continue importing**
- ℹ️ Error message shows **what went wrong**
- 🔄 You can **fix and retry** that specific sheet

---

### **Common Validation Errors**

**"Sheet must contain headers and at least one row of data"**
- Cause: Empty sheet or only headers
- Fix: Add data rows or deselect this sheet

**"Validation failed: budgetedVolume is required"**
- Cause: Missing required column
- Fix: Add column to sheet or change dataset type

**"Failed to parse sheet: [error]"**
- Cause: Invalid data format, corrupted file
- Fix: Check file integrity, verify Excel version

---

## 🛠️ Troubleshooting

### **Issue: "No sheets found in Excel file"**

**Cause:** Empty workbook

**Solutions:**
1. Open Excel file and verify it has sheets
2. Check file isn't corrupted
3. Ensure it's a valid Excel file (.xlsx or .xls)
4. Try re-saving the file

---

### **Issue: CSV files don't work**

**Cause:** CSV files don't have multiple sheets

**Solution:**
1. CSV files only work in **Single Sheet mode**
2. For multi-sheet, convert CSV to Excel (.xlsx)
3. Or use Single Sheet mode for CSV

---

### **Issue: Can't see multi-sheet option**

**Cause:** File hasn't been uploaded yet or CSV selected

**Solution:**
1. Make sure you're in **File Upload** tab
2. Click **"📚 Multiple Sheets"** button in top-right of card
3. Only works with Excel files (.xlsx, .xls)

---

### **Issue: Sheet names show as "Sheet1", "Sheet2"**

**Cause:** Default Excel sheet names

**Solution:**
1. Open Excel file
2. Right-click each sheet tab → Rename
3. Give descriptive names ("January", "DC-001", etc.)
4. Re-upload file

---

### **Issue: Import succeeds but datasets not showing**

**Cause:** Need to refresh View Data tab

**Solution:**
1. Go to **Settings → Integrations → View Data**
2. Your datasets should appear there
3. May need to refresh page if using browser back button

---

## 💡 Pro Tips

### **Tip 1: Template Consistency**
Create one template sheet with the correct column structure, then duplicate it for each month/site. This ensures all sheets import cleanly.

### **Tip 2: Batch by Type**
If your workbook has budget sheets AND actual sheets, import them in two passes:
- Pass 1: Select all budget sheets, set type to Budget, import
- Pass 2: Select all actual sheets, set type to Actual, import

### **Tip 3: Test with One Sheet**
Before importing all 12 months, test with just January. Verify it imports correctly, then import the rest.

### **Tip 4: Use Descriptive File Names**
Name your file `2025_Annual_Budget.xlsx` instead of `data.xlsx`. The filename becomes part of each dataset name.

### **Tip 5: Pre-Select in Excel**
Arrange your Excel sheets in the order you want to import them. The multi-sheet selector shows them in the same order.

### **Tip 6: Hidden Sheets**
The system **does not detect hidden sheets** in Excel. Unhide any sheets you want to import.

### **Tip 7: Partial Import Recovery**
If some sheets fail, the successful ones are still imported. Fix the failed sheets and upload again selecting only those.

### **Tip 8: Archive Old Versions**
After importing, keep a backup of the Excel file. You can always re-import if needed.

---

## 📊 Technical Details

### **How It Works**

```
1. File Upload
   ↓ User uploads .xlsx file
   
2. Sheet Detection
   ↓ System reads workbook structure
   ↓ Gets all sheet names and metadata
   
3. Metadata Display
   ↓ Shows: Sheet name, row count, column count
   
4. User Selection
   ↓ User checks/unchecks sheets
   
5. Sequential Import
   ↓ For each selected sheet:
   │  - Parse sheet data
   │  - Map columns using configuration
   │  - Validate data
   │  - Create dataset
   │  - Save to localStorage
   
6. Results
   ↓ Show success/failure per sheet
```

---

### **Sheet Metadata**

Each sheet provides:

```typescript
{
  name: string;        // "January", "DC-001", etc.
  index: number;       // Position in workbook (0-based)
  rowCount: number;    // Total rows including header
  columnCount: number; // Total columns
}
```

---

### **Import Process**

For each selected sheet:

```typescript
1. parseExcelSheet(file, sheetName)
   - Reads specific sheet from workbook
   - Extracts headers and data rows
   - Maps columns using configuration
   - Returns ImportedDataRow[]

2. validateImportedData(parsedData)
   - Checks required fields
   - Validates data types
   - Returns validation result

3. saveImportedDataset(name, data, source, type, filename)
   - Creates dataset object
   - Saves to localStorage
   - Returns saved dataset
```

---

## 🎯 Quick Reference

| Action | Steps |
|--------|-------|
| **Switch to Multi-Sheet** | Click "📚 Multiple Sheets" button |
| **Upload File** | Drag/drop or click upload area |
| **Select All Sheets** | Click "Select All" button |
| **Deselect All** | Click "Deselect All" button |
| **Toggle Sheet** | Click checkbox or sheet row |
| **Import** | Click "Import X Sheets" button |
| **Cancel** | Click "Cancel" or "Choose Different File" |
| **Start Over** | Click "Import Another File" |
| **Switch Back** | Click "📄 Single Sheet" button |

---

## 🆚 Comparison: File Upload vs Google Sheets

| Feature | Multi-Sheet Excel | Google Sheets |
|---------|------------------|---------------|
| **Select Sheets** | ✅ Yes | ✅ Yes |
| **Auto-Sync** | ❌ No (one-time upload) | ✅ Yes (scheduled) |
| **Offline** | ✅ Can prepare offline | ❌ Requires internet |
| **Setup** | ✅ Simple upload | Moderate (connect) |
| **Updates** | ❌ Re-upload to update | ✅ Auto-syncs changes |
| **Best For** | One-time imports, historical data | Live data, frequent updates |

---

## ✅ Summary

✅ **Multi-sheet Excel import** now available  
✅ **Toggle button** switches between single/multi-sheet mode  
✅ **Select one or more sheets** from any Excel file  
✅ **Each sheet = separate dataset** with its own type  
✅ **Validation per sheet** - failures don't block others  
✅ **Clear import results** showing success/errors  
✅ **Works with budget, actual, and combined data**  
✅ **All UI uses design system CSS variables**  

---

**Now you can upload one Excel file and import data from multiple sheets at once!** 📚📊✨

**Perfect for:**
- 📅 Monthly budget workbooks (12 sheets → 12 datasets)
- 🏭 Multi-site data files (1 sheet per site)
- 📈 Budget vs Actual files (separate sheets for each)
- 🗂️ Organized data with logical sheet divisions
