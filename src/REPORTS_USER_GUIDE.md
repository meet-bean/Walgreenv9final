# Reports Feature - User Guide 📋

## Quick Start

The Reports feature allows you to generate professional performance reports and export them as PDF or CSV files.

---

## 📍 How to Access Reports

### **Step 1: Find the Reports Icon**
- Located in the **top-right navigation bar**
- Icon: 📋 **FileText** icon
- Click to open the Reports Hub

```
[Dashboards] [Data Input] | [📋 Reports] [🎨 Design] [🔔 Alerts] [⚙️ Settings] [👤 Logout]
                              ↑ CLICK HERE
```

---

## 📊 Available Reports

### **1. Daily Performance Report**
**Purpose:** View yesterday's performance across all distribution centers

**What it shows:**
- ✅ Overall average performance with day-over-day trend
- ✅ Total volume processed
- ✅ Total hours worked
- ✅ Site-by-site breakdown
- ✅ Job function performance within each site

**How to use:**
1. Select the **Report Date** (defaults to yesterday)
2. Click **"Generate Report"**
3. Review performance metrics
4. Export as PDF or CSV

**Best for:**
- Daily operations review
- Morning briefings
- Quick performance snapshots

---

### **2. Weekly Trend Analysis**
**Purpose:** Analyze 7-day performance trends

**What it shows:**
- ✅ Week average performance with week-over-week comparison
- ✅ Daily breakdown for 7 days
- ✅ Volume and hours trends
- ✅ Site-specific performance trends

**How to use:**
1. Select the **End Date** (defaults to today)
2. Report will show 7 days ending on that date
3. Click **"Generate Report"**
4. Review trend data
5. Export as PDF or CSV

**Best for:**
- Weekly reviews
- Trend identification
- Performance pattern analysis

---

### **3. Exception Report**
**Purpose:** Identify all performance below threshold

**What it shows:**
- ✅ Total exception count
- ✅ Critical vs. warning exceptions
- ✅ Average exception performance
- ✅ Site exception breakdown
- ✅ Detailed exception list with variance

**How to use:**
1. Set **Threshold** (default: 75%)
2. Set **Number of Days** to analyze (default: 7)
3. Click **"Generate Report"**
4. Review all exceptions
5. Export for follow-up

**Best for:**
- Problem identification
- Performance improvement initiatives
- Supervisor coaching opportunities

---

## 💾 Export Options

### **Export to PDF**
**How it works:**
1. Generate your report
2. Click **"Print / PDF"** button
3. Browser print dialog opens
4. Choose **"Save as PDF"** from destination
5. Save to your computer

**Advantages:**
- ✅ Professional formatting
- ✅ Ready to share
- ✅ Print-friendly
- ✅ Preserves layout

**Best for:**
- Executive presentations
- Email attachments
- Printed documentation
- Archival records

---

### **Export to CSV**
**How it works:**
1. Generate your report
2. Click **"Export CSV"** button
3. File downloads automatically
4. Open in Excel, Google Sheets, or any spreadsheet software

**Advantages:**
- ✅ Editable data
- ✅ Further analysis possible
- ✅ Can create custom charts
- ✅ Easy to filter and sort

**Best for:**
- Data analysis
- Custom visualizations
- Integration with other tools
- Advanced calculations

---

## 🎯 Step-by-Step Workflows

### **Workflow 1: Daily Morning Review**

**Goal:** Generate yesterday's performance report for team meeting

1. **Login** to the system
2. Click **📋 Reports** icon (top-right)
3. Select **"Daily Performance Report"**
4. Verify date is set to **yesterday**
5. Click **"Generate Report"**
6. Review the **Summary** section:
   - Average Performance
   - Total Volume
   - Total Hours
7. Scroll down to **Site Performance Breakdown**
8. Note any sites below 85% performance
9. Click **"Print / PDF"** to save for meeting
10. Done! File ready to present

---

### **Workflow 2: Weekly Trend Analysis**

