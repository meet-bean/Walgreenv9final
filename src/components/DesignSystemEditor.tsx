import React, { useState, useEffect, useRef } from 'react';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './design-system/Tabs';
import { Badge } from './design-system/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './design-system/Card';
import { Switch } from './design-system/Switch';
import { Checkbox } from './design-system/Checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './design-system/Textarea';
import { Progress } from './design-system/Progress';
import { Separator } from './design-system/Separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertTitle, AlertDescription } from './design-system/Alert';
import { Skeleton } from './design-system/Skeleton';
import { PageHeader } from './design-system/PageHeader';
import { PageContainer } from './design-system/PageContainer';
import { FlatCard } from './design-system/FlatCard';
import { OverviewTileCard } from './design-system/OverviewTileCard';
import { SlideOut } from './design-system/SlideOut';
import { ChartHeader } from './ChartHeader';
import { 
  Paintbrush, 
  X, 
  Eye, 
  EyeOff, 
  Download, 
  Upload,
  Undo,
  Save,
  Info,
  Search,
  Layers,
  Type,
  Palette,
  Box,
  Circle,
  Droplets,
  Zap,
  User,
  AlertCircle,
  CheckCircle2,
  Settings,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface DesignSystemEditorProps {
  onClose: () => void;
}

interface CSSVariable {
  name: string;
  value: string;
  category: 'color' | 'spacing' | 'typography' | 'shadow' | 'radius' | 'transition' | 'other';
  description?: string;
}

interface InspectedElement {
  element: HTMLElement;
  tagName: string;
  classes: string[];
  computedStyles: Record<string, string>;
  cssVariables: CSSVariable[];
  componentType: string;
}

// Helper component for component sections
function ComponentSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ 
      padding: 'var(--spacing-4)',
      backgroundColor: 'var(--muted)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)'
    }}>
      <h5 style={{ 
        fontSize: '14px',
        fontWeight: 'var(--font-weight-semibold)',
        marginBottom: 'var(--spacing-1)',
        color: 'var(--foreground)'
      }}>
        {title}
      </h5>
      <p style={{ 
        fontSize: '12px', 
        color: 'var(--muted-foreground)', 
        marginBottom: 'var(--spacing-3)' 
      }}>
        {description}
      </p>
      {children}
    </div>
  );
}

