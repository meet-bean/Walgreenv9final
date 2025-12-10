# Where to Find Your Imported Data 📊

## 🎯 Quick Answer

**Settings (⚙️) → Integrations → View Data Tab**

---

## 📍 Step-by-Step Instructions

### **1. Open Settings**
Click the **Settings icon (⚙️)** in the top-right corner of the application

### **2. Go to Integrations**
In the left sidebar, click **"Integrations"**

### **3. Click "View Data" Tab**
You'll see three tabs at the top:
- **Data Upload** - Upload new files
- **View Data** ⭐ - See your imported data
- **Configure Format** - Edit data format settings

Click the **"View Data"** tab

---

## 📋 What You Can See

### **Dataset List**
Each uploaded file is shown with:

```
📄 filename.xlsx                    [✓ valid]
📅 Nov 14, 2024, 10:30 AM
   25 rows • 8 columns

   [👁️ View Data]  [⬇️ Download]  [🗑️ Delete]
```

### **Dataset Card Shows:**
- ✅ **File name** - Original filename
- ✅ **Upload timestamp** - When it was uploaded
- ✅ **Row count** - Number of data rows
- ✅ **Column count** - Number of columns
- ✅ **Validation status** - Valid, Warnings, or Errors
- ✅ **Metadata** - Site, date, or other extracted info

---

## 👁️ Viewing the Actual Data

### **Click "View Data" Button**

A data table expands showing **all your rows and columns**:

```
┌────┬─────────────┬──────────┬──────────┬────────┐
│ #  │ Tasks       │ Volume   │ Rate     │ Hours  │
├────┼─────────────┼──────────┼──────────┼────────┤
│ 1  │ Picking     │ 1000     │ 50       │ 20.0   │
│ 2  │ Packing     │ 800      │ 40       │ 20.0   │
│ 3  │ Loading     │ 600      │ 30       │ 20.0   │
└────┴─────────────┴──────────┴──────────┴────────┘
```

### **Table Features:**
- ✅ **Row numbers** - Easy to reference specific rows
- ✅ **All columns** - Every column from your file
- ✅ **Scrollable** - Horizontal scroll for many columns
- ✅ **Fixed header** - Header stays visible when scrolling
- ✅ **Striped rows** - Alternating colors for readability
- ✅ **Max height** - Scrolls vertically for many rows

---

## 💾 What You Can Do

### **1. View Data** (👁️ button)
- Click to expand the data table
- See all rows and columns
- Verify your data is correct
- Click again to collapse

### **2. Download** (⬇️ button)
- Exports the dataset as CSV
- Same data that was imported
- File named: `original_filename_exported.csv`
- Can be opened in Excel

### **3. Delete** (🗑️ button)
- Removes the dataset permanently
- Confirms before deleting
- Cannot be undone
- Use when data is no longer needed

---

## 🔍 Verification Checklist

After uploading, verify your data:

- [ ] **Open View Data tab** (Settings → Integrations → View Data)
- [ ] **Find your dataset** by filename and timestamp
- [ ] **Check validation status** (should be green "valid")
- [ ] **Click "View Data"** to expand the table
- [ ] **Verify row count** matches your file
- [ ] **Check column headers** are correct
- [ ] **Spot check data values** in a few rows
- [ ] **Look for metadata** (site, date, etc.)
- [ ] **Confirm all columns** are present

---

## 📊 Understanding Validation Status

### **✓ Valid (Green)**
- All required columns present
- No validation errors
- Data types are correct
- Ready to use

### **⚠️ Warnings (Yellow)**
- Data imported successfully
- Some warnings detected
- Example: Zero values, calculated hours mismatch
- Review warnings and decide if acceptable

### **✗ Errors (Red)**
- Critical issues found
- May have missing required columns
- Data may be incomplete
- Fix issues and re-upload

---

## 🗂️ Metadata

If your file contains metadata, it's shown in a gray box:

```
Metadata:
Site: DC-01        Date: 2024-11-14        Shift: Day
```

**Common metadata fields:**
- Site ID or location
- Date (if a date column is detected)
- Shift (if a shift column is detected)
- Job function
- Any other extracted information

---

## 💡 Pro Tips

### **Multiple Uploads**
- Each upload creates a **new dataset**
- Datasets are sorted **newest first**
- Keep multiple versions if needed
- Delete old ones to keep it clean

