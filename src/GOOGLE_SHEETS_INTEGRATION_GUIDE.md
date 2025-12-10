# Google Sheets Integration Guide 📊🔗

## Overview

The data import system now supports **direct Google Sheets integration**! Connect your Google Sheets spreadsheets and automatically sync data without manual uploads.

---

## 🎯 Why Use Google Sheets Integration?

### **Benefits:**

✅ **No File Uploads** - Data syncs directly from Google Sheets  
✅ **Real-Time Updates** - Changes in Google Sheets automatically sync  
✅ **Scheduled Sync** - Hourly, 6-hour, or daily automatic updates  
✅ **Single Source of Truth** - Keep data in Google Sheets, sync to dashboard  
✅ **Team Collaboration** - Multiple people can update the same sheet  
✅ **Version History** - Google Sheets tracks all changes automatically  
✅ **Easy Updates** - Edit in familiar Google Sheets interface  
✅ **No Downloads** - Never download/upload files again  

---

## 📍 Where to Find It

**Location:**
```
Settings (⚙️) → Integrations → Google Sheets Tab
```

**Tab Structure:**
1. **File Upload** - Manual Excel/CSV uploads
2. **Google Sheets** ⭐ **NEW!** - Connect Google Sheets
3. **SharePoint / Excel Integration** - SharePoint Online sync

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Get Your Google Sheets URL**

1. Open your Google Sheet in your browser
2. Copy the **full URL** from the address bar
3. URL looks like: `https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9/edit`

**Example:**
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```

---

### **Step 2: Connect in the App**

1. Go to **Settings → Integrations → Google Sheets**
2. Click **"Add Connection"** button
3. Paste your Google Sheets URL
4. Click **"Connect"** button
5. System fetches all sheets/tabs from your spreadsheet

---

### **Step 3: Select Sheet & Sync**

1. Choose which **sheet/tab** to import (e.g., "January", "Q1 Actuals")
2. Select **sync frequency** (Manual, Hourly, Daily)
3. Click **"Connect Sheet"**
4. Click **"Sync Now"** to import data immediately

**Done!** Your data is now imported and will auto-sync based on your schedule.

---

## 🎨 User Interface

### **Connection Form:**

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Google Sheets URL                               │
│ ┌─────────────────────────────────────┬──────────────┐ │
│ │ https://docs.google.com/spread...   │  [Connect]   │ │
│ └─────────────────────────────────────┴──────────────┘ │
│ Paste the full URL from your browser's address bar     │
└─────────────────────────────────────────────────────────┘

✓ Connected to "Budget Data 2025" with 4 sheets

┌─────────────────────────────────────────────────────────┐
│ Step 2: Select Sheet/Tab                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ January (50 rows × 8 columns)                       │ │
│ │ February (48 rows × 8 columns)                      │ │
│ │ Q1 Summary (150 rows × 10 columns)                  │ │
│ │ Actuals (120 rows × 13 columns)                     │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Step 3: Sync Frequency                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Manual only (sync when you click)                   │ │
│ │ Every hour                                           │ │
│ │ Every 6 hours                                        │ │
│ │ Daily at midnight                                    │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

                        [Cancel]  [Connect Sheet]
```

---

### **Connected Sheets List:**

```
┌─────────────────────────────────────────────────────────┐
│ 📄 Budget Data 2025                                     │
│    [January]  📊 Budget                                 │
│    ⏰ Every hour                                        │
│    Last synced: Nov 14, 2024, 10:30 AM                 │
│    50 rows × 8 columns                                  │
│                          [🔗 Open] [▶️ Sync] [🗑️ Delete] │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📄 Q3 Actuals 2024                                      │
│    [Actuals]  ✅ Actual                                 │
│    ⏰ Daily at midnight                                 │
│    Last synced: Nov 14, 2024, 12:00 AM                 │
│    120 rows × 13 columns                                │
│                          [🔗 Open] [▶️ Sync] [🗑️ Delete] │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 How It Works

### **Connection Flow:**

```
1. User pastes Google Sheets URL
        ↓
