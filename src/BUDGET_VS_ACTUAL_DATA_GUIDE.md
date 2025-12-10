# Budget vs Actual Data Import Guide 📊✅

## Overview

The data import system now supports **three types of datasets**:

1. **📊 Budget/Forecast Data** - Planning data for the year ahead
2. **✅ Actual/Historical Data** - Performance data that already happened
3. **📈 Combined Data** - Files containing both budget and actual columns

---

## 🎯 Use Cases

### **Budget/Forecast Data**
**When to use:**
- Setting up annual budget/forecast for the year
- Importing planned volumes, rates, and hours
- Creating targets and goals
- Initial planning phase

**Columns typically included:**
- Tasks
- Budgeted Volume
- Budgeted Rate (UPH)
- Budgeted Hours
- Forecasted Volume
- Site ID, Job Function, Date

**Example scenario:**
> "It's January 2025. I'm uploading the annual budget for all DCs showing planned volumes and hours for each task throughout the year."

---

### **Actual/Historical Data**
**When to use:**
- Importing past performance data
- Bringing in historical actuals for analysis
- Comparing actual vs budget
- Analyzing trends and variances

**Columns typically included:**
- Tasks
- Actual Volume (units completed)
- Actual Rate (UPH achieved)
- Actual Hours (hours worked)
- Variance (difference from budget)
- Efficiency % (performance percentage)
- Site ID, Job Function, Date

**Example scenario:**
> "It's November 2024. I'm uploading the actual performance data from Q1-Q3 2024 to analyze how we performed against budget."

---

### **Combined Data**
**When to use:**
- Files that have both budget AND actual columns
- Variance reporting
- Budget vs Actual comparison files
- Consolidated performance reports

**Columns typically included:**
- All budget columns (budgetedVolume, budgetedRate, etc.)
- All actual columns (actualVolume, actualRate, etc.)
- Variance and efficiency calculations
- Site ID, Job Function, Date

**Example scenario:**
> "I have a master spreadsheet with both the original budget and YTD actuals side-by-side for variance analysis."

---

## 📋 Available Columns

### **Planning/Budget Columns**
| Column | Field Name | Description | Type | Required |
|--------|-----------|-------------|------|----------|
| Tasks | `task` | Task name or description | Text | ✅ Yes |
| Budgeted Volume | `budgetedVolume` | Expected units for the day | Number | ✅ Yes |
| Budgeted Rate (UPH) | `budgetedRate` | Units per hour rate | Number | ✅ Yes |
| Budgeted Hours | `budgetedHours` | Planned hours | Number | ✅ Yes |
| Forecasted Volume | `forecastedVolume` | Updated daily forecast | Number | Optional |

### **Actual/Historical Columns**
| Column | Field Name | Description | Type | Required |
|--------|-----------|-------------|------|----------|
| Actual Volume | `actualVolume` | Actual units completed | Number | Optional |
| Actual Rate (UPH) | `actualRate` | Actual units per hour achieved | Number | Optional |
| Actual Hours | `actualHours` | Actual hours worked | Number | Optional |
| Variance | `variance` | Variance from budget | Number | Optional |
| Efficiency % | `efficiency` | Performance efficiency % | Number | Optional |

### **Common Metadata Columns**
| Column | Field Name | Description | Type | Required |
|--------|-----------|-------------|------|----------|
| Site ID | `siteId` | Distribution center (e.g., DC-001) | Text | Optional |
| Job Function | `jobFunction` | Department (Inbound/Outbound) | Text | Optional |
| Date | `date` | Date for this data (YYYY-MM-DD) | Date | Optional |

---

## 🔧 How to Use

### **Step 1: Select Dataset Type**

When uploading a file in **Settings → Integrations → Data Upload**, you'll see three options:

