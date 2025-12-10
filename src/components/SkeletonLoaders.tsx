import { Card } from './design-system/Card';
import { Skeleton } from './design-system/Skeleton';

/**
 * Skeleton loader for TaskTile components
 */
export function TaskTileSkeleton() {
  return (
    <Card className="card-task-tile">
      <CardContent className="card-content-padding-5">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ flex: 1, paddingRight: 'var(--spacing-3)' }}>
            <Skeleton style={{ height: '20px', width: '128px', marginBottom: 'var(--spacing-2)' }} />
            <Skeleton style={{ height: '12px', width: '80px' }} />
          </div>
          <Skeleton style={{ height: '36px', width: '96px', borderRadius: 'var(--radius)' }} />
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)', padding: 'var(--spacing-3)', border: '1px solid var(--border)' }}>
            <Skeleton style={{ height: '12px', width: '48px', marginBottom: 'var(--spacing-1)' }} />
            <Skeleton style={{ height: '20px', width: '64px' }} />
          </div>
          <div style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)', padding: 'var(--spacing-3)', border: '1px solid var(--border)' }}>
            <Skeleton style={{ height: '12px', width: '48px', marginBottom: 'var(--spacing-1)' }} />
            <Skeleton style={{ height: '20px', width: '64px' }} />
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
            <Skeleton style={{ height: '12px', width: '64px' }} />
            <Skeleton style={{ height: '12px', width: '40px' }} />
          </div>
          <Skeleton style={{ height: '10px', width: '100%', borderRadius: '9999px' }} />
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--border)' }}>
          <Skeleton style={{ height: '12px', width: '100%' }} />
          <Skeleton style={{ height: '12px', width: '100%' }} />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for Dashboard cards
 */
export function DashboardCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton style={{ height: '24px', width: '192px', marginBottom: 'var(--spacing-2)' }} />
        <Skeleton style={{ height: '16px', width: '128px' }} />
      </CardHeader>
      <CardContent>
        <Skeleton style={{ height: '128px', width: '100%', marginBottom: 'var(--spacing-4)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Skeleton style={{ height: '16px', width: '100%' }} />
          <Skeleton style={{ height: '16px', width: '75%' }} />
          <Skeleton style={{ height: '16px', width: '83%' }} />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for table rows
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: 'var(--spacing-4) var(--spacing-3)' }}>
          <Skeleton style={{ height: '16px', width: '100%' }} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton loader for entire table
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <table style={{ width: '100%' }}>
        <thead style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} style={{ padding: 'var(--spacing-4) var(--spacing-3)', textAlign: 'left' }}>
                <Skeleton style={{ height: '16px', width: '96px' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Skeleton loader for chart/graph
 */
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton style={{ height: '20px', width: '160px', marginBottom: 'var(--spacing-2)' }} />
        <Skeleton style={{ height: '16px', width: '96px' }} />
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-2)', height: `${height}px` }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              style={{ 
                flex: 1, 
                borderTopLeftRadius: 'var(--radius)', 
                borderTopRightRadius: 'var(--radius)',
                height: `${Math.random() * 60 + 40}%` 
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for Overview Tiles grid
 */
export function OverviewTilesSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
      {Array.from({ length: count }).map((_, i) => (
        <TaskTileSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for list items
 */
export function ListItemSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)' }}>
      <Skeleton style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Skeleton style={{ height: '16px', width: '75%' }} />
        <Skeleton style={{ height: '12px', width: '50%' }} />
      </div>
      <Skeleton style={{ height: '32px', width: '80px', borderRadius: 'var(--radius)' }} />
    </div>
  );
}

/**
 * Full page loading skeleton with shimmer effect
 */
export function PageLoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Skeleton style={{ height: '32px', width: '256px' }} />
          <Skeleton style={{ height: '16px', width: '192px' }} />
        </div>
        <Skeleton style={{ height: '40px', width: '128px', borderRadius: 'var(--radius)' }} />
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        <Skeleton style={{ height: '96px', borderRadius: 'var(--radius)' }} />
        <Skeleton style={{ height: '96px', borderRadius: 'var(--radius)' }} />
        <Skeleton style={{ height: '96px', borderRadius: 'var(--radius)' }} />
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

      <OverviewTilesSkeleton count={6} />
    </div>
  );
}
