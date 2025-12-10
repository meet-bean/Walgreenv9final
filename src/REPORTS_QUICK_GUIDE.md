# Reports System - Quick Start Guide

## 🚀 Getting Started

The Reports system now has two main sections:

1. **Configuration Tab** - Column layout, grouping, drag-and-drop
2. **Enhancements Tab** - Advanced features, saved views, comparisons

---

## 📊 Basic Report Workflow

### Step 1: Generate a Report
1. From Reports home, choose your report type
2. Configure parameters (date, threshold, etc.)
3. Click "Generate Report"

### Step 2: Customize Your View
1. **Sidebar → Configuration Tab**
   - Show/hide columns (checkbox)
   - Reorder columns (drag the grip icon)
   - Create column groups (click + icon)
   - Configure row grouping (dropdown at bottom)

### Step 3: Enhance Your Report
1. **Sidebar → Enhancements Tab**
   - Set view density (Compact/Comfortable/Spacious)
   - Enable global search
   - Configure auto-refresh
   - Save your custom view

---

## 🎯 Power User Features

### 🔍 Sorting & Filtering

**Sort Data:**
- Click column header
- ⬆️ Ascending → ⬇️ Descending → ❌ Clear

**Filter Data:**
- Click filter icon in column header
- Enter search term or select value
- See active filters at bottom of table

**Global Search:**
- Enhancements tab → "Global Search"
- Searches ALL columns at once
- Great for finding specific values

### 📌 Column Management

**Pin a Column:**
- Click pin icon in column header
- Column stays visible when scrolling
- Perfect for keeping Task/Site visible

**Resize a Column:**
- Hover over column border
- Drag left/right to resize
- Double-click to auto-fit (future)

### 🎨 Visual Enhancements

**Heat Maps:**
- Automatically enabled on performance columns
- Green = good, Yellow = warning, Red = critical
- Intensity shows severity

**Zebra Striping:**
- Alternating row colors
- Improves readability
- Always on by default

**Sparklines:**
- Mini trend charts in cells
- Shows 7-day trend at a glance
- Appears on time-series data

### 💾 Save & Load Views

**Save Current View:**
1. Configure report exactly how you want
2. Enhancements tab → "Save Current View"
3. Give it a name (e.g., "Weekly Executive Summary")
4. Click "Save View"

**Load a Saved View:**
1. Enhancements tab → "Load View"
2. Select from your saved views
3. All settings instantly applied

**Why Use Saved Views?**
- Save time on repeated reports
- Share configurations with team
- Maintain consistency

### 📅 Period Comparison

**Compare This Week vs Last Week:**
1. Enhancements tab → "Compare Periods"
2. Set base period (e.g., Nov 11-17)
3. Choose "Previous Period"
4. Click "Apply Comparison"

**Compare Year-over-Year:**
1. Same process
2. Choose "Previous Year"
3. See YoY trends instantly

**Custom Comparison:**
1. Choose "Custom"
2. Manually set both date ranges
3. Compare any two periods

### 🔔 Alerts & Automation

**Set Performance Alert:**
1. Enhancements tab → "Set Alert"
2. Choose metric (e.g., Performance %)
3. Set condition (e.g., Falls below)
4. Set threshold (e.g., 75)
5. Get notified when triggered

**Schedule Report Delivery:**
1. Enhancements tab → "Schedule"
2. Choose frequency (daily/weekly/monthly)
3. Enter email recipients
4. Report auto-sends at scheduled time

### 🔄 Auto-Refresh

**Enable Live Updates:**
1. Enhancements tab → "Auto Refresh"
2. Choose interval (30sec to 10min)
3. Report refreshes automatically
4. Great for monitoring dashboards

### 🔗 Share Your Report

**Generate Shareable Link:**
1. Configure report perfectly
2. Enhancements tab → "Share Link"
3. Link copied to clipboard
4. Anyone with link sees exact same view

**What Gets Shared?**
- Column configuration
- Filters applied
- Density setting
- All visual settings

### 📤 Export Options

**CSV Export:**
- Raw data, no formatting
- Opens in Excel/Sheets
- Best for further analysis

**PDF Export (Print):**
- Formatted for printing
- Includes all styling
- Professional reports

**Enhanced Excel:**
- Coming soon
- Conditional formatting
- Formulas included

**Google Sheets:**
- Coming soon
- Direct integration
- Real-time collaboration

---

## 🎨 Visual Customization

### Density Options

**Compact:**
- Tightest spacing
- Most data per screen
- Best for large reports

**Comfortable (Default):**
- Balanced spacing
- Easy to read
- Best for most users

**Spacious:**
- Maximum breathing room
- Easiest to scan
- Best for presentations

### Heat Map Intensity

**Performance Metrics:**
- 90-100%: Dark green (excellent)
- 75-90%: Light green (good)
- 60-75%: Yellow (warning)
- 0-60%: Red (critical)

**Variance Metrics:**
- Positive: Green shades
- Negative: Red shades
- Intensity = magnitude

**Volume Metrics:**
- Blue intensity scale
- Darker = higher value
- Relative to column data

