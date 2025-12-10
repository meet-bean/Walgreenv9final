# Section Width & Layout Guide

## Overview
You can now easily mix and match different section widths to create dynamic dashboard layouts! Sections can be set to various widths, allowing you to have:
- **Full-width sections** that span the entire row
- **Half-width sections** that sit side-by-side
- **Quarter and third-width sections** for compact layouts
- **Any combination** of the above!

---

## Available Width Options

Our 12-column grid system supports the following width presets:

| Width Preset | Columns | Usage | Example Layout |
|--------------|---------|-------|----------------|
| **Quarter** | 3 cols | Small metrics, compact KPIs | 4 sections per row |
| **Third** | 4 cols | Medium widgets, focused data | 3 sections per row |
| **Half** | 6 cols | ⭐ Default - Two sections per row | 2 sections per row |
| **Two-Thirds** | 8 cols | Larger charts with sidebar | 1 large + 1 small |
| **Three-Quarters** | 9 cols | Featured content | 1 featured + 1 quarter |
| **Full** | 12 cols | Dashboard headers, wide tables | 1 section per row |

---

## How to Set Section Width

### Method 1: Width Dropdown (Easiest!)
1. In the **Design** or **Design Test** tab, look at your section list
2. Each section has a **width dropdown** on the right side
3. Click it and select from:
   - Quarter (3 cols)
   - Third (4 cols)
   - Half (6 cols) ⭐ **Default**
   - Two-Thirds (8 cols)
   - Three-Quarters (9 cols)
   - Full (12 cols)

### Method 2: Resize Handles in Preview
1. In the **Live Preview**, hover over a section
2. Drag the **right edge** to resize width
3. Drag the **bottom-right corner** to resize both width and height

### Method 3: Visual Badge
- Each section shows a **width badge** (e.g., "Half", "Full", "2/3")
- This helps you quickly see the current layout

---

## Common Layout Patterns

### Pattern 1: Header + Dual Content
```
[==== Full Width Header Section ====]
[== Half Width ==] [== Half Width ==]
[== Half Width ==] [== Half Width ==]
```
**Use Case:** KPI header with detailed charts below

**How to Build:**
1. Add a section → Set to "Full (12 cols)"
2. Add 4 more sections → Keep at "Half (6 cols)" (default)

---

### Pattern 2: Featured + Sidebar
```
[==== Two-Thirds ====] [= Third =]
[==== Two-Thirds ====] [= Third =]
```
**Use Case:** Main chart with quick stats sidebar

**How to Build:**
1. Add section → Set to "Two-Thirds (8 cols)"
2. Add section → Set to "Third (4 cols)"
3. Repeat as needed

---

### Pattern 3: Compact Metrics Grid
```
[= 1/4 =] [= 1/4 =] [= 1/4 =] [= 1/4 =]
[= 1/4 =] [= 1/4 =] [= 1/4 =] [= 1/4 =]
```
**Use Case:** Executive dashboard with many KPIs

**How to Build:**
1. Add 8 sections
2. Set each to "Quarter (3 cols)"

---

### Pattern 4: Mixed Layout (Most Flexible!)
```
[======= Full Width Title =======]
[=== Half ===] [=== Half ===]
[==== Two-Thirds ====] [= Third =]
[= 1/4 =] [= 1/4 =] [= 1/4 =] [= 1/4 =]
[======= Full Width Table =======]
```
**Use Case:** Comprehensive dashboard with varied content

**How to Build:**
1. Mix different widths as needed
2. Sections automatically flow into rows
3. Use density mode to fit more content

---

## Pro Tips

### ✅ Best Practices
- **Start with Half (6 cols)**: Default setting fits 2 sections per row - great for most use cases
- **Use Full Width for Headers**: Makes dashboard sections clear and organized
- **Pair Two-Thirds + Third**: Perfect for main content + sidebar layout
- **Group Similar Widths**: Sections with same width create cleaner rows

### 🎯 Density Mode
Combine width settings with **Density Mode** (Compact/Normal/Comfortable):
- **Compact**: Reduces spacing and heights by 30% - fits MORE sections
- **Normal**: Balanced spacing (15% reduction)
- **Comfortable**: Maximum spacing for readability

### 🔧 Auto-Flow Grid System
- Sections automatically flow into new rows when a row is full
- Example: If you have 3 half-width sections (6 cols each):
  - Row 1: Section 1 + Section 2 (6 + 6 = 12 ✓)
  - Row 2: Section 3 (6 cols, waiting for another section)

---

## Visual Example: Building a Real Dashboard

**Goal:** Create an executive dashboard with KPI header, charts, and tables

**Steps:**

1. **Add KPI Cards Section** → Set to **Full (12 cols)**
   - Shows 6 metric cards across the full width

2. **Add Performance Trend** → Set to **Half (6 cols)**
   - Line chart showing trends

3. **Add Hours Chart** → Set to **Half (6 cols)**
   - Bar chart next to the trend (same row!)

4. **Add Site Map** → Set to **Two-Thirds (8 cols)**
   - Large geographic visualization

5. **Add Rankings** → Set to **Third (4 cols)**
   - Top performers list (sits next to map)

6. **Add Task List** → Set to **Full (12 cols)**
   - Wide table showing all tasks

**Result:**
```
[============ KPI Cards (Full) ============]
[== Trend Chart ==] [== Hours Chart ==]
[==== Site Map ====] [Rankings]
[============ Task List (Full) ============]
```

---

## Technical Details

### Grid System
- 12-column CSS Grid layout
- Responsive and flexible
- Supports any column span from 1-12

### Supported Column Spans
All integer values 1-12 are supported, but we provide presets for:
- 3, 4, 6, 8, 9, 12 (most common)

### Custom Widths
While not exposed in the UI, you can technically resize to any width using the resize handles in the preview.

---

## Troubleshooting

**Q: Why is my section on a new row when I wanted it next to another?**
A: Check that the total columns don't exceed 12. Example: 8 cols + 6 cols = 14 (too much!) → Second section moves to new row.

**Q: Can I have 3 sections in one row?**
A: Yes! Use Third (4 cols) × 3 = 12 cols total. Or Quarter (3 cols) × 4 = 12 cols.

**Q: How do I make all sections the same size?**
A: Select all sections and set them to the same width preset (e.g., all to "Half").

**Q: Can I save my layout?**
A: Yes! Your width settings are saved with the dashboard automatically.

---

## Next Steps
- Experiment with different layouts in the **Design Test** tab
- Use the **75% preview scale** to see how your dashboard will look
- Try **Compact density mode** to fit more sections
- Save successful layouts as templates for reuse
