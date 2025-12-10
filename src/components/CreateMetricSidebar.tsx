import React, { useState } from 'react';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Sparkles } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { FormulaBuilder } from './FormulaBuilder';
import { getAllFieldsWithCustom, FieldDefinition, saveCustomFields, getCustomFields } from '../lib/unifiedFieldSchema';
import { toast } from './design-system/Toast';

interface FormulaElement {
  id: string;
  type: 'metric' | 'operator' | 'function' | 'number' | 'parenthesis';
  value: string;
  label?: string;
}

interface CreateMetricSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMetricCreated?: (fieldId: string) => void;
}

export function CreateMetricSidebar({ isOpen, onClose, onMetricCreated }: CreateMetricSidebarProps) {
  const [newMetricName, setNewMetricName] = useState('');
  const [newMetricDescription, setNewMetricDescription] = useState('');
  const [newMetricFormat, setNewMetricFormat] = useState<'number' | 'percentage' | 'currency' | 'decimal'>('number');
  const [formula, setFormula] = useState<FormulaElement[]>([]);
  const [formulaString, setFormulaString] = useState('');

  if (!isOpen) return null;

  // Get available metrics for formula builder
  const allFields = getAllFieldsWithCustom();
  const availableMetrics = allFields
    .filter(field => field.type === 'number' && field.field !== 'date')
    .map(field => ({
      id: field.field,
      name: field.displayName,
      dataType: field.format,
    }));

  const handleFormulaChange = (newFormula: FormulaElement[], newFormulaString: string) => {
    setFormula(newFormula);
    setFormulaString(newFormulaString);
  };

  const handleCreateMetric = () => {
    if (!newMetricName.trim()) {
      toast.error('Metric name is required');
      return;
    }

    if (formula.length === 0) {
      toast.error('Please build a formula for the metric');
      return;
    }

    // Create a field ID from the name (lowercase, no spaces)
    const fieldId = newMetricName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check if field ID already exists
    const existingCustomFields = getCustomFields();
    if (existingCustomFields.some(f => f.field === fieldId)) {
      toast.error('A metric with this name already exists');
      return;
    }

    // Create the new custom field
    const newField: FieldDefinition = {
      field: fieldId,
      displayName: newMetricName,
      description: newMetricDescription || `Custom KPI metric: ${newMetricName}`,
      sourceType: 'calculated',
      category: 'custom',
      type: 'number',
      required: false,
      format: newMetricFormat,
      decimals: newMetricFormat === 'percentage' ? 1 : 2,
      formula: formula,
      formulaString: formulaString,
      isCore: false,
      isEditable: false,
      showInImport: false,
      showInForms: false,
    };

    // Save to custom fields
    const updatedCustomFields = [...existingCustomFields, newField];
    saveCustomFields(updatedCustomFields);

    toast.success(`Created metric: ${newMetricName}`);

    // Notify parent if callback provided
    if (onMetricCreated) {
      onMetricCreated(fieldId);
    }

    // Reset form and close
    setNewMetricName('');
    setNewMetricDescription('');
    setNewMetricFormat('number');
    setFormula([]);
    setFormulaString('');
    onClose();
  };

  const handleCancel = () => {
    setNewMetricName('');
    setNewMetricDescription('');
    setNewMetricFormat('number');
    setFormula([]);
    setFormulaString('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          transition: 'opacity var(--transition-default)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(2px)',
        }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: '57px', // Start below the header
          bottom: 0,
          zIndex: 50,
          overflowY: 'auto',
          width: '600px',
          maxWidth: '90vw',
          backgroundColor: 'var(--color-card)',
          boxShadow: 'var(--shadow-elevation-lg)',
          padding: 'var(--spacing-6)',
        }}
      >
        {/* Header */}
        <SidebarHeader
          title="Create Custom Metric"
          description="Build a new calculated metric using the formula builder"
          onClose={onClose}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {/* Metric Name */}
          <div>
            <Label
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-foreground)',
                marginBottom: 'var(--spacing-2)',
                display: 'block',
              }}
            >
              Metric Name *
            </Label>
            <Input
              value={newMetricName}
              onChange={(e) => setNewMetricName(e.target.value)}
              placeholder="e.g., Total Revenue, Efficiency Rate"
            />
          </div>

          {/* Metric Description */}
          <div>
            <Label
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-foreground)',
                marginBottom: 'var(--spacing-2)',
                display: 'block',
              }}
            >
              Description (optional)
            </Label>
            <Input
              value={newMetricDescription}
              onChange={(e) => setNewMetricDescription(e.target.value)}
              placeholder="Describe what this metric measures"
            />
          </div>

          {/* Display Format */}
          <div>
            <Label
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-foreground)',
                marginBottom: 'var(--spacing-2)',
                display: 'block',
              }}
            >
              Display Format
            </Label>
            <select
              value={newMetricFormat}
              onChange={(e) => setNewMetricFormat(e.target.value as any)}
              style={{
                width: '100%',
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-foreground)',
                padding: 'var(--spacing-2)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
              }}
            >
              <option value="number">Number</option>
              <option value="percentage">Percentage (%)</option>
              <option value="currency">Currency ($)</option>
              <option value="decimal">Decimal</option>
            </select>
          </div>

          {/* Formula Builder */}
          <FormulaBuilder
            availableMetrics={availableMetrics}
            initialFormula={formula}
            onChange={handleFormulaChange}
          />

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-3)',
              paddingTop: 'var(--spacing-4)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <Button onClick={handleCreateMetric} style={{ flex: 1 }}>
              <Sparkles size={16} style={{ marginRight: 'var(--spacing-2)' }} />
              Create Metric
            </Button>
            <Button onClick={handleCancel} variant="outline" style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}