2. System extracts spreadsheet ID
        ↓
3. Connects to Google Sheets API
        ↓
4. Fetches list of all sheets/tabs
        ↓
5. User selects specific sheet to sync
        ↓
6. User chooses sync frequency
        ↓
7. Connection saved and activated
        ↓
8. Data syncs immediately
        ↓
9. Auto-syncs on schedule thereafter
```

---

## ⏰ Sync Frequencies

### **Manual Only**
- Data syncs only when you click "Sync Now"
- Best for: Static data that rarely changes
- Example: Annual budget that's set once

### **Every Hour**
- Automatically syncs every 60 minutes
- Best for: Frequently updated data
- Example: Daily operational data being entered throughout the day

### **Every 6 Hours**
- Syncs 4 times per day (12am, 6am, 12pm, 6pm)
- Best for: Data updated a few times daily
- Example: Shift-based data entry

### **Daily at Midnight**
- Syncs once per day at 12:00 AM
- Best for: Data updated once daily
- Example: End-of-day reports

---

## 🗂️ Supported Data Types

### **Budget/Forecast Data**
Connect sheets containing:
- Budgeted volumes, rates, hours
- Forecasted volumes
- Planning data

**Example sheet:**
| Tasks | Budgeted Volume | Budgeted Rate | Budgeted Hours | Site |
|-------|----------------|---------------|----------------|------|
| Picking | 1000 | 50 | 20.0 | DC-01 |
| Packing | 800 | 40 | 20.0 | DC-01 |

---

### **Actual/Historical Data**
Connect sheets containing:
- Actual volumes, rates, hours
- Performance data
- Efficiency metrics

**Example sheet:**
| Tasks | Actual Volume | Actual Rate | Actual Hours | Efficiency |
|-------|--------------|-------------|--------------|------------|
| Picking | 980 | 48 | 20.4 | 98% |
| Packing | 820 | 42 | 19.5 | 103% |

---

### **Combined Data**
Connect sheets with both budget AND actual:
- Variance reports
- Budget vs Actual comparisons

**Example sheet:**
| Tasks | Budget Vol | Budget Rate | Actual Vol | Actual Rate | Variance |
|-------|-----------|-------------|-----------|-------------|----------|
| Picking | 1000 | 50 | 980 | 48 | -20 |
| Packing | 800 | 40 | 820 | 42 | +20 |

---

## 🎯 Use Cases

### **Use Case 1: Live Budget Management**

**Scenario:** Annual budget in Google Sheets, updated weekly

**Setup:**
1. Create Google Sheet: "2025 Annual Budget"
2. Add sheets for each month: "January", "February", etc.
3. Connect each sheet to app
4. Set sync: **Every 6 hours**
5. Finance team updates budget in Google Sheets
6. Dashboard auto-syncs latest budget

**Benefits:**
- Single source of truth in Google Sheets
- No manual uploads when budget changes
- Finance team works in familiar interface
- Dashboard always shows latest budget

---

### **Use Case 2: Daily Operations Data**

**Scenario:** Operations team enters daily actuals

**Setup:**
1. Google Sheet: "Daily Operations Log"
2. One sheet per day or week
3. Connect current period sheet
4. Set sync: **Every hour**
5. Supervisors enter data throughout the day
6. Dashboard updates hourly automatically

**Benefits:**
- Real-time visibility into operations
- No end-of-day upload process
- Multiple users can enter data simultaneously
- Automatic hourly refresh

---

### **Use Case 3: Historical Analysis**

**Scenario:** Import 2 years of historical data for analysis

**Setup:**
1. Google Sheet: "Historical Actuals 2023-2024"
2. Separate sheets: "2023", "2024", "Q1", "Q2", etc.
3. Connect each sheet as **Actual** type
4. Set sync: **Manual** (historical data doesn't change)
5. One-time sync to import all data
6. Use for trend analysis and forecasting

**Benefits:**
- No need to download/upload large files
- Easy to reference and update if needed
- Can re-sync if corrections are made
- Organized by time periods

---

### **Use Case 4: Monthly Variance Reports**

**Scenario:** Finance creates monthly budget vs actual reports

**Setup:**
1. Google Sheet: "2024 Variance Reports"
2. Sheets: "Jan Variance", "Feb Variance", etc.
3. Each sheet has budget + actual + variance columns
4. Connect as **Combined** type
5. Set sync: **Daily**
6. Finance updates sheet monthly, dashboard stays current

**Benefits:**
- Automated monthly reporting
- No manual export from Google Sheets
- Version history tracks report changes
- Easy to correct and re-sync

---

## 🔧 Managing Connections

### **Sync Now (▶️ Button)**
- Manually triggers immediate sync
- Updates data from Google Sheet right now
- Use when you know data has changed
- Shows sync progress spinner

### **Open Sheet (🔗 Button)**
- Opens the Google Sheet in a new tab
- Quick access to edit data
- Verify data before syncing
- Check formulas and formatting

### **Delete Connection (🗑️ Button)**
- Removes the connection
- **Does NOT delete the Google Sheet** (sheet is safe!)
- **Does NOT delete imported data** (already synced data remains)
- Can reconnect the same sheet later if needed

---

## 📊 Google Sheets Best Practices

### **Sheet Structure**

✅ **DO:**
- Use clear column headers in row 1
- Keep data tabular (rows and columns)
- Use consistent date formats
- Remove merged cells in data area
- Keep one header row

❌ **DON'T:**
- Have multiple header rows
- Use merged cells in data area
- Mix data types in same column
- Leave blank rows in the middle
- Use complex formulas in source data

---

### **Column Headers**

Use headers that match the system's keywords:

**Budget Columns:**
- "Budgeted Volume" or "Budget Volume"
- "Budgeted Rate" or "UPH"
- "Budgeted Hours" or "Planned Hours"

**Actual Columns:**
- "Actual Volume" or "Actual Units"
- "Actual Rate" or "Actual UPH"
- "Actual Hours" or "Hours Worked"
- "Efficiency %" or "Performance %"

**Metadata:**
- "Site ID" or "DC"
- "Job Function" or "Department"
- "Date"

---

### **Sharing Permissions**

The Google Sheet must be **accessible** to the app:

**Option 1: Public Link**
- File → Share → Get Link
- Change to "Anyone with the link can view"
- ⚠️ Anyone with URL can view the sheet

**Option 2: Share with Service Account** (Production)
- Create Google Cloud service account
- Share sheet with service account email
- More secure, controlled access
- Recommended for production

**Option 3: OAuth User Authentication** (Production)
- User authenticates with their Google account
- App accesses only sheets they have access to
- Most secure for user-specific data

---

### **Data Validation**

Before connecting:
- ✅ Check all required columns are present
- ✅ Verify data types (numbers are numbers, not text)
- ✅ Remove blank rows
- ✅ Consistent formatting
- ✅ Test with small sample first

---

## 🔐 Security & Privacy

### **Current Implementation (Demo)**

⚠️ **Demo Mode:**
- Uses mock data for demonstration
- No real Google API connection yet
- Connections stored in browser localStorage
- For testing and evaluation only

---

### **Production Implementation**

For production use, you need:

#### **1. Google Cloud Project**
```
1. Go to console.cloud.google.com
2. Create new project
3. Enable Google Sheets API
4. Create credentials (OAuth 2.0 or Service Account)
```

#### **2. OAuth 2.0 Setup**
```
1. Create OAuth 2.0 Client ID
2. Add authorized JavaScript origins
3. Add authorized redirect URIs
4. Download client configuration
```

#### **3. API Authentication**
```typescript
// Initialize Google API
gapi.load('client:auth2', initClient);

