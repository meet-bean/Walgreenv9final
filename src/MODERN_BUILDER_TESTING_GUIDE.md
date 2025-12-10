# Modern Dashboard Builder - Testing Guide

## 🎯 What's New

We've created a completely reimagined dashboard builder (`ModernDashboardBuilder.tsx`) with:
- Simpler, cleaner interface
- Responsive 4-column grid system
- Hover-based controls
- Smooth drag & drop animations
- Better visual feedback
- Full design system integration

## 🧪 How to Test

### Quick Start
1. **Log in** to the application
2. **Navigate to Dashboard Manager** (wrench icon in header)
3. **Click "Create Dashboard"** or **Edit an existing dashboard**
4. You'll see a **toggle button** in the top-right header that says **"Modern"** or **"Classic"**

### Toggle Between Builders
- **Modern Builder** (default): Click the button when it says "Classic" to switch to modern
- **Classic Builder**: Click the button when it says "Modern" to switch back to classic
- The toggle only appears when you're editing/creating a dashboard

### Testing the Modern Builder

#### 1️⃣ **Create a New Dashboard**
```
Dashboard Manager → Create Dashboard → Create from Scratch
```
- ✅ Check: Name and description inputs are at the top
- ✅ Check: Empty state shows centered message with "Add First Section" button

#### 2️⃣ **Add Sections**
- Click **"Add First Section"** button (or the floating **+** button if sections exist)
- ✅ Check: Sidebar slides in from the right with all section types
- ✅ Check: Each section shows icon, name, and description
- Click any section type to add it
- ✅ Check: Section appears in the grid at full width (4 columns)
- ✅ Check: Toast notification confirms addition

#### 3️⃣ **Hover Controls**
Hover over any section card in edit mode:
- ✅ Check: Gray control bar appears at the top
- ✅ Check: Shows drag handle (grip icon), section name
- ✅ Check: Shows width buttons (1, 2, 3, 4)
- ✅ Check: Shows duplicate and delete buttons
- ✅ Check: Card border changes to blue
- ✅ Check: Card gets subtle shadow elevation

#### 4️⃣ **Width Adjustment**
- Hover over a section
- Click the width buttons **1**, **2**, **3**, or **4**
- ✅ Check: Section immediately resizes
- ✅ Check: Other sections reflow in the grid
- ✅ Check: Active width button is highlighted in blue

#### 5️⃣ **Drag & Drop**
- Hover over a section to see the drag handle
- Click and drag the grip icon (or anywhere on the control bar)
- ✅ Check: Section becomes semi-transparent while dragging
- ✅ Check: Drop zones show visual feedback (blue dashed border)
- ✅ Check: Sections reorder when you drop
- ✅ Check: Smooth animations during reordering

#### 6️⃣ **Duplicate Section**
- Hover over a section
- Click the **copy icon** button
- ✅ Check: New section appears at the end with "(Copy)" in the title
- ✅ Check: Toast confirms duplication

#### 7️⃣ **Remove Section**
- Hover over a section
- Click the **trash icon** button
- ✅ Check: Section is removed immediately
- ✅ Check: Toast confirms removal
- ✅ Check: Grid reflows smoothly

#### 8️⃣ **Preview Mode**
- Click **"Preview"** button in the header
- ✅ Check: All builder controls disappear
- ✅ Check: Sections show exactly as end users will see them
- ✅ Check: No hover effects on sections
- ✅ Check: Button changes to "Edit Mode"
- Click **"Edit Mode"** to return to editing

#### 9️⃣ **Responsive Grid**
Try different combinations:
- Add 4 sections at width 1 (should be in one row)
- Add 2 sections at width 2 (should be in one row)
- Add 1 section at width 3 and 1 at width 1 (should be in one row)
- Mix different widths
- ✅ Check: Grid automatically wraps to new rows
- ✅ Check: Sections maintain their widths

#### 🔟 **Save & Publish**
- Add dashboard name (required)
- Add at least one section
- Click **"Save"** or **"Publish"**
- ✅ Check: Buttons are disabled when name is empty or no sections
- ✅ Check: Success toast appears
- ✅ Check: Returns to dashboard manager

## 🔄 Compare with Classic Builder

Switch to the **Classic Builder** and notice:
- More complex interface with BuilderPreviewWrapper
- Different drag & drop behavior
- More controls visible at once
- Different layout system

Then switch back to **Modern Builder** to see the improvements.

## 🎨 Design System Verification

The Modern Builder uses **all CSS variables** from `/styles/globals.css`:

### Colors
- Background: `var(--color-background)`
- Cards: `var(--color-card)`
- Borders: `var(--color-border)`
- Primary: `var(--color-primary)`
- Muted: `var(--color-muted)`
- Chart colors for visual feedback

### Spacing
- All gaps: `var(--spacing-*)` and `var(--grid-gap)`
- All padding: `var(--spacing-*)`
- Consistent spacing throughout

### Typography
- Font family: `var(--font-family-inter)`
- Font sizes: `var(--text-label)`, `var(--text-detail)`, etc.
- Font weights: `var(--font-weight-medium)`, etc.

### Other Design Tokens
- Border radius: `var(--radius-md)`
- Shadows: `var(--shadow-elevation-sm/md/lg)`
- Transitions: `var(--transition-default)`

### Test Design System
1. Open `/styles/globals.css`
2. Change `--color-primary` to a different color (e.g., `rgba(0, 150, 255, 1.00)`)
3. Refresh the app
4. ✅ Check: All primary buttons, active states, and accents update

## 🐛 What to Look For

### Expected Behavior ✅
- Smooth animations when dragging, resizing, adding/removing
- Instant visual feedback on all interactions
- No layout jumps or flickers
- Consistent spacing and alignment
- Clean hover states

### Potential Issues 🚨
- Sections not reordering correctly when dragged
- Width buttons not working
- Grid layout breaking with certain width combinations
- Hover controls not appearing
- Animations feeling jerky or slow
- Design system variables not applying

## 📊 Performance

The Modern Builder should feel **fast and responsive**:
- Hover states: < 50ms
- Width changes: Instant
- Drag feedback: Real-time
- Add/remove: < 100ms

## 🔧 Switching Default

Currently, the Modern Builder is the **default** (`useModernBuilder` starts as `true`).

To make Classic the default:
```tsx
// In MainApp.tsx, line ~49
const [useModernBuilder, setUseModernBuilder] = useState(false); // Changed to false
```

## 💡 Tips for Testing

1. **Create multiple dashboards** - Test with different section combinations
2. **Test on different screen sizes** - The grid is responsive
3. **Try rapid interactions** - Click buttons quickly, drag multiple times
4. **Test edge cases** - One section, many sections, all same width, all different widths
5. **Switch between modes often** - Preview ↔ Edit to ensure state is maintained

## 🎓 Next Steps

After testing:
1. **Provide feedback** - What works well? What needs improvement?
2. **Report issues** - Any bugs or unexpected behavior?
3. **Suggest enhancements** - Missing features from the classic builder?
4. **Make it permanent** - Once satisfied, we can remove the classic builder

## 📝 Feedback Template

```
### What I Tested
- [ ] Adding sections
- [ ] Drag & drop
- [ ] Width controls
- [ ] Duplicate/Delete
- [ ] Preview mode
- [ ] Save/Publish

### What Works Great
- 

### Issues Found
- 

### Suggestions
- 
```

Happy testing! 🚀