```
┌─────────────────────────────────────────────────────────────┐
│ What type of data are you uploading?                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Budget/Forecast Data                                    │
│     Budgeted volumes, rates, and hours for planning         │
│                                                              │
│  ✅ Actual/Historical Data                                  │
│     Actual performance data that already happened           │
│                                                              │
│  📈 Combined (Budget + Actual)                              │
│     File contains both budget and actual columns            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Choose the type that matches your file:**
- Select **Budget** if your file has only planning data
- Select **Actual** if your file has only performance data
- Select **Combined** if your file has both

---

### **Step 2: Upload Your File**

Drag and drop or click to upload your Excel/CSV file.

The system will:
1. Auto-detect columns based on headers
2. Validate required fields (based on dataset type)
3. Show validation results
4. Save with dataset type tag

---

### **Step 3: View Your Data**

Go to **Settings → Integrations → View Data** tab.

You'll see your datasets with type badges:

```
📄 annual_budget_2025.xlsx        📊 Budget     ✓ valid
📅 Jan 15, 2025, 9:00 AM
   50 rows • 8 columns

📄 q3_actuals_2024.xlsx           ✅ Actual     ✓ valid
📅 Nov 10, 2024, 2:30 PM
   120 rows • 13 columns

📄 variance_report.xlsx           📈 Combined   ⚠️ warnings
📅 Nov 12, 2024, 4:15 PM
   100 rows • 15 columns
