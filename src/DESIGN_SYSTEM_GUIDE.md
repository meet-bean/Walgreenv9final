# Design System Integration Guide

This guide explains how to use the design system variables defined in `/styles/globals.css` to ensure consistent styling across the application.

## 🎯 Quick Token Reference - "Which One is Which?"

### 🎨 **Color Tokens - At a Glance**

**Base Colors** (backgrounds and surfaces):
- `--background` → Main app background (white in light mode)
- `--foreground` → Main text color on backgrounds
- `--card` → Cards, modals, containers
- `--card-foreground` → Text on cards
- `--popover` → Dropdowns, tooltips
- `--popover-foreground` → Text in dropdowns

**Brand Colors** (your main colors):
- `--primary` → **Most Important!** Main brand color (red/coral) - buttons, links, CTAs
- `--primary-foreground` → Text that appears on primary buttons
- `--secondary` → Secondary actions (lighter pink)
- `--accent` → Highlights and accents

**State Colors** (feedback):
- `--color-success` → Green - completed, success ✅
- `--color-warning` → Orange - caution, warnings ⚠️
- `--color-error` → Red - errors, validation ❌
- `--color-info` → Blue/brand - informational ℹ️
- `--destructive` → Dark red - delete actions 🗑️
- `--muted` → Gray - disabled, subtle backgrounds
- `--muted-foreground` → Gray text - labels, secondary text

**UI Elements**:
- `--border` → All border colors
- `--input` → Input field backgrounds
- `--ring` → Focus outlines (that blue ring when you click)

**Chart Colors**:
- `--chart-1` through `--chart-5` → Blue, Green, Orange, Red, Purple

---

### 📏 **Spacing Tokens - At a Glance**

**Numeric Scale** (most commonly used):
- `--spacing-1` = 4px → Tiny gaps
- `--spacing-2` = 8px → Small gaps (very common!)
- `--spacing-3` = 12px → Medium-small
- `--spacing-4` = 16px → **Most used spacing!**
- `--spacing-6` = 24px → Large sections
- `--spacing-8` = 32px → Extra large

**T-Shirt Sizes** (semantic):
- `--spacing-xs` = 8px
- `--spacing-sm` = 12px
- `--spacing-md` = 16px
- `--spacing-lg` = 24px
- `--spacing-xl` = 32px

**Special Purpose**:
- `--grid-gap` → Gap between dashboard sections
- `--spacing-section` → Standard section spacing

---

### 🔤 **Typography Tokens - At a Glance**

**Headings** (big to small):
- `--text-h1` = 48px → Page titles
- `--text-h2` = 30px → Section headers
- `--text-h3` = 24px → Subsections
- `--text-h4` = 20px → Card titles

**Body Text**:
- `--text-base` = 16px → **Default paragraph text**
- `--text-large` = 18px → Emphasized text
- `--text-label` = 14px → Form labels
- `--text-detail` = 12px → Captions, small text

**Font Weights**:
- `--font-weight-regular` = 400 → Normal text
- `--font-weight-medium` = 500 → Slightly bold
- `--font-weight-semibold` = 600 → **Most used for emphasis**
- `--font-weight-bold` = 700 → Bold
- `--font-weight-extrabold` = 800 → Extra bold headings

---

### ☁️ **Shadow Tokens**
- `--elevation-sm` → Subtle shadow for cards
- `--elevation-md` → Standard card shadow
- `--elevation-lg` → Modal, overlay shadows

---

### ⚪ **Border Radius**
- `--radius` = 6px → **Default roundness** for everything

---

### ⚡ **Transitions**
- `--transition-default` → Standard animation speed

---

## 💡 **Most Used Tokens - Start Here!**

If you're new, these are the tokens you'll use 90% of the time:

1. **`--primary`** - Your main brand color
2. **`--spacing-4`** - Standard spacing (16px)
3. **`--text-base`** - Body text size
4. **`--border`** - Border colors
5. **`--radius`** - Border roundness
6. **`--muted-foreground`** - Secondary text color

---

## Typography

### Font Sizes
All typography should use the CSS variables defined in the design system:

```tsx
// ✅ CORRECT - Using design system variables
<h1>Dashboard Title</h1>  // Automatically uses var(--text-h1)
<p>Regular text</p>        // Automatically uses var(--text-base)

// For inline styles when needed:
<span style={{ fontSize: 'var(--text-detail)' }}>Small text</span>
<div style={{ fontSize: 'var(--text-h3)' }}>Custom heading</div>

// ❌ AVOID - Hardcoded Tailwind classes
<h1 className="text-4xl">Title</h1>
<p className="text-sm">Text</p>
```

### Available Typography Variables
- `--text-h1`: 48px - Main page titles
- `--text-h2`: 30px - Section headers
- `--text-h3`: 24px - Subsection headers
- `--text-h4`: 20px - Card titles
- `--text-large`: 18px - Emphasized text
- `--text-base`: 16px - Body text (default for `<p>`)
- `--text-label`: 14px - Form labels
- `--text-detail`: 12px - Small text, captions
- `--text-section-title`: 14px - Section titles

### Font Weights
- `--font-weight-regular`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700
- `--font-weight-extrabold`: 800

### Utility Classes
Use semantic utility classes for typography:

```tsx
<p className="text-detail">Small caption text</p>
<div className="text-large">Emphasized content</div>
<span className="text-section-title">Section Header</span>
```

## Colors

### Semantic Colors
Use semantic color variables instead of hardcoded colors:

```tsx
// ✅ CORRECT - Using semantic colors
<div style={{ color: 'var(--color-foreground)' }}>Main text</div>
<div style={{ color: 'var(--color-muted-foreground)' }}>Secondary text</div>
<div style={{ backgroundColor: 'var(--color-card)' }}>Card background</div>

// ❌ AVOID - Hardcoded colors
<div className="text-gray-900">Text</div>
<div className="bg-blue-50">Background</div>
```

### State Colors
For success, warning, error, and info states:

```tsx
// Success
<div style={{ color: 'var(--color-state-success)' }}>✓ Success</div>
<div style={{ backgroundColor: 'var(--color-state-success-light)' }}>Light background</div>

// Warning
<div style={{ color: 'var(--color-state-warning)' }}>⚠ Warning</div>
<div style={{ backgroundColor: 'var(--color-state-warning-light)' }}>Light background</div>

// Error
<div style={{ color: 'var(--color-state-error)' }}>✗ Error</div>
<div style={{ backgroundColor: 'var(--color-state-error-light)' }}>Light background</div>

// Info
<div style={{ color: 'var(--color-state-info)' }}>ℹ Info</div>
<div style={{ backgroundColor: 'var(--color-state-info-light)' }}>Light background</div>
```

### Chart Colors
For data visualization:

```tsx
// Use chart variables for consistent chart colors
<Bar fill="var(--color-chart-1)" />  // Blue
<Bar fill="var(--color-chart-2)" />  // Green
<Bar fill="var(--color-chart-3)" />  // Orange
<Bar fill="var(--color-chart-4)" />  // Red
<Bar fill="var(--color-chart-5)" />  // Purple
```

### Utility Classes
```tsx
<span className="text-foreground">Main text color</span>
<span className="text-muted">Secondary text</span>
<span className="text-success">Success text</span>
<span className="text-warning">Warning text</span>
<span className="text-error">Error text</span>
<span className="text-info">Info text</span>

<div className="bg-success-light">Success background</div>
<div className="bg-warning-light">Warning background</div>
<div className="bg-error-light">Error background</div>
<div className="bg-info-light">Info background</div>
```

## Spacing

### Spacing Scale
Use the consistent spacing scale:

```tsx
// ✅ CORRECT - Using spacing variables
<div style={{ padding: 'var(--spacing-4)' }}>Content</div>
<div style={{ margin: 'var(--spacing-6)' }}>Content</div>
<div style={{ gap: 'var(--spacing-2)' }}>Content</div>

// ❌ AVOID - Hardcoded spacing
<div className="p-4">Content</div>
<div className="gap-2">Content</div>
```

### Available Spacing Variables
- `--spacing-1`: 0.25rem (4px)
- `--spacing-2`: 0.5rem (8px)
- `--spacing-3`: 0.75rem (12px)
- `--spacing-4`: 1rem (16px)
- `--spacing-5`: 1.25rem (20px)
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)
- `--spacing-10`: 2.5rem (40px)
- `--spacing-12`: 3rem (48px)
- `--spacing-16`: 4rem (64px)
- `--spacing-20`: 5rem (80px)
- `--spacing-24`: 6rem (96px)