---

## ⌨️ Keyboard Shortcuts

Coming soon! These will be added:
- `Ctrl/Cmd + F` - Global search
- `Ctrl/Cmd + S` - Save view
- `Ctrl/Cmd + P` - Print report
- `Ctrl/Cmd + E` - Export
- Arrow keys - Navigate cells
- `Space` - Expand row

---

## 💡 Tips & Tricks

### Tip 1: Start with a Template
- Generate a basic report
- Customize columns and filters
- Save as "Template - [Report Type]"
- Load whenever needed

### Tip 2: Use Groups Effectively
- Group related columns (Budget/Actual/Variance)
- Collapse groups you don't need
- Cleaner, more focused view

### Tip 3: Combine Features
- Pin key columns (Task, Performance)
- Filter for specific sites
- Sort by performance (ascending)
- Save as "Problem Areas View"

### Tip 4: Leverage Global Search
- Find specific task quickly
- Locate a particular site
- Search for performance values
- Much faster than scrolling

### Tip 5: Set Up Dashboards
- Create multiple saved views
- Set different auto-refresh rates
- Open in separate tabs
- Real-time monitoring

### Tip 6: Regular Cleanup
- Delete unused saved views
- Review and update alerts
- Archive old schedules
- Keep system organized

### Tip 7: Export Strategy
- CSV for analysis (Excel, Python, R)
- PDF for distribution (email, print)
- Sheets for collaboration
- Pick right tool for job

---

## 🐛 Troubleshooting

### Report Not Loading
- Check date range
- Verify data exists for period
- Try refreshing page

### Filters Not Working
- Check filter syntax
- Clear all and reapply
- Verify data type matches

### Saved View Missing
- Check browser localStorage
- May have been cleared
- Re-save if needed

### Export Issues
- Check browser pop-up blocker
- Allow downloads from site
- Try different format

### Performance Slow
- Reduce auto-refresh frequency
- Use filters to limit data
- Enable compact density
- Clear old saved views

---

## 📚 Learn More

For detailed technical documentation, see:
- `REPORTS_COMPREHENSIVE_ENHANCEMENTS_COMPLETE.md`
- `REPORTS_FEATURE_COMPLETE.md`
- `REPORTS_COLUMN_GROUPING_GUIDE.md`
- `REPORTS_USER_GUIDE.md`

---

## 🎯 Common Use Cases

### Use Case 1: Daily Operations Review
**Setup:**
1. Generate Daily Performance Report
2. Pin: Task, Site, Performance
3. Sort: Performance ascending
4. Filter: Performance < 75%
5. Save as "Daily Issues"

**Daily Workflow:**
1. Load "Daily Issues" view
2. See all underperforming tasks
3. Drill into specific sites
4. Export PDF for team meeting

### Use Case 2: Weekly Executive Summary
**Setup:**
1. Generate Weekly Trend Report
2. Show only summary columns
3. Enable heat maps
4. Set density to Spacious
5. Save as "Executive Weekly"

**Weekly Workflow:**
1. Load "Executive Weekly"
2. Compare to previous week
3. Screenshot key metrics
4. Share link with executives

### Use Case 3: Exception Monitoring
**Setup:**
1. Generate Exception Report
2. Set threshold to 60%
3. Pin: Date, Site, Task
4. Enable auto-refresh (5 min)
5. Set alert for new exceptions

**Monitoring:**
1. Leave tab open
2. Auto-refreshes every 5 min
3. Get alerted to new issues
4. Take immediate action

### Use Case 4: Site Performance Analysis
**Setup:**
1. Generate Daily Performance Report
2. Filter: Site = "DFW1"
3. Group by: Job Function
4. Show running totals
5. Compare to previous period

**Analysis:**
1. See site trends
2. Identify problem functions
3. Compare to other periods
4. Export for deeper dive

---

## ✅ Quick Reference Cheat Sheet

| I want to... | Action | Location |
|-------------|--------|----------|
| Sort data | Click column header | Table header |
| Filter data | Click filter icon | Column header |
| Search everything | Use Global Search | Enhancements tab |
| Pin column | Click pin icon | Column header |
| Resize column | Drag border | Column edge |
| Save my view | Click "Save Current View" | Enhancements tab |
| Load a view | Click "Load View" | Enhancements tab |
| Change density | Select Compact/Comfortable/Spacious | Enhancements tab |
| Compare periods | Click "Compare Periods" | Enhancements tab |
| Share report | Click "Share Link" | Enhancements tab |
| Set alert | Click "Set Alert" | Enhancements tab |
| Schedule report | Click "Schedule" | Enhancements tab |
| Export | Choose format | Enhancements tab or top toolbar |
| Auto-refresh | Set interval | Enhancements tab |
| Show/hide column | Toggle checkbox | Configuration tab |
| Reorder column | Drag grip icon | Configuration tab |
| Group columns | Click + icon | Configuration tab |
| Group rows | Select grouping | Configuration tab |

---

**Enjoy your enhanced reporting experience! 🎉**
