import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Maximize2 } from 'lucide-react';
import { DashboardSection } from '../lib/mockData';
import { Resizable } from 're-resizable';
import { SectionContextMenu } from './SectionContextMenu';

const BUILDER_SECTION_TYPE = 'BUILDER_PREVIEW_SECTION';

interface BuilderPreviewWrapperProps {
  sections: Array<{
    id: string;
    content: React.ReactNode;
    section: DashboardSection;
  }>;
  densityMode?: 'compact' | 'normal' | 'comfortable';
  builderMode?: boolean; // Controls whether to show builder features (drag, resize)
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onResize?: (sectionId: string, width: string | number, height: number) => void;
  globalFilters?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  headerControls?: React.ReactNode; // NEW: Custom header controls (replaces zoom controls)
  onConfigure?: (sectionId: string) => void;
  onEditDataSource?: (sectionId: string) => void;
  onRemove?: (sectionId: string) => void;
  onSaveToLibrary?: (sectionId: string) => void;
  onDuplicate?: (sectionId: string) => void;
  onCycleSize?: (sectionId: string) => void;
  onCycleHeight?: (sectionId: string) => void;
  onConfigureKPICards?: (sectionId: string, selectedMetrics: string[]) => void; // NEW: KPI cards configurator
}

interface DraggablePreviewSectionProps {
  section: {
    id: string;
    content: React.ReactNode;
    section: DashboardSection;
  };
  index: number;
  densityMode?: 'compact' | 'normal' | 'comfortable';
  builderMode?: boolean; // NEW: Controls whether to show builder features
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onResize?: (sectionId: string, width: string | number, height: number) => void;
  onConfigure?: (sectionId: string) => void;
  onEditDataSource?: (sectionId: string) => void;
  onRemove?: (sectionId: string) => void;
  onSaveToLibrary?: (sectionId: string) => void;
  onDuplicate?: (sectionId: string) => void;
  onCycleSize?: (sectionId: string) => void;
  onCycleHeight?: (sectionId: string) => void;
  onConfigureKPICards?: (sectionId: string, selectedMetrics: string[]) => void; // NEW: KPI cards configurator
}

// Helper function to get grid column span for 4-column grid
// This matches ModernDashboardBuilder's grid system
function getGridColumnSpan(columnSpan?: number): string {
  const span = columnSpan || 2; // Default to half width (2 columns = 50%)
  return `span ${span} / span ${span}`;
}

