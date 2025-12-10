import { useState, useCallback } from 'react';
import { CanvasTile, TilePosition } from '../components/GridCanvas';

export interface SavedSection {
  id: string;
  name: string;
  description: string;
  tiles: CanvasTile[];
  createdAt: string;
  category: 'performance' | 'financial' | 'operations' | 'strategic';
  tags: string[];
}

export function useCanvasManager() {
  const [tiles, setTiles] = useState<CanvasTile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [nextId, setNextId] = useState(1);

  const addTile = useCallback(
    (tile: Omit<CanvasTile, 'id'>, position: TilePosition) => {
      const newTile: CanvasTile = {
        ...tile,
        id: `tile-${nextId}`,
        position,
      };
      setTiles((prev) => [...prev, newTile]);
      setNextId((prev) => prev + 1);
    },
    [nextId]
  );

  const updateTile = useCallback((id: string, updates: Partial<CanvasTile>) => {
    setTiles((prev) =>
      prev.map((tile) => (tile.id === id ? { ...tile, ...updates } : tile))
    );
  }, []);

  const deleteTile = useCallback((id: string) => {
    setTiles((prev) => prev.filter((tile) => tile.id !== id));
    setSelectedTiles((prev) => prev.filter((tileId) => tileId !== id));
  }, []);

  const selectTile = useCallback((id: string, multiSelect: boolean) => {
    setSelectedTiles((prev) => {
      if (multiSelect) {
        // Toggle selection
        if (prev.includes(id)) {
          return prev.filter((tileId) => tileId !== id);
        } else {
          return [...prev, id];
        }
      } else {
        // Single select
        return [id];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTiles([]);
  }, []);

  const getSelectedTiles = useCallback(() => {
    return tiles.filter((tile) => selectedTiles.includes(tile.id));
  }, [tiles, selectedTiles]);

  const saveAsSection = useCallback(
    (name: string, description: string, category: SavedSection['category'], tags: string[]): SavedSection => {
      const selectedTileObjects = getSelectedTiles();
      
      // Calculate bounding box of selected tiles
      let minX = Infinity, minY = Infinity;
      selectedTileObjects.forEach(tile => {
        minX = Math.min(minX, tile.position.x);
        minY = Math.min(minY, tile.position.y);
      });

      // Normalize positions (relative to top-left of group)
      const normalizedTiles = selectedTileObjects.map(tile => ({
        ...tile,
        position: {
          ...tile.position,
          x: tile.position.x - minX,
          y: tile.position.y - minY,
        },
        selected: false,
      }));

      const section: SavedSection = {
        id: `section-${Date.now()}`,
        name,
        description,
        tiles: normalizedTiles,
        createdAt: new Date().toISOString(),
        category,
        tags,
      };

      // Save to localStorage
      const saved = localStorage.getItem('saved-sections');
      let sections: SavedSection[] = [];
      try {
        sections = saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Failed to parse saved sections, clearing corrupted data:', error);
        localStorage.removeItem('saved-sections');
      }
      sections.push(section);
      
      try {
        localStorage.setItem('saved-sections', JSON.stringify(sections));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded');
          throw new Error('Storage quota exceeded. Please delete some saved sections.');
        }
        throw error;
      }

      return section;
    },
    [getSelectedTiles]
  );

  const loadSavedSections = useCallback((): SavedSection[] => {
    const saved = localStorage.getItem('saved-sections');
    if (!saved) return [];
    
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse saved sections, clearing corrupted data:', error);
      localStorage.removeItem('saved-sections');
      return [];
    }
  }, []);

  const addSectionToCanvas = useCallback((section: SavedSection, insertPosition?: { x: number; y: number }) => {
    // Find insertion point (bottom of canvas or specified position)
    const insertY = insertPosition?.y ?? Math.max(0, ...tiles.map(t => t.position.y + t.position.h));
    const insertX = insertPosition?.x ?? 0;

    // Add all tiles from section with offset
    section.tiles.forEach(tile => {
      const newTile: CanvasTile = {
        ...tile,
        id: `tile-${nextId + tiles.length}`,
        position: {
          ...tile.position,
          x: tile.position.x + insertX,
          y: tile.position.y + insertY,
        },
      };
      setTiles(prev => [...prev, newTile]);
    });
    
    setNextId(prev => prev + section.tiles.length);
  }, [tiles, nextId]);

  const clearCanvas = useCallback(() => {
    setTiles([]);
    setSelectedTiles([]);
    setNextId(1);
  }, []);

  return {
    tiles,
    selectedTiles,
    addTile,
    updateTile,
    deleteTile,
    selectTile,
    clearSelection,
    getSelectedTiles,
    saveAsSection,
    loadSavedSections,
    addSectionToCanvas,
    clearCanvas,
  };
}
