# Visual Data Format Editor - User Guide

## 🎯 Where to Access

### **Settings → Integrations → Configure Format Tab**

**Step-by-Step:**
1. Click the **⚙️ Settings** icon in the top-right corner
2. Click **"Integrations"** in the left sidebar
3. You'll see two tabs at the top:
   - **"Data Upload"** - Upload and manage your Excel/CSV files
   - **"Configure Format"** - ✨ Configure the expected data format ✨
4. Click **"Configure Format"** tab

## 📋 What You Can Do

### **Tab 1: Column Definitions**

#### **View Columns**
- All your columns are listed in order
- Each shows:
  - Column hint (e.g., "Column A")
  - Display name
  - Required marker (red * for required fields)
  - Description and data type

#### **Add a Column**
1. Click **"+ Add Column"** button (top-right)
2. A new column appears at the bottom
3. Click **"Edit"** button to configure it

#### **Edit a Column**
1. Click the **"Edit"** button (pencil icon) on any column
2. Fill in the form:
   - **Field Name** - Internal code name (e.g., `shift`)
   - **Display Name** - What users see (e.g., "Shift")
   - **Column Hint** - Position hint (e.g., "Column I")
   - **Data Type** - String, Number, or Date
   - **Description** - Help text for users
   - **Match Keywords** - Comma-separated keywords for auto-detection
     - Example: `shift, period, time`
     - System uses these to recognize the column in uploaded files
   - **Required** - Toggle on/off
3. Click **"Done"** when finished

#### **Reorder Columns**
- Use **↑** and **↓** buttons to move columns up/down
- The order here = the order in:
  - Expected Data Format display
  - Downloaded template
  - Column hints (A, B, C...)

#### **Delete a Column**
1. Click **"Edit"** on the column
2. Click the **red trash icon** at the bottom
3. Confirm deletion

---

### **Tab 2: Validation Rules**

Configure how uploaded data is validated:

#### **Allow Negative Numbers**
- **OFF** (default) - Reject files with negative volumes/rates/hours
- **ON** - Allow negative values

#### **Warn on Zero Values**
- **ON** (default) - Show warnings when volume or rate is zero
- **OFF** - Ignore zero values

#### **Validate Calculated Hours**
- **ON** (default) - Check if Hours = Volume ÷ Rate
- **OFF** - Skip this validation

#### **Calculated Hours Tolerance**
- Number input (default: 0.1)
- Maximum difference allowed in hours calculation
- Example: If calculated = 20.5 and budgeted = 20.0:
  - Tolerance 0.1: Shows warning (difference = 0.5)
  - Tolerance 1.0: No warning (difference < 1.0)

#### **Minimum Rows**
- Number input (default: 1)
- Minimum data rows required in upload
- Set to 1 for at least one row

#### **Maximum Rows**
- Number input (default: 0)
- Maximum rows allowed
- 0 = unlimited
- Set a limit to prevent huge files

---

### **Tab 3: UI Text**

Customize text shown in the Data Integration Hub:

#### **Page Title**
- Main heading (default: "Data Integration Hub")
- Shown at the top of the upload page

#### **Page Description**
- Subtitle (default: "Upload Excel files or connect to SharePoint...")
- Shown under the title

---

## 💾 Saving Changes

### **Unsaved Changes Alert**
- Yellow banner appears when you make changes
- Shows: "You have unsaved changes. Click 'Save Changes' to apply your configuration."

### **Save Button**
- Top-right corner
- **Enabled** when you have unsaved changes
- **Disabled** when no changes

### **Save Process**
1. Click **"Save Changes"** button
2. Configuration saved to browser localStorage
3. Success message: "Configuration saved successfully! Reload the page for changes to take effect."
4. **Important:** Reload the page to see changes in Data Upload tab

### **Reset to Defaults**
- Click **"Reset to Defaults"** button (top-right)
- Confirms: "Are you sure you want to reset to default configuration?"
- Resets all settings to original defaults
- Removes custom configuration from localStorage

---

## 🔄 How Changes Take Effect

### **Where Changes Apply:**

1. **Expected Data Format Card** (Data Upload tab)
   - Shows your configured columns
   - Displays required markers
   - Uses your descriptions

2. **File Upload Parser**
   - Uses your match keywords to detect columns
   - Converts data types as configured
   - Maps to your field names

3. **Validation Engine**
   - Enforces your validation rules
   - Shows errors/warnings based on settings
   - Uses your tolerance levels

4. **Template Download**
   - Headers match your display names
   - Column order matches your configuration
   - Sample data includes your columns

### **When to Reload:**
After saving changes, reload the browser page to see updates in:
- Data Upload tab
- File upload processing
- Template downloads
- Validation messages

---

## 📊 Example: Adding a "Shift" Column

