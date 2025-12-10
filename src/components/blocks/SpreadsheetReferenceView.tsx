import { Card, CardDescription, CardTitle } from '../design-system/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../design-system/Table';
import { Badge } from '../design-system/Badge';
import exampleImage from 'figma:asset/69f542f881e7449c4070a7452192da6df5e9733b.png';

/**
 * This component demonstrates the full spreadsheet view similar to the current Excel-based system.
 * It shows all columns from A to beyond F, matching the complexity shown in the reference image.
 */
export function SpreadsheetReferenceView() {
  // Mock data representing the complex spreadsheet structure
  const sampleData = [
    {
      task: 'Receiving',
      assignedMonthlyVolume: 1700000,
      assignedRate: 350,
      budgetedMonthlyVolume: 1535658,
      remMonthlyVolume: 1203475,
      actualMonthlyVolume: 332183,
      hoursOfForecast: 4757,
      forecastRegHours: 4253,
      forecastOT: 504,
      overtimeLimit: 0,
      actualRegHours: 933,
      actualOT: 0,
      actualTotal: 933,
      performanceRate: 98.2,
    },
    {
      task: 'Breakdown',
      assignedMonthlyVolume: 850000,
      assignedRate: 425,
      budgetedMonthlyVolume: 767829,
      remMonthlyVolume: 601738,
      actualMonthlyVolume: 166091,
      hoursOfForecast: 2387,
      forecastRegHours: 2133,
      forecastOT: 254,
      overtimeLimit: 0,
      actualRegHours: 391,
      actualOT: 0,
      actualTotal: 391,
      performanceRate: 102.5,
    },
    {
      task: 'Put Away',
      assignedMonthlyVolume: 1200000,
      assignedRate: 300,
      budgetedMonthlyVolume: 1084560,
      remMonthlyVolume: 850230,
      actualMonthlyVolume: 234330,
      hoursOfForecast: 4000,
      forecastRegHours: 3574,
      forecastOT: 426,
      overtimeLimit: 0,
      actualRegHours: 781,
      actualOT: 0,
      actualTotal: 781,
      performanceRate: 96.8,
    },
  ];

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 100) return <Badge className="bg-green-100 text-green-800">Over Performing</Badge>;
    if (rate >= 95) return <Badge className="bg-blue-100 text-blue-800">On Target</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800">Below Target</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reference: Complete Spreadsheet View</CardTitle>
          <CardDescription>
            This view matches the complexity of your current Excel system with all columns and calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Reference Image */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Current Excel System (Reference):</p>
            <img 
              src={exampleImage} 
              alt="Excel spreadsheet reference" 
              className="w-full border rounded-lg shadow-sm"
            />
          </div>

          {/* Simplified representation in web format */}
          <div className="space-y-4">
            <p className="text-sm text-gray-900">Web Application Equivalent:</p>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-orange-100">
                    <TableHead className="border">Task</TableHead>
                    <TableHead className="border text-right">Assigned Monthly Volume</TableHead>
                    <TableHead className="border text-right">Assigned Rate</TableHead>
                    <TableHead className="border text-right">Budgeted Monthly Volume</TableHead>
                    <TableHead className="border text-right">Remaining Monthly Volume</TableHead>
                    <TableHead className="border text-right">Actual Monthly Volume</TableHead>
                    <TableHead className="border text-right">Hours of Forecast</TableHead>
                    <TableHead className="border text-right">Forecast Reg Hours</TableHead>
                    <TableHead className="border text-right">Forecast OT</TableHead>
                    <TableHead className="border text-right">Actual Reg Hours</TableHead>
                    <TableHead className="border text-right">Actual OT</TableHead>
                    <TableHead className="border text-right">Actual Total</TableHead>
                    <TableHead className="border text-right">Performance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="border">{row.task}</TableCell>
                      <TableCell className="border text-right bg-blue-50">{row.assignedMonthlyVolume.toLocaleString()}</TableCell>
                      <TableCell className="border text-right bg-blue-50">{row.assignedRate}</TableCell>
                      <TableCell className="border text-right bg-blue-50">{row.budgetedMonthlyVolume.toLocaleString()}</TableCell>
                      <TableCell className="border text-right bg-green-50">{row.remMonthlyVolume.toLocaleString()}</TableCell>
                      <TableCell className="border text-right bg-green-50">{row.actualMonthlyVolume.toLocaleString()}</TableCell>
                      <TableCell className="border text-right bg-yellow-50">{row.hoursOfForecast.toLocaleString()}</TableCell>
                      <TableCell className="border text-right bg-yellow-50">{row.forecastRegHours.toLocaleString()}</TableCell>
                      <TableCell className="border text-right bg-yellow-50">{row.forecastOT}</TableCell>
                      <TableCell className="border text-right">{row.actualRegHours.toLocaleString()}</TableCell>
                      <TableCell className="border text-right">{row.actualOT}</TableCell>
                      <TableCell className="border text-right">{row.actualTotal.toLocaleString()}</TableCell>
                      <TableCell className="border">{getPerformanceBadge(row.performanceRate)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-purple-100">
                    <TableCell className="border">Totals</TableCell>
                    <TableCell className="border text-right">3,750,000</TableCell>
                    <TableCell className="border text-right">-</TableCell>
                    <TableCell className="border text-right">3,388,047</TableCell>
                    <TableCell className="border text-right">2,655,443</TableCell>
                    <TableCell className="border text-right">732,604</TableCell>
                    <TableCell className="border text-right">11,144</TableCell>
                    <TableCell className="border text-right">9,960</TableCell>
                    <TableCell className="border text-right">1,184</TableCell>
                    <TableCell className="border text-right">2,105</TableCell>
                    <TableCell className="border text-right">0</TableCell>
                    <TableCell className="border text-right">2,105</TableCell>
                    <TableCell className="border">
                      <Badge className="bg-blue-100 text-blue-800">99.1%</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 mb-2">Color Coding Legend:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 border rounded"></div>
                  <span>Job Function Headers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-50 border rounded"></div>
                  <span>Budget Data (from file)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border rounded"></div>
                  <span>Calculated Monthly Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-50 border rounded"></div>
                  <span>Forecast Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border rounded"></div>
                  <span>Totals Row</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border rounded"></div>
                  <span>Actual Data (manual input)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-900 mb-2">How This Maps to the Web App:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Data Source Block:</strong> Uploads the budget data (blue columns)</li>
                <li>• <strong>System Calculations:</strong> Auto-calculates forecast hours (yellow columns)</li>
                <li>• <strong>Supervisor Entry:</strong> Inputs actual volumes and hours (white columns)</li>
                <li>• <strong>Dashboards:</strong> Display all data with performance indicators</li>
                <li>• <strong>Report Builder:</strong> Create custom views of this data with flexible layouts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