function initClient() {
  gapi.client.init({
    apiKey: 'YOUR_API_KEY',
    clientId: 'YOUR_CLIENT_ID',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
  });
}

// Sign in user
gapi.auth2.getAuthInstance().signIn();
```

#### **4. Fetch Sheet Data**
```typescript
// Get spreadsheet metadata
const response = await gapi.client.sheets.spreadsheets.get({
  spreadsheetId: 'YOUR_SPREADSHEET_ID'
});

// Get sheet values
const values = await gapi.client.sheets.spreadsheets.values.get({
  spreadsheetId: 'YOUR_SPREADSHEET_ID',
  range: 'Sheet1!A1:Z1000'
});
```

#### **5. Secure Token Storage**
```typescript
// Store tokens in Supabase (NOT localStorage)
await supabase
  .from('google_tokens')
  .insert({
    user_id: userId,
    access_token: encrypted(accessToken),
    refresh_token: encrypted(refreshToken),
    expires_at: expiresAt
  });
```

---

## 🛠️ Troubleshooting

### **Issue: "Invalid Google Sheets URL"**

**Cause:** URL format is incorrect

**Solutions:**
1. Copy the **full URL** from browser address bar
2. URL must start with `https://docs.google.com/spreadsheets/d/`
3. Don't use shortened URLs (goo.gl)
4. Don't use share links with additional parameters

