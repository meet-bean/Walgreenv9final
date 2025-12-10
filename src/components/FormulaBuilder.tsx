import React, { useState } from 'react';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Card } from './design-system/Card';
import { 
  Plus, 
  X, 
  Calculator, 
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from './design-system/Alert';

interface FormulaElement {
  id: string;
  type: 'metric' | 'operator' | 'function' | 'number' | 'parenthesis';
  value: string;
  label?: string;
}

interface FormulaBuilderProps {
  availableMetrics: Array<{ id: string; name: string; dataType: string }>;
  initialFormula?: FormulaElement[];
  onChange: (formula: FormulaElement[], formulaString: string) => void;
}

export function FormulaBuilder({ availableMetrics, initialFormula = [], onChange }: FormulaBuilderProps) {
  const [formula, setFormula] = useState<FormulaElement[]>(initialFormula);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [numberInput, setNumberInput] = useState<string>('');

  const operators = [
    { value: '+', label: '+' },
    { value: '-', label: '-' },
    { value: '*', label: '×' },
    { value: '/', label: '÷' },
  ];

  const functions = [
    { value: 'SUM', label: 'SUM' },
    { value: 'AVG', label: 'AVG' },
    { value: 'MIN', label: 'MIN' },
    { value: 'MAX', label: 'MAX' },
    { value: 'ABS', label: 'ABS' },
  ];

  const addMetric = () => {
    if (!selectedMetric) return;
    
    const metric = availableMetrics.find(m => m.id === selectedMetric);
    if (!metric) return;

    const newElement: FormulaElement = {
      id: `${Date.now()}`,
      type: 'metric',
      value: selectedMetric,
      label: metric.name
    };

    const newFormula = [...formula, newElement];
    setFormula(newFormula);
    updateFormula(newFormula);
    setSelectedMetric('');
  };

  const addOperator = (op: string) => {
    const newElement: FormulaElement = {
      id: `${Date.now()}`,
      type: 'operator',
      value: op,
      label: op
    };

    const newFormula = [...formula, newElement];
    setFormula(newFormula);
    updateFormula(newFormula);
  };

  const addFunction = (fn: string) => {
    const newFormula = [
      ...formula,
      {
        id: `${Date.now()}-fn`,
        type: 'function',
        value: fn,
        label: fn
      },
      {
        id: `${Date.now()}-open`,
        type: 'parenthesis',
        value: '(',
        label: '('
      }
    ];
    setFormula(newFormula);
    updateFormula(newFormula);
  };

  const addNumber = () => {
    if (!numberInput || isNaN(Number(numberInput))) return;

    const newElement: FormulaElement = {
      id: `${Date.now()}`,
      type: 'number',
      value: numberInput,
      label: numberInput
    };

    const newFormula = [...formula, newElement];
    setFormula(newFormula);
    updateFormula(newFormula);
    setNumberInput('');
  };

  const addParenthesis = (paren: '(' | ')') => {
    const newElement: FormulaElement = {
      id: `${Date.now()}`,
      type: 'parenthesis',
      value: paren,
      label: paren
    };

    const newFormula = [...formula, newElement];
    setFormula(newFormula);
    updateFormula(newFormula);
  };

  const removeElement = (id: string) => {
    const newFormula = formula.filter(el => el.id !== id);
    setFormula(newFormula);
    updateFormula(newFormula);
  };

  const clearFormula = () => {
    setFormula([]);
    updateFormula([]);
  };

  const updateFormula = (newFormula: FormulaElement[]) => {
    const formulaString = newFormula.map(el => {
      if (el.type === 'metric') {
        return `[${el.label}]`;
      }
      return el.value;
    }).join(' ');
    
    onChange(newFormula, formulaString);
  };

  const validateFormula = (): { valid: boolean; message: string } => {
    if (formula.length === 0) {
      return { valid: false, message: 'Formula is empty' };
    }

    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (const el of formula) {
      if (el.value === '(') parenthesesCount++;
      if (el.value === ')') parenthesesCount--;
      if (parenthesesCount < 0) {
        return { valid: false, message: 'Unbalanced parentheses' };
      }
    }
    if (parenthesesCount !== 0) {
      return { valid: false, message: 'Unbalanced parentheses' };
    }

    // Check that we don't have consecutive operators
    for (let i = 0; i < formula.length - 1; i++) {
      if (formula[i].type === 'operator' && formula[i + 1].type === 'operator') {
        return { valid: false, message: 'Cannot have consecutive operators' };
      }
    }

    // Check that formula doesn't start or end with operator
    if (formula[0].type === 'operator') {
      return { valid: false, message: 'Formula cannot start with an operator' };
    }
    if (formula[formula.length - 1].type === 'operator') {
      return { valid: false, message: 'Formula cannot end with an operator' };
    }

    return { valid: true, message: 'Formula is valid' };
  };

  const validation = validateFormula();

  const getElementColor = (type: string): React.CSSProperties => {
    switch (type) {
      case 'metric':
        return {
          backgroundColor: 'var(--chart-1-light)',
          borderColor: 'var(--chart-1)',
          color: 'var(--chart-1)',
        };
      case 'operator':
        return {
          backgroundColor: 'var(--chart-3-light)',
          color: 'var(--chart-3)',
          borderColor: 'var(--chart-3)',
        };
      case 'function':
        return {
          backgroundColor: 'var(--success-light)',
          color: 'var(--chart-2)',
          borderColor: 'var(--chart-2)',
        };
      case 'number':
        return {
          backgroundColor: 'var(--warning-light)',
          color: 'var(--warning)',
          borderColor: 'var(--warning)',
        };
      case 'parenthesis':
        return {
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
          borderColor: 'var(--border)',
        };
      default:
        return {
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
          borderColor: 'var(--border)',
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {/* Formula Display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Label className="label-with-icon">
          <Calculator style={{ height: '16px', width: '16px' }} />
          Formula Builder
        </Label>
        
        <Card className="card-formula-display">
          <div style={{ padding: 'var(--spacing-4)' }}>
            {formula.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 'var(--spacing-4)' }}>
                <Calculator style={{ height: '32px', width: '32px', margin: '0 auto', marginBottom: 'var(--spacing-2)', opacity: 0.5 }} />
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  Build your formula by adding elements below
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                {formula.map((element) => (
                  <div
                    key={element.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-1)',
                      padding: 'var(--spacing-1) var(--spacing-3)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid',
                      ...getElementColor(element.type),
                    }}
                  >
                    <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family-mono)' }}>
                      {element.label}
                    </span>
                    <button
                      onClick={() => removeElement(element.id)}
                      style={{
                        padding: '2px',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <X style={{ height: '12px', width: '12px' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Validation Message */}
        {formula.length > 0 && (
          <Alert variant={validation.valid ? 'default' : 'destructive'}>
            {validation.valid ? (
              <CheckCircle2 style={{ height: '16px', width: '16px' }} />
            ) : (
              <AlertCircle style={{ height: '16px', width: '16px' }} />
            )}
            <AlertDescription>{validation.message}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Building Tools */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--spacing-4)', 
        padding: 'var(--spacing-4)', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius)', 
        backgroundColor: 'var(--background)' 
      }}>
        {/* Add Metric */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Label className="label-field-helper">
            1. Add Metric
          </Label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="select-flex">
                <SelectValue placeholder="Select a metric..." />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name}
                    <Badge variant="outline" className="badge-field-type">
                      {metric.dataType}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={addMetric}
              disabled={!selectedMetric}
              size="sm"
              variant="outline"
            >
              <Plus style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-1)' }} />
              Add
            </Button>
          </div>
        </div>

        {/* Add Operator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Label className="label-field-helper">
            2. Add Operator
          </Label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            {operators.map((op) => (
              <Button
                key={op.value}
                onClick={() => addOperator(op.value)}
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
              >
                {op.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Add Number */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Label className="label-field-helper">
            3. Add Number/Constant
          </Label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Input
              type="number"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder="Enter a number..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') addNumber();
              }}
            />
            <Button
              onClick={addNumber}
              disabled={!numberInput}
              size="sm"
              variant="outline"
            >
              <Plus style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-1)' }} />
              Add
            </Button>
          </div>
        </div>

        {/* Add Function */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Label className="label-field-helper">
            4. Add Function
          </Label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            {functions.map((fn) => (
              <Button
                key={fn.value}
                onClick={() => addFunction(fn.value)}
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
              >
                {fn.label}()
              </Button>
            ))}
          </div>
        </div>

        {/* Add Parentheses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Label className="label-field-helper">
            5. Add Parentheses
          </Label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Button
              onClick={() => addParenthesis('(')}
              variant="outline"
              size="sm"
              style={{ flex: 1 }}
            >
              (
            </Button>
            <Button
              onClick={() => addParenthesis(')')}
              variant="outline"
              size="sm"
              style={{ flex: 1 }}
            >
              )
            </Button>
          </div>
        </div>

        {/* Clear Button */}
        {formula.length > 0 && (
          <Button
            onClick={clearFormula}
            variant="destructive"
            size="sm"
            style={{ width: '100%' }}
          >
            <X style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
            Clear Formula
          </Button>
        )}
      </div>

      {/* Formula Example */}
      <Alert>
        <Info style={{ height: '16px', width: '16px' }} />
        <AlertDescription>
          <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-2)' }}>
            Example formulas:
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--spacing-1)', 
            fontSize: 'var(--text-xs)', 
            fontFamily: 'var(--font-family-mono)' 
          }}>
            <p>• [Actual Hours] / [Expected Hours] * 100</p>
            <p>• ([Forecasted Volume] - [Actual Volume]) / [Forecasted Volume]</p>
            <p>• AVG ( [Performance %] )</p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}