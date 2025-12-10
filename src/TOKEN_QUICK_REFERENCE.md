# 🎨 Design Tokens - Quick Reference Guide

## "Which Token is Which?" - The Essential Guide

This is your go-to reference for understanding what each CSS variable/token does in your design system.

---

## 🏆 **TOP 10 MOST USED TOKENS**

Start with these - they're used everywhere:

1. **`--primary`** → Your main brand color (red/coral) - use for buttons, links, CTAs
2. **`--spacing-4`** → 16px spacing - the standard gap size
3. **`--text-base`** → 16px - default body text size
4. **`--border`** → Border color for all UI elements
5. **`--radius`** → 6px - default corner roundness
6. **`--muted-foreground`** → Gray text for labels and secondary content
7. **`--background`** → Main page background color
8. **`--foreground`** → Main text color
9. **`--card`** → Background for cards and containers
10. **`--spacing-2`** → 8px spacing - for tight layouts

---

## 🎨 **COLORS - Complete Guide**

### Base & Surface Colors
```
--background          → 🏠 Main app background (white/dark)
--foreground          → ✏️ Main text color
--card                → 🃏 Cards, modals, panels
--card-foreground     → ✏️ Text on cards
--popover             → 💬 Dropdown menus, tooltips
--popover-foreground  → ✏️ Text in dropdowns
```

### Brand Colors (Your Identity)
```
--primary                → ⭐ MAIN BRAND COLOR (buttons, links, CTAs)
--primary-foreground     → ✏️ White text on primary buttons
--secondary              → 🔷 Secondary actions (lighter)
--secondary-foreground   → ✏️ Text on secondary elements
--accent                 → ✨ Accent highlights
--accent-foreground      → ✏️ Text on accents
```

### State & Feedback Colors
```
--color-success       → ✅ Green - completed, success
--color-success-light → 💚 Light green backgrounds
--color-warning       → ⚠️ Orange - warnings, caution
--color-warning-light → 💛 Light orange backgrounds
--color-error         → ❌ Red - errors, failed
--color-error-light   → ❤️ Light red backgrounds
--color-info          → ℹ️ Blue - informational
--color-info-light    → 💙 Light blue backgrounds
--destructive         → 🗑️ Dark red - delete actions
--destructive-foreground → ✏️ Text on delete buttons
```

### Neutral & Muted
```
--muted             → 🔇 Subtle gray backgrounds
--muted-foreground  → 🔇 MOST USED! Gray text for labels, captions
```

### UI Elements
```
--border          → 📦 All border colors
--input           → 📝 Input field background (filled state)
--input-background → 📝 Input field background (empty)
--ring            → 🎯 Focus rings (blue outline when clicked)
```

### Chart Colors
```
--chart-1  → 📊 Blue    (59, 130, 246)
--chart-2  → 📊 Green   (16, 185, 129)
--chart-3  → 📊 Orange  (245, 158, 11)
--chart-4  → 📊 Red     (239, 68, 68)
--chart-5  → 📊 Purple  (168, 85, 247)
```

### Sidebar
```
--sidebar                    → 📂 Sidebar background
--sidebar-foreground         → ✏️ Sidebar text
--sidebar-primary            → ⭐ Active sidebar items
--sidebar-primary-foreground → ✏️ Text on active items
--sidebar-accent             → ✨ Hover state
--sidebar-accent-foreground  → ✏️ Text on hover
--sidebar-border             → 📦 Sidebar borders
--sidebar-ring               → 🎯 Sidebar focus
```

---

## 📏 **SPACING - Complete Guide**

### Numeric Scale (Recommended - Consistent!)
```
--spacing-1   → 4px   🔸 Tiny gaps (icons, badges)
--spacing-2   → 8px   🔸 Small gaps (very common!)
--spacing-3   → 12px  🔸 Medium-small
--spacing-4   → 16px  🔸 STANDARD SPACING (most used!)
--spacing-5   → 20px  🔸 Medium-large
--spacing-6   → 24px  🔸 Large sections
--spacing-8   → 32px  🔸 Extra large
--spacing-10  → 40px  🔸 2XL
--spacing-12  → 48px  🔸 3XL
--spacing-16  → 64px  🔸 4XL
--spacing-20  → 80px  🔸 5XL
--spacing-24  → 96px  🔸 6XL (huge gaps)
```

### T-Shirt Sizes (Semantic Names)
```
--spacing-xs  → 8px   (same as spacing-2)
--spacing-sm  → 12px  (same as spacing-3)
--spacing-md  → 16px  (same as spacing-4)
--spacing-lg  → 24px  (same as spacing-6)
--spacing-xl  → 32px  (same as spacing-8)
--spacing-2xl → 40px  (same as spacing-10)
```

### Special Purpose
```
--spacing-section  → 24px - Standard section padding
--grid-gap         → 16px - Gap between dashboard widgets
--grid-outer-gap   → 16px - Gap between dashboard areas
```

**💡 Pro Tip:** Use numeric scale (spacing-1 to spacing-24) for consistency. T-shirt sizes are aliases for convenience.

---

## 🔤 **TYPOGRAPHY - Complete Guide**

### Font Sizes - Headings
```
--text-h1  → 48px  📏 Huge page titles
--text-h2  → 30px  📏 Section headers
--text-h3  → 24px  📏 Subsection headers
--text-h4  → 20px  📏 Card/component titles
```

### Font Sizes - Body Text
```
--text-large  → 18px  📏 Emphasized text
--text-base   → 16px  📏 DEFAULT body text (most used!)
--text-label  → 14px  📏 Form labels
--text-detail → 12px  📏 Captions, small text
```

