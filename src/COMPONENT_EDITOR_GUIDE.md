# Component Editor Guide

## How to Access the Component Editor

The Component Editor can be accessed from the main navigation toolbar:

1. Look for the **Paintbrush icon** (🎨) in the top toolbar
2. Click the icon to open the Component Editor overlay
3. Click it again or the Close button to close the editor

## What is the Component Editor?

The Component Editor is your complete design system toolkit that provides:
- **Component Library** - Browse all available UI components
- **Typography Reference** - View all typography styles (read-only)
- **Typography Editor** - Edit and customize typography in real-time ✨ NEW
- **Element Inspector** - Click any element to see what components it uses ✨ NEW

## Using the Component Editor

### Components Tab

**Browse Components:**
- View all 15+ design system components with live examples
- See component descriptions and use cases
- Explore different variants and sizes

**Filter & Search:**
- Use the search bar to find specific components
- Filter by category:
  - **All** - Show all components
  - **Input** - Forms, inputs, selects, etc.
  - **Display** - Cards, badges, alerts, etc.
  - **Navigation** - Tabs, buttons, etc.
  - **Feedback** - Skeletons, progress bars, etc.

**Component Details:**
Click any component card to expand it and see:
- Live component preview
- Available variants
- Props and configuration options

### Typography Tab (Read-Only Reference)

**View All Typography Styles:**

1. **Headings Section**
   - H1 through H4 with specifications
   - Font size, weight, and letter spacing for each

2. **Body Text Section**
   - Paragraph styles
   - Text-large for emphasized content
   - Text-detail for captions

3. **UI Elements Section**
   - Button text styles
   - Label styles
   - Input text styles
   - Table headers
   - Section titles

4. **Font Weights**
   - All available weights (Light to Bold)
   - CSS variable references

5. **CSS Variables Table**
   - Complete list of typography tokens
   - Variable names and values
   - Usage guidelines

### Edit Typography Tab ✨ NEW

**Customize Typography in Real-Time:**

**How it Works:**
- Edit any typography value and see changes immediately
- Live preview shows how your changes look
- All changes apply to CSS variables in real-time
- Export your changes as a CSS file

**Features:**
1. **Live Preview Panel**
   - See all typography styles with your custom values
   - Toggle preview on/off to save space
   - Shows H1-H4, body text, buttons, and more

2. **Edit Any Value**
   - Click the Edit icon (✏️) next to any typography style
   - Enter new values (supports px, em, unitless numbers)
   - Changes apply immediately
   - Modified values are highlighted with a badge

3. **Categories:**
   - **Font Sizes** - Adjust text size for all elements
   - **Line Heights** - Control vertical spacing between lines
   - **Font Weights** - Change text thickness (100-900)
   - **Letter Spacing** - Fine-tune character spacing

4. **Actions:**
   - **Reset** - Click the reset icon (↻) to restore default value
   - **Reset All** - Restore all typography to defaults
   - **Export CSS** - Download a CSS file with your custom values
   - **Show/Hide Preview** - Toggle the live preview panel

**Workflow:**
1. Click "Edit Typography" tab
2. Find the style you want to change
3. Click the Edit icon (✏️)
4. Enter a new value
5. Click the checkmark (✓) to save
6. See the change immediately in the preview and entire app
7. Click "Export CSS" to download your customizations

### Inspector Tab ✨ NEW

**Inspect Any Element on the Page:**

**How it Works:**
- Click "Start Inspecting" to enter inspector mode
- Hover over any element to highlight it
- Click to inspect and see detailed information
- Works like browser DevTools but focuses on design system components

**What You Can See:**
1. **Element Information**
   - HTML tag name
   - Identified component (if it's a design system component)
   - Element ID and dimensions
   
2. **Element Hierarchy**
   - Full path from body to the selected element
   - Shows the DOM structure
   - Highlights the selected element

3. **CSS Classes**
   - All class names applied to the element
   - Helps identify which component it is

4. **Computed Styles**
   - All relevant CSS properties
   - Final calculated values
   - Includes layout, colors, typography, spacing

5. **HTML Attributes**
   - All attributes like data-*, aria-*, etc.
   - Helps understand component props

**Workflow:**
1. Click "Inspector" tab
2. Click "Start Inspecting" button
3. Hover over elements on the page (they'll be highlighted in blue)
4. Click an element to inspect it
5. View detailed information in the Inspector panel
6. Press ESC or click "Cancel" to exit inspector mode
7. Click "Start Inspecting" again to inspect another element

**Use Cases:**
- "What component is this button?"
- "What CSS classes are applied here?"
- "What's the exact spacing/color of this element?"
- "How is this component structured?"

## Tips

- **Components Tab** - READ-ONLY reference for browsing available components
- **Typography Tab** - READ-ONLY reference showing all typography styles
- **Edit Typography Tab** - INTERACTIVE editor to customize typography
- **Inspector Tab** - INTERACTIVE tool to inspect any element
- All components shown use the design system from `/components/design-system/`
- Typography styles are defined in `/styles/globals.css`
- Use this as a reference when building features to maintain consistency
- Typography edits are temporary - export to CSS to save permanently
- Inspector mode can inspect any element, not just design system components

## Quick Reference

| Action | How To |
|--------|--------|
| Open/Close | Click Paintbrush icon in toolbar |
| Switch tabs | Click any of the 4 tabs (Components, Typography, Edit Typography, Inspector) |
| Browse components | Use Components tab - search and filter |
| View typography | Use Typography tab - read-only reference |
| Edit typography | Use Edit Typography tab - click edit icons |
| Inspect element | Use Inspector tab - click "Start Inspecting" |
| Export changes | Edit Typography tab - click "Export CSS" |
| Reset typography | Edit Typography tab - click reset icons |
| Exit inspector | Press ESC or click "Cancel" |

---

**Note:** 
- Components tab and Typography tab are read-only references
- Edit Typography tab allows real-time customization with export
- Inspector tab lets you click on any element to inspect it
- All components are "hardened" - they have fixed styling and don't accept arbitrary style props
- Typography edits are live but temporary - export to CSS to save permanently
