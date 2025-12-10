# Modern Dashboard Builder - Quick Reference Card

## 🎯 Quick Start

```
Dashboard Manager → Create/Edit Dashboard → Toggle shows "Modern" in header
```

## 🎮 Controls Reference

### Header Bar
```
┌─────────────────────────────────────────────────────────────┐
│ [Cancel] | [Preview/Edit]  ...  [Modern/Classic] [Save] [Publish] │
└─────────────────────────────────────────────────────────────┘
```

### Section Hover Controls
```
┌─────────────────────────────────────────────────┐
│ [≡] Section Name    [1][2][3][4]  [⎘] [🗑]      │ ← Appears on hover
│                                                  │
│  Section Content (Live Preview)                 │
│                                                  │
└─────────────────────────────────────────────────┘

[≡]      = Drag handle
[1-4]    = Width buttons (columns)
[⎘]      = Duplicate
[🗑]      = Delete
```

### Adding Sections
```
┌─────────────────────┐
│  Empty Dashboard    │
│   ┌───────┐         │
│   │   +   │         │
│   └───────┘         │
│  "Add First Section"│
└─────────────────────┘

OR (when sections exist):

                    [+] ← Floating Action Button
                        (Bottom-right corner)
```

## 📐 Grid System

### Width System
- **1** = 25% width (1/4 of grid)
- **2** = 50% width (2/4 of grid)
- **3** = 75% width (3/4 of grid)
- **4** = 100% width (4/4 of grid - Full width)

### Grid Flow Examples

**All Full Width:**
```
┌────────────────────────────────────┐
│ Section 1 (width: 4)               │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Section 2 (width: 4)               │
└────────────────────────────────────┘
```

**Half + Half:**
```
┌─────────────────┬─────────────────┐
│ Section 1 (2)   │ Section 2 (2)   │
└─────────────────┴─────────────────┘
```

**Mixed Widths:**
```
┌────────┬────────┬────────┬────────┐
│ Sec1(1)│ Sec2(1)│ Sec3(1)│ Sec4(1)│
└────────┴────────┴────────┴────────┘
┌────────────────┬──────────────────┐
│  Section 5 (2) │  Section 6 (2)   │
└────────────────┴──────────────────┘
┌──────────────────────────┬────────┐
│    Section 7 (3)         │ Sec8(1)│
└──────────────────────────┴────────┘
```

## ⌨️ Keyboard Shortcuts (Future)

Currently mouse-driven. Keyboard shortcuts planned:
- `Ctrl+S` - Save
- `Ctrl+P` - Publish  
- `Esc` - Close sidebar
- `Delete` - Remove selected section

## 🎨 Visual States

### Normal State
- White background
- Light gray border
- Subtle shadow

### Hover State (Edit Mode)
- Blue border (`--color-chart-1`)
- Elevated shadow
- Control bar appears

### Dragging State
- Semi-transparent (30% opacity)
- Original position remains visible

### Drop Zone State
- Blue dashed border
- Light blue background tint
- Slight scale increase

### Preview Mode
- All controls hidden
- Clean, end-user view
- No hover effects

## 🔄 Common Workflows

### Creating a Dashboard
```
1. Click "Create Dashboard"
2. Enter name (required)
3. Add description (optional)
4. Click floating [+] button
5. Select section type from sidebar
6. Adjust width (1-4) on hover
7. Drag to reorder
8. Click "Save" or "Publish"
```

### Editing Layout
```
1. Open dashboard in builder
2. Hover over section
3. Click width buttons [1][2][3][4]
4. Sections auto-reflow
5. Save changes
```

### Duplicating Sections
```
1. Hover over section
2. Click duplicate [⎘] button
3. New "(Copy)" appears at end
4. Rename if needed
5. Adjust width/position
```

### Reordering Sections
```
1. Hover over section
2. Grab drag handle [≡]
3. Drag up/down
4. Drop zone highlights
5. Release to drop
6. Sections reorder
```

## 🎯 Pro Tips

### Efficient Layout Building
1. **Start with structure** - Add all sections first
2. **Set widths** - Adjust all widths at once
3. **Fine-tune order** - Drag to perfect positions
4. **Preview often** - Toggle to see user view
5. **Save frequently** - Don't lose work

### Width Strategy
- **Hero sections**: Use width 4 (full)
- **Metrics**: Use width 1 (quarters) for KPIs
- **Charts**: Use width 2 or 3
- **Tables**: Usually width 3 or 4
- **Side-by-side**: Use matching widths (2+2, 1+3, etc.)

### Performance
- Sections render independently
- Grid is CSS-native (fast)
- Changes are instant
- No layout calculations needed

## 🐛 Troubleshooting

### Section won't drag
- ✅ Make sure you're not in Preview mode
- ✅ Grab the drag handle [≡], not content
- ✅ Hover first to see controls

### Width buttons not working
- ✅ Ensure you're hovering over section
- ✅ Check you're in Edit mode
- ✅ Try clicking directly on button

### Sidebar won't close
- ✅ Click backdrop (darkened area)
- ✅ Click [X] button in sidebar
- ✅ Click section to add (auto-closes)

### Controls not appearing
- ✅ Must be in Edit mode (not Preview)
- ✅ Hover directly over section card
- ✅ Wait ~100ms for animation

### Layout looks wrong
- ✅ Check total widths per row = 4 max
- ✅ Sections wrap to new rows automatically
- ✅ Preview mode shows final layout

## 📊 Design System Values

All styling uses CSS variables from `/styles/globals.css`:

### Spacing
- Card padding: `var(--spacing-4)`
- Grid gap: `var(--grid-gap)`
- Control spacing: `var(--spacing-2)`

### Colors
- Primary: `var(--color-primary)` - Red/Pink
- Border: `var(--color-border)` - Light gray
- Hover: `var(--color-chart-1)` - Blue
- Background: `var(--color-background)` - White

### Shadows
- Normal: `var(--shadow-elevation-sm)`
- Hover: `var(--shadow-elevation-md)`
- Sidebar: `var(--shadow-elevation-lg)`

### Transitions
- Duration: `var(--transition-default)` - 150ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## 🔄 Switching Builders

### To Switch:
Click the **"Modern"** or **"Classic"** button in the header (top-right)

### When to Switch:
- **To Modern**: Cleaner interface, faster performance
- **To Classic**: Need specific features, familiar interface

### Your Work is Safe:
- Switching doesn't lose changes
- Same dashboard data
- Just different editing interface

## ✅ Checklist Before Saving

- [ ] Dashboard has a name
- [ ] At least one section added
- [ ] Section widths make sense
- [ ] Order is logical
- [ ] Previewed the dashboard
- [ ] Checked on different screen sizes (if needed)

## 🚀 Next Steps

1. **Try it**: Create a test dashboard
2. **Explore**: Hover, click, drag everything
3. **Compare**: Switch to Classic and back
4. **Feedback**: Note what you like/dislike
5. **Report**: Share findings for improvements

---

**Questions?** Check the full [MODERN_BUILDER_TESTING_GUIDE.md](./MODERN_BUILDER_TESTING_GUIDE.md)