### Utility Classes
```tsx
<div className="gap-system-2">Flex with 8px gap</div>
<div className="gap-system-4">Flex with 16px gap</div>
<div className="p-system-6">24px padding</div>
<div className="px-system-4 py-system-6">Mixed padding</div>
<div className="mt-system-2 mb-system-3">Margin utilities</div>
```

### Common Spacing Patterns
```tsx
// Card padding
<CardContent style={{ padding: 'var(--spacing-6)' }}>

// Button gap
<Button style={{ gap: 'var(--spacing-2)' }}>

// Section spacing
<div style={{ marginBottom: 'var(--spacing-8)' }}>

// Grid gap
<div className="grid" style={{ gap: 'var(--spacing-4)' }}>
```

## Border Radius

```tsx
// ✅ CORRECT
<div style={{ borderRadius: 'var(--radius)' }}>Default radius</div>
<div style={{ borderRadius: 'var(--radius-lg)' }}>Large radius</div>

// Utility classes
<div className="rounded-system">Default radius</div>
<div className="rounded-system-lg">Large radius</div>
<div className="rounded-system-xl">Extra large radius</div>

// ❌ AVOID
<div className="rounded-lg">Content</div>
```

## Shadows

```tsx
// ✅ CORRECT
<div style={{ boxShadow: 'var(--shadow-elevation-sm)' }}>Card</div>
<div style={{ boxShadow: 'var(--shadow-elevation-md)' }}>Modal</div>

// Utility classes
<div className="shadow-system-sm">Small shadow</div>
<div className="shadow-system-md">Medium shadow</div>
<div className="shadow-system-lg">Large shadow</div>

// ❌ AVOID
<div className="shadow-md">Content</div>
```

## Borders

```tsx
// ✅ CORRECT
<div style={{ borderColor: 'var(--color-border)' }}>Default border</div>

// Utility class
<div className="border border-system">Default border</div>
<div className="border-2 border-chart-1">Blue accent border</div>

// ❌ AVOID
<div className="border-gray-300">Content</div>
```

## Complete Component Examples

### Example 1: Metric Tile
```tsx
<Card 
  className="border-2" 
  style={{ 
    backgroundColor: 'var(--color-state-info-light)', 
    borderColor: 'var(--color-chart-1)' 
  }}
>
  <CardContent style={{ padding: 'var(--spacing-6)' }}>
    <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
      <span style={{ fontSize: 'var(--text-h3)' }}>📊</span>
      <p className="text-detail" style={{ color: 'var(--color-muted-foreground)' }}>
        Performance
      </p>
    </div>
    <p style={{ fontSize: 'var(--text-h2)', color: 'var(--color-foreground)' }}>
      95.4%
    </p>
  </CardContent>
</Card>
```

### Example 2: Alert Message
```tsx
<div 
  className="border-2 rounded-system-lg p-system-4"
  style={{ 
    backgroundColor: 'var(--color-state-warning-light)',
    borderColor: 'var(--color-state-warning)'
  }}
>
  <p className="text-detail" style={{ color: 'var(--color-foreground)' }}>
    Warning: Performance below target
  </p>
</div>
```

### Example 3: Button with Icon
```tsx
<Button style={{ gap: 'var(--spacing-2)' }}>
  <Save className="h-4 w-4" />
  Save Changes
</Button>
```

## Migration Checklist

When updating existing components:

- [ ] Replace hardcoded font sizes with typography variables or semantic classes
- [ ] Replace color classes (`text-gray-600`, `bg-blue-50`) with CSS variables
- [ ] Replace spacing classes (`gap-2`, `p-4`) with spacing variables
- [ ] Replace border radius classes with `--radius` variables
- [ ] Replace shadow classes with `--elevation` variables
- [ ] Use semantic state colors for success/warning/error states
- [ ] Use chart colors for data visualization
- [ ] Test in both light and dark modes

## Benefits

1. **Consistency**: All components use the same design tokens
2. **Maintainability**: Update colors/spacing in one place
3. **Theming**: Easy to create theme variants
4. **Dark Mode**: Automatic support via CSS variable overrides
5. **Accessibility**: Consistent spacing and color contrast
6. **Design System Alignment**: Matches team's design specifications

## Tools & Resources

- Main design tokens: `/styles/globals.css`
- Utility classes: Available in the `@layer utilities` section
- Component examples: See updated `GridCanvas.tsx` and `DashboardRenderer.tsx`
