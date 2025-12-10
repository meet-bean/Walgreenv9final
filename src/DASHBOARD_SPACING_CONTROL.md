# Dashboard Spacing Control Guide 🎯

## Quick Spacing Adjustment

Want to make sections **tighter** or **more spacious**? Just edit **two CSS variables** in `/styles/globals.css`:

```css
/* Dashboard Grid Spacing - Adjust these to control section tightness */
--grid-gap: 1rem;        /* Gap between dashboard sections */
--grid-outer-gap: 1rem;  /* Gap between filters/title/grid */
```

## Preset Spacing Options

### Extra Tight (Cramped)
```css
--grid-gap: 0.5rem;       /* 8px - minimal breathing room */
--grid-outer-gap: 0.5rem; /* 8px */
```

### Tight (Current Default) ✅
```css
--grid-gap: 1rem;         /* 16px - compact but not cramped */
--grid-outer-gap: 1rem;   /* 16px */
```

### Comfortable
```css
--grid-gap: 1.25rem;      /* 20px - balanced spacing */
--grid-outer-gap: 1.25rem; /* 20px */
```

### Spacious
```css
--grid-gap: 1.5rem;       /* 24px - generous whitespace */
--grid-outer-gap: 1.5rem; /* 24px */
```

### Very Spacious
```css
--grid-gap: 2rem;         /* 32px - lots of breathing room */
--grid-outer-gap: 2rem;   /* 32px */
```

## What Each Variable Controls

### `--grid-gap`
**Controls spacing BETWEEN dashboard sections**
- Horizontal gap between side-by-side sections
- Vertical gap between stacked sections
- Applied to the 12-column grid layout

**Used in:**
- BuilderPreviewWrapper grid (line 573)
- DashboardRenderer normal view grid (line 2894)
- DashboardRenderer builder mode grid (line 2857)

### `--grid-outer-gap`
**Controls spacing BETWEEN major dashboard elements**
- Space between breadcrumb and filters
- Space between filters and title
- Space between title and grid
- Space between grid and bottom of page

**Used in:**
- BuilderPreviewWrapper outer container (line 500, 546)
- DashboardRenderer outer containers (lines 2833, 2870)

## How to Change Spacing

### Option 1: Edit CSS Directly (Recommended)
1. Open `/styles/globals.css`
2. Find lines with `--grid-gap` and `--grid-outer-gap`
3. Change the values (e.g., `1rem` → `0.75rem` for tighter, `1.5rem` for looser)
4. Save and refresh - changes apply instantly!

### Option 2: Use Existing CSS Variables
You can reference any spacing variable from your design system:

```css
--grid-gap: var(--spacing-3);  /* 0.75rem - extra tight */
--grid-gap: var(--spacing-4);  /* 1rem - tight (current) */
--grid-gap: var(--spacing-5);  /* 1.25rem - comfortable */
--grid-gap: var(--spacing-6);  /* 1.5rem - spacious */
```

## Available Spacing Scale

Your design system includes these spacing values:

| Variable | Value | Pixels (at 16px base) |
|---|---|---|
| `--spacing-1` | 0.25rem | 4px |
| `--spacing-2` | 0.5rem | 8px |
| `--spacing-3` | 0.75rem | 12px |
| `--spacing-4` | 1rem | **16px** (current) |
| `--spacing-5` | 1.25rem | 20px |
| `--spacing-6` | 1.5rem | 24px |
| `--spacing-8` | 2rem | 32px |
| `--spacing-10` | 2.5rem | 40px |
| `--spacing-12` | 3rem | 48px |

## Visual Guide

```
╔═══════════════════════════════════╗
║  Breadcrumb                       ║
╠═══════════════════════════════════╣  ← grid-outer-gap
║  Filters                          ║
╠═══════════════════════════════════╣  ← grid-outer-gap
║  Dashboard Title                  ║
╠═══════════════════════════════════╣  ← grid-outer-gap
║ ┌─────────────┐  ┌─────────────┐ ║
║ │  Section 1  │→ │  Section 2  │ ║  ← grid-gap (horizontal)
║ └─────────────┘  └─────────────┘ ║
║        ↓ grid-gap (vertical)      ║
║ ┌─────────────┐  ┌─────────────┐ ║
║ │  Section 3  │  │  Section 4  │ ║
║ └─────────────┘  └─────────────┘ ║
╚═══════════════════════════════════╝
```

## Why This Approach?

✅ **Centralized control** - Change spacing in one place, updates everywhere
✅ **Design system adherence** - Uses CSS variables from your design system
✅ **Perfect consistency** - Builder and published dashboards always match
✅ **No code changes needed** - Just edit CSS variables
✅ **Instant feedback** - Changes apply immediately without rebuilding

## Common Issues

### Sections still feel too spaced out?
- Try `--grid-gap: 0.75rem` (12px) for extra tight
- Check if sections have internal padding (in Card components)

### Sections feel cramped?
- Try `--grid-gap: 1.5rem` (24px) for more breathing room
- Ensure section content has appropriate internal padding

### Filters too close to title?
- Adjust `--grid-outer-gap` independently from `--grid-gap`
- They can have different values!

## Files That Use These Variables

- ✅ `/components/BuilderPreviewWrapper.tsx` - Builder preview grid system
- ✅ `/components/DashboardRenderer.tsx` - Published dashboard rendering
- ✅ `/styles/globals.css` - Variable definitions

**All spacing is now controlled by your design system!** 🎨
