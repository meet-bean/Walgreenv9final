# Design System Editor Guide

## Overview

The Design System Editor is a powerful visual tool that allows you to edit your entire design system by pointing at any element on the screen. Unlike traditional editing that fragments your design by changing individual instances, this editor updates the **CSS variables** that control all similar components globally.

## Key Concept: Token-Based Design

All UI components in your application use CSS variables (design tokens) from `/styles/globals.css`. When you edit a token, **all components using that token update automatically**, maintaining design consistency across your entire application.

## How to Access

Click the **Paintbrush icon** (🎨) in the top-right header of the application. This opens the Design System Editor panel on the right side of your screen.

## Features

### 1. **Inspect Mode**

**How it works:**
- Click the "Inspect" button to activate inspection mode
- Your cursor changes to a crosshair
- Hover over any element to see it highlighted with a blue outline
- Click the element to see what design tokens it uses

**What you'll see:**
- **Component Type** - Button, Card, Input, etc.
- **CSS Variables Used** - All design tokens affecting that element
- **Computed Styles** - The actual rendered styles

### 2. **Edit Design Tokens**

Once you've inspected an element:

**For Colors:**
- See the current color value
- Edit the hex code directly
- Use the color picker for visual selection
- See a live preview of the color

**For Spacing, Typography, Borders, etc.:**
- Edit values directly (e.g., "16px", "1.5rem", "Inter")
- Changes apply in real-time
- See immediate feedback across all instances

### 3. **All Tokens View**

Switch to the "All Tokens" tab to:
- **Browse all CSS variables** organized by category
- **Search tokens** by name or description
- **Filter by category**: Colors, Spacing, Typography, Borders, Radius, Other
- **Edit any token** directly without inspecting elements

**Categories:**
- 🎨 **Colors** - All color variables (primary, background, foreground, etc.)
- 📏 **Spacing** - Padding, margin, gap values
- ✏️ **Typography** - Font families, sizes, weights, line heights
- 🔲 **Border** - Border widths, styles, colors
- ⭕ **Radius** - Border radius values
- 📦 **Other** - Miscellaneous design tokens

### 4. **Save & Export**

**Reset Button:**
- Reverts all changes back to the original values
- Useful if you want to start over

**Export Button:**
- Downloads a CSS file with all your custom variables
- File name: `design-system-variables.css`

**Copy CSS Button:**
- Copies all CSS variables to your clipboard
- **Important:** Paste this into `/styles/globals.css` to make changes permanent
- Changes are only temporary until you update the actual CSS file

## Workflow Example

### Scenario: Change Primary Button Color Across Entire App

1. **Open Design Editor** - Click the paintbrush icon
2. **Inspect a Button** - Click "Inspect", then click any primary button
3. **Find the Token** - Look for `--color-primary` in the variables list
4. **Edit the Color** - Use the color picker or type a hex code
5. **Watch It Update** - All primary buttons across the app change instantly
6. **Save Changes** - Click "Copy CSS" and update your `globals.css` file

### Scenario: Adjust Spacing Throughout App

1. **Open All Tokens Tab** - Click "All Tokens"
2. **Filter by Spacing** - Select "Spacing" from the category dropdown
3. **Edit Values** - Update `--spacing-4` from "16px" to "20px"
4. **See Global Impact** - All components using this spacing token adjust
5. **Export** - Save your changes to CSS

## Benefits

### ✅ Consistency
- Changes apply to ALL similar components
- No design fragmentation
- Maintains design system integrity

### ✅ Speed
- No need to hunt through code
- Real-time visual feedback
- Edit what you see

### ✅ Safety
- Can't accidentally break one instance
- Easy to reset if you don't like changes
- Preview before committing

### ✅ Learning
- See which tokens control which elements
- Understand your design system structure
- Learn CSS variable relationships

## Important Notes

⚠️ **Changes are Temporary**
- Edits only affect the current browser session
- To make changes permanent, you MUST update `/styles/globals.css`
- Use the "Copy CSS" button to get the updated code

⚠️ **Component Type Detection**
- The editor identifies components by their CSS classes and HTML structure
- Custom components may show as "Element" instead of specific types

⚠️ **Color Values**
- Use hex codes (#000000) or CSS color names (black)
- RGB/RGBA also supported: rgb(0, 0, 0)

⚠️ **Spacing Values**
- Include units: "16px", "1rem", "2em"
- Without units, values may not apply correctly

## Advanced Usage

### Creating Design Variations

1. **Find Core Tokens** - Identify the main colors, spacing, and typography tokens
2. **Adjust Systematically** - Change primary, secondary, and accent colors together
3. **Test Across Views** - Navigate to different screens while editor is open
4. **Export When Happy** - Save your design variation

### Responsive Design

- The editor shows computed styles, which may vary by screen size
- Inspect elements at different viewport widths
- Some tokens may have responsive overrides

### Dark Mode / Themes

- Current implementation shows `:root` variables
- For dark mode tokens, you may need to edit the `.dark` selector separately
- Consider creating a theme switcher that modifies CSS classes

## Troubleshooting

**Q: Changes aren't applying**
- Make sure you're editing a CSS variable (starts with `--`)
- Check that the component actually uses that variable
- Try refreshing the page

**Q: Element shows no CSS variables**
- The element might use hardcoded values instead of tokens
- Check the "Computed Styles" section to see actual values
- Consider refactoring that component to use design tokens

**Q: Lost my changes**
- Changes are temporary - use "Copy CSS" frequently
- Paste into your `globals.css` file to preserve changes
- The "Export" button also saves a backup

**Q: Can't click the element I want**
- The editor panel may be blocking it
- Try inspecting from a different angle
- Use the "All Tokens" tab instead

## Next Steps

After editing your design system:

1. **Copy the CSS** using "Copy CSS" button
2. **Open `/styles/globals.css`** in your code editor
3. **Replace the `:root` section** with your copied CSS
4. **Save the file**
5. **Refresh your application** to see permanent changes

## Tips

- 💡 Start with small changes and test thoroughly
- 💡 Keep a backup of your original `globals.css`
- 💡 Use meaningful, consistent naming for custom tokens
- 💡 Document your design decisions in comments
- 💡 Test on different screen sizes and browsers

---

**Remember:** This tool edits the **design system**, not individual components. Every change affects all instances using the same tokens. This is the power of a token-based design system!
