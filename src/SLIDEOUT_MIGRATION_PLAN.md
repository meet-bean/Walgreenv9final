# SlideOut Component Migration Plan

## ✅ COMPLETED

### 1. Created New Component
**File:** `/components/design-system/SlideOut.tsx`

**Features:**
- ✅ Uses proven CSS classes from CreateAlertSidebar (`.component-editor-*`)
- ✅ Proper padding: `var(--spacing-6)`
- ✅ Resizable (optional)
- ✅ Header with icon, title, subtitle, and close button
- ✅ Scrollable content area
- ✅ Optional footer with action buttons
- ✅ Smooth animations
- ✅ Consistent with design system

**Props:**
- `open: boolean` - Controls visibility
- `onClose: () => void` - Close handler
- `title: string` - Header title
- `description?: string` - Optional subtitle
- `icon?: ReactNode` - Optional icon in header
- `children: ReactNode` - Content area
- `footer?: ReactNode` - Optional footer with buttons
- `resizable?: boolean` - Enable resize handle (default: false)
- `defaultWidth?: number` - Initial width in pixels (default: 520)
- `minWidth?: number` - Minimum width (default: 400)
- `maxWidth?: number` - Maximum width (default: 800)

### 2. Migrated CreateAlertSidebar
**File:** `/components/CreateAlertSidebar.tsx`
- ✅ Now uses `<SlideOut>` component
- ✅ Removed custom resize logic
- ✅ Removed header/footer markup
- ✅ Cleaner, more maintainable code

### 3. Migrated ComponentEditor
**File:** `/components/ComponentEditor.tsx`
- ✅ Now uses `<SlideOut>` component
- ✅ Removed custom resize logic (40+ lines removed)
- ✅ Removed header/footer markup
- ✅ Added `open` prop for controlled visibility
- ✅ Footer now includes info text and close button
- ✅ Much cleaner code structure

---

## 🔄 PENDING MIGRATIONS

### Files Using Sheet Component (Need Migration)

#### 1. **CustomDataEntryDialog.tsx**
Current: Uses `Sheet` from `./design-system/Sheet`
Migration:
```tsx
// Replace Sheet imports with:
import { SlideOut } from './design-system/SlideOut';

// Replace Sheet usage with:
<SlideOut
  open={open}
  onClose={onClose}
  title="Custom Data Entry"
  description="Enter custom data for your dashboard"
  icon={<Icon size={18} />} // Choose appropriate icon
  footer={
    <>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </>
  }
>
  {/* Move SheetContent children here */}
</SlideOut>
```

#### 2. **DataSourceConfigDialog.tsx**
Current: Uses `Sheet` from `./design-system/Sheet`
Migration: Similar pattern, likely needs icon like `<Database size={18} />`

#### 3. **SetRoleDefaultDialog.tsx**
Current: Uses `Sheet` from `./design-system/Sheet`
Migration: Similar pattern, likely needs icon like `<Settings size={18} />`

#### 4. **UserManagement.tsx**
Current: Uses `Sheet` from `./design-system/Sheet`
Migration: Similar pattern, likely needs icon like `<UserPlus size={18} />`

#### 5. **RolesPermissions.tsx**
Current: Uses `Sheet` from `./design-system/Sheet`
Migration: Similar pattern, likely needs icon like `<Shield size={18} />`

---

## 📋 Migration Checklist

For each file:
- [ ] Import `SlideOut` instead of `Sheet` components
- [ ] Identify the icon to use in the header
- [ ] Extract title and description from existing code
- [ ] Move content from `SheetContent` to `SlideOut` children
- [ ] Move footer buttons to `footer` prop
- [ ] Remove Sheet-related imports
- [ ] Test the slide-out functionality
- [ ] Verify proper padding and spacing
- [ ] Check responsive behavior

---

## 🎯 Benefits of Migration

1. **Consistent Design**: All slide-outs use the same proven pattern
2. **Proper Padding**: All slide-outs get `var(--spacing-6)` spacing automatically
3. **Less Code**: No need to duplicate header/footer markup
4. **Resizable Option**: Easy to add resize functionality when needed
5. **Maintainable**: One component to update instead of 6+ custom implementations
6. **Type-Safe**: Clear TypeScript props with helpful defaults

---

## 🔍 Before/After Example

### Before (using Sheet):
```tsx
<Sheet open={open} onOpenChange={onClose}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>My Title</SheetTitle>
      <SheetDescription>My description</SheetDescription>
    </SheetHeader>
    <div style={{ padding: '...' }}> {/* Manual padding! */}
      {/* Content */}
    </div>
    <SheetFooter>
      <Button>Action</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### After (using SlideOut):
```tsx
<SlideOut
  open={open}
  onClose={onClose}
  title="My Title"
  description="My description"
  icon={<Icon size={18} />}
  footer={<Button>Action</Button>}
>
  {/* Content - padding handled automatically! */}
</SlideOut>
```

---

## 📝 Notes

- The `Sheet` component in `/components/design-system/Sheet.tsx` can remain for backward compatibility or be deprecated
- The SlideOut component uses the existing CSS classes (`.component-editor-*`) so no CSS changes needed
- All existing animations and transitions are preserved
- Consider adding `resizable={true}` for complex forms or content-heavy slide-outs

---

## 🚀 Next Steps

Would you like me to:
1. Migrate all 5 remaining files now?
2. Migrate them one at a time so you can review?
3. Create a side-by-side comparison for one file first?
