import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './design-system/Button';
import { Card, CardTitle } from './design-system/Card';
import { Badge } from './design-system/Badge';
import { ScrollArea } from './design-system/ScrollArea';
import { Separator } from './design-system/Separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './design-system/Dialog';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Textarea } from './design-system/Textarea';
import { MousePointer, X, Eye, Code, Layers, Save, FolderOpen, Download, Upload, Trash2, Play } from 'lucide-react';
import { 
  loadConfigurations, 
  saveConfiguration, 
  deleteConfiguration, 
  applyConfiguration,
  getUniqueSelector,
  type InspectorConfiguration,
  type ElementModification
} from '../lib/inspectorConfigService';

interface InspectedElement {
  tagName: string;
  className: string;
  id: string;
  computedStyles: Record<string, string>;
  attributes: Record<string, string>;
  dimensions: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  hierarchy: string[];
  element: HTMLElement; // Store reference to the actual DOM element
}

interface ElementInspectorProps {
  onClose?: () => void;
}

export function ElementInspector({ onClose }: ElementInspectorProps) {
  const [isActive, setIsActive] = useState(false);
  const [inspectedElement, setInspectedElement] = useState<InspectedElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  
  // Configuration management
  const [modifications, setModifications] = useState<ElementModification[]>([]);
  const [savedConfigs, setSavedConfigs] = useState<InspectorConfiguration[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [configName, setConfigName] = useState('');
  const [configDescription, setConfigDescription] = useState('');

  // Style properties we care about for inspection
  const relevantStyleProps = [
    'display',
    'position',
    'width',
    'height',
    'margin',
    'padding',
    'background-color',
    'color',
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'letter-spacing',
    'border',
    'border-radius',
    'box-shadow',
    'flex-direction',
    'justify-content',
    'align-items',
    'gap',
    'grid-template-columns',
    'grid-gap',
  ];

  const getElementHierarchy = (element: HTMLElement): string[] => {
    const hierarchy: string[] = [];
    let current: HTMLElement | null = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        // Handle both HTML elements (string) and SVG elements (SVGAnimatedString)
        const classNameValue = typeof current.className === 'string' 
          ? current.className 
          : (current.className as any).baseVal || '';
        const classes = classNameValue.split(' ').filter((c: string) => c.trim());
        if (classes.length > 0) {
          selector += `.${classes[0]}`;
        }
      }
      hierarchy.unshift(selector);
      current = current.parentElement;
    }
    
    return hierarchy;
  };

  const inspectElement = (element: HTMLElement) => {
    const computedStyles = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    const styles: Record<string, string> = {};
    relevantStyleProps.forEach(prop => {
      const value = computedStyles.getPropertyValue(prop);
      if (value) {
        styles[prop] = value;
      }
    });

    const attributes: Record<string, string> = {};
    Array.from(element.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
    });

    setInspectedElement({
      tagName: element.tagName.toLowerCase(),
      className: typeof element.className === 'string' 
        ? element.className 
        : (element.className as any).baseVal || '',
      id: element.id,
      computedStyles: styles,
      attributes,
      dimensions: {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      },
      hierarchy: getElementHierarchy(element),
      element, // Store reference to the actual element
    });
  };

  // Get available tag options based on current tag
  const getTagOptions = (currentTag: string): string[] => {
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
    const containerTags = ['div', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav'];
    const inlineTags = ['span', 'a', 'strong', 'em', 'small', 'mark'];
    const buttonTags = ['button', 'a'];
    
    if (headingTags.includes(currentTag)) {
      return headingTags;
    } else if (containerTags.includes(currentTag)) {
      return containerTags;
    } else if (inlineTags.includes(currentTag)) {
      return inlineTags;
    } else if (currentTag === 'button') {
      return buttonTags;
    }
    
    // Default fallback
    return [currentTag];
  };

  // Change the tag of the inspected element
  const changeElementTag = (newTag: string) => {
    if (!inspectedElement) {
      console.warn('[ElementInspector] No element inspected');
      return;
    }
    
    const oldElement = inspectedElement.element;
    
    if (!oldElement || !oldElement.parentNode) {
      console.warn('[ElementInspector] Element no longer in DOM');
      return;
    }
    
    console.log(`[ElementInspector] Changing tag from <${inspectedElement.tagName}> to <${newTag}>`);
    
    const selector = getUniqueSelector(oldElement);
    const originalTag = inspectedElement.tagName;
    
    const newElement = document.createElement(newTag);
    
    // Copy all attributes
    Array.from(oldElement.attributes).forEach(attr => {
      newElement.setAttribute(attr.name, attr.value);
    });
    
    // Copy all children  
    while (oldElement.firstChild) {
      newElement.appendChild(oldElement.firstChild);
    }
    
    // Copy inline styles to preserve appearance
    if (oldElement.style.cssText) {
      newElement.style.cssText = oldElement.style.cssText;
    }
    
    // Replace in DOM
    oldElement.parentNode.replaceChild(newElement, oldElement);
    
    console.log('[ElementInspector] Tag changed successfully in DOM');
    
    // Track this modification
    const modification: ElementModification = {
      selector,
      originalTag,
      newTag,
      timestamp: Date.now(),
    };
    
    setModifications(prev => {
      // Update existing or add new
      const existing = prev.findIndex(m => m.selector === selector);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = modification;
        return updated;
      }
      return [...prev, modification];
    });
    
    // Re-inspect the new element
    inspectElement(newElement);
  };

  // Load saved configurations
  useEffect(() => {
    setSavedConfigs(loadConfigurations());
  }, []);

  // Save current modifications as a configuration
  const handleSaveConfiguration = () => {
    if (!configName.trim()) return;
    
    const config = saveConfiguration({
      name: configName.trim(),
      description: configDescription.trim() || undefined,
      modifications,
    });
    
    setSavedConfigs(prev => [...prev, config]);
    setConfigName('');
    setConfigDescription('');
    setShowSaveDialog(false);
    
    // Show success message
    console.log('✅ Configuration saved:', config.name);
  };

  // Apply a saved configuration
  const handleApplyConfiguration = (config: InspectorConfiguration) => {
    const result = applyConfiguration(config);
    console.log(`✅ Applied configuration: ${result.success} success, ${result.failed} failed`);
    if (result.errors.length > 0) {
      console.error('Errors:', result.errors);
    }
    setShowLoadDialog(false);
  };

  // Delete a configuration
  const handleDeleteConfiguration = (id: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      deleteConfiguration(id);
      setSavedConfigs(prev => prev.filter(c => c.id !== id));
    }
  };

  // Export configurations
  const handleExportConfigurations = () => {
    const configs = loadConfigurations();
    const json = JSON.stringify(configs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspector-configs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear all modifications
  const handleClearModifications = () => {
    if (confirm('Clear all unsaved modifications?')) {
      setModifications([]);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    
    // Ignore the overlay itself and the inspector panel
    const target = e.target as HTMLElement;
    if (target.closest('.element-inspector-overlay') || 
        target.closest('.element-inspector-panel')) {
      return;
    }

    setHoveredElement(target);
    
    // Draw highlight
    if (overlayRef.current) {
      const rect = target.getBoundingClientRect();
      overlayRef.current.style.left = `${rect.left}px`;
      overlayRef.current.style.top = `${rect.top}px`;
      overlayRef.current.style.width = `${rect.width}px`;
      overlayRef.current.style.height = `${rect.height}px`;
      overlayRef.current.style.display = 'block';
    }
  }, [isActive]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('.element-inspector-overlay') || 
        target.closest('.element-inspector-panel')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    inspectElement(target);
    setIsActive(false);
    
    if (overlayRef.current) {
      overlayRef.current.style.display = 'none';
    }
  }, [isActive]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isActive) {
      setIsActive(false);
      if (overlayRef.current) {
        overlayRef.current.style.display = 'none';
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleClick, true);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.cursor = 'crosshair';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.cursor = '';
    };
  }, [isActive, handleMouseMove, handleClick, handleKeyDown]);

  const toggleInspector = () => {
    setIsActive(!isActive);
    if (isActive && overlayRef.current) {
      overlayRef.current.style.display = 'none';
    }
  };

  const identifyComponent = (className: string): string | null => {
    // Try to identify which design system component this is
    const componentMap: Record<string, string> = {
      'button': 'Button',
      'input': 'Input',
      'card': 'Card',
      'badge': 'Badge',
      'alert': 'Alert',
      'dialog': 'Dialog',
      'select': 'Select',
      'checkbox': 'Checkbox',
      'switch': 'Switch',
      'tabs': 'Tabs',
      'table': 'Table',
      'separator': 'Separator',
      'avatar': 'Avatar',
      'progress': 'Progress',
      'skeleton': 'Skeleton',
      'textarea': 'Textarea',
      'label': 'Label',
    };

    const classes = className.toLowerCase().split(' ');
    for (const [key, component] of Object.entries(componentMap)) {
      if (classes.some(c => c.includes(key))) {
        return component;
      }
    }
    
    return null;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Hover overlay */}
      {isActive && (
        <div
          ref={overlayRef}
          className="element-inspector-overlay"
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            border: '2px solid #3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            zIndex: 999999,
            display: 'none',
          }}
        />
      )}

      {/* Header */}
      <div style={{ 
        padding: 'var(--spacing-3) var(--spacing-4)', 
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--muted/50)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        flexShrink: 0
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <h3 style={{ margin: 0, fontSize: '14px' }}>Element Inspector</h3>
            {isActive && <Badge variant="default" style={{ fontSize: '10px', padding: '2px 6px' }}>Inspecting...</Badge>}
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--muted-foreground)', fontSize: '11px', lineHeight: '1.4' }}>
            {isActive ? 'Click on any element to inspect it. Press ESC to cancel.' : 'Inspect elements to see their styles and properties'}
          </p>
        </div>
        <Button 
          variant={isActive ? "default" : "outline"}
          onClick={toggleInspector}
          size="sm"
          style={{ width: '100%' }}
        >
          <MousePointer size={14} style={{ marginRight: 'var(--spacing-2)' }} />
          {isActive ? 'Cancel' : 'Start Inspecting'}
        </Button>
        
        {/* Configuration Actions */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-2)',
          paddingTop: 'var(--spacing-2)',
          borderTop: '1px solid var(--border)'
        }}>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                style={{ flex: 1 }}
                disabled={modifications.length === 0}
              >
                <Save size={14} style={{ marginRight: 'var(--spacing-1)' }} />
                Save
                {modifications.length > 0 && (
                  <Badge 
                    variant="default" 
                    style={{ 
                      marginLeft: 'var(--spacing-2)', 
                      fontSize: '10px', 
                      padding: '0 4px',
                      minWidth: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {modifications.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Configuration</DialogTitle>
                <DialogDescription>
                  Save your element modifications to reuse later
                </DialogDescription>
              </DialogHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                  <Label htmlFor="config-name">Configuration Name</Label>
                  <Input
                    id="config-name"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="e.g., Homepage Headings Update"
                  />
                </div>
                <div>
                  <Label htmlFor="config-description">Description (Optional)</Label>
                  <Textarea
                    id="config-description"
                    value={configDescription}
                    onChange={(e) => setConfigDescription(e.target.value)}
                    placeholder="Describe what this configuration does..."
                    rows={3}
                  />
                </div>
                <div style={{ 
                  padding: 'var(--spacing-3)', 
                  backgroundColor: 'var(--muted)', 
                  borderRadius: 'var(--radius)' 
                }}>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>
                    <strong>{modifications.length}</strong> modification{modifications.length !== 1 ? 's' : ''} will be saved
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveConfiguration} disabled={!configName.trim()}>
                  <Save size={14} style={{ marginRight: 'var(--spacing-2)' }} />
                  Save Configuration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" style={{ flex: 1 }}>
                <FolderOpen size={14} style={{ marginRight: 'var(--spacing-1)' }} />
                Load
              </Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: '600px' }}>
              <DialogHeader>
                <DialogTitle>Load Configuration</DialogTitle>
                <DialogDescription>
                  Apply a saved configuration to the current page
                </DialogDescription>
              </DialogHeader>
              <ScrollArea style={{ maxHeight: '400px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', padding: 'var(--spacing-2)' }}>
                  {savedConfigs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--muted-foreground)' }}>
                      <FolderOpen size={48} style={{ margin: '0 auto var(--spacing-4)', opacity: 0.3 }} />
                      <p>No saved configurations yet</p>
                    </div>
                  ) : (
                    savedConfigs.map(config => (
                      <Card key={config.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <CardTitle>{config.name}</CardTitle>
                            {config.description && (
                              <p className="card-description" style={{ marginTop: 'var(--spacing-1)' }}>
                                {config.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteConfiguration(config.id)}
                            style={{ marginLeft: 'var(--spacing-2)' }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-4)' }}>
                          <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                            {config.modifications.length} modification{config.modifications.length !== 1 ? 's' : ''}
                            <br />
                            <span style={{ fontSize: '11px' }}>
                              {new Date(config.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleApplyConfiguration(config)}
                          >
                            <Play size={14} style={{ marginRight: 'var(--spacing-2)' }} />
                            Apply
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" onClick={handleExportConfigurations}>
                  <Download size={14} style={{ marginRight: 'var(--spacing-2)' }} />
                  Export All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Modifications Counter */}
        {modifications.length > 0 && (
          <div style={{ 
            padding: 'var(--spacing-2)', 
            backgroundColor: 'var(--primary/10)', 
            borderRadius: 'var(--radius)',
            fontSize: '11px',
            textAlign: 'center'
          }}>
            {modifications.length} unsaved modification{modifications.length !== 1 ? 's' : ''}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearModifications}
              style={{ marginLeft: 'var(--spacing-2)', height: '20px', padding: '0 var(--spacing-2)', fontSize: '10px' }}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScrollArea style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: 'var(--spacing-4)' }}>
            {!inspectedElement && (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-8)',
                color: 'var(--muted-foreground)'
              }}>
                <MousePointer size={48} style={{ margin: '0 auto var(--spacing-4)', opacity: 0.3 }} />
                <p>Click "Start Inspecting" and then click on any element on the page to inspect it.</p>
              </div>
            )}

            {inspectedElement && (
              <>
                {/* Element Overview */}
                <Card style={{ marginBottom: 'var(--spacing-6)' }}>
                  <CardTitle>Element Information</CardTitle>
                  <p className="card-description">Basic details about the selected element</p>
                    {/* React Warning */}
                    <div style={{ 
                      padding: 'var(--spacing-3)', 
                      backgroundColor: 'var(--color-warning-light)', 
                      border: '1px solid var(--color-warning)',
                      borderRadius: 'var(--radius)',
                      marginBottom: 'var(--spacing-4)',
                      fontSize: '12px',
                      lineHeight: '1.5'
                    }}>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-warning)', marginBottom: 'var(--spacing-1)' }}>
                        ⚠️ React-Managed Element
                      </div>
                      <div style={{ color: 'var(--foreground)' }}>
                        Changes to this element's tag will be <strong>temporary</strong>. React will revert them on the next render. 
                        To make permanent changes, edit the source code in the component file.
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        <span style={{ color: 'var(--muted-foreground)' }}>Tag:</span>
                        <Select 
                          value={inspectedElement.tagName}
                          onValueChange={changeElementTag}
                        >
                          <SelectTrigger style={{ width: '180px', height: '32px' }}>
                            <code style={{ fontFamily: 'monospace' }}>
                              &lt;{inspectedElement.tagName}&gt;
                            </code>
                          </SelectTrigger>
                          <SelectContent>
                            {getTagOptions(inspectedElement.tagName).map((tag) => {
                              // Render preview based on tag type
                              const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag);
                              const isParagraph = tag === 'p';
                              
                              return (
                                <SelectItem key={tag} value={tag}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', padding: 'var(--spacing-1) 0' }}>
                                    <code style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--muted-foreground)' }}>
                                      &lt;{tag}&gt;
                                    </code>
                                    {(isHeading || isParagraph) && (
                                      <div style={{ 
                                        fontSize: tag === 'h1' ? '32px' : 
                                                 tag === 'h2' ? '24px' : 
                                                 tag === 'h3' ? '20px' : 
                                                 tag === 'h4' ? '18px' : 
                                                 tag === 'h5' ? '16px' : 
                                                 tag === 'h6' ? '14px' : '14px',
                                        fontWeight: isHeading ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                                        color: 'var(--foreground)',
                                        lineHeight: '1.2',
                                        maxWidth: '200px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}>
                                        {isHeading ? 'Heading Preview' : 'Paragraph text'}
                                      </div>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      {identifyComponent(inspectedElement.className) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--muted-foreground)' }}>Component:</span>
                          <Badge variant="default">{identifyComponent(inspectedElement.className)}</Badge>
                        </div>
                      )}
                      {inspectedElement.id && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--muted-foreground)' }}>ID:</span>
                          <code style={{ fontFamily: 'monospace', backgroundColor: 'var(--muted)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                            #{inspectedElement.id}
                          </code>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--muted-foreground)' }}>Dimensions:</span>
                        <span>{Math.round(inspectedElement.dimensions.width)} × {Math.round(inspectedElement.dimensions.height)}px</span>
                      </div>
                    </div>
                </Card>

                {/* Element Hierarchy */}
                <Card style={{ marginBottom: 'var(--spacing-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Layers size={18} />
                    <CardTitle>Element Hierarchy</CardTitle>
                  </div>
                  <p className="card-description">Path from body to selected element</p>
                  <div style={{ fontFamily: 'monospace', fontSize: 'var(--text-detail)', lineHeight: '1.6' }}>
                    {inspectedElement.hierarchy.map((tag, i) => (
                      <div key={i} style={{ paddingLeft: `${i * 16}px`, color: i === inspectedElement.hierarchy.length - 1 ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Classes */}
                {inspectedElement.className && (
                  <Card style={{ marginBottom: 'var(--spacing-6)' }}>
                    <CardTitle>CSS Classes</CardTitle>
                    <p className="card-description">Applied class names</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                      {inspectedElement.className.split(' ').filter(c => c.trim()).map((className, i) => (
                        <Badge key={i} variant="outline">
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Computed Styles */}
                <Card style={{ marginBottom: 'var(--spacing-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Code size={18} />
                    <CardTitle>Computed Styles</CardTitle>
                  </div>
                  <p className="card-description">Resolved CSS properties</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                      {Object.entries(inspectedElement.computedStyles).map(([prop, value]) => (
                        <div 
                          key={prop} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-2) 0',
                            borderBottom: '1px solid var(--border)',
                            fontSize: 'var(--text-detail)'
                          }}
                        >
                          <span style={{ color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>
                            {prop}:
                          </span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 'var(--font-weight-medium)' }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                </Card>

                {/* Attributes */}
                {Object.keys(inspectedElement.attributes).length > 0 && (
                  <Card style={{ marginBottom: 'var(--spacing-6)' }}>
                    <CardTitle>HTML Attributes</CardTitle>
                    <p className="card-description">Element attributes</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                      {Object.entries(inspectedElement.attributes)
                        .filter(([name]) => name !== 'class' && name !== 'id') // Already shown above
                        .map(([name, value]) => (
                          <div 
                            key={name} 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              padding: 'var(--spacing-2) 0',
                              borderBottom: '1px solid var(--border)',
                              fontSize: 'var(--text-detail)'
                            }}
                          >
                            <span style={{ color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>
                              {name}:
                            </span>
                            <span style={{ fontFamily: 'monospace', maxWidth: '60%', wordBreak: 'break-all' }}>
                              {value}
                            </span>
                          </div>
                        ))}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}