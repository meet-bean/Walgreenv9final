# Tailwind to CSS Variables Conversion Guide

## Current Status

All design-system components in `/components/design-system/` have been successfully migrated to use CSS variables with inline styles. However, several application components still use Tailwind utility classes that need to be converted.

## Files Requiring Conversion

### Priority 1: Most Used Components
1. **ModernDashboardBuilder.tsx** - 68+ className instances
2. **MainApp.tsx** - 70+ className instances (previously attempted)

### CSS Variables Available

From `/styles/globals.css`:

#### Colors
- `var(--background)`, `var(--foreground)`
- `var(--card)`, `var(--card-foreground)`
- `var(--primary)`, `var(--primary-foreground)`
- `var(--secondary)`, `var(--secondary-foreground)`
- `var(--muted)`, `var(--muted-foreground)`
- `var(--accent)`, `var(--accent-foreground)`
- `var(--destructive)`, `var(--destructive-foreground)`
- `var(--border)`, `var(--input)`, `var(--ring)`
- `var(--color-success)`, `var(--color-success-light)`
- `var(--color-warning)`, `var(--color-warning-light)`
- `var(--color-error)`, `var(--color-error-light)`
- `var(--color-info)`, `var(--color-info-light)`

#### Spacing
- `var(--spacing-1)` through `var(--spacing-24)`
- `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-md)`, `var(--spacing-lg)`, `var(--spacing-xl)`, `var(--spacing-2xl)`
- `var(--grid-gap)`, `var(--grid-outer-gap)`

#### Border Radius
- `var(--radius)` (6px default)
- `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`, `var(--radius-xl)`

#### Shadows
- `var(--elevation-sm)`, `var(--elevation-md)`, `var(--elevation-lg)`

#### Typography
- Font sizes: `var(--text-h1)` through `var(--text-detail)`
- Font family: `var(--font-family-inter)`
- Font weights: `var(--font-weight-regular)` through `var(--font-weight-extrabold)`

#### Transitions
- `var(--transition-default)`

## Common Tailwind to Inline Style Conversions

### Layout & Flexbox
```tsx
// BEFORE
className="flex items-center justify-between"

// AFTER
style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
```

```tsx
// BEFORE
className="flex flex-col"

// AFTER
style={{ display: 'flex', flexDirection: 'column' }}
```

```tsx
// BEFORE
className="grid grid-cols-2 gap-4"

// AFTER
style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)' }}
```

```tsx
// BEFORE
className="flex-1"

// AFTER
style={{ flex: 1 }}
```

### Spacing
```tsx
// BEFORE
className="space-y-4"

// AFTER (on parent)
style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}

// OR (on children)
style={{ marginBottom: 'var(--spacing-4)' }}
```

```tsx
// BEFORE
className="p-4"

// AFTER
style={{ padding: 'var(--spacing-4)' }}
```

```tsx
// BEFORE
className="px-4 py-2"

// AFTER
style={{ paddingLeft: 'var(--spacing-4)', paddingRight: 'var(--spacing-4)', paddingTop: 'var(--spacing-2)', paddingBottom: 'var(--spacing-2)' }}
```

```tsx
// BEFORE
className="m-4"

// AFTER
style={{ margin: 'var(--spacing-4)' }}
```

### Sizing
```tsx
// BEFORE
className="h-4 w-4"

// AFTER
style={{ height: '16px', width: '16px' }}

// OR for icons
style={{ height: '1rem', width: '1rem' }}
```

```tsx
// BEFORE
className="h-full w-full"

// AFTER
style={{ height: '100%', width: '100%' }}
```

```tsx
// BEFORE
className="w-80"

// AFTER
style={{ width: '320px' }}

// OR
style={{ width: '20rem' }}
```

### Borders & Radius
```tsx
// BEFORE
className="rounded-md"

// AFTER
style={{ borderRadius: 'var(--radius)' }}
```

```tsx
// BEFORE
className="rounded-lg"

// AFTER
style={{ borderRadius: 'var(--radius-lg)' }}
```

```tsx
// BEFORE
className="border-b"

// AFTER
style={{ borderBottom: '1px solid var(--border)' }}
```

### Position
```tsx
// BEFORE
className="absolute top-0 left-0 right-0"

// AFTER
style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
```