### **Step 1: Add Column**
1. Go to Settings → Integrations → Configure Format
2. Click "Column Definitions" tab
3. Click "+ Add Column" button

### **Step 2: Configure Column**
Click "Edit" and fill in:
- **Field Name:** `shift`
- **Display Name:** `Shift`
- **Column Hint:** `Column I`
- **Data Type:** Select "String (Text)"
- **Description:** `Day, Night, or Swing shift`
- **Match Keywords:** `shift, period, time`
- **Required:** Toggle OFF (optional)

Click "Done"

### **Step 3: Save**
1. Click "Save Changes" button
2. Wait for success message
3. **Reload the page**

### **Step 4: Verify**
1. Go to "Data Upload" tab
2. Scroll to "Expected Data Format" card
3. You should see:
   ```
   Column I: Shift
   Day, Night, or Swing shift
   ```

### **Step 5: Test**
1. Download template - should have "Shift" column
2. Upload a file with "Shift" column - should be recognized
3. View imported data - should include shift values

---

## 🎨 Design System Integration

All UI elements use your CSS variables:

### **Typography:**
- `--font-family-inter`
- `--text-base`, `--text-label`
- `--font-weight-medium`, `--font-weight-semibold`

### **Colors:**
- `--foreground`, `--muted-foreground`
- `--border`, `--card`, `--background`
- `--primary`, `--secondary`
- `--chart-1` through `--chart-4`

### **Spacing:**
- `--spacing-1` through `--spacing-8`

### **Borders:**
- `--radius`

**No custom CSS needed** - everything automatically matches your design system!

---

## 💡 Pro Tips

### **Match Keywords Strategy**
Include variations to catch different header names:
```
Good: shift, period, time, shift period
Better: shift, shifts, period, time, shift period, work shift
```

### **Column Ordering**
- Put required fields first (A, B, C, D...)
- Group related fields together
- Optional metadata at the end

### **Field Names**
- Use camelCase (e.g., `budgetedVolume`)
- No spaces or special characters
- Descriptive but concise

### **Display Names**
- Can include spaces and punctuation
- Use title case (e.g., "Budgeted Volume")
- Add units if helpful (e.g., "Rate (UPH)")

### **Descriptions**
- Short and clear
- Explain what data goes here
- Include format hints for dates/numbers

### **Validation Tolerance**
- Too strict (0.01): Many warnings
- Too loose (1.0): Misses errors
- Recommended: 0.1 - 0.5

---

## 🔧 Troubleshooting

### **Changes Not Showing**
- **Solution:** Reload the browser page after saving

### **Column Not Detected in Upload**
- **Check:** Match keywords include variations
- **Example:** If file has "Task Name", keywords should include "task" and "name"

### **Too Many Validation Errors**
- **Check:** Validation rules might be too strict
- **Solution:** Adjust tolerance or disable certain rules

### **Template Missing Columns**
- **Check:** Did you save changes?
- **Check:** Did you reload the page?
- **Solution:** Save, reload, then download template again

### **Configuration Lost**
- **Cause:** Browser cleared localStorage
- **Solution:** Re-configure or keep a backup of your settings
- **Prevention:** Use "Reset to Defaults" sparingly

---

## 📁 Data Storage

### **Where Configuration is Stored:**
- **Browser localStorage** (key: `dataImportConfig`)
- Persists across browser sessions
- Specific to this browser on this device

### **What's Stored:**
```json
{
  "columns": [...], 
  "validationRules": {...},
  "uiText": {...}
}
```

### **Backup Your Configuration:**
1. Open browser Developer Tools (F12)
2. Go to "Application" or "Storage" tab
3. Click "Local Storage"
4. Find key: `dataImportConfig`
5. Copy the value and save to a file

### **Restore Configuration:**
1. Open Developer Tools
2. Paste your saved value into `dataImportConfig`
3. Reload the page

---

## 🎉 Quick Start Checklist

- [ ] Access: Settings → Integrations → Configure Format
- [ ] Review default columns in "Column Definitions"
- [ ] Add any custom columns you need
- [ ] Set required/optional for each column
- [ ] Configure match keywords for auto-detection
- [ ] Adjust validation rules as needed
- [ ] Customize UI text if desired
- [ ] Click "Save Changes"
- [ ] **Reload the browser page**
- [ ] Test by downloading template
- [ ] Upload a test file to verify

---

## 📞 Need More Help?

- See `/HOW_TO_EDIT_DATA_FORMAT.md` for code-based editing
- See `/DATA_FORMAT_QUICK_REFERENCE.md` for visual reference
- See `/DATA_INTEGRATION_HUB_COMPLETE.md` for full feature docs

---

**The Visual Editor makes data format configuration easy - no code required!** 🚀