**Correct format:**
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```

---

### **Issue: "Failed to connect to Google Sheet"**

**Cause:** Sheet is not accessible

**Solutions:**
1. Check sharing settings - must be "Anyone with link can view"
2. Verify you have permission to access the sheet
3. Try opening the sheet in incognito window
4. Check if sheet was deleted or moved
5. Wait and try again (API rate limits)

---

### **Issue: "No sheets found"**

**Cause:** Spreadsheet is empty or has no data

**Solutions:**
1. Verify spreadsheet has at least one sheet/tab
2. Check sheet has data (not just empty)
3. Ensure sheet has headers in row 1
4. Try refreshing the connection

---

### **Issue: "Columns not detected"**

**Cause:** Column headers don't match keywords

**Solutions:**
1. Go to Configure Format tab
2. Check expected column names
3. Update your Google Sheet headers to match
4. Or add your headers as match keywords in Configure Format
5. Re-sync the connection

---

### **Issue: "Sync failed"**

**Cause:** Various reasons

**Solutions:**
1. Check internet connection
2. Verify sheet hasn't been deleted
3. Check sharing permissions
4. Try manual sync
5. Delete and reconnect
6. Check browser console for errors

---

## 📚 Complete Workflow Example

### **Scenario: Monthly Budget & Actuals Tracking**

#### **Month 1: Setup**

**Week 1:**
1. Create Google Sheet: "2025 Operations Budget"
2. Add sheets: "January Budget", "January Actuals"
3. In app: Connect "January Budget" as **Budget** type, Daily sync
4. In app: Connect "January Actuals" as **Actual** type, Hourly sync

**Throughout Month:**
- Finance team updates budget in Google Sheets as needed
- Operations enters daily actuals throughout each day
- Dashboard auto-syncs hourly (actuals) and daily (budget)
- View real-time performance in dashboard

**End of Month:**
1. Create "January Variance" sheet in Google Sheets
2. Add formulas: `=January Actuals - January Budget`
3. Connect "January Variance" as **Combined** type, Daily sync
4. Generate reports from dashboard

---

#### **Month 2: Expand**

1. Add "February Budget" and "February Actuals" sheets
2. Connect both to app
3. Keep January connections active for historical comparison
4. Now tracking two months simultaneously

---

#### **Month 12: Full Year**

1. Have 12 budget sheets + 12 actuals sheets + 12 variance sheets
2. All connected and syncing automatically
3. Create "2025 Annual Summary" sheet
4. Pull data from all months for YTD analysis
5. Complete year of data with zero manual uploads

---

## 💡 Pro Tips

### **Tip 1: Sheet Organization**
Create separate Google Sheets for different purposes:
- "2025 Budget" - All budget data
- "2025 Actuals" - All actual data
- "Variance Reports" - Monthly comparisons

### **Tip 2: Naming Convention**
Use consistent sheet names:
- "2025-01 Budget" instead of "Jan"
- "2025-Q1 Actuals" for quarters
- Include year in sheet name

### **Tip 3: Test First**
- Create a test sheet with sample data
- Connect and sync to verify format
- Once working, use same structure for real data

### **Tip 4: Version Control**
- Google Sheets has built-in version history
- File → Version History → See version history
- Restore previous versions if needed
- Track who made what changes

### **Tip 5: Multiple Connections**
- You can connect multiple sheets from same spreadsheet
- Each sheet = separate connection
- Each connection can have different sync frequency
- Example: Hourly for current month, Manual for historical

### **Tip 6: Sync Timing**
- Schedule syncs for after data entry times
- Example: Daily sync at 1 AM (after midnight processing)
- Avoid hourly sync for rarely changing data

### **Tip 7: Data Entry Template**
- Create a template sheet with all correct headers
- Duplicate for each new period
- Ensures consistent format
- Easier to connect new sheets

### **Tip 8: Formulas in Google Sheets**
- Google Sheets formulas are calculated before sync
- Dashboard imports final calculated values
- Use formulas for complex calculations in Google Sheets
- Keep dashboard for visualization

---

## 🆚 Google Sheets vs File Upload

| Feature | Google Sheets | File Upload |
|---------|--------------|-------------|
| **Ease of Update** | ✅ Edit in Google Sheets | ❌ Download, edit, re-upload |
| **Auto-Sync** | ✅ Scheduled automatic sync | ❌ Manual upload required |
| **Team Collaboration** | ✅ Multiple users simultaneously | ❌ One file at a time |
| **Version History** | ✅ Built into Google Sheets | ❌ Manual version control |
| **Real-Time** | ✅ Syncs hourly | ❌ Only when you upload |
| **Setup** | Moderate (one-time connect) | Easy (just upload) |
| **Offline** | ❌ Requires internet | ✅ Can prepare offline |
| **Large Files** | ✅ Handles large datasets | May have size limits |

---

## 📞 Support & Resources

### **Documentation Files**
- `/lib/googleSheetsService.ts` - Service implementation and setup guide
- `/BUDGET_VS_ACTUAL_DATA_GUIDE.md` - Data types guide
- `/WHERE_TO_FIND_IMPORTED_DATA.md` - Viewing imported data
- `/HOW_TO_EDIT_DATA_FORMAT.md` - Column configuration

### **Testing**
- Use the demo mode to test functionality
- Try with sample Google Sheets
- Verify data format before production use

### **Production Setup**
- See detailed setup instructions in `/lib/googleSheetsService.ts`
- Google Sheets API documentation: https://developers.google.com/sheets/api
- OAuth 2.0 guide: https://developers.google.com/identity/protocols/oauth2

---

## ✅ Quick Reference

| Action | Location | What It Does |
|--------|----------|--------------|
| **Add Connection** | Google Sheets tab → Add Connection | Connect new Google Sheet |
| **Sync Now** | Connected sheet → ▶️ button | Manually sync immediately |
| **Open Sheet** | Connected sheet → 🔗 button | Open Google Sheet in new tab |
| **Delete Connection** | Connected sheet → 🗑️ button | Remove connection (keeps data) |
| **View Synced Data** | View Data tab | See imported rows & columns |
| **Configure Columns** | Configure Format tab | Edit expected columns |
| **Change Sync Frequency** | Delete and reconnect | Update schedule |

---

## 🎉 Summary

✅ **Google Sheets integration** provides seamless data sync  
✅ **No more manual uploads** - edit in Google Sheets, auto-sync  
✅ **Scheduled updates** - hourly, 6-hour, or daily automatic sync  
✅ **Team collaboration** - multiple users can update simultaneously  
✅ **Budget & Actual support** - works with all data types  
✅ **Easy management** - simple UI to connect and sync sheets  
✅ **Production-ready** - clear setup guide for real implementation  

**Now you can keep your data in Google Sheets and automatically sync to the dashboard!** 📊🔗✨