**Goal:** Analyze last week's performance trends

1. Click **📋 Reports** icon
2. Select **"Weekly Trend Analysis"**
3. Set **End Date** to last Friday (or desired end)
4. Click **"Generate Report"**
5. Review **Week Average Performance**:
   - Check if up/down vs. previous week
6. Scroll to **7-Day Performance Trend** table
7. Identify peak and low days
8. Review **Site Trends** section
9. Note which sites are improving/declining
10. Click **"Export CSV"** for deeper analysis
11. Open CSV in Excel
12. Create pivot tables or charts as needed
13. Done!

---

### **Workflow 3: Exception Investigation**

**Goal:** Find all performance issues below 75% in last 7 days

1. Click **📋 Reports** icon
2. Select **"Exception Report"**
3. Set **Threshold:** `75` (%)
4. Set **Days:** `7`
5. Click **"Generate Report"**
6. Review **Summary**:
   - Total Exceptions
   - Critical (<60%) count
   - Warning (60-75%) count
7. Check **Exceptions by Site**:
   - Which sites have most issues?
8. Scroll to **All Exceptions** table:
   - Date, Site, Job Function, Task
   - Performance % and Variance
9. Sort by performance (worst first)
10. Click **"Export CSV"** to share with supervisors
11. Follow up on critical exceptions
12. Done!

---

## 📊 Understanding Report Metrics

### **Performance %**
- **What it is:** Efficiency metric (Expected Hours / Actual Hours × 100)
- **100%+ = Excellent:** Performing better than budget
- **85-99% = Good:** Within acceptable range
- **75-84% = Warning:** Needs attention
- **<75% = Critical:** Immediate action required

### **Trend Indicators**
- **↑ Green Arrow:** Performance improved
- **↓ Red Arrow:** Performance declined
- **→ Gray Line:** No significant change (<0.5%)

### **Volume vs. Budget**
- **Positive variance:** Processed more than budgeted
- **Negative variance:** Processed less than budgeted

---

## 🎨 Color Coding System

Reports use consistent color coding:

| Color | Badge | Meaning |
|-------|-------|---------|
| 🟢 Emerald | Excellent | Performance ≥ 100% |
| 🔵 Blue | Good | Performance 85-99% |
| 🟡 Yellow | Warning | Performance 75-84% |
| 🔴 Red | Critical | Performance < 75% |

---

## 📱 Mobile Usage

Reports work on mobile devices:
- Single-column layout
- Touch-friendly buttons
- Scrollable tables
- Mobile export options

**Note:** For best experience, use desktop/tablet for report generation and PDF export.

---

## 🖨️ Printing Tips

### **For Best Print Quality:**
1. Generate report
2. Click "Print / PDF"
3. In print dialog:
   - **Layout:** Portrait
   - **Paper:** Letter or A4
   - **Margins:** Default
   - **Background graphics:** ON
4. Preview before printing
5. Save as PDF or print

### **Print Features:**
- ✅ Page breaks optimized
- ✅ No navigation bars
- ✅ Professional fonts
- ✅ Complete tables
- ✅ Clean headers/footers

---

## ⚙️ Configuration Guide

### **Date Selection:**
- Use calendar picker
- Cannot select future dates
- Time is ignored (report by day)

### **Threshold Setting:**
- Range: 0-100%
- Common values:
  - 90% = Very strict
  - 80% = Strict
  - 75% = Standard (default)
  - 70% = Lenient
  - 60% = Very lenient

### **Days to Analyze:**
- Range: 1-30 days
- Common periods:
  - 1 day = Yesterday only
  - 7 days = Last week (default)
  - 14 days = Last 2 weeks
  - 30 days = Last month

---

## 🔄 Refreshing Reports

### **When to Refresh:**
- Data has been updated
- Need latest numbers
- After entering new actuals

### **How to Refresh:**
1. In report view, click **"Refresh"** button
2. Report regenerates with current data
3. New timestamp appears
4. Updated metrics display

---

## 💡 Pro Tips

