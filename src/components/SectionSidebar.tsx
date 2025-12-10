import React, { useState } from 'react';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { X, Trophy, BarChart3, TrendingUp, FolderTree, Clock, Award, DollarSign, Map, PieChart, GripVertical, Check } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DashboardSection } from '../lib/mockData';

interface SectionDefinition {
  type: string;
  label: string;
  icon: string;
  description: string;
}

interface SectionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sectionDefinitions: SectionDefinition[];
  onAddSection: (type: string) => void;
  onReorderSections?: (reorderedDefinitions: SectionDefinition[]) => void;
  currentSections?: DashboardSection[];
  title?: string;
  description?: string;
}

const ICON_MAP = {
  'Trophy': Trophy,
  'BarChart3': BarChart3,
  'TrendingUp': TrendingUp,
  'FolderTree': FolderTree,
  'Clock': Clock,
  'Award': Award,
  'DollarSign': DollarSign,
  'Map': Map,
  'PieChart': PieChart,
};

const DRAG_TYPE = 'SECTION_DEFINITION';

interface DraggableSectionCardProps {
  sectionDef: SectionDefinition;
  index: number;
  onAddSection: (type: string) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  count?: number;
}

function DraggableSectionCard({ sectionDef, index, onAddSection, moveCard, count = 0 }: DraggableSectionCardProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [isAdding, setIsAdding] = React.useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: DRAG_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: DRAG_TYPE,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const IconComponent = ICON_MAP[sectionDef.icon as keyof typeof ICON_MAP] || BarChart3;

  const handleClick = () => {
    setIsAdding(true);
    onAddSection(sectionDef.type);
    // Reset after animation
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = 'var(--shadow-elevation-md)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: 'var(--spacing-2)',
        borderRadius: 'var(--radius)',
        border: isAdding ? '2px solid #10b981' : 'none',
        transition: 'all var(--transition-default)',
        backgroundColor: isAdding ? '#d1fae5' : (isOver ? '#e5e7eb' : '#f7f8f9'),
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20px',
          height: '36px',
          flexShrink: 0,
          cursor: 'grab',
        }}
      >
        <GripVertical size={16} style={{ color: '#9ca3af' }} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          flexShrink: 0,
        }}
      >
        <IconComponent size={20} style={{ color: '#6b7280' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-family-inter)',
            color: 'var(--color-foreground)',
            fontWeight: 'normal',
          }}
        >
          {sectionDef.label}
        </div>
      </div>
      {count > 0 && (
        <Badge
          variant="secondary"
          style={{
            fontSize: '10px',
            padding: '2px 8px',
            backgroundColor: 'var(--color-muted)',
            color: 'var(--color-foreground)',
          }}
        >
          {count}
        </Badge>
      )}
      {isAdding && (
        <div
          style={{
            position: 'absolute',
            right: 'var(--spacing-2)',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            animation: 'scaleIn 0.3s ease-out',
          }}
        >
          <Check size={16} style={{ color: 'white' }} />
        </div>
      )}
    </button>
  );
}

export function SectionSidebar({
  isOpen,
  onClose,
  sectionDefinitions,
  onAddSection,
  onReorderSections,
  currentSections = [],
  title = 'Add Section',
  description = 'Choose a section type to add to your dashboard',
}: SectionSidebarProps) {
  if (!isOpen) return null;

  // Calculate section type counts
  const sectionCounts = currentSections.reduce((acc, section) => {
    acc[section.type] = (acc[section.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const newSectionDefinitions = [...sectionDefinitions];
    const [draggedItem] = newSectionDefinitions.splice(dragIndex, 1);
    newSectionDefinitions.splice(hoverIndex, 0, draggedItem);
    if (onReorderSections) {
      onReorderSections(newSectionDefinitions);
    }
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
          width: '400px',
          maxWidth: '90vw',
          backgroundColor: 'var(--color-card)',
          boxShadow: 'var(--shadow-elevation-lg)',
          padding: 'var(--spacing-6)',
        }}
      >
        {/* Header */}
        <SidebarHeader
          title={title}
          description={description}
          onClose={onClose}
        />

        {/* Section Types */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {sectionDefinitions.map((sectionDef, index) => {
            const count = sectionCounts[sectionDef.type] || 0;
            return (
              <DraggableSectionCard
                key={sectionDef.type}
                sectionDef={sectionDef}
                index={index}
                onAddSection={onAddSection}
                moveCard={moveCard}
                count={count}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}