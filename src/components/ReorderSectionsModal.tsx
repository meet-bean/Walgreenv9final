import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from './design-system/Button';
import { GripVertical, X } from 'lucide-react';
import { DashboardSection } from '../types/dashboard';
import { SECTION_DEFINITIONS } from '../lib/sectionDefinitions';

interface ReorderSectionsModalProps {
  isOpen: boolean;
  sections: DashboardSection[];
  onClose: () => void;
  onReorder: (sections: DashboardSection[]) => void;
}

interface DraggableSectionItemProps {
  section: DashboardSection;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  onUpdateWidth: (index: number, width: 1 | 2 | 3 | 4) => void;
}

const ITEM_TYPE = 'REORDER_SECTION';

function DraggableSectionItem({ section, index, moveSection, onUpdateWidth }: DraggableSectionItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref));

  const sectionDef = SECTION_DEFINITIONS.find((def) => def.type === section.type);

  // Calculate grid column span based on columnSpan
  const getGridColumnSpan = (span: number) => {
    return `span ${span} / span ${span}`;
  };

  return (
    <div
      ref={ref}
      style={{
        gridColumn: getGridColumnSpan(section.columnSpan),
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s',
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative',
      }}
    >
      {/* Drop indicator */}
      {isOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            pointerEvents: 'none',
            borderRadius: 'var(--radius)',
            border: '2px solid var(--color-primary)',
            backgroundColor: 'var(--color-primary)',
            opacity: 0.1,
            zIndex: 10,
          }}
        />
      )}

      <div
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 'var(--spacing-2)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-2)',
          minHeight: '80px',
        }}
      >
        {/* Header with drag handle and title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            paddingBottom: 'var(--spacing-2)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-muted-foreground)',
              cursor: 'grab',
              flexShrink: 0,
            }}
          >
            <GripVertical size={14} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-foreground)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {section.title || 'Untitled Section'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: '9px',
                color: 'var(--color-muted-foreground)',
                marginTop: '2px',
              }}
            >
              {sectionDef?.icon} {sectionDef?.label}
            </div>
          </div>
        </div>

        {/* Width Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
          {[1, 2, 3, 4].map((width) => (
            <button
              key={width}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateWidth(index, width as 1 | 2 | 3 | 4);
              }}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius)',
                transition: 'all var(--transition-default)',
                fontSize: '10px',
                fontWeight: 'var(--font-weight-medium)',
                backgroundColor:
                  section.columnSpan === width
                    ? 'var(--color-chart-1)'
                    : 'var(--color-muted)',
                color:
                  section.columnSpan === width
                    ? 'white'
                    : 'var(--color-muted-foreground)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (section.columnSpan !== width) {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                }
              }}
              onMouseLeave={(e) => {
                if (section.columnSpan !== width) {
                  e.currentTarget.style.backgroundColor = 'var(--color-muted)';
                }
              }}
            >
              {width}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReorderSectionsModal({ isOpen, sections, onClose, onReorder }: ReorderSectionsModalProps) {
  const [localSections, setLocalSections] = useState<DashboardSection[]>(sections);

  // Update local state when sections prop changes
  React.useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  if (!isOpen) return null;

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const newSections = [...localSections];
    const [draggedSection] = newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    setLocalSections(newSections);
  };

  const handleUpdateWidth = (index: number, width: 1 | 2 | 3 | 4) => {
    const newSections = [...localSections];
    newSections[index] = { ...newSections[index], columnSpan: width };
    setLocalSections(newSections);
  };

  const handleApply = () => {
    onReorder(localSections);
    onClose();
  };

  const handleCancel = () => {
    setLocalSections(sections); // Reset to original
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
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={handleCancel}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '900px',
          maxWidth: '90vw',
          maxHeight: '85vh',
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-elevation-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-4)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-foreground)',
                marginBottom: 'var(--spacing-1)',
              }}
            >
              Reorder & Resize Sections
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted-foreground)',
              }}
            >
              Drag sections to reorder • Click width buttons (1-4) to resize
            </p>
          </div>
          <button
            onClick={handleCancel}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-muted-foreground)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mini Dashboard Grid - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-4)',
            backgroundColor: 'var(--color-muted)',
          }}
        >
          {localSections.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--spacing-8)',
                color: 'var(--color-muted-foreground)',
              }}
            >
              <p style={{ fontSize: 'var(--text-sm)' }}>
                No sections to reorder
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridAutoRows: 'min-content',
                gap: '8px',
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
              {localSections.map((section, index) => (
                <DraggableSectionItem
                  key={section.id}
                  section={section}
                  index={index}
                  moveSection={moveSection}
                  onUpdateWidth={handleUpdateWidth}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-3)',
            padding: 'var(--spacing-4)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Changes
          </Button>
        </div>
      </div>
    </>
  );
}