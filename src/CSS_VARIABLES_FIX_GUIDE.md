# CSS Variables Fix Guide

## Issue
The ModernDashboardBuilder.tsx file uses incorrect CSS variable names with a `--color-` prefix that doesn't exist in `/styles/globals.css`.

## Correct Variable Names (from globals.css)

Replace these incorrect variables:
- `--color-background` → `--background`
- `--color-foreground` → `--foreground`
- `--color-card` → `--card`
- `--color-muted` → `--muted`
- `--color-muted-foreground` → `--muted-foreground`
- `--color-border` → `--border`
- `--color-primary` → `--primary`
- `--color-primary-foreground` → `--primary-foreground`
- `--color-chart-1` → `--chart-1`

## Files Affected
1. `/components/ModernDashboardBuilder.tsx` - 39 occurrences need fixing

## Find and Replace Commands

For ModernDashboardBuilder.tsx, perform these replacements:

```
'var(--color-background)' → 'var(--background)'
'var(--color-foreground)' → 'var(--foreground)'
'var(--color-card)' → 'var(--card)'
'var(--color-muted)' → 'var(--muted)'
'var(--color-muted-foreground)' → 'var(--muted-foreground)'
'var(--color-border)' → 'var(--border)'
'var(--color-primary)' → 'var(--primary)'
'var(--color-primary-foreground)' → 'var(--primary-foreground)'
'var(--color-chart-1)' → 'var(--chart-1)'
```

## Status
✅ MainApp.tsx - Fixed  
⚠️ ModernDashboardBuilder.tsx - Needs fixing (39 occurrences)

## Testing After Fix
1. Create a new dashboard
2. Verify all colors render correctly
3. Check hover states on sections
4. Verify buttons and borders use correct colors
5. Test preview mode UI colors