### **Tip 1: Compare Weeks**
Generate Weekly Trend Reports for consecutive weeks:
- Week 1: End date = Last Friday
- Week 2: End date = Previous Friday
- Compare performance trends

### **Tip 2: Track Exceptions Over Time**
Run Exception Reports weekly:
- Same threshold (75%)
- Same period (7 days)
- Track if exception count increases/decreases

### **Tip 3: Site-Specific Analysis**
After exporting CSV:
- Filter by specific site
- Create site-focused reports
- Share with site managers

### **Tip 4: Save Report Templates**
For recurring reports:
- Set your preferred configurations
- Generate report
- Export as PDF
- Save filename format: `Report_Type_Date.pdf`

### **Tip 5: Combine Report Types**
Use all three together:
1. **Daily Report** → What happened yesterday?
2. **Weekly Trend** → What's the pattern?
3. **Exception Report** → Where are the problems?

---

## ❓ Frequently Asked Questions

### **Q: Why can't I select today's date for Daily Report?**
**A:** Daily Performance Report shows completed days. Today's data is incomplete, so the latest selectable date is yesterday.

### **Q: Why is my report empty?**
**A:** Check if data exists for the selected date range. If you're viewing historical data before your system start date, there may be no records.

### **Q: Can I schedule reports to run automatically?**
**A:** Not in Phase 1 MVP. Report scheduling is planned for Phase 2.

### **Q: How do I share a report with my team?**
**A:** Generate the report, export as PDF, and email it. Or export as CSV and share the file via your preferred method.

### **Q: Can I customize the report layout?**
**A:** Not in Phase 1 MVP. Custom report builder is planned for Phase 2.

### **Q: Why doesn't the CSV include charts?**
**A:** CSV is raw data only. Use PDF export if you need the formatted report with visual elements.

### **Q: How far back can I generate reports?**
**A:** The system has 180 days (6 months) of historical data available.

### **Q: Can I filter by specific sites or job functions?**
**A:** Not in Phase 1 MVP. Advanced filtering is planned for Phase 2. However, you can export to CSV and filter in Excel.

---

## 🆘 Troubleshooting

### **Issue: Report generation fails**
**Solution:**
- Refresh the page
- Check your date selections are valid
- Try a different date range
- Contact support if persistent

### **Issue: PDF export doesn't work**
**Solution:**
- Check browser popup blocker
- Ensure print dialog isn't blocked
- Try a different browser
- Use CSV export as alternative

### **Issue: CSV download doesn't start**
**Solution:**
- Check browser download settings
- Clear browser cache
- Try again with different browser
- Verify file permissions

### **Issue: Numbers don't match dashboard**
**Solution:**
- Ensure you're viewing same date range
- Check if data was recently updated
- Refresh the report
- Verify filters match

---

## 📞 Support

If you encounter issues or have questions:
1. Check this guide first
2. Review the FAQ section
3. Contact your system administrator
4. Submit a support ticket

---

## 🎓 Training Resources

### **New User Training:**
1. Read this guide
2. Generate each report type once
3. Practice exporting to PDF and CSV
4. Review sample reports with your manager

### **Power User Training:**
1. Master all three report types
2. Learn CSV analysis in Excel
3. Create custom visualizations
4. Train team members

---

## ✅ Quick Reference Card

| Task | Steps |
|------|-------|
| **Generate Daily Report** | Reports → Daily Performance → Select Date → Generate |
| **Generate Weekly Report** | Reports → Weekly Trend → Select End Date → Generate |
| **Generate Exception Report** | Reports → Exception → Set Threshold & Days → Generate |
| **Export PDF** | Generate Report → Print/PDF → Save as PDF |
| **Export CSV** | Generate Report → Export CSV → Open file |
| **Refresh Report** | In Report View → Click Refresh |
| **Return to List** | In Report View → Back to Reports |

---

**Last Updated:** November 17, 2025  
**Version:** Phase 1 MVP  
**Feature Status:** ✅ Complete
