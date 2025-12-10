# Design System Components

This directory contains custom UI components built using your team's design system variables defined in `/styles/globals.css`.

## Why Custom Components?

These components replace shadcn/ui to ensure:
- **Design System Compliance**: All styling uses CSS variables from `/styles/globals.css`
- **Centralized Control**: Update your design system by modifying CSS variables
- **Typography Consistency**: Uses only the Inter font family defined in the design system
- **No External Dependencies**: Built specifically for your team's needs

## Available Components

### Button
Primary UI button with variants: `primary`, `secondary`, `destructive`, `outline`, `ghost`

```tsx
import { Button } from './components/design-system/Button';

<Button variant="primary" size="md">Click me</Button>
```

### Card
Container component with header, content, and footer sections

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/design-system/Card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Input
Form input field

```tsx
import { Input } from './components/design-system/Input';

<Input type="text" placeholder="Enter text..." />
```

### Table
Data table with header, body, and rows

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/design-system/Table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Select
Dropdown select component

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/design-system/Select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Alert
Notification messages with variants

```tsx
import { Alert, AlertDescription } from './components/design-system/Alert';

<Alert variant="success">
  <AlertDescription>Success message</AlertDescription>
</Alert>
```

### Badge
Small status indicators

```tsx
import { Badge } from './components/design-system/Badge';

<Badge variant="success">Active</Badge>
```

### Tabs
Tabbed interface

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/design-system/Tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Toast
Toast notifications

```tsx
import { Toaster, toast } from './components/design-system/Toast';

// In your App.tsx
<Toaster />

// Anywhere in your app
toast.success('Operation successful');
toast.error('Something went wrong');
toast.warning('Warning message');
toast.message('Info message');
```

## Design System Variables

All components use CSS variables from `/styles/globals.css`:

- **Colors**: `--primary`, `--secondary`, `--destructive`, `--muted`, etc.
- **Spacing**: `--spacing-1` through `--spacing-24`
- **Typography**: `--font-family-inter`, `--text-base`, `--text-label`, etc.
- **Borders**: `--radius`, `--border`
- **Shadows**: `--elevation-sm`, `--elevation-md`, `--elevation-lg`

## Updating the Design System

To update styling across all components, modify the CSS variables in `/styles/globals.css`. Changes will automatically apply to all design system components.

Example:
```css
:root {
  --primary: rgba(255, 105, 105, 1.00); /* Change this to update all primary colors */
  --radius: 6px; /* Change this to update all border radius */
}
```

## Migration from Shadcn

All files previously importing from `./components/ui/*` have been updated to import from `./components/design-system/*`:

- ✅ App.tsx
- ✅ DataEntryDesktop.tsx
- ✅ DataEntryMobile.tsx  
- ✅ DataSourceBlock.tsx
- ✅ SpreadsheetReferenceView.tsx
- ✅ SupervisorMapView.tsx

The `/components/ui` directory still exists but is no longer used in the application.