function DraggablePreviewSection({ 
  section, 
  index, 
  densityMode = 'compact',
  builderMode = true,
  onMove, 
  onResize, 
  onConfigure, 
  onEditDataSource, 
  onRemove, 
  onSaveToLibrary, 
  onDuplicate,
  onCycleSize,
  onCycleHeight,
  onConfigureKPICards
}: DraggablePreviewSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const resizableRef = useRef<any>(null);
  const [isHeightExpanded, setIsHeightExpanded] = useState(false);

  // Only enable drag/drop in builder mode
  const [{ isDragging }, drag, preview] = useDrag({
    type: BUILDER_SECTION_TYPE,
    item: { id: section.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: builderMode,
  });

  const [, drop] = useDrop({
    accept: BUILDER_SECTION_TYPE,
    hover(item: { id: string; index: number }, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Only attach drag/drop refs in builder mode
  if (builderMode) {
    preview(drop(ref));
  }

  // Get column span from section config (1-4 for 4-column grid)
  const columnSpan = (section.section as any).columnSpan || 2;
  const gridColumnStyle = getGridColumnSpan(columnSpan);

  // Get default minimum height based on section type
  // If user has configured a specific height, use that (enables scrolling)
  // Otherwise, use a generous default height that user can adjust down
  const getDefaultMinHeight = () => {
    const config = (section.section as any).config || {};
    const sectionType = section.section.type;
    
    // Check if height is already manually configured by user via resize
    // CRITICAL: User-configured heights take absolute precedence and must never be recalculated
    const configuredHeight = config.height || (section.section as any).tileHeight || (section.section as any).heightPx;
    
    if (configuredHeight && typeof configuredHeight === 'number' && configuredHeight > 0) {
      return { minHeight: configuredHeight, isUserDefined: true, useFixedHeight: true };
    }
    
    // Use density-based default heights for consistent sizing across builder and view modes
    // This ensures view mode matches builder/preview mode layout
    const densityHeights = {
      compact: 300,
      normal: 350,
      comfortable: 450
    };
    const defaultFullHeight = densityHeights[densityMode] || densityHeights.normal;
    return { minHeight: defaultFullHeight, isUserDefined: false, useFixedHeight: true };
  };

  const { minHeight, isUserDefined, useFixedHeight } = getDefaultMinHeight();

  // Handler for double-click on bottom edge to expand to natural content height
  const handleBottomEdgeDoubleClick = () => {
    if (!onResize || !resizableRef.current) return;
    
    // Get the actual content height by temporarily measuring it
    const contentElement = resizableRef.current.resizable?.querySelector('.builder-section-scaler');
    if (!contentElement) return;
    
    // Get the natural scrollHeight of the content
    const naturalHeight = contentElement.scrollHeight;
    const currentHeight = resizableRef.current.resizable?.offsetHeight || minHeight;
    
    // Toggle between expanded (natural height) and minimum height
    if (Math.abs(currentHeight - naturalHeight) < 20) {
      // Already expanded, collapse back to minimum
      const columnSpan = (section.section as any).columnSpan || 12;
      onResize(section.id, columnSpan, minHeight);
      setIsHeightExpanded(false);
    } else {
      // Expand to natural height (add some padding)
      const expandedHeight = Math.max(naturalHeight + 20, minHeight);
      const columnSpan = (section.section as any).columnSpan || 12;
      onResize(section.id, columnSpan, expandedHeight);
      setIsHeightExpanded(true);
    }
  };

  // Handler for double-click on right edge to expand to full width
  const handleRightEdgeDoubleClick = () => {
    if (!onResize) return;
    
    const currentColumnSpan = (section.section as any).columnSpan || 12;
    
    // Toggle between full width (12) and the previous width
    if (currentColumnSpan === 12) {
      // Already full width, collapse to half width
      const currentHeight = (section.section as any).config?.height || (section.section as any).tileHeight || minHeight;
      onResize(section.id, 6, currentHeight);
    } else {
      // Expand to full width
      const currentHeight = (section.section as any).config?.height || (section.section as any).tileHeight || minHeight;
      onResize(section.id, 12, currentHeight);
    }
  };

  // Get section metadata for context menu
  const sourceTab = ((section.section as any)._sourceTab || 'design') as 'design' | 'test';
  const sectionTitle = section.section.title;
  const sectionData = section.section as any;
  const isConfigured = !!(
    sectionData.dataSource || 
    sectionData.dataSourceConfig || 
    sectionData.chartConfig || 
    (sectionData.kpiCards && sectionData.kpiCards.length > 0) ||
    (section.section.type === 'metric-tile' && sectionData.metricTileConfig)
  );

  // No padding - let the section content handle its own padding
  // This matches the published dashboard layout
  const sectionContent = (
    <div className="w-full h-full builder-section-scaler">
      {section.content}
    </div>
  );

  // Wrap content with context menu if handlers are provided AND in builder mode
  const wrappedContent = (builderMode && (onConfigure || onEditDataSource || onRemove)) ? (
    <SectionContextMenu
      sectionId={section.id}
      sectionTitle={sectionTitle}
      sourceTab={sourceTab}
      isConfigured={isConfigured}
      sectionType={section.section.type} // NEW: Pass section type
      kpiCards={(section.section as any).kpiCards} // NEW: Pass KPI cards config
      onConfigure={onConfigure || (() => {})}
      onEditDataSource={onEditDataSource || (() => {})}
      onRemove={onRemove || (() => {})}
      onSaveToLibrary={onSaveToLibrary}
      onDuplicate={onDuplicate}
      onCycleSize={onCycleSize}
      onCycleHeight={onCycleHeight}
      onConfigureKPICards={onConfigureKPICards}
    >
      {sectionContent}
    </SectionContextMenu>
  ) : sectionContent;

  return (
    <div
      ref={builderMode ? ref : undefined}
      className={isDragging ? 'opacity-50' : ''}
      style={{ 
        gridColumn: gridColumnStyle,
        minWidth: 0,
      }}
    >
      <div className="relative group h-full w-full">
        {/* Drag handle overlay - Only show in builder mode */}
        {builderMode && (
          <div className="absolute -left-10 top-4 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <div
              ref={drag}
              className="cursor-move text-white rounded-md p-2 hover:scale-110 transition-transform duration-200"
              style={{ 
                backgroundColor: 'var(--color-chart-1)',
                boxShadow: 'var(--shadow-elevation-md)',
                border: '2px solid white',
              }}
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Resizable wrapper for section content - Only in builder mode */}
        {builderMode && onResize ? (
          <Resizable
            ref={resizableRef}
            size={{ 
              width: '100%', 
              height: minHeight // Always use the height (whether user-defined or default)
            }}
            minHeight={minHeight}
            minWidth="20%" // Minimum ~2-3 columns
            maxWidth="100%"
            snapGap={20} // Snap to increments for smoother feel
            enable={{
              top: false,
              right: true,
              bottom: true,
              left: false,
              topRight: false,
              bottomRight: true,
              bottomLeft: false,
              topLeft: false,
            }}
            onResize={(e, direction, ref, d) => {
              // Real-time resize for immediate visual feedback
              // This allows the section to expand/contract smoothly during drag
              const hasWidthChange = direction === 'right' || direction === 'bottomRight';
              const hasHeightChange = direction === 'bottom' || direction === 'bottomRight';
              
              if (hasWidthChange) {
                // During resize, allow the width to change freely
                // The grid column will update on stop
              }
            }}
            onResizeStop={(e, direction, ref, d) => {
              // Prevent accidental resizes from double-clicks or tiny drags
              // Only process resize if there's meaningful delta (> 5px in either direction)
              const hasWidthChange = Math.abs(d.width) > 5;
              const hasHeightChange = Math.abs(d.height) > 5;
              
              if (!hasWidthChange && !hasHeightChange) {
                // No meaningful resize - ignore this event
                return;
              }
              
              // Get current column span to preserve it if only height changed
              const currentColumnSpan = (section.section as any).columnSpan || 12;
              let newColumnSpan = currentColumnSpan;
              
              // Only recalculate column span if width actually changed
              if (hasWidthChange) {
                // Calculate new column span based on actual pixel delta
                // Find the grid container by looking for element with grid-cols-12 class
                let gridContainer: HTMLElement | null = ref.parentElement;
                let attempts = 0;
                while (gridContainer && attempts < 10) {
                  if (gridContainer.classList.contains('grid-cols-12') || 
                      gridContainer.classList.contains('grid')) {
                    break;
                  }
                  gridContainer = gridContainer.parentElement;
                  attempts++;
                }
                
                // Calculate container width accounting for gaps
                const gapValue = 24; // gap-6 = 1.5rem = 24px
                const containerWidth = (gridContainer?.offsetWidth || 1200) + gapValue;
                const columnWidth = (containerWidth - (11 * gapValue)) / 12;
                
                // Get final width after resize
                const finalWidth = ref.offsetWidth;
                
                // Calculate how many columns this width represents
                const rawColumnSpan = Math.round(finalWidth / (columnWidth + gapValue));
                
                // Snap to nearest valid column span: 3, 4, 6, 8, 9, 12
                const validSpans = [3, 4, 6, 8, 9, 12];
                newColumnSpan = validSpans.reduce((prev, curr) => 
                  Math.abs(curr - rawColumnSpan) < Math.abs(prev - rawColumnSpan) ? curr : prev
                );
                
                // Ensure we stay within valid range
                newColumnSpan = Math.max(3, Math.min(12, newColumnSpan));
              }
              
              // Calculate new height - ensure it never shrinks below minimum
              // Use the current height from ref to avoid compounding errors
              const currentHeight = ref.offsetHeight;
              const newHeight = Math.max(minHeight, currentHeight);
              
              // Reset expanded state since user manually resized
              setIsHeightExpanded(false);
              
              onResize(section.id, newColumnSpan, newHeight);
            }}
            handleComponent={{
              bottomRight: (
                <div 
                  className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center hover:scale-110 resize-handle-pulse"
                  style={{
                    backgroundColor: 'rgb(var(--color-chart-1) / 1)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid white',
                  }}
                >
                  <Maximize2 className="h-4 w-4 text-white rotate-90" />
                </div>
              ),
              right: (
                <div 
                  className="absolute top-0 right-0 h-full w-3 cursor-col-resize opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-info-light)',
                    borderRight: '2px solid var(--color-chart-1)',
                  }}
                  onDoubleClick={handleRightEdgeDoubleClick}
                  title="Double-click to toggle full width"
                >
                  <div className="w-1 h-12 rounded-full" style={{ backgroundColor: 'var(--color-chart-1)' }} />
                </div>
              ),
              bottom: (
                <div 
                  className="absolute bottom-0 left-0 w-full h-3 cursor-row-resize opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-info-light)',
                    borderBottom: '2px solid var(--color-chart-1)',
                  }}
                  onDoubleClick={handleBottomEdgeDoubleClick}
                  title="Double-click to expand height"
                >
                  <div className="h-1 w-12 rounded-full" style={{ backgroundColor: 'var(--color-chart-1)' }} />
                </div>
              ),
            }}
            handleStyles={{
              bottomRight: {
                zIndex: 30,
              },
              right: {
                zIndex: 25,
              },
              bottom: {
                zIndex: 25,
              },
            }}
            className="transition-all w-full relative"
            style={{
              border: '2px solid transparent',
              transition: 'border-color 0.2s ease',
              borderRadius: 'var(--radius-lg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgb(var(--color-chart-1) / 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            {/* Content container - FIXED height with scrollable overflow */}
            {/* This ensures sections can scroll when content exceeds the resized height */}
            <div className="w-full h-full" style={{ 
              overflow: 'auto', // Enable scrolling when content overflows
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              height: '100%', // Match parent Resizable height exactly
              maxHeight: '100%', // Prevent expansion beyond Resizable bounds
              paddingBottom: '16px', // Add padding to prevent content from blocking bottom resize handle
            }}>
              {wrappedContent}
            </div>
            {/* Resize hint - shows when hovering */}
            <div className="absolute bottom-2 right-10 opacity-0 group-hover:opacity-90 transition-all duration-200 pointer-events-none text-xs rounded-md"
              style={{
                backgroundColor: 'rgb(var(--color-chart-1) / 1)',
                color: 'white',
                boxShadow: 'var(--shadow-elevation-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
              }}
            >
              Drag edges to resize • Double-click right edge (full width) or bottom (fit content) • Corner for both
            </div>
          </Resizable>
        ) : (
          /* View mode - let sections grow naturally like ModernDashboardBuilder */
          <div 
            className="w-full" 
            style={{ 
              height: 'auto', // Let content determine height naturally
              overflow: 'visible', // No scrolling in view mode - show all content
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            {wrappedContent}
          </div>
        )}
      </div>
    </div>
  );
}

export function BuilderPreviewWrapper({
  sections,
  densityMode = 'compact',
  builderMode = true,
  onReorder,
  onResize,
  globalFilters,
  breadcrumb,
  headerControls,
  onConfigure,
  onEditDataSource,
  onRemove,
  onSaveToLibrary,
  onDuplicate,
  onCycleSize,
  onCycleHeight,
  onConfigureKPICards
}: BuilderPreviewWrapperProps) {
  // Use design system grid gap variable for consistent spacing
  const gridGap = 'var(--grid-gap)'; // Controlled by CSS variable --grid-gap

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-outer-gap)' }}>
      {/* Header Controls - Custom controls passed from parent */}
      {headerControls && (
        <div style={{ 
          paddingLeft: 'var(--spacing-4)',
          paddingRight: 'var(--spacing-4)',
          paddingBottom: 'var(--spacing-4)',
          paddingTop: '0',
          backgroundColor: 'transparent',
          borderRadius: 'var(--radius)',
        }}>
          {headerControls}
        </div>
      )}

      {/* SIMPLIFIED 2-LAYER STRUCTURE */}
      {/* Layer 1: Preview Canvas Container - Flex container with optional padding for drag handles */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--grid-outer-gap)', // Controlled by CSS variable
        paddingLeft: builderMode ? 'var(--spacing-2xl)' : 'var(--spacing-4)', // Drag handle space in builder mode, content alignment in view mode
        paddingRight: builderMode ? '0' : 'var(--spacing-4)', // Match horizontal padding in view mode
      }}>
        {/* Global controls shown once at top */}
        {breadcrumb && (
          <div>
            {breadcrumb}
          </div>
        )}
        
        {globalFilters && (
          <div>
            {globalFilters}
          </div>
        )}
        
        {(breadcrumb || globalFilters) && <div className="divider-subtle" />}
        
        {/* Layer 2: Grid - Match ModernDashboardBuilder's 4-column grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'min-content',
          gap: gridGap,
          width: '100%',
          marginTop: 'calc(-1 * var(--spacing-4))',
        }}>
          {(() => {
            // Group sections by stackGroup
            const stackGroups = new Map<string, typeof sections>();
            const processedGroups = new Set<string>();
            const result: JSX.Element[] = [];
            let globalIndex = 0;
            
            sections.forEach((section) => {
              if (section.section.stackGroup && !processedGroups.has(section.section.stackGroup)) {
                // This is the first section in a stack group - collect all sections in this group
                processedGroups.add(section.section.stackGroup);
                const groupSections = sections.filter(s => s.section.stackGroup === section.section.stackGroup);
                const columnSpan = groupSections[0].section.columnSpan || 2;
                const gridColumnStyle = getGridColumnSpan(columnSpan);
                
                result.push(
                  <div key={`stack-${section.section.stackGroup}`} style={{ gridColumn: gridColumnStyle }}>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 'var(--grid-gap)',
                      height: '100%',
                    }}>
                      {groupSections.map((groupSection, idx) => (
                        <div key={groupSection.id} style={{ flex: 1, minHeight: 0 }}>
                          <DraggablePreviewSection
                            section={groupSection}
                            index={globalIndex++}
                            densityMode={densityMode}
                            builderMode={builderMode}
                            onMove={onReorder}
                            onResize={onResize}
                            onConfigure={onConfigure}
                            onEditDataSource={onEditDataSource}
                            onRemove={onRemove}
                            onSaveToLibrary={onSaveToLibrary}
                            onDuplicate={onDuplicate}
                            onCycleSize={onCycleSize}
                            onCycleHeight={onCycleHeight}
                            onConfigureKPICards={onConfigureKPICards}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (!section.section.stackGroup) {
                // Standalone section (not part of a stack group)
                result.push(
                  <DraggablePreviewSection
                    key={section.id}
                    section={section}
                    index={globalIndex++}
                    densityMode={densityMode}
                    builderMode={builderMode}
                    onMove={onReorder}
                    onResize={onResize}
                    onConfigure={onConfigure}
                    onEditDataSource={onEditDataSource}
                    onRemove={onRemove}
                    onSaveToLibrary={onSaveToLibrary}
                    onDuplicate={onDuplicate}
                    onCycleSize={onCycleSize}
                    onCycleHeight={onCycleHeight}
                    onConfigureKPICards={onConfigureKPICards}
                  />
                );
              }
            });
            
            return result;
          })()}
        </div>
      </div>
    </div>
  );
}