### **Verifying Changes**
If you modified data format config:
1. Upload a test file
2. Go to View Data tab
3. Verify columns are mapped correctly
4. Check all expected columns are present

### **Exporting for Backup**
- Download datasets as CSV backup
- Store for your records
- Re-upload if needed

### **Data Storage**
- All data stored in **browser localStorage**
- Specific to this browser on this device
- Clearing browser data will delete datasets
- Export important datasets as backup

---

## 🔧 Troubleshooting

### **Problem: Can't find my uploaded file**

**Solutions:**
1. Check you're in the **View Data** tab (not Data Upload)
2. Look for the filename - datasets are sorted by date
3. If just uploaded, it should be at the top
4. Refresh the page if it doesn't appear

### **Problem: Data looks wrong**

**Solutions:**
1. Click "View Data" to see the actual rows
2. Compare with your original file
3. Check if columns were mapped correctly
4. Review the Expected Data Format in Data Upload tab
5. May need to adjust match keywords in Configure Format

### **Problem: Missing columns**

**Solutions:**
1. Check the column count in the dataset card
2. View the data table - scroll horizontally
3. Column may not have matched - check Configure Format
4. Add more match keywords for that column
5. Re-upload after updating config

### **Problem: Dataset deleted accidentally**

**Solutions:**
- Datasets cannot be recovered after deletion
- Check if you have the original file
- Re-upload the file if available
- Consider exporting datasets before deleting

---

## 📁 Where Data is Actually Stored

### **Technical Details:**

**Storage Location:**
- Browser localStorage
- Key: `importedDatasets`

**Data Structure:**
```json
[
  {
    "id": "dataset-1731600000000-abc123",
    "fileName": "budget.xlsx",
    "uploadedAt": "2024-11-14T10:30:00.000Z",
    "rowCount": 25,
    "columnCount": 8,
    "validationStatus": "valid",
    "data": [
      {
        "task": "Picking",
        "budgetedVolume": 1000,
        "budgetedRate": 50,
        "budgetedHours": 20
      },
      // ... more rows
    ],
    "metadata": {
      "site": "DC-01",
      "date": "2024-11-14"
    }
  }
  // ... more datasets
]
```

### **Viewing in Browser DevTools:**
1. Press F12 to open DevTools
2. Go to "Application" or "Storage" tab
3. Expand "Local Storage"
4. Click on your site URL
5. Find key: `importedDatasets`
6. Click to see JSON data

---

## 🎨 Design System Integration

The View Data interface uses your CSS variables:

### **Typography:**
```css
--font-family-inter          /* All text */
--text-base                   /* Body text */
--text-label                  /* Small text, table cells */
```

### **Colors:**
```css
--foreground                  /* Primary text */
--muted-foreground           /* Secondary text */
--border                      /* Table borders */
--card                        /* Card backgrounds */
--secondary                   /* Striped row backgrounds */
--primary                     /* Icons, accents */
```

### **Spacing:**
```css
--spacing-1 through --spacing-6   /* Consistent spacing */
```

---

## 🚀 Quick Reference

| Action | Location | What You See |
|--------|----------|--------------|
| **Upload file** | Settings → Integrations → Data Upload | Upload form, validation results |
| **View data** | Settings → Integrations → View Data | List of datasets, data tables |
| **Configure format** | Settings → Integrations → Configure Format | Column editor, validation rules |
| **Download template** | Data Upload tab | Download CSV template |
| **Export dataset** | View Data tab → ⬇️ button | Download CSV export |
| **Delete dataset** | View Data tab → 🗑️ button | Remove dataset |

---

## ✅ Summary

### **To Find Your Imported Data:**

1. ⚙️ **Settings** (top-right)
2. 📂 **Integrations** (left sidebar)
3. 👁️ **View Data** tab (top tabs)
4. Click **"View Data"** button on any dataset
5. ✨ **See all your rows and columns!**

### **What You Get:**
- ✅ Complete list of all imported datasets
- ✅ Full data table with all rows and columns
- ✅ Validation status for each upload
- ✅ Metadata extraction
- ✅ Export to CSV
- ✅ Delete old datasets
- ✅ Verification tools

---

**Your data is safe, organized, and easy to find!** 📊✨

Need to adjust what columns are imported? Go to **Configure Format** tab!  
Need to upload new data? Go to **Data Upload** tab!