```

Click **"View Data"** to see the actual rows and columns.

---

## 📝 Example Files

### **Example 1: Budget-Only File**

**Filename:** `annual_budget_2025.xlsx`  
**Dataset Type:** 📊 Budget

| Tasks | Budgeted Volume | Budgeted Rate | Budgeted Hours | Site ID | Job Function | Date |
|-------|----------------|---------------|----------------|---------|--------------|------|
| Receiving | 5000 | 250 | 20.0 | DC-001 | Inbound | 2025-01-15 |
| Put Away | 4500 | 200 | 22.5 | DC-001 | Inbound | 2025-01-15 |
| Picking | 8000 | 300 | 26.7 | DC-001 | Outbound | 2025-01-15 |
| Packing | 7500 | 275 | 27.3 | DC-001 | Outbound | 2025-01-15 |
| Shipping | 6000 | 350 | 17.1 | DC-001 | Outbound | 2025-01-15 |

**Use case:** Setting up the annual budget for 2025.

---

### **Example 2: Actual-Only File**

**Filename:** `q3_actuals_2024.xlsx`  
**Dataset Type:** ✅ Actual

| Tasks | Actual Volume | Actual Rate | Actual Hours | Efficiency % | Site ID | Job Function | Date |
|-------|--------------|-------------|--------------|--------------|---------|--------------|------|
| Receiving | 4950 | 240 | 20.6 | 99.0 | DC-001 | Inbound | 2024-09-15 |
| Put Away | 4600 | 210 | 21.9 | 105.0 | DC-001 | Inbound | 2024-09-15 |
| Picking | 8200 | 315 | 26.0 | 105.0 | DC-001 | Outbound | 2024-09-15 |
| Packing | 7400 | 270 | 27.4 | 98.7 | DC-001 | Outbound | 2024-09-15 |
| Shipping | 6100 | 360 | 16.9 | 102.9 | DC-001 | Outbound | 2024-09-15 |

**Use case:** Importing historical performance data for trend analysis.

---

### **Example 3: Combined File**

**Filename:** `variance_report_oct2024.xlsx`  
**Dataset Type:** 📈 Combined

| Tasks | Budgeted Volume | Budgeted Rate | Budgeted Hours | Actual Volume | Actual Rate | Actual Hours | Variance | Efficiency % |
|-------|----------------|---------------|----------------|--------------|-------------|--------------|----------|--------------|
| Receiving | 5000 | 250 | 20.0 | 4950 | 240 | 20.6 | -50 | 99.0 |
| Put Away | 4500 | 200 | 22.5 | 4600 | 210 | 21.9 | +100 | 105.0 |
| Picking | 8000 | 300 | 26.7 | 8200 | 315 | 26.0 | +200 | 105.0 |
| Packing | 7500 | 275 | 27.3 | 7400 | 270 | 27.4 | -100 | 98.7 |
| Shipping | 6000 | 350 | 17.1 | 6100 | 360 | 16.9 | +100 | 102.9 |

**Use case:** Monthly variance reporting with budget vs actual comparison.

---

## 🎨 Visual Indicators

### **Dataset Type Badges**

When viewing datasets in the **View Data** tab, you'll see color-coded badges:

- **📊 Budget** - Blue badge - Planning/forecast data
- **✅ Actual** - Green badge - Historical/performance data
- **📈 Combined** - Purple badge - Budget + Actual data

These help you quickly identify what type of data each dataset contains.

---

## 🔄 Typical Workflows

### **Workflow 1: Annual Planning**

1. **January:** Upload budget data for entire year
   - Select **📊 Budget** type
   - File: `annual_budget_2025.xlsx`
   - Contains: Budgeted volumes, rates, hours for all tasks

2. **Throughout year:** Upload actual data monthly
   - Select **✅ Actual** type
   - Files: `jan_actuals.xlsx`, `feb_actuals.xlsx`, etc.
   - Contains: Actual performance for that month

3. **Year-end:** Upload combined variance report
   - Select **📈 Combined** type
   - File: `2025_annual_variance.xlsx`
   - Contains: Budget vs Actual for entire year

---

### **Workflow 2: Historical Analysis**

1. **Goal:** Analyze past 2 years to inform budget
   
2. **Upload historical actuals:**
   - Select **✅ Actual** type
   - Files: `2023_actuals.xlsx`, `2024_actuals.xlsx`
   - Contains: Historical performance data

3. **Use insights to create budget:**
   - Analyze trends, seasonality, efficiency
   - Create 2025 budget based on insights

4. **Upload new budget:**
   - Select **📊 Budget** type
   - File: `2025_budget.xlsx`
   - Contains: Data-driven budget based on historical trends

---

### **Workflow 3: Mid-Year Review**

1. **June:** Review YTD performance vs budget

2. **Upload original budget:**
   - Select **📊 Budget** type
   - File: `2025_original_budget.xlsx`
   - Contains: Annual budget created in January

3. **Upload YTD actuals:**
   - Select **✅ Actual** type
   - File: `2025_h1_actuals.xlsx`
   - Contains: Jan-Jun actual performance

4. **Generate variance report:**
   - Create combined file in Excel
   - Select **📈 Combined** type
   - File: `2025_h1_variance.xlsx`
   - Contains: Budget vs Actual with variance analysis

---

## ⚙️ Configuration

### **Adding Custom Columns**

If you need additional columns, go to **Settings → Integrations → Configure Format**:

1. Click **"Add Column"**
2. Define field name, display name, description
3. Add match keywords for auto-detection
4. Set as required or optional
5. Save configuration

**Example custom columns:**
- Overtime Hours
- Direct vs Indirect
- Equipment Downtime
- Quality Defects
- Safety Incidents

---

## 🔍 Column Matching

The system auto-detects columns using **match keywords**. 

### **Budget Columns Match:**
- `budgetedVolume` → "budget volume", "budgeted volume", "planned volume", "target volume"
- `budgetedRate` → "budget rate", "budgeted rate", "uph", "rate", "units per hour"
- `budgetedHours` → "budget hour", "budgeted hour", "planned hour", "hours"

### **Actual Columns Match:**
- `actualVolume` → "actual volume", "actual units", "completed volume", "actual"
- `actualRate` → "actual rate", "actual uph", "achieved rate"
- `actualHours` → "actual hour", "actual hours", "worked hours", "hours worked"
- `variance` → "variance", "difference", "delta"
- `efficiency` → "efficiency", "performance", "attainment", "percent"

**Tip:** Use these keywords in your Excel headers for automatic column detection!

---

## 📊 Best Practices

### **File Naming**
Use clear, descriptive names:
- ✅ `2025_annual_budget_all_sites.xlsx`
- ✅ `dc001_q3_actuals_2024.xlsx`
- ✅ `october_variance_report.xlsx`
- ❌ `data.xlsx`
- ❌ `file_v2_final_FINAL.xlsx`

### **Date Formats**
Use consistent date format:
- ✅ `2024-11-14` (YYYY-MM-DD)
- ✅ `11/14/2024` (MM/DD/YYYY)
- ❌ Mixed formats in same file

### **Column Headers**
Use clear, keyword-rich headers:
- ✅ "Budgeted Volume"
- ✅ "Actual Hours Worked"
- ✅ "Efficiency %"
- ❌ "Vol"
- ❌ "Col A"
- ❌ "Data"

### **Data Validation**
Before uploading:
- ✅ Remove blank rows
- ✅ Remove summary/total rows
- ✅ Ensure numeric columns are numbers (not text)
- ✅ Check date formats
- ✅ Verify all required columns present

### **Dataset Organization**
- Keep budget and actual files separate if possible
- Use consistent file naming conventions
- Include site ID and date in metadata columns
- Upload regularly (monthly for actuals)
- Delete old/incorrect uploads

---

## 🚨 Common Issues & Solutions

### **Issue: Column not detected**
**Problem:** Your "Actual Volume" column isn't being recognized.

**Solutions:**
1. Check your header spelling: "Actual Volume" or "Actual Units"
2. Go to Configure Format → Edit "Actual Volume" column
3. Add your specific header as a match keyword
4. Save and re-upload

---

### **Issue: Required fields missing**
**Problem:** Validation error says "Budgeted Volume is required"

**Solutions:**
1. Check if you selected the wrong dataset type
   - If uploading actuals-only, select **✅ Actual** (not Budget)
   - Budget type requires all budget columns
2. Make sure your file has the required column
3. Check column header matches keywords

---

### **Issue: Wrong dataset type**
**Problem:** Uploaded as Budget but should be Actual

**Solutions:**
1. Go to View Data tab
2. Delete the incorrect upload
3. Go back to Data Upload tab
4. Select correct dataset type
5. Re-upload the file

---

### **Issue: Combined file validation**
**Problem:** Combined file has warnings about missing budget columns

**Solutions:**
- Combined type is flexible - warnings are OK
- If file truly has both, ignore warnings
- If file is budget-only or actual-only, re-upload with correct type

---

## 💡 Pro Tips

### **Tip 1: Use Templates**
Download the Excel template from the Data Upload page as a starting point.

### **Tip 2: Consistent Structure**
Keep the same file structure across all uploads for consistency.

### **Tip 3: Metadata is Key**
Always include Site ID, Job Function, and Date columns for better filtering and analysis.

### **Tip 4: Monthly Actuals**
Upload actuals monthly to track performance over time.

### **Tip 5: Year-over-Year Analysis**
Upload multiple years of actuals to analyze trends and seasonality.

### **Tip 6: Forecast Updates**
If forecasts change mid-year, upload new forecast file with updated dataset name.

### **Tip 7: Version Control**
Include date or version in filename when uploading updated budgets.

### **Tip 8: Data Backup**
Use the Download button in View Data to backup your datasets.

---

## 📚 Quick Reference

| Dataset Type | Icon | Use For | Required Columns | Optional Columns |
|--------------|------|---------|-----------------|------------------|
| **Budget** | 📊 | Annual planning, forecasts | task, budgetedVolume, budgetedRate, budgetedHours | forecastedVolume, siteId, jobFunction, date |
| **Actual** | ✅ | Historical data, performance | task, budgetedVolume, budgetedRate, budgetedHours | actualVolume, actualRate, actualHours, variance, efficiency, siteId, jobFunction, date |
| **Combined** | 📈 | Variance reports, comparisons | task, budgetedVolume, budgetedRate, budgetedHours | All budget + actual columns |

---

## 🎯 Summary

✅ **Budget Data** - Use for planning and forecasting  
✅ **Actual Data** - Use for historical performance  
✅ **Combined Data** - Use for budget vs actual comparison  

✅ Select the correct dataset type when uploading  
✅ Use clear column headers that match keywords  
✅ Include metadata (site, date, function) for better analysis  
✅ View your data in the View Data tab to verify  
✅ Export datasets as CSV for backup  

---

**The system now handles both your planning needs AND historical analysis!** 📊✅📈
