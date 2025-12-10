# Switch Color Variants

The Switch component now supports different color variants for the unchecked (OFF) state. You can choose which one works best visually.

## Available Variants

### 1. `'gray'` (Default - Current)
```tsx
<Switch variant="gray" checked={isChecked} onCheckedChange={setIsChecked} />
```
**Unchecked color:** `#d1d5db` - Medium gray  
**Best for:** Good balance of visibility and subtlety

---

### 2. `'light-gray'`
```tsx
<Switch variant="light-gray" checked={isChecked} onCheckedChange={setIsChecked} />
```
**Unchecked color:** `#e5e7eb` - Lighter gray  
**Best for:** More subtle than default, still clearly visible

---

### 3. `'muted'`
```tsx
<Switch variant="muted" checked={isChecked} onCheckedChange={setIsChecked} />
```
**Unchecked color:** `#f3f4f6` - Very light gray  
**Best for:** Minimal, clean look with less contrast

---

### 4. `'border'`
```tsx
<Switch variant="border" checked={isChecked} onCheckedChange={setIsChecked} />
```
**Unchecked color:** `#9ca3af` - Darker gray  
**Best for:** Maximum contrast and prominence when OFF

---

### 5. `'subtle'`
```tsx
<Switch variant="subtle" checked={isChecked} onCheckedChange={setIsChecked} />
```
**Unchecked color:** `#f9fafb` - Nearly white  
**Best for:** Ultra-minimal, barely-there appearance

---

## Quick Test

To test variants in RolesPermissions, you can temporarily change line in the Switch usage:

**Current (default):**
```tsx
<Switch checked={role.permissions[permission.id]} ... />
```

**With variant:**
```tsx
<Switch variant="border" checked={role.permissions[permission.id]} ... />
```

## Visual Comparison

```
OFF State Colors (light → dark):
subtle:      #f9fafb ░░░░░░░░░░░ Nearly white
muted:       #f3f4f6 ▒▒▒▒▒▒▒▒▒▒▒ Very light gray
light-gray:  #e5e7eb ▒▒▒▒▒▒▒▒▒▒▒ Light gray
gray:        #d1d5db ▓▓▓▓▓▓▓▓▓▓▓ Medium gray (default)
border:      #9ca3af ████████████ Darker gray

ON State Color (all variants):
primary:     var(--primary) with white thumb
```

## Recommendations

- **For tables:** `'gray'` or `'border'` - easier to scan at a glance
- **For forms:** `'light-gray'` or `'muted'` - softer, less aggressive
- **For minimal UI:** `'subtle'` or `'muted'` - very clean
- **For high contrast:** `'border'` - most obvious OFF state

## How to Change Default

To change the default variant globally, edit `/components/design-system/Switch.tsx`:

```tsx
variant = 'border'  // Change this line (currently 'gray')
```
