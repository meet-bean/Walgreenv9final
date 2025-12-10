import { useState } from 'react';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Separator } from './design-system/Separator';
import { FileText } from 'lucide-react';
import { 
  ReportColumnConfig, 
  ReportDisplayConfig, 
  DEFAULT_COLUMNS, 
  DEFAULT_GROUPING,
  DEFAULT_COLUMN_GROUPS 
} from './ReportColumnConfig';
import { ReportType } from '../lib/reportGenerator';

interface CustomReportBuilderProps {
  onGenerate: (reportName: string, config: ReportDisplayConfig) => void;
  onSave: (reportName: string, config: ReportDisplayConfig) => void;
  onCancel: () => void;
}

export function CustomReportBuilder({ onGenerate, onSave, onCancel }: CustomReportBuilderProps) {
  const [reportName, setReportName] = useState('');
  const [baseReportType] = useState<ReportType>('daily-performance'); // Base structure
  const [config, setConfig] = useState<ReportDisplayConfig>({
    columns: DEFAULT_COLUMNS['daily-performance'],
    grouping: DEFAULT_GROUPING,
    columnGroups: DEFAULT_COLUMN_GROUPS,
  });

  const handleGenerate = () => {
    if (!reportName.trim()) return;
    onGenerate(reportName, config);
  };

  const handleSave = () => {
    if (!reportName.trim()) return;
    onSave(reportName, config);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-6)',
      height: '100%'
    }}>
      {/* Report Name */}
      <div style={{
        padding: 'var(--spacing-4)',
        backgroundColor: 'var(--muted)',
        borderRadius: 'var(--radius-md)'
      }}>
        <Label htmlFor="report-name">Report Name</Label>
        <Input
          id="report-name"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          placeholder="e.g., Weekly Operations Summary"
          style={{ marginTop: 'var(--spacing-2)' }}
        />
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
          marginTop: 'var(--spacing-2)'
        }}>
          Give your custom report a descriptive name
        </p>
      </div>

      <Separator />

      {/* Report Configuration */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ReportColumnConfig
          reportType={baseReportType}
          currentConfig={config}
          onSave={setConfig}
        />
      </div>

      <Separator />

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-3)',
        justifyContent: 'flex-end'
      }}>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!reportName.trim()}>
          <FileText style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
          Save Report
        </Button>
        <Button onClick={handleGenerate} disabled={!reportName.trim()}>
          <FileText style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
          Generate Report
        </Button>
      </div>
    </div>
  );
}