### Font Sizes - Special
```
--text-table-head    → 16px  📏 Table headers
--text-section-title → 14px  📏 Section titles
--font-size          → 16px  📏 Root font size
```

### Font Weights
```
--font-weight-regular   → 400  💪 Normal text
--font-weight-medium    → 500  💪 Slightly emphasized
--font-weight-semibold  → 600  💪 MOST USED for emphasis!
--font-weight-bold      → 700  💪 Strong emphasis
--font-weight-extrabold → 800  💪 Extra strong (headings)
```

### Font Family
```
--font-family-inter  → 'Inter', sans-serif  🔤 The only font we use!
```

**💡 Pro Tip:** HTML elements like `<h1>`, `<p>`, `<label>` automatically use the right sizes. Only override when needed!

---

## ☁️ **SHADOWS (Elevation)**

```
--elevation-sm  → Small shadow   - Subtle cards, hover states
--elevation-md  → Medium shadow  - Standard cards, dropdowns  
--elevation-lg  → Large shadow   - Modals, important overlays
```

**Example values:**
```css
--elevation-sm: 0px 4px 6px 0px rgba(0, 0, 0, 0.09);
--elevation-md: 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05);
--elevation-lg: 0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## ⚪ **BORDER RADIUS**

```
--radius  → 6px  ⚪ Default roundness for EVERYTHING (buttons, cards, inputs)
```

**💡 Pro Tip:** We use one radius value for consistency. All components share the same corner roundness.

---

## ⚡ **TRANSITIONS & ANIMATIONS**

```
--transition-default  → 150ms cubic-bezier(0.4, 0, 0.2, 1)  ⚡ Standard animation speed
--hover-overlay       → rgba(0, 0, 0, 0.05)                 🎨 Hover darkness overlay
--focus-ring-width    → 2px                                  🎯 Focus ring thickness
```

---

## 🎯 **COMMON USE CASES**

### "I want to style a button"
```tsx
<button style={{
  backgroundColor: 'var(--primary)',        // Brand color
  color: 'var(--primary-foreground)',       // White text
  padding: 'var(--spacing-2) var(--spacing-4)', // 8px top/bottom, 16px left/right
  borderRadius: 'var(--radius)',            // Rounded corners
  fontSize: 'var(--text-base)',             // Standard text size
  fontWeight: 'var(--font-weight-medium)'   // Slightly bold
}}>
  Click Me
</button>
```

### "I want to create a card"
```tsx
<div style={{
  backgroundColor: 'var(--card)',
  color: 'var(--card-foreground)',
  padding: 'var(--spacing-4)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--elevation-sm)'
}}>
  Card content
</div>
```

### "I want spacing between elements"
```tsx
<div style={{ 
  display: 'flex', 
  gap: 'var(--spacing-4)'  // 16px gap between items
}}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### "I want gray secondary text"
```tsx
<p style={{ color: 'var(--muted-foreground)' }}>
  This is secondary text
</p>
```

### "I want a success message"
```tsx
<div style={{
  backgroundColor: 'var(--color-success-light)',
  color: 'var(--color-success)',
  padding: 'var(--spacing-3)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-success)'
}}>
  ✅ Success! Your changes were saved.
</div>
```

---

## 🔍 **HOW TO FIND THE RIGHT TOKEN**

### By Purpose:
- **Main colors?** → Look at `--primary`, `--secondary`, `--accent`
- **Text colors?** → Look at `*-foreground` tokens
- **Spacing?** → Use `--spacing-4` as default, adjust as needed
- **Shadows?** → Use `--elevation-md` for most cards
- **Text size?** → Use `--text-base` for body, `--text-h*` for headings
- **State/feedback?** → Look at `--color-success/warning/error`

### By Pattern:
- `--*-foreground` → Text that goes ON TOP of that color
- `--spacing-*` → Gaps, padding, margins
- `--text-*` → Font sizes
- `--font-weight-*` → Text boldness
- `--color-*-light` → Light background versions of colors
- `--chart-*` → Data visualization colors

---

## 🛠️ **USING THE DESIGN SYSTEM EDITOR**

1. Click the 🎨 **Paintbrush icon** in the header
2. Go to **"All Tokens"** tab
3. Each token has:
   - **Emoji icon** showing its type
   - **Description** explaining what it does
   - **Visual preview** (for colors, shadows, spacing)
   - **Live editing** - changes apply instantly!
4. **Hover over tokens** to highlight all UI elements using them
5. Use the **search bar** to find specific tokens
6. Use the **category filter** to narrow by type

---

## 📚 **ADDITIONAL RESOURCES**

- **Full Design System Guide:** See `/DESIGN_SYSTEM_GUIDE.md`
- **Design System Editor:** Click 🎨 paintbrush in app header
- **CSS Variables File:** See `/styles/globals.css`

---

## 💡 **FINAL TIPS**

1. **When in doubt, use:**
   - `--primary` for brand color
   - `--spacing-4` for spacing
   - `--text-base` for text
   - `--muted-foreground` for secondary text

2. **Don't hardcode values!** Always use CSS variables so changes propagate everywhere.

3. **Use the hover feature** in the Design System Editor to see which elements use which tokens.

4. **The emoji icons help identify token types:**
   - 🎨 = Colors
   - 📏 = Spacing/sizes
   - 🔤 = Typography
   - ☁️ = Shadows
   - ⚡ = Transitions

5. **Most tokens follow naming patterns:**
   - Base color + `-foreground` = text on that color
   - Color + `-light` = lighter background version
   - `spacing-1` through `spacing-24` = consistent scale

---

**Need help?** Open the Design System Editor and click the ℹ️ info button for interactive help!