export function DesignSystemEditor({ onClose }: DesignSystemEditorProps) {
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectedElement, setInspectedElement] = useState<InspectedElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [cssVariables, setCssVariables] = useState<CSSVariable[]>([]);
  const [originalVariables, setOriginalVariables] = useState<CSSVariable[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredVariable, setHoveredVariable] = useState<string | null>(null);
  const [highlightedElements, setHighlightedElements] = useState<HTMLElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Extract all CSS variables from :root
  useEffect(() => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const variables: CSSVariable[] = [];

    // Get all custom properties
    for (let i = 0; i < styles.length; i++) {
      const name = styles[i];
      if (name.startsWith('--')) {
        const value = styles.getPropertyValue(name).trim();
        const category = categorizeCSSVariable(name, value);
        variables.push({
          name,
          value,
          category,
          description: generateDescription(name, category)
        });
      }
    }

    setCssVariables(variables);
    setOriginalVariables(JSON.parse(JSON.stringify(variables)));
  }, []);

  const categorizeCSSVariable = (name: string, value?: string): CSSVariable['category'] => {
    // Categorize based on name patterns
    if (name.includes('elevation') || name.includes('shadow')) return 'shadow';
    if (name.includes('transition') || name.includes('duration')) return 'transition';
    if (name.includes('radius') || name.includes('rounded')) return 'radius';
    if (name.includes('spacing') || name.includes('gap')) return 'spacing';
    
    // Typography: font sizes, weights, families, line heights
    if (name.includes('font') || name.includes('text') || name.includes('line-height')) return 'typography';
    
    // Colors: check value to see if it's a color
    if (value) {
      // Check if value looks like a color (hex, rgb, rgba, hsl, hsla)
      const colorPatterns = /^(#|rgb|rgba|hsl|hsla)/i;
      if (colorPatterns.test(value)) return 'color';
    }
    
    // Fallback to name-based detection for colors
    if (name.includes('color') || name === '--border' || name === '--input' || 
        name === '--ring' || name.includes('-foreground') || name.includes('background') ||
        name.includes('primary') || name.includes('secondary') || name.includes('accent') ||
        name.includes('destructive') || name.includes('muted') || name.includes('chart-')) {
      return 'color';
    }
    
    return 'other';
  };

  const generateDescription = (name: string, category: string): string => {
    const descriptions: Record<string, string> = {
      // Base Colors
      '--background': '🎨 Main app background (white/dark)',
      '--foreground': '✏️ Main text color on backgrounds',
      '--card': '🃏 Background for cards, modals, containers',
      '--card-foreground': '✏️ Text color on cards/modals',
      '--popover': '💬 Background for dropdowns, tooltips',
      '--popover-foreground': '✏️ Text color in dropdowns/tooltips',
      
      // Brand Colors
      '--primary': '⭐ Primary brand color (buttons, links)',
      '--primary-foreground': '✏️ Text on primary buttons',
      '--secondary': '🔷 Secondary buttons/accents',
      '--secondary-foreground': '✏️ Text on secondary elements',
      '--accent': '✨ Accent color for highlights',
      '--accent-foreground': '✏️ Text on accent backgrounds',
      
      // State Colors
      '--muted': '🔇 Less prominent backgrounds',
      '--muted-foreground': '🔇 Secondary text, labels',
      '--destructive': '🗑️ Delete buttons, error actions',
      '--destructive-foreground': '✏️ Text on destructive buttons',
      '--color-success': '✅ Success states, completed items',
      '--color-success-light': '💚 Light success backgrounds',
      '--color-warning': '⚠️ Warning states, caution',
      '--color-warning-light': '💛 Light warning backgrounds',
      '--color-error': '❌ Error states, validation',
      '--color-error-light': '❤️ Light error backgrounds',
      '--color-info': 'ℹ️ Information, neutral states',
      '--color-info-light': '💙 Light info backgrounds',
      
      // UI Elements
      '--border': '📦 Default border color',
      '--input': '📝 Input field background when filled',
      '--input-background': '📝 Input field background',
      '--ring': '🎯 Focus rings, outlines',
      
      // Chart Colors
      '--chart-1': '📊 Chart color #1 (blue)',
      '--chart-2': '📊 Chart color #2 (green)',
      '--chart-3': '📊 Chart color #3 (orange)',
      '--chart-4': '📊 Chart color #4 (red)',
      '--chart-5': '📊 Chart color #5 (purple)',
      
      // Sidebar
      '--sidebar': '📂 Sidebar background',
      '--sidebar-foreground': '✏️ Sidebar text',
      '--sidebar-primary': '⭐ Sidebar active/primary',
      '--sidebar-primary-foreground': '✏️ Text on sidebar primary',
      '--sidebar-accent': '✨ Sidebar hover/accent',
      '--sidebar-accent-foreground': '✏️ Text on sidebar accent',
      '--sidebar-border': '📦 Sidebar borders',
      '--sidebar-ring': '🎯 Sidebar focus rings',
      
      // Typography
      '--font-family-inter': '🔤 Primary font (Inter)',
      '--text-h1': '📏 Heading 1 size (48px)',
      '--text-h2': '📏 Heading 2 size (30px)',
      '--text-h3': '📏 Heading 3 size (24px)',
      '--text-h4': '📏 Heading 4 size (20px)',
      '--text-base': '📏 Body text size (16px)',
      '--text-label': '📏 Label text size (14px)',
      '--text-large': '📏 Large text size (18px)',
      '--text-detail': '📏 Small detail text (12px)',
      '--text-table-head': '📏 Table header text (16px)',
      '--text-section-title': '📏 Section title text (14px)',
      '--font-weight-regular': '💪 Normal weight (400)',
      '--font-weight-medium': '💪 Medium weight (500)',
      '--font-weight-semibold': '💪 Semibold weight (600)',
      '--font-weight-bold': '💪 Bold weight (700)',
      '--font-weight-extrabold': '💪 Extra bold weight (800)',
      
      // Spacing - Numeric
      '--spacing-1': '📏 4px - Tiny gap',
      '--spacing-2': '📏 8px - Small gap',
      '--spacing-3': '📏 12px - Medium-small gap',
      '--spacing-4': '📏 16px - Medium gap',
      '--spacing-5': '📏 20px - Medium-large gap',
      '--spacing-6': '📏 24px - Large gap',
      '--spacing-8': '📏 32px - Extra large gap',
      '--spacing-10': '📏 40px - 2XL gap',
      '--spacing-12': '📏 48px - 3XL gap',
      '--spacing-16': '📏 64px - 4XL gap',
      '--spacing-20': '📏 80px - 5XL gap',
      '--spacing-24': '📏 96px - 6XL gap',
      
      // Spacing - Semantic
      '--spacing-xs': '📏 8px - Extra small',
      '--spacing-sm': '📏 12px - Small',
      '--spacing-md': '📏 16px - Medium',
      '--spacing-lg': '📏 24px - Large',
      '--spacing-xl': '📏 32px - Extra large',
      '--spacing-2xl': '📏 40px - 2X large',
      '--spacing-section': '📏 24px - Between sections',
      
      // Grid Spacing
      '--grid-gap': '🎯 Gap between dashboard sections',
      '--grid-outer-gap': '🎯 Gap between dashboard areas',
      
      // Shadows
      '--elevation-sm': '☁️ Small shadow for subtle depth',
      '--elevation-md': '☁️ Medium shadow for cards',
      '--elevation-lg': '☁️ Large shadow for modals',
      
      // Radius
      '--radius': '⚪ Default border radius (6px)',
      
      // Transitions
      '--transition-default': '⚡ Default animation speed',
      '--hover-overlay': '🎨 Hover overlay darkness',
      '--focus-ring-width': '🎯 Focus ring thickness',
    };
    
    return descriptions[name] || `${category} token`;
  };

  // Identify component type from element
  const identifyComponent = (element: HTMLElement): string => {
    const classes = Array.from(element.classList);
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();

    // Check for common component patterns
    if (classes.some(c => c.includes('button')) || tagName === 'button') return 'Button';
    if (classes.some(c => c.includes('card'))) return 'Card';
    if (classes.some(c => c.includes('input')) || tagName === 'input') return 'Input';
    if (classes.some(c => c.includes('badge'))) return 'Badge';
    if (classes.some(c => c.includes('dialog'))) return 'Dialog';
    if (classes.some(c => c.includes('table'))) return 'Table';
    if (role === 'tab') return 'Tab';
    if (role === 'dialog') return 'Dialog';
    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') return 'Heading';
    if (tagName === 'p') return 'Paragraph';
    if (tagName === 'label') return 'Label';
    
    return 'Element';
  };

  // Extract CSS variables used by element
  const extractElementVariables = (element: HTMLElement): CSSVariable[] => {
    const computedStyles = getComputedStyle(element);
    const usedVariables: CSSVariable[] = [];
    const seenVars = new Set<string>();

    // Check all CSS properties for var() usage
    for (let i = 0; i < computedStyles.length; i++) {
      const property = computedStyles[i];
      const value = computedStyles.getPropertyValue(property);
      
      // Find all CSS variables used in this value
      const varMatches = value.matchAll(/var\((--[^,)]+)/g);
      for (const match of varMatches) {
        const varName = match[1];
        if (!seenVars.has(varName)) {
          seenVars.add(varName);
          const variable = cssVariables.find(v => v.name === varName);
          if (variable) {
            usedVariables.push(variable);
          }
        }
      }
    }

    // Also check inline styles
    const inlineStyle = element.getAttribute('style') || '';
    const inlineVarMatches = inlineStyle.matchAll(/var\((--[^,)]+)/g);
    for (const match of inlineVarMatches) {
      const varName = match[1];
      if (!seenVars.has(varName)) {
        seenVars.add(varName);
        const variable = cssVariables.find(v => v.name === varName);
        if (variable) {
          usedVariables.push(variable);
        }
      }
    }

    return usedVariables;
  };

  // Set up/tear down event listeners
  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      // Ignore events on the editor panel itself
      if (overlayRef.current?.contains(e.target as Node)) return;

      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (element) {
        setHoveredElement(element);
      }
    };

    const clickHandler = (e: MouseEvent) => {
      // Ignore clicks on the editor panel
      if (overlayRef.current?.contains(e.target as Node)) return;

      e.preventDefault();
      e.stopPropagation();

      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (element) {
        const computedStyles = getComputedStyle(element);
        const relevantStyles: Record<string, string> = {
          backgroundColor: computedStyles.backgroundColor,
          color: computedStyles.color,
          fontSize: computedStyles.fontSize,
          fontFamily: computedStyles.fontFamily,
          padding: computedStyles.padding,
          margin: computedStyles.margin,
          border: computedStyles.border,
          borderRadius: computedStyles.borderRadius,
        };

        const elementVariables = extractElementVariables(element);
        const componentType = identifyComponent(element);

        setInspectedElement({
          element,
          tagName: element.tagName.toLowerCase(),
          classes: Array.from(element.classList),
          computedStyles: relevantStyles,
          cssVariables: elementVariables,
          componentType
        });

        setIsInspecting(false);
        setHoveredElement(null);
        toast.success(`Inspecting ${componentType}`);
      }
    };

    if (isInspecting) {
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('click', clickHandler, true);
      document.body.style.cursor = 'crosshair';
    }

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('click', clickHandler, true);
      document.body.style.cursor = 'default';
    };
  }, [isInspecting, cssVariables]);

  // Update CSS variable in real-time
  const updateCSSVariable = (name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
    setCssVariables(prev => 
      prev.map(v => v.name === name ? { ...v, value } : v)
    );
  };

  // Find all elements using a specific CSS variable
  const findElementsUsingVariable = (varName: string): HTMLElement[] => {
    const elements: HTMLElement[] = [];
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach((el) => {
      const element = el as HTMLElement;
      // Skip the editor panel itself
      if (overlayRef.current?.contains(element)) return;
      
      const computedStyles = getComputedStyle(element);
      const inlineStyle = element.getAttribute('style') || '';
      
      // Check computed styles
      for (let i = 0; i < computedStyles.length; i++) {
        const property = computedStyles[i];
        const value = computedStyles.getPropertyValue(property);
        if (value.includes(varName)) {
          elements.push(element);
          return; // Found it, no need to check more properties
        }
      }
      
      // Check inline styles
      if (inlineStyle.includes(varName)) {
        elements.push(element);
      }
    });
    
    return elements;
  };

  // Handle variable hover
  const handleVariableHover = (varName: string | null) => {
    setHoveredVariable(varName);
    if (varName) {
      const elements = findElementsUsingVariable(varName);
      setHighlightedElements(elements);
    } else {
      setHighlightedElements([]);
    }
  };

  // Reset all changes
  const handleReset = () => {
    originalVariables.forEach(variable => {
      document.documentElement.style.setProperty(variable.name, variable.value);
    });
    setCssVariables(JSON.parse(JSON.stringify(originalVariables)));
    toast.success('Reset to original values');
  };

  // Export CSS
  const handleExport = () => {
    const cssContent = ':root {\n' + 
      cssVariables.map(v => `  ${v.name}: ${v.value};`).join('\n') + 
      '\n}';
    
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-system-variables.css';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSS variables exported');
  };

  // Copy to clipboard
  const handleCopyCSS = () => {
    const cssContent = ':root {\n' + 
      cssVariables.map(v => `  ${v.name}: ${v.value};`).join('\n') + 
      '\n}';
    
    navigator.clipboard.writeText(cssContent);
    toast.success('CSS copied to clipboard! Update your globals.css file.');
  };

  // Filter variables
  const filteredVariables = cssVariables.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (v.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get variables by category
  const getVariablesByCategory = (category: string) => {
    return cssVariables.filter(v => v.category === category);
  };

  // Parse numeric value from CSS value
  const parseNumericValue = (value: string): { num: number; unit: string } | null => {
    const match = value.match(/^([\d.]+)(px|rem|em|%|ms|s)?$/);
    if (match) {
      return { num: parseFloat(match[1]), unit: match[2] || '' };
    }
    return null;
  };

  // Get font weight options
  const fontWeightOptions = ['400', '500', '600', '700', '800'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'color': return <Palette size={16} />;
      case 'spacing': return <Box size={16} />;
      case 'typography': return <Type size={16} />;
      case 'shadow': return <Droplets size={16} />;
      case 'radius': return <Circle size={16} />;
      case 'transition': return <Zap size={16} />;
      default: return <Layers size={16} />;
    }
  };

  return (
    <>
      {/* Inspection overlay */}
      {isInspecting && hoveredElement && (
        <div
          style={{
            position: 'fixed',
            top: hoveredElement.getBoundingClientRect().top,
            left: hoveredElement.getBoundingClientRect().left,
            width: hoveredElement.getBoundingClientRect().width,
            height: hoveredElement.getBoundingClientRect().height,
            border: '2px solid var(--color-primary)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            pointerEvents: 'none',
            zIndex: 9998,
            transition: 'all 0.1s ease',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-24px',
            left: 0,
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: '2px 8px',
            fontSize: '12px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
          }}>
            {identifyComponent(hoveredElement)}
          </div>
        </div>
      )}

      {/* Variable hover highlights */}
      {hoveredVariable && highlightedElements.map((element, index) => {
        const rect = element.getBoundingClientRect();
        return (
          <div
            key={index}
            style={{
              position: 'fixed',
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              border: '2px dashed var(--color-chart-2)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              pointerEvents: 'none',
              zIndex: 9997,
              transition: 'all 0.15s ease',
              borderRadius: '4px',
            }}
          />
        );
      })}

      {/* Editor Panel */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '360px',
          height: '100vh',
          backgroundColor: 'var(--card)',
          borderLeft: '1px solid var(--border)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: 'var(--spacing-3)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <Paintbrush size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '16px' }}>Design Editor</h3>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Button
              variant={isInspecting ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsInspecting(!isInspecting)}
            >
              {isInspecting ? <EyeOff size={16} /> : <Eye size={16} />}
              {isInspecting ? 'Stop' : 'Inspect'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-state-info-light)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: 'var(--spacing-2)',
          fontSize: '13px',
          color: 'var(--color-state-info)',
        }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            {isInspecting 
              ? '👆 Click any element to see which design tokens control its styling'
              : '💡 Each token includes emoji icons and descriptions to help you understand what it controls'}
          </span>
        </div>

        {/* Action Bar */}
        <div style={{
          padding: 'var(--spacing-2)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: 'var(--spacing-1)',
        }}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast.info('💡 Token Tips', {
                description: 'Open the "All Tokens" tab to see descriptions with emoji icons explaining what each token does. Hover over tokens to highlight elements using them!'
              });
            }}
            style={{ fontSize: '12px' }}
            title="Quick Help"
          >
            <Info size={14} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="button-flex-1 button-compact">
            <Undo size={14} />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="button-flex-1 button-compact">
            <Download size={14} />
            Export
          </Button>
          <Button variant="default" size="sm" onClick={handleCopyCSS} className="button-flex-1 button-compact">
            <Save size={14} />
            Copy
          </Button>
        </div>

        {/* Content */}
        <Tabs defaultValue="inspect">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: 'calc(100vh - 185px)', // Account for header, info banner, and action bar
            overflow: 'hidden'
          }}>
            <TabsList className="ds-tabs-list-compact">
              <TabsTrigger value="inspect" className="ds-tabs-trigger-small">
                <Eye size={14} />
                Inspect
              </TabsTrigger>
              <TabsTrigger value="all" className="ds-tabs-trigger-small">
                <Layers size={14} />
                All Tokens
              </TabsTrigger>
              <TabsTrigger value="components" className="ds-tabs-trigger-small">
                <Box size={14} />
                Components
              </TabsTrigger>
            </TabsList>

            {/* Inspector Tab */}
            <TabsContent value="inspect" className="ds-tabs-content-flex">
              <div style={{ padding: 'var(--spacing-3)' }}>
                {inspectedElement ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    {/* Component Info */}
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--spacing-2)',
                        marginBottom: 'var(--spacing-2)'
                      }}>
                        <h4 style={{ margin: 0 }}>{inspectedElement.componentType}</h4>
                        <Badge variant="outline">{inspectedElement.tagName}</Badge>
                      </div>
                      {inspectedElement.classes.length > 0 && (
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 'var(--spacing-1)',
                          marginTop: 'var(--spacing-2)'
                        }}>
                          {inspectedElement.classes.map((cls, i) => (
                            <Badge key={i} variant="secondary" className="badge-compact">
                              {cls}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CSS Variables Used */}
                    {inspectedElement.cssVariables.length > 0 ? (
                      <div>
                        <h5 style={{ 
                          marginBottom: 'var(--spacing-3)',
                          color: 'var(--color-muted-foreground)'
                        }}>
                          Design Tokens ({inspectedElement.cssVariables.length})
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                          {inspectedElement.cssVariables.map((variable) => (
                            <div
                              key={variable.name}
                              style={{
                                padding: 'var(--spacing-2)',
                                backgroundColor: 'var(--background)',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                              }}
                            >
                              {/* Color Preview - Show prominently for color variables */}
                              {variable.category === 'color' && (
                                <div style={{
                                  marginBottom: 'var(--spacing-2)',
                                  display: 'flex',
                                  gap: 'var(--spacing-2)',
                                  alignItems: 'center'
                                }}>
                                  {/* Color swatch */}
                                  <div style={{
                                    width: '56px',
                                    height: '56px',
                                    backgroundColor: variable.value,
                                    borderRadius: 'var(--radius)',
                                    border: '2px solid var(--border)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    flexShrink: 0,
                                  }} />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <Label className="label-variable-name">
                                      {variable.name}
                                    </Label>
                                    {variable.description && (
                                      <p style={{ 
                                        fontSize: '10px', 
                                        color: 'var(--color-muted-foreground)',
                                        margin: '0 0 4px 0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}>
                                        {variable.description}
                                      </p>
                                    )}
                                    <Badge variant="outline" className="badge-xs">
                                      {variable.category}
                                    </Badge>
                                  </div>
                                </div>
                              )}

                              {/* Non-color variables header */}
                              {variable.category !== 'color' && (
                                <>
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 'var(--spacing-2)',
                                    marginBottom: 'var(--spacing-2)'
                                  }}>
                                    {getCategoryIcon(variable.category)}
                                    <Label className="label-mono-md">
                                      {variable.name}
                                    </Label>
                                    <Badge variant="outline" className="badge-spaced badge-sm">
                                      {variable.category}
                                    </Badge>
                                  </div>
                                  {variable.description && (
                                    <p style={{ 
                                      fontSize: '12px', 
                                      color: 'var(--color-muted-foreground)',
                                      margin: '0 0 var(--spacing-2) 0'
                                    }}>
                                      {variable.description}
                                    </p>
                                  )}
                                </>
                              )}

                              {/* Input based on variable type */}
                              {variable.category === 'color' ? (
                                <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'stretch' }}>
                                  <input
                                    type="color"
                                    value={variable.value}
                                    onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                    style={{ 
                                      width: '36px', 
                                      height: '36px', 
                                      border: '2px solid var(--border)',
                                      borderRadius: 'var(--radius)',
                                      cursor: 'pointer',
                                      flexShrink: 0
                                    }}
                                  />
                                  <Input
                                    type="text"
                                    value={variable.value}
                                    onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                    style={{ 
                                      fontFamily: 'monospace', 
                                      fontSize: '11px',
                                      flex: 1
                                    }}
                                    placeholder="#000000"
                                  />
                                </div>
                              ) : variable.category === 'shadow' ? (
                                <>
                                  <div style={{
                                    width: '100%',
                                    height: '48px',
                                    backgroundColor: 'var(--background)',
                                    borderRadius: 'var(--radius)',
                                    boxShadow: variable.value,
                                    marginBottom: 'var(--spacing-2)',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    color: 'var(--color-muted-foreground)'
                                  }}>
                                    Shadow Preview
                                  </div>
                                  <Input
                                    type="text"
                                    value={variable.value}
                                    onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                    style={{ fontFamily: 'monospace', fontSize: '10px' }}
                                  />
                                </>
                              ) : variable.category === 'typography' ? (
                                <>
                                  {variable.name.includes('font-size') || variable.name.includes('text-') ? (
                                    <div style={{
                                      padding: 'var(--spacing-2)',
                                      backgroundColor: 'var(--card)',
                                      borderRadius: 'var(--radius)',
                                      border: '1px solid var(--border)',
                                      marginBottom: 'var(--spacing-2)',
                                      fontSize: variable.value,
                                      fontWeight: variable.name.includes('weight') ? variable.value : undefined
                                    }}>
                                      {variable.name.includes('weight') ? 'Aa' : 'Sample Text'}
                                    </div>
                                  ) : null}
                                  <Input
                                    type="text"
                                    value={variable.value}
                                    onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                    style={{ fontFamily: 'monospace', fontSize: '11px' }}
                                  />
                                </>
                              ) : (
                                <Input
                                  type="text"
                                  value={variable.value}
                                  onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                  style={{ fontFamily: 'monospace', fontSize: '11px' }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        padding: 'var(--spacing-4)',
                        textAlign: 'center',
                        color: 'var(--color-muted-foreground)',
                        backgroundColor: 'var(--background)',
                        borderRadius: 'var(--radius)',
                      }}>
                        No CSS variables detected in this element
                      </div>
                    )}

                    {/* Computed Styles */}
                    <details>
                      <summary style={{ 
                        cursor: 'pointer',
                        color: 'var(--color-muted-foreground)',
                        fontSize: '14px',
                        marginBottom: 'var(--spacing-2)'
                      }}>
                        Computed Styles
                      </summary>
                      <div style={{
                        padding: 'var(--spacing-3)',
                        backgroundColor: 'var(--background)',
                        borderRadius: 'var(--radius)',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}>
                        {Object.entries(inspectedElement.computedStyles).map(([key, value]) => (
                          <div key={key} style={{ marginBottom: 'var(--spacing-1)' }}>
                            <span style={{ color: 'var(--color-muted-foreground)' }}>{key}:</span>{' '}
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ) : (
                  <div style={{
                    padding: 'var(--spacing-8)',
                    textAlign: 'center',
                    color: 'var(--color-muted-foreground)',
                  }}>
                    <Eye size={48} style={{ margin: '0 auto var(--spacing-4)', opacity: 0.3 }} />
                    <p style={{ marginBottom: 'var(--spacing-2)' }}>
                      Click "Inspect" then click any element to see its design tokens
                    </p>
                    <p style={{ fontSize: '13px', opacity: 0.7 }}>
                      Changes you make will apply to all instances using the same tokens
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* All Tokens Tab */}
            <TabsContent value="all" className="ds-tabs-content-flex">
              <div style={{ padding: 'var(--spacing-3)' }}>
                {/* Helper Info Banner */}
                <div style={{
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--color-info-light)',
                  border: '1px solid var(--primary)',
                  borderRadius: 'var(--radius)',
                  marginBottom: 'var(--spacing-3)',
                  display: 'flex',
                  gap: 'var(--spacing-2)',
                  alignItems: 'flex-start'
                }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
                  <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>💡 Token Guide:</strong>
                    <div style={{ opacity: 0.9 }}>
                      • <strong>Hover over a token</strong> to highlight all UI elements using it<br/>
                      • Each token includes <strong>emoji icons</strong> showing its purpose<br/>
                      • <strong>Color tokens</strong> have visual swatches for easy identification<br/>
                      • Use the <strong>category filter</strong> to focus on specific token types<br/>
                      • Changes apply <strong>globally</strong> to all components using that token
                    </div>
                  </div>
                </div>

                {/* Quick Token Legend */}
                <details style={{ marginBottom: 'var(--spacing-3)' }}>
                  <summary style={{
                    padding: 'var(--spacing-2)',
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-medium)',
                    fontFamily: 'var(--font-family-inter)'
                  }}>
                    📖 Token Naming Guide (click to expand)
                  </summary>
                  <div style={{
                    padding: 'var(--spacing-3)',
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderTop: 'none',
                    borderRadius: '0 0 var(--radius) var(--radius)',
                    fontSize: '11px',
                    lineHeight: '1.6',
                    fontFamily: 'var(--font-family-inter)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>🎨 Color Patterns:</strong>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--primary</code> = Main brand color<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--*-foreground</code> = Text on that color<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--color-success</code> = Green/success<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--chart-*</code> = Chart colors
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>📏 Spacing Patterns:</strong>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--spacing-1 to 24</code> = Numeric scale<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--spacing-xs/sm/md</code> = T-shirt sizes<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--grid-gap</code> = Dashboard spacing
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>🔤 Typography Patterns:</strong>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--text-h1/h2/h3</code> = Heading sizes<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--text-base</code> = Body text<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--font-weight-*</code> = Font weights
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>☁️ Other Patterns:</strong>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--elevation-sm/md/lg</code> = Shadows<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--radius</code> = Border radius<br/>
                        • <code style={{ fontSize: '10px', backgroundColor: 'var(--muted)', padding: '1px 4px', borderRadius: '3px' }}>--transition-*</code> = Animation timing
                      </div>
                    </div>
                  </div>
                </details>

                {/* Search and Filter */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 'var(--spacing-2)',
                  marginBottom: 'var(--spacing-3)'
                }}>
                  <div style={{ position: 'relative' }}>
                    <Search 
                      size={16} 
                      style={{ 
                        position: 'absolute', 
                        left: 'var(--spacing-3)', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'var(--color-muted-foreground)'
                      }} 
                    />
                    <Input
                      placeholder="Search tokens... (try: primary, spacing, text-h1)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: 'calc(var(--spacing-3) + 24px)' }}
                    />
                  </div>
                  {searchQuery && (
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--muted-foreground)',
                      fontFamily: 'var(--font-family-inter)'
                    }}>
                      💡 Tip: Descriptions with emoji icons explain what each token does
                    </div>
                  )}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">📚 All Tokens ({cssVariables.length})</SelectItem>
                      <SelectItem value="color">🎨 Colors ({getVariablesByCategory('color').length})</SelectItem>
                      <SelectItem value="typography">🔤 Typography ({getVariablesByCategory('typography').length})</SelectItem>
                      <SelectItem value="spacing">📏 Spacing ({getVariablesByCategory('spacing').length})</SelectItem>
                      <SelectItem value="shadow">☁️ Shadows ({getVariablesByCategory('shadow').length})</SelectItem>
                      <SelectItem value="radius">⚪ Radius ({getVariablesByCategory('radius').length})</SelectItem>
                      <SelectItem value="transition">⚡ Transitions ({getVariablesByCategory('transition').length})</SelectItem>
                      <SelectItem value="other">⚙️ Other ({getVariablesByCategory('other').length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Most Used Tokens - Quick Access */}
                {selectedCategory === 'all' && searchQuery === '' && (
                  <div style={{ marginBottom: 'var(--spacing-4)' }}>
                    <h5 style={{
                      fontSize: '12px',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--muted-foreground)',
                      marginBottom: 'var(--spacing-2)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: 'var(--font-family-inter)'
                    }}>
                      ⭐ Most Used Tokens
                    </h5>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                      gap: 'var(--spacing-2)',
                      marginBottom: 'var(--spacing-3)',
                      padding: 'var(--spacing-2)',
                      backgroundColor: 'var(--card)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)'
                    }}>
                      {cssVariables.filter(v => 
                        ['--primary', '--background', '--foreground', '--spacing-4', '--text-base', '--radius'].includes(v.name)
                      ).map(v => (
                        <div 
                          key={v.name} 
                          style={{
                            padding: 'var(--spacing-2)',
                            backgroundColor: 'var(--background)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '10px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 105, 105, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {v.category === 'color' && (
                            <div style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: v.value,
                              borderRadius: 'var(--radius)',
                              border: '1px solid var(--border)',
                              marginBottom: '4px'
                            }} />
                          )}
                          <div style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '9px',
                            marginBottom: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {v.name}
                          </div>
                          <div style={{ fontSize: '8px', color: 'var(--muted-foreground)' }}>
                            {v.description?.split(' ')[0]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Token List Header */}
                <h5 style={{
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--muted-foreground)',
                  marginBottom: 'var(--spacing-2)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: 'var(--font-family-inter)'
                }}>
                  {selectedCategory === 'all' ? '📚 All Tokens' : `Filtered Tokens`} ({filteredVariables.length})
                </h5>

                {/* Token List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                  {filteredVariables.map((variable) => (
                    <div
                      key={variable.name}
                      style={{
                        padding: 'var(--spacing-2)',
                        backgroundColor: 'var(--background)',
                        borderRadius: 'var(--radius)',
                        border: hoveredVariable === variable.name 
                          ? '2px solid var(--color-chart-2)' 
                          : '1px solid var(--border)',
                        boxShadow: hoveredVariable === variable.name 
                          ? '0 0 0 3px rgba(16, 185, 129, 0.1)' 
                          : 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={() => handleVariableHover(variable.name)}
                      onMouseLeave={() => handleVariableHover(null)}
                    >
                      {/* Show color swatch prominently for color variables */}
                      {variable.category === 'color' ? (
                        <>
                          <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-2)',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            {/* Color preview */}
                            <div style={{
                              width: '48px',
                              height: '48px',
                              backgroundColor: variable.value,
                              borderRadius: 'var(--radius)',
                              border: '2px solid var(--border)',
                              flexShrink: 0,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              cursor: 'pointer',
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Label className="label-variable-compact">
                                {variable.name}
                              </Label>
                              {variable.description && (
                                <div style={{
                                  fontSize: '11px',
                                  color: 'var(--muted-foreground)',
                                  marginTop: '2px',
                                  fontFamily: 'var(--font-family-inter)'
                                }}>
                                  {variable.description}
                                </div>
                              )}
                              <Badge variant="outline" className="badge-xs badge-top-spaced">
                                {variable.category}
                              </Badge>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 'var(--spacing-1)', alignItems: 'stretch' }}>
                            <input
                              type="color"
                              value={variable.value.startsWith('rgba') ? '#000000' : variable.value}
                              onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                              style={{ 
                                width: '42px', 
                                height: '36px', 
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            />
                            <Input
                              type="text"
                              value={variable.value}
                              onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                              style={{ fontFamily: 'monospace', fontSize: '10px', flex: 1 }}
                            />
                          </div>
                        </>
                      ) : variable.category === 'shadow' ? (
                        <>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--spacing-2)',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            {getCategoryIcon(variable.category)}
                            <Label className="label-mono-xs label-flex-1">
                              {variable.name}
                            </Label>
                            <Badge variant="outline" className="badge-xs">
                              {variable.category}
                            </Badge>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '48px',
                            backgroundColor: 'var(--background)',
                            borderRadius: 'var(--radius)',
                            boxShadow: variable.value,
                            marginBottom: 'var(--spacing-2)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            color: 'var(--color-muted-foreground)'
                          }}>
                            Shadow Preview
                          </div>
                          <Input
                            type="text"
                            value={variable.value}
                            onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                            style={{ fontFamily: 'monospace', fontSize: '10px' }}
                          />
                        </>
                      ) : variable.category === 'typography' ? (
                        <>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--spacing-2)',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            {getCategoryIcon(variable.category)}
                            <Label className="label-mono-xs label-flex-1">
                              {variable.name}
                            </Label>
                            <Badge variant="outline" className="badge-xs">
                              {variable.category}
                            </Badge>
                          </div>
                          
                          {/* Font weight dropdown */}
                          {variable.name.includes('weight') ? (
                            <>
                              <div style={{
                                padding: 'var(--spacing-3)',
                                backgroundColor: 'var(--card)',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                marginBottom: 'var(--spacing-2)',
                                fontWeight: variable.value,
                                textAlign: 'center',
                                fontSize: '24px'
                              }}>
                                Aa
                              </div>
                              <Select value={variable.value} onValueChange={(value) => updateCSSVariable(variable.name, value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fontWeightOptions.map(weight => (
                                    <SelectItem key={weight} value={weight}>
                                      {weight === '400' ? 'Regular (400)' :
                                       weight === '500' ? 'Medium (500)' :
                                       weight === '600' ? 'Semibold (600)' :
                                       weight === '700' ? 'Bold (700)' :
                                       'Extrabold (800)'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </>
                          ) : variable.name.includes('font-size') || variable.name.includes('text-') ? (
                            <>
                              <div style={{
                                padding: 'var(--spacing-2)',
                                backgroundColor: 'var(--card)',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                marginBottom: 'var(--spacing-2)',
                                fontSize: variable.value,
                                textAlign: 'center'
                              }}>
                                Sample Text
                              </div>
                              {(() => {
                                const parsed = parseNumericValue(variable.value);
                                if (parsed && (parsed.unit === 'px' || parsed.unit === 'rem')) {
                                  const min = parsed.unit === 'px' ? 8 : 0.5;
                                  const max = parsed.unit === 'px' ? 72 : 4.5;
                                  const step = parsed.unit === 'px' ? 1 : 0.125;
                                  return (
                                    <>
                                      <input
                                        type="range"
                                        min={min}
                                        max={max}
                                        step={step}
                                        value={parsed.num}
                                        onChange={(e) => updateCSSVariable(variable.name, `${e.target.value}${parsed.unit}`)}
                                        style={{ 
                                          width: '100%', 
                                          marginBottom: 'var(--spacing-1)',
                                          accentColor: 'var(--color-primary)'
                                        }}
                                      />
                                      <Input
                                        type="text"
                                        value={variable.value}
                                        onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                        style={{ fontFamily: 'monospace', fontSize: '10px' }}
                                      />
                                    </>
                                  );
                                }
                                return (
                                  <Input
                                    type="text"
                                    value={variable.value}
                                    onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                    style={{ fontFamily: 'monospace', fontSize: '10px' }}
                                  />
                                );
                              })()}
                            </>
                          ) : (
                            <Input
                              type="text"
                              value={variable.value}
                              onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                              style={{ fontFamily: 'monospace', fontSize: '10px' }}
                            />
                          )}
                        </>
                      ) : variable.category === 'spacing' ? (
                        <>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--spacing-2)',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            {getCategoryIcon(variable.category)}
                            <Label className="label-mono-xs label-flex-1">
                              {variable.name}
                            </Label>
                            <Badge variant="outline" className="badge-xs">
                              {variable.category}
                            </Badge>
                          </div>
                          {/* Visual spacing preview */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-2)',
                            marginBottom: 'var(--spacing-2)',
                            padding: 'var(--spacing-2)',
                            backgroundColor: 'var(--card)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                          }}>
                            <div style={{
                              width: '12px',
                              height: '32px',
                              backgroundColor: 'var(--color-primary)',
                              borderRadius: '2px'
                            }} />
                            <div style={{
                              width: variable.value,
                              height: '2px',
                              backgroundColor: 'var(--color-chart-2)',
                            }} />
                            <div style={{
                              width: '12px',
                              height: '32px',
                              backgroundColor: 'var(--color-primary)',
                              borderRadius: '2px'
                            }} />
                          </div>
                          {(() => {
                            const parsed = parseNumericValue(variable.value);
                            if (parsed && (parsed.unit === 'px' || parsed.unit === 'rem')) {
                              const min = parsed.unit === 'px' ? 0 : 0;
                              const max = parsed.unit === 'px' ? 96 : 6;
                              const step = parsed.unit === 'px' ? 2 : 0.25;
                              return (
                                <>
                                  <input
                                    type="range"
                                    min={min}
                                    max={max}
                                    step={step}
                                    value={parsed.num}
                                    onChange={(e) => updateCSSVariable(variable.name, `${e.target.value}${parsed.unit}`)}
                                    style={{ 
                                      width: '100%', 
                                      marginBottom: 'var(--spacing-1)',
                                      accentColor: 'var(--color-primary)'
                                    }}
                                  />
                                  <Input
                                    type="text"
                                    value={variable.value}
                                    onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                    style={{ fontFamily: 'monospace', fontSize: '10px' }}
                                  />
                                </>
                              );
                            }
                            return (
                              <Input
                                type="text"
                                value={variable.value}
                                onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                style={{ fontFamily: 'monospace', fontSize: '10px' }}
                              />
                            );
                          })()}
                        </>
                      ) : variable.category === 'radius' ? (
                        <>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--spacing-2)',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            {getCategoryIcon(variable.category)}
                            <Label className="label-mono-xs label-flex-1">
                              {variable.name}
                            </Label>
                            <Badge variant="outline" className="badge-xs">
                              {variable.category}
                            </Badge>
                          </div>
                          {/* Radius preview */}
                          <div style={{
                            width: '100%',
                            height: '48px',
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: variable.value,
                            marginBottom: 'var(--spacing-2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '11px'
                          }}>
                            Preview
                          </div>
                          {(() => {
                            const parsed = parseNumericValue(variable.value);
                            if (parsed && parsed.unit === 'px') {
                              return (
                                <>
                                  <input
                                    type="range"
                                    min={0}
                                    max={24}
                                    step={1}
                                    value={parsed.num}
                                    onChange={(e) => updateCSSVariable(variable.name, `${e.target.value}px`)}
                                    style={{ 
                                      width: '100%', 
                                      marginBottom: 'var(--spacing-1)',
                                      accentColor: 'var(--color-primary)'
                                    }}
                                  />
                                  <Input
                                    type="text"
                                    value={variable.value}
                                    onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                    style={{ fontFamily: 'monospace', fontSize: '10px' }}
                                  />
                                </>
                              );
                            }
                            return (
                              <Input
                                type="text"
                                value={variable.value}
                                onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                                style={{ fontFamily: 'monospace', fontSize: '10px' }}
                              />
                            );
                          })()}
                        </>
                      ) : (
                        <>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--spacing-2)',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            {getCategoryIcon(variable.category)}
                            <Label className="label-mono-xs label-flex-1">
                              {variable.name}
                            </Label>
                            <Badge variant="outline" className="badge-xs">
                              {variable.category}
                            </Badge>
                          </div>
                          <Input
                            type="text"
                            value={variable.value}
                            onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                            style={{ fontFamily: 'monospace', fontSize: '10px' }}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {filteredVariables.length === 0 && (
                  <div style={{
                    padding: 'var(--spacing-8)',
                    textAlign: 'center',
                    color: 'var(--color-muted-foreground)',
                  }}>
                    No tokens found
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="ds-tabs-content-flex">
              <div style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                <div>
                  <h4 style={{ marginBottom: 'var(--spacing-2)' }}>Component Library</h4>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                    Interactive showcase of all design system components
                  </p>
                </div>
                
                {/* Typography */}
                <ComponentSection title="Typography" description="Headings, paragraphs, and text styles">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <h4>Heading 4</h4>
                    <h5>Heading 5</h5>
                    <h6>Heading 6</h6>
                    <Separator />
                    <p>This is a regular paragraph. It demonstrates the default body text style used throughout the application.</p>
                    <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                      This is muted text, often used for secondary information or descriptions.
                    </p>
                    <p style={{ fontSize: '12px' }}>This is small text, used for captions and footnotes.</p>
                  </div>
                </ComponentSection>

                {/* Buttons */}
                <ComponentSection title="Buttons" description="Action triggers with multiple variants and sizes">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><User size={16} /></Button>
                  </div>
                </ComponentSection>

                {/* Form Inputs */}
                <ComponentSection title="Form Inputs" description="Text input fields with labels">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <div>
                      <Label>Username</Label>
                      <Input placeholder="Enter username" />
                    </div>
                    <div>
                      <Label>Email (disabled)</Label>
                      <Input placeholder="email@example.com" disabled value="locked@example.com" />
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea placeholder="Type your message..." rows={3} />
                    </div>
                  </div>
                </ComponentSection>

                {/* Select & Dropdowns */}
                <ComponentSection title="Select & Dropdowns" description="Selection components with multiple sizes">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <div>
                      <Label>Small Select</Label>
                      <Select size="sm" defaultValue="apple">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Medium Select (Default)</Label>
                      <Select size="md" defaultValue="blue">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ComponentSection>

                {/* Form Controls */}
                <ComponentSection title="Form Controls" description="Checkboxes, switches, and radio buttons">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">Accept terms and conditions</Label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                    <div>
                      <Label>Choose an option</Label>
                      <RadioGroup defaultValue="option1" style={{ marginTop: 'var(--spacing-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <RadioGroupItem value="option1" id="r1" />
                          <Label htmlFor="r1">Option 1</Label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <RadioGroupItem value="option2" id="r2" />
                          <Label htmlFor="r2">Option 2</Label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <RadioGroupItem value="option3" id="r3" />
                          <Label htmlFor="r3">Option 3</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </ComponentSection>

                {/* Cards */}
                <ComponentSection title="Cards" description="Container components for grouping content">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description goes here</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p style={{ fontSize: '14px' }}>This is the card content area where you can place any components or information.</p>
                    </CardContent>
                  </Card>
                </ComponentSection>

                {/* Badges */}
                <ComponentSection title="Badges" description="Labels and status indicators">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                  </div>
                </ComponentSection>

                {/* Alerts */}
                <ComponentSection title="Alerts" description="Important messages and notifications">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <Alert>
                      <AlertCircle size={16} />
                      <AlertTitle>Information</AlertTitle>
                      <AlertDescription>This is an informational alert message.</AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertCircle size={16} />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>Something went wrong with your request.</AlertDescription>
                    </Alert>
                  </div>
                </ComponentSection>

                {/* Avatar */}
                <ComponentSection title="Avatar" description="User profile images with fallbacks">
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                  </div>
                </ComponentSection>

                {/* Progress */}
                <ComponentSection title="Progress" description="Progress indicators">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <div>
                      <Label style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>25% Complete</Label>
                      <Progress value={25} />
                    </div>
                    <div>
                      <Label style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>75% Complete</Label>
                      <Progress value={75} />
                    </div>
                  </div>
                </ComponentSection>

                {/* Separator */}
                <ComponentSection title="Separator" description="Visual dividers">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <div>Content above separator</div>
                    <Separator />
                    <div>Content below separator</div>
                  </div>
                </ComponentSection>

                {/* Skeleton */}
                <ComponentSection title="Skeleton" description="Loading placeholders">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <Skeleton style={{ height: '20px', width: '100%' }} />
                    <Skeleton style={{ height: '20px', width: '80%' }} />
                    <Skeleton style={{ height: '20px', width: '60%' }} />
                  </div>
                </ComponentSection>

                {/* Page Layout Components */}
                <ComponentSection title="PageHeader" description="Page-level header with title, actions, and metadata">
                  <PageHeader
                    title="Dashboard Overview"
                    subtitle="View and manage your analytics"
                    actions={
                      <>
                        <Button variant="outline" size="sm">
                          <Settings size={16} />
                          Settings
                        </Button>
                        <Button size="sm">
                          <TrendingUp size={16} />
                          Create Report
                        </Button>
                      </>
                    }
                  />
                </ComponentSection>

                {/* Chart Header */}
                <ComponentSection title="ChartHeader" description="Header for charts with title and drill-down hints">
                  <ChartHeader
                    title="Performance Metrics"
                    description="Monthly performance overview"
                    currentLevel="Company Level"
                    drillDownHint="Click any bar to drill down"
                  />
                </ComponentSection>

                {/* FlatCard */}
                <ComponentSection title="FlatCard" description="Flat card without shadow for minimalist design">
                  <FlatCard>
                    <div style={{ padding: 'var(--spacing-4)' }}>
                      <h4>Flat Card Example</h4>
                      <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-2)' }}>
                        This is a flat card component with no shadow.
                      </p>
                    </div>
                  </FlatCard>
                </ComponentSection>

                {/* OverviewTileCard */}
                <ComponentSection title="OverviewTileCard" description="Card component for overview tiles">
                  <OverviewTileCard>
                    <div style={{ padding: 'var(--spacing-4)' }}>
                      <h4>Overview Tile</h4>
                      <p style={{ fontSize: '24px', marginTop: 'var(--spacing-2)' }}>1,234</p>
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Total Items</p>
                    </div>
                  </OverviewTileCard>
                </ComponentSection>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
