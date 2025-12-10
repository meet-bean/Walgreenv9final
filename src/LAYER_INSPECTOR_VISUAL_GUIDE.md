# Layer Inspector Sidebar - Visual Guide 👀

## What You'll See

### 1. Dashboard View (Before Clicking)
```
┌─────────────────────────────────────────────────────────┐
│  [Date Range] [Last 7 Days] [Last 30 Days]              │
│  ☑ Show Underperforming                                  │
│  💡 Click any section to inspect its layers  [Edit Dashboard]│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Performance Trend                                       │
│  [Line Chart with data]                                  │
│  ← Hover shows blue outline                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Hours Chart                                             │
│  [Bar Chart with data]                                   │
└─────────────────────────────────────────────────────────┘
```

### 2. Dashboard View (After Clicking Section)
```
┌─────────────────────────────────────┐┌───────────────────┐
│  Performance Trend                  ││ 🔍 Layer Inspector │
│  [Line Chart - SELECTED]            ││ ─────────────────  │
│                                     ││ Performance Trend  │
│                                     ││                    │
│                                     ││ ▼ FlatCard         │
│                                     ││   ├─ ChartHeader ✏️│
│                                     ││   ├─ Responsive... │
│                                     ││   │  └─ LineChart ✏️│
│                                     ││   │     ├─ Cartesian│
│                                     ││   │     ├─ XAxis   │
│                                     ││   │     ├─ YAxis   │
│                                     ││   │     ├─ Tooltip │
│                                     ││   │     ├─ Legend  │
│                                     ││   │     ├─ RefLine │
│                                     ││   │     └─ Line ✏️ │
│                                     ││   └─ Drill Buttons │
│                                     ││                 [X]│
└─────────────────────────────────────┘└───────────────────┘
        ↖ Content shifts left                 ↖ Sidebar slides in
```

### 3. Editing a Component
```
┌───────────────────────────────────────┐
│ 🔍 Layer Inspector                  [X]│
│ ───────────────────────────────────── │
│ Performance Trend                     │
│                                       │
│ ▼ FlatCard                            │
│   ├─ ChartHeader ✏️                   │
│   ├─ ResponsiveContainer              │
│   │  └─ ┌─────────────────────────┐  │
│   │     │ LineChart            [▼]│  │ ← Editing!
│   │     ├─────────────────────────┤  │
│   │     │ 📦 Charts (Recharts)    │  │
│   │     │   • LineChart           │  │
│   │     │   • BarChart         ←── │  │ Click this
│   │     │   • PieChart            │  │
│   │     │   • AreaChart           │  │
│   │     ├─────────────────────────┤  │
│   │     │ 🔧 Chart Elements       │  │
│   │     │   • CartesianGrid       │  │
│   │     │   • XAxis               │  │
│   │     │   • YAxis               │  │
│   │     └─────────────────────────┘  │
│   │     ✓ Cancel ✗                   │
│   │                                   │
│                                       │
│ 💡 Changes highlight when saved      │
└───────────────────────────────────────┘
```

### 4. After Saving
```
┌───────────────────────────────────────┐
│ 🔍 Layer Inspector                  [X]│
│ ───────────────────────────────────── │
│ Performance Trend                     │
│                                       │
│ ▼ FlatCard                            │
│   ├─ ChartHeader ✏️                   │
│   ├─ ResponsiveContainer              │
│   │  └─ ┌─────────────────────┐      │
│   │     │ BarChart          ✏️│ ← Highlighted blue!
│   │     └─────────────────────┘      │
│   │     ├─ CartesianGrid             │
│   │     ├─ XAxis                     │
│   │     ├─ YAxis                     │
│   │     ├─ Tooltip                   │
│   │     └─ Bar ✏️                     │
│   └─ Drill-down Buttons              │
│                                       │
│ 💡 Changes highlight when saved      │
└───────────────────────────────────────┘
```

## Component Picker Categories

When you click ✏️, you'll see components organized like this:

```
┌─────────────────────────────┐
│ Search...                   │
├─────────────────────────────┤
│ HEADERS                     │
│  • ChartHeader              │
│  • CardHeader               │
├─────────────────────────────┤
│ CONTAINERS                  │
│  • FlatCard                 │
│  • Card                     │
│  • ResponsiveContainer      │
│  • div                      │
├─────────────────────────────┤
│ CHARTS (RECHARTS)           │
│  • LineChart                │
│  • BarChart                 │
│  • PieChart                 │
│  • AreaChart                │
├─────────────────────────────┤
│ CHART ELEMENTS              │
│  • CartesianGrid            │
│  • XAxis                    │
│  • YAxis                    │
│  • Tooltip                  │
│  • Legend                   │
│  • ReferenceLine            │
│  • Line                     │
│  • Bar                      │
│  • Pie                      │
│  • Area                     │
├─────────────────────────────┤
│ TABLES                      │
│  • Table                    │
│  • TableHeader              │
│  • TableBody                │
│  • TableRow                 │
│  • TableCell                │
├─────────────────────────────┤
│ UI COMPONENTS               │
│  • Badge                    │
│  • Progress                 │
│  • Button                   │
│  • Separator                │
├─────────────────────────────┤
│ CUSTOM COMPONENTS           │
│  • HierarchicalPerformance..│
│  • SitePerformanceMap       │
│  • DynamicRankings          │
│  • PerformancePieChart      │
└─────────────────────────────┘
```

## Color Legend in Sidebar

- 🔵 **Component** (Blue text) - React components like ChartHeader, LineChart
- 🟠 **Wrapper** (Orange text) - Container elements like FlatCard, ResponsiveContainer
- ⚫ **Element** (Gray text) - Leaf elements like XAxis, CartesianGrid
- 🟢 **Section** (Green text) - Top-level section containers

## Interactive Elements

| Element | What It Does |
|---------|-------------|
| ✏️ | Opens component picker to change the component |
| ✓ | Saves the component change (flashes blue) |
| ✗ | Cancels the edit |
| [X] | Closes the entire sidebar |
| ▼ / ▶ | Expands/collapses layer tree |
| 💡 | Shows helpful notes about alternatives |

## Hover States

1. **Section hover** (dashboard): Blue outline appears
2. **Component picker hover** (sidebar): Gray background
3. **Edit button hover** (sidebar): Full opacity

## Smooth Transitions

- **Sidebar slide-in**: 300ms ease from right
- **Content margin shift**: 300ms ease
- **Highlight flash**: 800ms blue → normal
- **Hover outline**: Instant

## Keyboard Shortcuts

- **Ctrl+Shift+D**: Opens the full Structure Diagram (different from Layer Inspector)
- **Click section**: Opens Layer Inspector for that specific section
- **ESC** (future): Could close the sidebar

## Mobile Considerations

On smaller screens, the sidebar might:
- Overlay content instead of shifting it
- Take full width on very small screens
- Show a hamburger menu to toggle

## What's NOT Changed

The Layer Inspector is **documentation only**. It:
- ✅ Shows you the structure
- ✅ Lets you edit component names
- ✅ Tracks changes visually
- ❌ Does NOT modify actual code
- ❌ Does NOT change the real dashboard
- ❌ Does NOT persist changes

Think of it as a **visual reference tool** and **documentation aid**.

## When to Use It

Perfect for:
- 📚 Learning how sections are built
- 🔍 Understanding component hierarchies
- 🎨 Planning design changes
- 📝 Documenting architecture
- 🎓 Teaching others about the codebase
- 🤔 Exploring Recharts components

Enjoy exploring your dashboard layers! 🚀