```tsx
// BEFORE
className="relative"

// AFTER
style={{ position: 'relative' }}
```

```tsx
// BEFORE
className="inset-0"

// AFTER
style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
```

### Overflow
```tsx
// BEFORE
className="overflow-auto"

// AFTER
style={{ overflow: 'auto' }}
```

```tsx
// BEFORE
className="overflow-hidden"

// AFTER
style={{ overflow: 'hidden' }}
```

### Cursor & Interaction
```tsx
// BEFORE
className="cursor-pointer"

// AFTER
style={{ cursor: 'pointer' }}
```

```tsx
// BEFORE
className="cursor-grab active:cursor-grabbing"

// AFTER
style={{ cursor: 'grab' }}
// Note: active state needs onMouseDown/onMouseUp handlers
```

```tsx
// BEFORE
className="pointer-events-none"

// AFTER
style={{ pointerEvents: 'none' }}
```

### Z-Index
```tsx
// BEFORE
className="z-10"

// AFTER
style={{ zIndex: 10 }}
```

```tsx
// BEFORE
className="z-20"

// AFTER
style={{ zIndex: 20 }}
```

### Transitions
```tsx
// BEFORE
className="transition-all"

// AFTER
style={{ transition: 'all var(--transition-default)' }}
```

## Icon Size Conversions

Lucide React icons (h-* w-* classes):
```tsx
// BEFORE
<Icon className="h-4 w-4" />

// AFTER
<Icon style={{ height: '16px', width: '16px' }} />

// OR use the size prop
<Icon size={16} />
```

Common icon sizes:
- `h-2.5 w-2.5` → `size={10}` or `style={{ height: '10px', width: '10px' }}`
- `h-3 w-3` → `size={12}`
- `h-4 w-4` → `size={16}`
- `h-5 w-5` → `size={20}`
- `h-6 w-6` → `size={24}`
- `h-8 w-8` → `size={32}`

## Conversion Strategy

### Step 1: Identify All className Usage
Search for `className=` in each component file.

### Step 2: Convert in Batches
Convert similar patterns together (e.g., all flex layouts, then all spacing, then all borders).

### Step 3: Test After Each Component
Ensure visual appearance remains identical after conversion.

### Step 4: Remove Empty classNames
After conversion, remove any `className=""` attributes.

## Example: Complete Conversion

### BEFORE
```tsx
<div className="flex flex-col space-y-4">
  <div className="flex items-center justify-between p-4 border-b">
    <h3 className="text-lg font-semibold">Title</h3>
    <Button className="h-8 w-8 p-0">
      <X className="h-4 w-4" />
    </Button>
  </div>
  <div className="flex-1 overflow-auto p-6">
    Content
  </div>
</div>
```

### AFTER
```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border)'
  }}>
    <h3>Title</h3>
    <Button style={{ height: '32px', width: '32px', padding: 0 }}>
      <X size={16} />
    </Button>
  </div>
  <div style={{ flex: 1, overflow: 'auto', padding: 'var(--spacing-6)' }}>
    Content
  </div>
</div>
```

## Notes

1. **Typography**: Don't add font-size, font-weight, or line-height unless specifically requested, as these are handled by the base typography system in globals.css.

2. **Combining Styles**: When a component already has inline styles, merge the new styles with existing ones.

3. **Conditional Classes**: Convert conditional className logic to conditional style objects:
   ```tsx
   // BEFORE
   className={isActive ? "bg-primary" : "bg-secondary"}
   
   // AFTER
   style={{ backgroundColor: isActive ? 'var(--primary)' : 'var(--secondary)' }}
   ```

4. **Multiple Classes**: Break down complex className strings systematically.

5. **Design System Components**: Button, Input, etc. from `/components/design-system/` are already converted and should not be modified.

## Progress Tracking

- [x] All design-system components (22 components)
- [ ] ModernDashboardBuilder.tsx
- [ ] MainApp.tsx
- [ ] Other application components (TBD)

## Next Steps

1. Convert ModernDashboardBuilder.tsx as it's heavily used
2. Convert MainApp.tsx as it's the main application component  
3. Audit remaining components systematically
4. Create final verification script to ensure no Tailwind classes remain
