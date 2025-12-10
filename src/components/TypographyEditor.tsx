import React, { useState, useEffect } from 'react';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Card, CardDescription, CardTitle } from './design-system/Card';
import { ScrollArea } from './design-system/ScrollArea';
import { Badge } from './design-system/Badge';
import { Separator } from './design-system/Separator';
import { Edit3, Check, X, RotateCcw, Download } from 'lucide-react';

interface TypographyStyle {
  id: string;
  name: string;
  cssVariable: string;
  currentValue: string;
  defaultValue: string;
  category: 'size' | 'weight' | 'spacing' | 'family' | 'lineHeight';
  description: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function TypographyEditor() {
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  // Typography definitions
  const typographyStyles: TypographyStyle[] = [
    // Font Sizes
    { id: 'h1', name: 'Heading 1', cssVariable: '--text-h1', currentValue: '36px', defaultValue: '36px', category: 'size', description: 'Main page titles', unit: 'px', min: 24, max: 72, step: 2 },
    { id: 'h2', name: 'Heading 2', cssVariable: '--text-h2', currentValue: '28px', defaultValue: '28px', category: 'size', description: 'Section headings', unit: 'px', min: 20, max: 48, step: 2 },
    { id: 'h3', name: 'Heading 3', cssVariable: '--text-h3', currentValue: '20px', defaultValue: '20px', category: 'size', description: 'Subsection headings', unit: 'px', min: 16, max: 32, step: 1 },
    { id: 'h4', name: 'Heading 4', cssVariable: '--text-h4', currentValue: '16px', defaultValue: '16px', category: 'size', description: 'Card titles, labels', unit: 'px', min: 14, max: 24, step: 1 },
    { id: 'body', name: 'Body Text', cssVariable: '--text-body', currentValue: '14px', defaultValue: '14px', category: 'size', description: 'Default paragraph text', unit: 'px', min: 12, max: 20, step: 1 },
    { id: 'large', name: 'Large Text', cssVariable: '--text-large', currentValue: '16px', defaultValue: '16px', category: 'size', description: 'Emphasized content', unit: 'px', min: 14, max: 24, step: 1 },
    { id: 'detail', name: 'Detail Text', cssVariable: '--text-detail', currentValue: '12px', defaultValue: '12px', category: 'size', description: 'Captions, helper text', unit: 'px', min: 10, max: 16, step: 1 },
    { id: 'button', name: 'Button Text', cssVariable: '--text-button', currentValue: '14px', defaultValue: '14px', category: 'size', description: 'Button labels', unit: 'px', min: 12, max: 18, step: 1 },
    { id: 'label', name: 'Label Text', cssVariable: '--text-label', currentValue: '12px', defaultValue: '12px', category: 'size', description: 'Form labels', unit: 'px', min: 10, max: 16, step: 1 },
    
    // Line Heights
    { id: 'lh-tight', name: 'Line Height - Tight', cssVariable: '--line-height-tight', currentValue: '1.25', defaultValue: '1.25', category: 'lineHeight', description: 'For headings', unit: '', min: 1, max: 2, step: 0.05 },
    { id: 'lh-normal', name: 'Line Height - Normal', cssVariable: '--line-height-normal', currentValue: '1.5', defaultValue: '1.5', category: 'lineHeight', description: 'For body text', unit: '', min: 1, max: 2, step: 0.05 },
    { id: 'lh-relaxed', name: 'Line Height - Relaxed', cssVariable: '--line-height-relaxed', currentValue: '1.625', defaultValue: '1.625', category: 'lineHeight', description: 'For comfortable reading', unit: '', min: 1, max: 2, step: 0.05 },
    
    // Font Weights
    { id: 'fw-light', name: 'Font Weight - Light', cssVariable: '--font-weight-light', currentValue: '300', defaultValue: '300', category: 'weight', description: 'Light emphasis', unit: '', min: 100, max: 900, step: 100 },
    { id: 'fw-normal', name: 'Font Weight - Normal', cssVariable: '--font-weight-normal', currentValue: '400', defaultValue: '400', category: 'weight', description: 'Regular text', unit: '', min: 100, max: 900, step: 100 },
    { id: 'fw-medium', name: 'Font Weight - Medium', cssVariable: '--font-weight-medium', currentValue: '500', defaultValue: '500', category: 'weight', description: 'Slight emphasis', unit: '', min: 100, max: 900, step: 100 },
    { id: 'fw-semibold', name: 'Font Weight - Semibold', cssVariable: '--font-weight-semibold', currentValue: '600', defaultValue: '600', category: 'weight', description: 'Moderate emphasis', unit: '', min: 100, max: 900, step: 100 },
    { id: 'fw-bold', name: 'Font Weight - Bold', cssVariable: '--font-weight-bold', currentValue: '700', defaultValue: '700', category: 'weight', description: 'Strong emphasis', unit: '', min: 100, max: 900, step: 100 },
    
    // Letter Spacing
    { id: 'ls-tight', name: 'Letter Spacing - Tight', cssVariable: '--letter-spacing-tight', currentValue: '-0.025em', defaultValue: '-0.025em', category: 'spacing', description: 'Compact headings', unit: 'em', min: -0.1, max: 0.2, step: 0.005 },
    { id: 'ls-normal', name: 'Letter Spacing - Normal', cssVariable: '--letter-spacing-normal', currentValue: '0em', defaultValue: '0em', category: 'spacing', description: 'Default spacing', unit: 'em', min: -0.1, max: 0.2, step: 0.005 },
    { id: 'ls-wide', name: 'Letter Spacing - Wide', cssVariable: '--letter-spacing-wide', currentValue: '0.025em', defaultValue: '0.025em', category: 'spacing', description: 'Loose spacing', unit: 'em', min: -0.1, max: 0.2, step: 0.005 },
  ];

  // Apply CSS variable changes in real-time
  useEffect(() => {
    Object.entries(edits).forEach(([id, value]) => {
      const style = typographyStyles.find(s => s.id === id);
      if (style) {
        document.documentElement.style.setProperty(style.cssVariable, value);
      }
    });
  }, [edits]);

  const handleStartEdit = (style: TypographyStyle) => {
    setEditingId(style.id);
    setTempValue(edits[style.id] || style.currentValue);
  };

  const handleTempValueChange = (style: TypographyStyle, value: string) => {
    setTempValue(value);
    // Apply live feedback as user types
    if (value.trim()) {
      document.documentElement.style.setProperty(style.cssVariable, value);
    }
  };

  const handleSaveEdit = (style: TypographyStyle) => {
    if (tempValue.trim()) {
      setEdits(prev => ({ ...prev, [style.id]: tempValue }));
      document.documentElement.style.setProperty(style.cssVariable, tempValue);
    }
    setEditingId(null);
    setTempValue('');
  };

  const handleCancelEdit = (style: TypographyStyle) => {
    // Restore the original value when canceling
    const originalValue = edits[style.id] || style.currentValue;
    document.documentElement.style.setProperty(style.cssVariable, originalValue);
    setEditingId(null);
    setTempValue('');
  };

  const handleReset = (styleId: string) => {
    const style = typographyStyles.find(s => s.id === styleId);
    if (style) {
      document.documentElement.style.setProperty(style.cssVariable, style.defaultValue);
      setEdits(prev => {
        const newEdits = { ...prev };
        delete newEdits[styleId];
        return newEdits;
      });
    }
  };

  const handleResetAll = () => {
    typographyStyles.forEach(style => {
      document.documentElement.style.setProperty(style.cssVariable, style.defaultValue);
    });
    setEdits({});
  };

  const handleExport = () => {
    const cssOutput = typographyStyles
      .filter(style => edits[style.id])
      .map(style => `  ${style.cssVariable}: ${edits[style.id]};`)
      .join('\n');
    
    const fullCss = `:root {\n${cssOutput}\n}`;
    
    const blob = new Blob([fullCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typography-overrides.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCurrentValue = (style: TypographyStyle) => {
    return edits[style.id] || style.currentValue;
  };

  const hasEdits = Object.keys(edits).length > 0;

  const getCategoryStyles = (category: TypographyStyle['category']) => {
    return typographyStyles.filter(s => s.category === category);
  };

  const renderStyleRow = (style: TypographyStyle) => {
    const isEditing = editingId === style.id;
    const isModified = style.id in edits;
    const currentValue = getCurrentValue(style);

    return (
      <div
        key={style.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-3) 0',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{style.name}</span>
            {isModified && <Badge variant="secondary">Modified</Badge>}
          </div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-detail)' }}>
            {style.description}
          </div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-detail)', marginTop: '2px', fontFamily: 'monospace' }}>
            {style.cssVariable}
          </div>
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginLeft: 'var(--spacing-4)' }}>
            <Input
              type={style.unit ? 'number' : 'text'}
              value={tempValue}
              onChange={(e) => handleTempValueChange(style, e.target.value)}
              style={{ width: '120px' }}
              min={style.min}
              max={style.max}
              step={style.step}
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(style)}>
              <Check size={16} />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleCancelEdit(style)}>
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginLeft: 'var(--spacing-4)' }}>
            <div style={{ 
              fontFamily: 'monospace', 
              padding: 'var(--spacing-2) var(--spacing-3)', 
              backgroundColor: 'var(--muted)',
              borderRadius: 'var(--radius-sm)',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              {currentValue}
            </div>
            <Button size="sm" variant="ghost" onClick={() => handleStartEdit(style)}>
              <Edit3 size={16} />
            </Button>
            {isModified && (
              <Button size="sm" variant="ghost" onClick={() => handleReset(style.id)}>
                <RotateCcw size={16} />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with actions */}
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
            <h3 style={{ margin: 0, fontSize: '14px' }}>Typography Editor</h3>
            {hasEdits && <Badge style={{ fontSize: '10px', padding: '2px 6px' }}>{Object.keys(edits).length} changes</Badge>}
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--muted-foreground)', fontSize: '11px', lineHeight: '1.4' }}>
            Edit typography values in real-time. Changes apply immediately.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          {hasEdits && (
            <>
              <Button variant="outline" size="sm" onClick={handleResetAll}>
                <RotateCcw size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                Reset All
              </Button>
              <Button variant="default" size="sm" onClick={handleExport}>
                <Download size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                Export CSS
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScrollArea style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: 'var(--spacing-4)' }}>
            <Card style={{ marginBottom: 'var(--spacing-6)', backgroundColor: 'var(--muted/30)' }}>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your typography changes look</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <h1 style={{ margin: 0 }}>Heading 1 - Main Title</h1>
                  <h2 style={{ margin: 0 }}>Heading 2 - Section Title</h2>
                  <h3 style={{ margin: 0 }}>Heading 3 - Subsection Title</h3>
                  <h4 style={{ margin: 0 }}>Heading 4 - Card Title</h4>
                  <p style={{ margin: 0 }}>
                    This is body text. It's used for paragraphs and general content. The quick brown fox jumps over the lazy dog.
                    Typography is the art and technique of arranging type to make written language legible, readable, and appealing.
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <Button>Button Text</Button>
                    <Badge>Badge</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Font Sizes */}
            <Card style={{ marginBottom: 'var(--spacing-6)' }}>
              <CardHeader>
                <CardTitle>Font Sizes</CardTitle>
                <CardDescription>Adjust the size of text elements</CardDescription>
              </CardHeader>
              <CardContent>
                {getCategoryStyles('size').map(renderStyleRow)}
              </CardContent>
            </Card>

            {/* Line Heights */}
            <Card style={{ marginBottom: 'var(--spacing-6)' }}>
              <CardHeader>
                <CardTitle>Line Heights</CardTitle>
                <CardDescription>Control vertical spacing between lines</CardDescription>
              </CardHeader>
              <CardContent>
                {getCategoryStyles('lineHeight').map(renderStyleRow)}
              </CardContent>
            </Card>

            {/* Font Weights */}
            <Card style={{ marginBottom: 'var(--spacing-6)' }}>
              <CardHeader>
                <CardTitle>Font Weights</CardTitle>
                <CardDescription>Adjust text thickness and emphasis</CardDescription>
              </CardHeader>
              <CardContent>
                {getCategoryStyles('weight').map(renderStyleRow)}
              </CardContent>
            </Card>

            {/* Letter Spacing */}
            <Card style={{ marginBottom: 'var(--spacing-6)' }}>
              <CardHeader>
                <CardTitle>Letter Spacing</CardTitle>
                <CardDescription>Fine-tune horizontal spacing between characters</CardDescription>
              </CardHeader>
              <CardContent>
                {getCategoryStyles('spacing').map(renderStyleRow)}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
