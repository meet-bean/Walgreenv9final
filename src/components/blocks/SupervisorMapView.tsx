import { useState } from 'react';
import { Card, CardDescription, CardTitle } from '../design-system/Card';
import { Badge } from '../design-system/Badge';
import { MapPin, TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';
import { sites, getAggregateMetricsByDate, getSiteById } from '../../lib/mockData';

export function SupervisorMapView() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const selectedSite = selectedSiteId ? getSiteById(selectedSiteId) : null;
  const aggregateMetrics = getAggregateMetricsByDate(selectedDate);

  // Mock map coordinates for East Coast DCs
  const siteCoordinates: Record<string, { top: number; left: number }> = {
    'DC-001': { top: 40, left: 75 }, // Philadelphia
    'DC-002': { top: 30, left: 78 }, // Boston
    'DC-003': { top: 60, left: 62 }, // Atlanta
    'DC-004': { top: 52, left: 68 }, // Charlotte
    'DC-005': { top: 75, left: 70 }, // Miami
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Distribution Center Locations</h2>
          <p className="text-gray-600">East USA Region - Interactive Map View</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Regional Distribution Centers</CardTitle>
            <CardDescription>Click on a location to view detailed metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              {/* Simplified map background */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 20 10 L 80 10 L 85 30 L 80 50 L 75 70 L 70 90 L 50 95 L 30 90 L 25 70 L 20 50 L 18 30 Z" fill="currentColor" />
                </svg>
              </div>

              {/* Site Markers */}
              {sites.map((site) => {
                const coords = siteCoordinates[site.id];
                if (!coords) return null;

                const isSelected = selectedSiteId === site.id;

                return (
                  <button
                    key={site.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                      isSelected ? 'z-10 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ top: `${coords.top}%`, left: `${coords.left}%` }}
                    onClick={() => setSelectedSiteId(isSelected ? null : site.id)}
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isSelected 
                          ? 'bg-blue-600 shadow-lg ring-4 ring-blue-200' 
                          : 'bg-white border-2 border-blue-600 shadow-md'
                      }`}>
                        <MapPin className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      
                      {/* Pulse animation for selected */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75" />
                      )}
                      
                      {/* Site label */}
                      <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div className="bg-white px-2 py-1 rounded shadow text-xs">
                          {site.name}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
                <p className="text-sm text-gray-900 mb-2">Legend</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-gray-600">Over Performing ({'>'} 100%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-gray-600">On Target (95-100%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-gray-600">Below Target ({'<'} 95%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Site Details */}
        <Card>
          <CardHeader>
            <CardTitle>Site Details</CardTitle>
            <CardDescription>
              {selectedSite ? selectedSite.name : 'Select a site on the map'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSite ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-gray-900">{selectedSite.location}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Region</p>
                  <Badge variant="outline">{selectedSite.region}</Badge>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <p className="text-sm text-gray-900">Today's Metrics</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Active Staff</span>
                    </div>
                    <span className="text-gray-900">124</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Hours Today</span>
                    </div>
                    <span className="text-gray-900">892.5</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Performance</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">98.2%</Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-900 mb-2">Quick Stats</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipments Processed</span>
                      <span className="text-gray-900">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Units Handled</span>
                      <span className="text-gray-900">45,892</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">On-Time Delivery</span>
                      <span className="text-gray-900">99.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Click on a distribution center on the map to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Sites Summary */}
      <Card>
        <CardHeader>
          <CardTitle>All Distribution Centers Summary</CardTitle>
          <CardDescription>Performance overview for {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'long' })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => setSelectedSiteId(site.id)}
                className={`p-4 border rounded-lg text-left hover:border-blue-500 transition-colors ${
                  selectedSiteId === site.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-gray-900">{site.name}</p>
                </div>
                <p className="text-xs text-gray-600 mb-3">{site.location}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Performance</span>
                    <span className="text-green-600">98.2%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Hours</span>
                    <span className="text-gray-900">892.5</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
