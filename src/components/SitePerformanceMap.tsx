import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from './design-system/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Badge } from './design-system/Badge';
import { Button } from './design-system/Button';
import { MapPin, TrendingUp, TrendingDown, DollarSign, Target, ZoomIn, ZoomOut } from 'lucide-react';
import { Site, DailyMetrics } from '../lib/mockData';
import { ChartHeader } from './ChartHeader';

interface SitePerformanceMapProps {
  title: string;
  description?: string;
  sites: Site[];
  metrics: DailyMetrics[];
}

type MetricType = 'performance' | 'budget';

export const SitePerformanceMap: React.FC<SitePerformanceMapProps> = ({
  title,
  description,
  sites,
  metrics,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('performance');
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markersLayer, setMarkersLayer] = useState<any>(null);
  const [zoom, setZoom] = useState(6);

  // Calculate site metrics
  const siteMetrics = useMemo(() => {
    return sites.map(site => {
      const siteData = metrics.filter(m => m.siteId === site.id);
      const metricsWithActuals = siteData.filter(m => m.actualHours !== null);

      if (metricsWithActuals.length === 0) {
        return {
          site,
          performance: null,
          budgetVariance: null,
          status: 'no-data' as const,
        };
      }

      // Calculate performance
      const totalExpected = metricsWithActuals.reduce((sum, m) => sum + m.expectedHours, 0);
      const totalActual = metricsWithActuals.reduce((sum, m) => sum + (m.actualHours || 0), 0);
      const performance = totalExpected > 0 ? (totalExpected / totalActual) * 100 : 100;

      // Calculate budget variance (actual vs expected)
      const budgetVariance = totalActual - totalExpected;
      const budgetVariancePercent = totalExpected > 0 ? (budgetVariance / totalExpected) * 100 : 0;

      // Determine status based on selected metric
      let status: 'on-target' | 'off-target' | 'no-data';
      if (selectedMetric === 'performance') {
        // On target if performance >= 95%
        status = performance >= 95 ? 'on-target' : 'off-target';
      } else {
        // On target if within ±5% of budget
        status = Math.abs(budgetVariancePercent) <= 5 ? 'on-target' : 'off-target';
      }

      return {
        site,
        performance,
        budgetVariance,
        budgetVariancePercent,
        status,
      };
    });
  }, [sites, metrics, selectedMetric]);

  const getMarkerColor = (status: 'on-target' | 'off-target' | 'no-data') => {
    // Using hex colors for Leaflet markers (matches design system colors)
    switch (status) {
      case 'on-target':
        return '#10b981'; // matches var(--color-success)
      case 'off-target':
        return '#ef4444'; // matches var(--color-error)
      case 'no-data':
        return '#64748b'; // matches var(--color-muted-foreground)
    }
  };

  const [hoveredSite, setHoveredSite] = useState<string | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    let map: any = null;
    let isInitialized = false;

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (isInitialized) return;
      
      try {
        const L = (await import('leaflet')).default;
        
        // Add Leaflet CSS and wait for it to load
        if (!document.getElementById('leaflet-css')) {
          await new Promise<void>((resolve, reject) => {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = 'anonymous';
            link.onload = () => resolve();
            link.onerror = () => {
              console.error('Failed to load Leaflet CSS');
              resolve(); // Continue anyway
            };
            document.head.appendChild(link);
          });
        }

        // Small delay to ensure CSS is fully parsed
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize map
        const mapContainer = document.getElementById('site-performance-map');
        if (!mapContainer) return;

        // Check if map is already initialized on this container
        if ((mapContainer as any)._leaflet_id) {
          console.log('Map already initialized, skipping');
          return;
        }

        isInitialized = true;
        map = L.map(mapContainer, {
          zoomControl: false, // We'll add custom zoom controls
        }).setView([36.0, -78.0], zoom);

        // Add base map layer (terrain)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors, © CARTO',
          maxZoom: 19,
          className: 'map-tiles-grayscale',
        }).addTo(map);
        
        // Add state boundaries from GeoJSON
        fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
          .then(response => response.json())
          .then(data => {
            if (map) {
              L.geoJSON(data, {
                style: {
                  fillColor: 'transparent',
                  fillOpacity: 0,
                  color: '#cbd5e1',
                  weight: 1.5,
                  opacity: 0.4,
                }
              }).addTo(map);
            }
          })
          .catch(err => console.log('State boundaries not loaded:', err));
        
        // Add city/state labels on top
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
          attribution: '',
          maxZoom: 19,
          className: 'map-labels-gray',
        }).addTo(map);

        // Create a layer group for markers
        const markers = L.layerGroup().addTo(map);

        setMapInstance(map);
        setMarkersLayer(markers);

        // Update zoom state when map zoom changes
        map.on('zoomend', () => {
          setZoom(map.getZoom());
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup on unmount
    return () => {
      if (map) {
        try {
          map.remove();
          map = null;
        } catch (e) {
          console.log('Map cleanup error:', e);
        }
      }
      setMapInstance(null);
      setMarkersLayer(null);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers when siteMetrics or hoveredSite changes
  useEffect(() => {
    if (!mapInstance || !markersLayer) return;

    const L = (window as any).L;
    if (!L) return;

    // Clear existing markers
    markersLayer.clearLayers();

    // Add markers for each site
    siteMetrics.forEach(({ site, status, performance, budgetVariancePercent }) => {
      const color = getMarkerColor(status);
      const isHovered = hoveredSite === site.id;

      // Create custom icon with label
      const icon = L.divIcon({
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="
              width: ${isHovered ? '24px' : '16px'};
              height: ${isHovered ? '24px' : '16px'};
              background-color: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              transition: all 0.2s;
              ${isHovered ? 'animation: pulse 1s infinite;' : ''}
            "></div>
            <div style="
              position: absolute;
              top: ${isHovered ? '28px' : '20px'};
              white-space: nowrap;
              background-color: white;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 11px;
              font-weight: 600;
              color: #000000;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
              pointer-events: none;
            ">${site.name}</div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [isHovered ? 100 : 80, isHovered ? 50 : 40],
        iconAnchor: [isHovered ? 50 : 40, isHovered ? 12 : 8],
      });

      const marker = L.marker([site.latitude, site.longitude], { icon })
        .addTo(markersLayer);

      // Add popup
      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif;">
          <div style="font-weight: 600; margin-bottom: 4px;">${site.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${site.location}</div>
          <div style="font-size: 13px;">
            ${selectedMetric === 'performance'
              ? `<strong>Performance:</strong> ${performance?.toFixed(1)}%`
              : `<strong>Budget Variance:</strong> ${budgetVariancePercent && budgetVariancePercent > 0 ? '+' : ''}${budgetVariancePercent?.toFixed(1)}%`
            }
          </div>
          <div style="
            display: inline-block;
            margin-top: 6px;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            background-color: ${status === 'on-target' ? '#dcfce7' : '#fee2e2'};
            color: ${status === 'on-target' ? '#166534' : '#991b1b'};
          ">
            ${status === 'on-target' ? '✓ On Target' : '⚠ Off Target'}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Open popup on hover if this site is hovered
      if (isHovered) {
        marker.openPopup();
      }
    });
  }, [mapInstance, markersLayer, siteMetrics, hoveredSite, selectedMetric]);

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  };

  return (
    <Card style={{ 
      borderColor: 'var(--color-border)', 
      backgroundColor: 'var(--color-card)',
      overflow: 'hidden',
      position: 'relative',
      maxHeight: '800px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ChartHeader
        title={title}
        description={description}
        drillDownHint="Hover over sites to view details"
        metricValue={selectedMetric}
        onMetricChange={(value) => setSelectedMetric(value as MetricType)}
        metricOptions={[
          { value: 'performance', label: 'Performance' },
          { value: 'budget', label: 'Budget Variance' }
        ]}
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--spacing-6)' }}>
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative rounded-lg border overflow-hidden" style={{ 
              height: '500px',
              backgroundColor: 'var(--color-muted)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div id="site-performance-map" style={{ width: '100%', height: '100%' }}></div>
              
              {/* Zoom Controls */}
              <div className="absolute flex flex-col z-[1000]" style={{ top: 'var(--spacing-4)', right: 'var(--spacing-4)', gap: 'var(--spacing-2)' }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  style={{ 
                    backgroundColor: 'var(--color-card)',
                    boxShadow: 'var(--shadow-elevation-md)'
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  style={{ 
                    backgroundColor: 'var(--color-card)',
                    boxShadow: 'var(--shadow-elevation-md)'
                  }}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>

              {/* Attribution */}
              <div className="absolute rounded z-[1000]" style={{ 
                bottom: 'var(--spacing-2)', 
                right: 'var(--spacing-2)',
                fontSize: 'var(--text-detail)',
                color: 'var(--color-muted-foreground)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: 'var(--spacing-1) var(--spacing-2)',
                fontFamily: 'var(--font-family-inter)'
              }}>
                Map data © OpenStreetMap
              </div>
            </div>
          </div>

          {/* Legend and Site Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {/* Legend */}
            <div className="border rounded-lg" style={{ 
              padding: 'var(--spacing-4)',
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <h4 style={{ 
                fontSize: 'var(--text-label)',
                fontFamily: 'var(--font-family-inter)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: 'var(--spacing-3)'
              }}>Map Legend</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)', fontSize: 'var(--text-label)', fontFamily: 'var(--font-family-inter)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
                  <span>On Target</span>
                </div>
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)', fontSize: 'var(--text-label)', fontFamily: 'var(--font-family-inter)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-error)' }}></div>
                  <span>Off Target</span>
                </div>
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)', fontSize: 'var(--text-label)', fontFamily: 'var(--font-family-inter)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-muted-foreground)' }}></div>
                  <span>No Data</span>
                </div>
              </div>
              
              <div className="border-t" style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderColor: 'var(--color-border)' }}>
                <p style={{ 
                  fontSize: 'var(--text-detail)',
                  color: 'var(--color-muted-foreground)',
                  fontFamily: 'var(--font-family-inter)'
                }}>
                  {selectedMetric === 'performance'
                    ? 'On target: Performance ≥ 95%'
                    : 'On target: Within ±5% of budget'}
                </p>
              </div>
            </div>

            {/* Site List */}
            <div className="border rounded-lg overflow-y-auto" style={{ 
              padding: 'var(--spacing-4)',
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              maxHeight: '400px'
            }}>
              <h4 style={{ 
                fontSize: 'var(--text-label)',
                fontFamily: 'var(--font-family-inter)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: 'var(--spacing-3)'
              }}>Site Performance</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {siteMetrics.map(({ site, status, performance, budgetVariance, budgetVariancePercent }) => (
                  <div
                    key={site.id}
                    className="rounded-lg transition-all cursor-pointer"
                    style={{
                      padding: 'var(--spacing-3)',
                      border: hoveredSite === site.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                      backgroundColor: hoveredSite === site.id ? 'var(--color-secondary)' : 'var(--color-muted)',
                      borderRadius: 'var(--radius-md)'
                    }}
                    onMouseEnter={() => setHoveredSite(site.id)}
                    onMouseLeave={() => setHoveredSite(null)}
                    onClick={() => {
                      if (mapInstance) {
                        mapInstance.setView([site.latitude, site.longitude], 10, {
                          animate: true,
                          duration: 0.5,
                        });
                        setHoveredSite(site.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-2)' }}>
                      <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                        <MapPin className="h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />
                        <span style={{ 
                          fontSize: 'var(--text-label)',
                          fontFamily: 'var(--font-family-inter)',
                          fontWeight: 'var(--font-weight-medium)'
                        }}>{site.name}</span>
                      </div>
                      <Badge
                        variant={status === 'on-target' ? 'default' : 'destructive'}
                        style={status === 'on-target' ? { 
                          backgroundColor: 'var(--color-success)',
                          fontFamily: 'var(--font-family-inter)'
                        } : { fontFamily: 'var(--font-family-inter)' }}
                      >
                        {status === 'on-target' ? 'On Target' : 'Off Target'}
                      </Badge>
                    </div>
                    
                    <div style={{ 
                      fontSize: 'var(--text-detail)',
                      color: 'var(--color-muted-foreground)',
                      marginBottom: 'var(--spacing-2)',
                      fontFamily: 'var(--font-family-inter)'
                    }}>
                      {site.location}
                    </div>

                    {selectedMetric === 'performance' ? (
                      <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                        {performance !== null ? (
                          <>
                            {performance >= 95 ? (
                              <TrendingUp className="h-3 w-3" style={{ color: 'var(--color-success)' }} />
                            ) : (
                              <TrendingDown className="h-3 w-3" style={{ color: 'var(--color-error)' }} />
                            )}
                            <span style={{ 
                              fontSize: 'var(--text-label)',
                              fontFamily: 'var(--font-family-inter)',
                              color: performance >= 95 ? 'var(--color-success)' : 'var(--color-error)'
                            }}>
                              {performance.toFixed(1)}%
                            </span>
                          </>
                        ) : (
                          <span style={{ 
                            fontSize: 'var(--text-label)',
                            fontFamily: 'var(--font-family-inter)',
                            color: 'var(--color-muted-foreground)'
                          }}>No data</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                        {budgetVariance !== null ? (
                          <>
                            {budgetVariance <= 0 ? (
                              <TrendingDown className="h-3 w-3" style={{ color: 'var(--color-success)' }} />
                            ) : (
                              <TrendingUp className="h-3 w-3" style={{ color: 'var(--color-error)' }} />
                            )}
                            <span style={{ 
                              fontSize: 'var(--text-label)',
                              fontFamily: 'var(--font-family-inter)',
                              color: Math.abs(budgetVariancePercent || 0) <= 5 ? 'var(--color-success)' : 'var(--color-error)'
                            }}>
                              {budgetVariance > 0 ? '+' : ''}{budgetVariance.toFixed(0)} hrs
                              ({budgetVariancePercent && budgetVariancePercent > 0 ? '+' : ''}{budgetVariancePercent?.toFixed(1)}%)
                            </span>
                          </>
                        ) : (
                          <span style={{ 
                            fontSize: 'var(--text-label)',
                            fontFamily: 'var(--font-family-inter)',
                            color: 'var(--color-muted-foreground)'
                          }}>No data</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add pulse animation and grayscale filter styles */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .map-tiles-grayscale {
            filter: grayscale(100%) contrast(1.1) brightness(1.05);
          }
          
          .map-labels-gray {
            filter: grayscale(100%) opacity(0.25);
          }
          
          .leaflet-overlay-pane svg path {
            pointer-events: none;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};