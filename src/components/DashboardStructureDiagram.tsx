import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ArrowLeft, Edit2, Check, X, Layers } from 'lucide-react';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';

// Available components organized by category
const AVAILABLE_COMPONENTS = {
  'Headers': ['ChartHeader', 'CardHeader'],
  'Containers': ['FlatCard', 'Card', 'ResponsiveContainer', 'div'],
  'Tiles': ['TaskTile'],
  'Tables': ['Table', 'TableHeader', 'TableBody', 'TableRow', 'TableCell'],
  'Charts (Recharts)': ['LineChart', 'BarChart', 'PieChart', 'AreaChart'],
  'Chart Elements': ['CartesianGrid', 'XAxis', 'YAxis', 'Tooltip', 'Legend', 'ReferenceLine', 'Line', 'Bar', 'Pie', 'Area'],
  'UI Components': ['Badge', 'Progress', 'Button', 'Separator'],
  'Custom Components': ['HierarchicalPerformanceTable', 'SitePerformanceMap', 'DynamicRankings', 'PerformancePieChart'],
} as const;

interface StructureNode {
  id: string;
  name: string;
  type: 'component' | 'wrapper' | 'section' | 'element';
  children?: StructureNode[];
  props?: string[];
  notes?: string;
}

// Section-specific structures
const SECTION_STRUCTURES: Record<string, StructureNode> = {
  'performance-trend': {
    id: 'trend',
    name: 'Performance Trend Section',
    type: 'section',
    props: ['type: trend-chart'],
    children: [
      {
        id: 'trend-0',
        name: 'FlatCard',
        type: 'wrapper',
        props: ['noPadding'],
        children: [
          { 
            id: 'trend-0-0', 
            name: 'ChartHeader', 
            type: 'component',
            props: ['title', 'description', 'metricSelector', 'backButton'],
            notes: 'Can replace with CardHeader'
          },
          { 
            id: 'trend-0-1', 
            name: 'ResponsiveContainer', 
            type: 'wrapper',
            children: [
              { 
                id: 'trend-0-1-0', 
                name: 'LineChart', 
                type: 'component',
                notes: 'Can use BarChart, AreaChart',
                children: [
                  { id: 'trend-0-1-0-0', name: 'CartesianGrid', type: 'element' },
                  { id: 'trend-0-1-0-1', name: 'XAxis', type: 'element' },
                  { id: 'trend-0-1-0-2', name: 'YAxis', type: 'element' },
                  { id: 'trend-0-1-0-3', name: 'Tooltip', type: 'element' },
                  { id: 'trend-0-1-0-4', name: 'Legend', type: 'element' },
                  { id: 'trend-0-1-0-5', name: 'ReferenceLine', type: 'element' },
                  { id: 'trend-0-1-0-6', name: 'Line', type: 'element', notes: 'Can use Bar, Area' },
                ]
              }
            ]
          },
          { id: 'trend-0-2', name: 'Drill-down Buttons', type: 'element' },
        ],
      },
    ],
  },
  'hours-chart': {
    id: 'hours',
    name: 'Hours Chart Section',
    type: 'section',
    props: ['type: hours-chart'],
    children: [
      {
        id: 'hours-0',
        name: 'FlatCard',
        type: 'wrapper',
        props: ['noPadding'],
        children: [
          { id: 'hours-0-0', name: 'ChartHeader', type: 'component' },
          { 
            id: 'hours-0-1', 
            name: 'div (card-content-flex-col-gap-large)', 
            type: 'wrapper',
            children: [
              { 
                id: 'hours-0-1-0', 
                name: 'ResponsiveContainer', 
                type: 'wrapper',
                children: [
                  { 
                    id: 'hours-0-1-0-0', 
                    name: 'BarChart', 
                    type: 'component',
                    children: [
                      { id: 'hours-0-1-0-0-0', name: 'CartesianGrid', type: 'element' },
                      { id: 'hours-0-1-0-0-1', name: 'XAxis', type: 'element' },
                      { id: 'hours-0-1-0-0-2', name: 'YAxis', type: 'element' },
                      { id: 'hours-0-1-0-0-3', name: 'Tooltip', type: 'element' },
                      { id: 'hours-0-1-0-0-4', name: 'Bar', type: 'element' },
                    ]
                  }
                ]
              }
            ]
          },
        ],
      },
    ],
  },
  'hierarchical-performance': {
    id: 'hierarchical',
    name: 'Hierarchical Performance Table',
    type: 'section',
    props: ['type: hierarchical-performance'],
    children: [
      {
        id: 'hierarchical-0',
        name: 'FlatCard',
        type: 'wrapper',
        props: ['noPadding'],
        children: [
          { id: 'hierarchical-0-0', name: 'ChartHeader', type: 'component' },
          { 
            id: 'hierarchical-0-1', 
            name: 'HierarchicalPerformanceTable', 
            type: 'component',
            children: [
              { 
                id: 'hierarchical-0-1-0', 
                name: 'Table', 
                type: 'component',
                children: [
                  { id: 'hierarchical-0-1-0-0', name: 'TableHeader', type: 'element' },
                  { id: 'hierarchical-0-1-0-1', name: 'TableBody', type: 'element' },
                ]
              }
            ]
          },
        ],
      },
    ],
  },
  'kpi-cards': {
    id: 'kpi',
    name: 'KPI Cards Section',
    type: 'section',
    props: ['type: kpi-cards'],
    children: [
      {
        id: 'kpi-0',
        name: 'FlatCard',
        type: 'wrapper',
        props: ['card-section-full'],
        children: [
          { id: 'kpi-0-0', name: 'ChartHeader', type: 'component' },
          { 
            id: 'kpi-0-1', 
            name: 'Overview Tiles Grid', 
            type: 'wrapper',
            children: [
              { id: 'kpi-0-1-0', name: 'TaskTile', type: 'component', notes: 'x4 instances' }
            ]
          },
        ],
      },
    ],
  },
  'top-tasks': {
    id: 'tasks',
    name: 'Top Tasks Section',
    type: 'section',
    props: ['type: top-tasks'],
    children: [
      {
        id: 'tasks-0',
        name: 'FlatCard',
        type: 'wrapper',
        props: ['noPadding'],
        children: [
          { id: 'tasks-0-0', name: 'ChartHeader', type: 'component' },
          { 
            id: 'tasks-0-1', 
            name: 'div (card-content-flex-col-gap-large)', 
            type: 'wrapper',
            children: [
              { 
                id: 'tasks-0-1-0', 
                name: 'Table', 
                type: 'component',
                children: [
                  { id: 'tasks-0-1-0-0', name: 'TableHeader', type: 'element' },
                  { id: 'tasks-0-1-0-1', name: 'TableBody', type: 'element' },
                ]
              }
            ]
          },
        ],
      },
    ],
  },
  'rankings': {
    id: 'rankings',
    name: 'Rankings Section',
    type: 'section',
    props: ['type: rankings'],
    children: [
      {
        id: 'rankings-0',
        name: 'FlatCard',
        type: 'wrapper',
        props: ['noPadding'],
        children: [
          { id: 'rankings-0-0', name: 'ChartHeader', type: 'component' },
          { id: 'rankings-0-1', name: 'DynamicRankings', type: 'component' },
        ],
      },
    ],
  },
};

function ComponentPicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredComponents = Object.entries(AVAILABLE_COMPONENTS).reduce((acc, [category, components]) => {
    const filtered = components.filter(c => 
      c.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, readonly string[]>);

  const allComponents = Object.values(AVAILABLE_COMPONENTS).flat();

  return (
    <div style={{ position: 'relative', minWidth: '150px' }}>
      {isOpen ? (
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 50,
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '4px',
          minWidth: '200px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              height: '24px', 
              fontSize: '12px', 
              padding: '2px 6px',
              marginBottom: '4px'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {Object.entries(filteredComponents).map(([category, components]) => (
              <div key={category}>
                <div style={{ 
                  padding: '4px 8px', 
                  fontSize: '10px', 
                  color: '#6b7280',
                  fontWeight: 600,
                  backgroundColor: '#f9fafb'
                }}>
                  {category}
                </div>
                {components.map((component) => (
                  <button
                    key={component}
                    onClick={() => {
                      onChange(component);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      fontSize: '12px',
                      textAlign: 'left',
                      border: 'none',
                      backgroundColor: value === component ? '#dbeafe' : 'transparent',
                      cursor: 'pointer',
                      borderRadius: '2px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === component ? '#dbeafe' : 'transparent'}
                  >
                    {component}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            height: '24px',
            fontSize: '12px',
            padding: '2px 8px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '150px'
          }}
        >
          <span>{value}</span>
          <ChevronDown size={12} />
        </button>
      )}
    </div>
  );
}

function StructureNodeComponent({ 
  node, 
  level = 0,
  onUpdate,
  highlightedId
}: { 
  node: StructureNode; 
  level?: number;
  onUpdate: (id: string, updates: Partial<StructureNode>) => void;
  highlightedId?: string;
}) {
  const [expanded, setExpanded] = useState(level < 3);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [editType, setEditType] = useState(node.type);
  const hasChildren = node.children && node.children.length > 0;
  const isHighlighted = node.id === highlightedId;

  const handleSave = () => {
    onUpdate(node.id, { name: editName, type: editType });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(node.name);
    setEditType(node.type);
    setIsEditing(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'component': return '#3b82f6';
      case 'section': return '#10b981';
      case 'wrapper': return '#f59e0b';
      case 'element': return '#6b7280';
      default: return '#000';
    }
  };

  return (
    <div
      style={{
        marginLeft: level > 0 ? '16px' : '0',
        borderLeft: level > 0 ? '1px solid #e5e7eb' : 'none',
        paddingLeft: level > 0 ? '12px' : '0',
        marginTop: level > 0 ? '4px' : '0',
      }}
    >
      <div
        style={{
          padding: '6px 8px',
          backgroundColor: isHighlighted ? '#dbeafe' : level === 0 ? '#f3f4f6' : 'transparent',
          border: isHighlighted ? '1px solid #3b82f6' : level === 0 ? '1px solid #e5e7eb' : 'none',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Expand/Collapse */}
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              color: '#6b7280',
            }}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        {!hasChildren && <span style={{ width: '14px' }} />}

        {/* Edit Mode */}
        {isEditing ? (
          <>
            <ComponentPicker
              value={editName}
              onChange={setEditName}
            />
            <Select value={editType} onValueChange={(val) => setEditType(val as any)}>
              <SelectTrigger style={{ height: '24px', fontSize: '12px', width: '100px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="component">Component</SelectItem>
                <SelectItem value="section">Section</SelectItem>
                <SelectItem value="wrapper">Wrapper</SelectItem>
                <SelectItem value="element">Element</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={handleSave}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                color: '#10b981',
              }}
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancel}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                color: '#ef4444',
              }}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            {/* View Mode */}
            <span style={{ color: getTypeColor(node.type), flex: 1 }}>
              {node.name}
            </span>
            <span
              style={{
                fontSize: '10px',
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                padding: '1px 4px',
                borderRadius: '2px',
                border: '1px solid #e5e7eb',
              }}
            >
              {node.type}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                color: '#6b7280',
                opacity: 0.5,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
            >
              <Edit2 size={12} />
            </button>
          </>
        )}
      </div>

      {/* Props and Notes - Compact */}
      {!isEditing && (node.props || node.notes) && (
        <div style={{ marginLeft: '20px', fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
          {node.props && <span>Props: {node.props.join(', ')}</span>}
          {node.notes && <span style={{ marginLeft: node.props ? '8px' : '0', color: '#f59e0b' }}>💡 {node.notes}</span>}
        </div>
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <div style={{ marginTop: '2px' }}>
          {node.children!.map((child) => (
            <StructureNodeComponent 
              key={child.id} 
              node={child} 
              level={level + 1} 
              onUpdate={onUpdate}
              highlightedId={highlightedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardStructureDiagram({ onBack }: { onBack?: () => void }) {
  const [selectedSection, setSelectedSection] = useState<string>('performance-trend');
  const [structure, setStructure] = useState<StructureNode>(SECTION_STRUCTURES['performance-trend']);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | undefined>();

  const updateNode = (id: string, updates: Partial<StructureNode>) => {
    const updateRecursive = (node: StructureNode): StructureNode => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateRecursive),
        };
      }
      return node;
    };

    const updated = updateRecursive(structure);
    setStructure(updated);
    
    // Highlight the updated node briefly
    setHighlightedNodeId(id);
    setTimeout(() => setHighlightedNodeId(undefined), 1000);
  };

  const handleSectionChange = (sectionKey: string) => {
    setSelectedSection(sectionKey);
    setStructure(SECTION_STRUCTURES[sectionKey]);
    setHighlightedNodeId(undefined);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {/* Compact Header */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>Dashboard Structure</h2>
            {onBack && (
              <Button onClick={onBack} variant="outline" size="sm">
                <ArrowLeft size={14} style={{ marginRight: '6px' }} />
                Back
              </Button>
            )}
          </div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
            Select a section from the sidebar, then click <Edit2 size={12} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> to edit components with live feedback.
          </p>
        </div>

        {/* Compact Legend */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '8px 12px',
            backgroundColor: '#f9fafb',
            borderRadius: '4px',
            border: '1px solid #e5e7eb',
            marginBottom: '16px',
            fontSize: '12px',
          }}
        >
          {[
            { label: 'Component', color: '#3b82f6' },
            { label: 'Section', color: '#10b981' },
            { label: 'Wrapper', color: '#f59e0b' },
            { label: 'Element', color: '#6b7280' },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '2px' }} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Structure Tree */}
        <StructureNodeComponent 
          node={structure} 
          onUpdate={updateNode}
          highlightedId={highlightedNodeId}
        />
      </div>

      {/* Sidebar */}
      <div 
        style={{ 
          width: '280px', 
          borderLeft: '1px solid #e5e7eb', 
          backgroundColor: '#f9fafb',
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Layers size={16} color="#6b7280" />
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Section Layers</h3>
        </div>

        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
          Select a section to view its component structure
        </p>

        {/* Section List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Object.entries(SECTION_STRUCTURES).map(([key, section]) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key)}
              style={{
                padding: '8px 12px',
                backgroundColor: selectedSection === key ? '#3b82f6' : '#fff',
                color: selectedSection === key ? '#fff' : '#374151',
                border: '1px solid',
                borderColor: selectedSection === key ? '#3b82f6' : '#e5e7eb',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedSection !== key) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedSection !== key) {
                  e.currentTarget.style.backgroundColor = '#fff';
                }
              }}
            >
              {section.name}
            </button>
          ))}
        </div>

        {/* Component Reference */}
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#fff', 
          borderRadius: '4px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#374151' }}>
            Available Components
          </h4>
          <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>
              <strong>Performance Trend uses:</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                <li>ChartHeader</li>
                <li>ResponsiveContainer</li>
                <li>LineChart</li>
                <li>CartesianGrid, XAxis, YAxis</li>
                <li>Tooltip, Legend</li>
                <li>Line, ReferenceLine</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div style={{ 
          marginTop: 'auto',
          padding: '12px', 
          backgroundColor: '#fef3c7', 
          borderRadius: '4px',
          border: '1px solid #fbbf24'
        }}>
          <p style={{ fontSize: '11px', color: '#92400e', margin: 0 }}>
            💡 <strong>Tip:</strong> When you edit a component name, it will highlight briefly to show the change was saved.
          </p>
        </div>
      </div>
    </div>
  );
}