import React from 'react';

export interface TableProps {
  className?: string;
  children?: React.ReactNode;
}

export function Table({ className = '', children }: TableProps) {
  return (
    <div className="ds-table-wrapper">
      <table className={`ds-table ${className}`}>
        {children}
      </table>
    </div>
  );
}

export interface TableHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function TableHeader({ className = '', children }: TableHeaderProps) {
  return (
    <thead className={`ds-table-header ${className}`}>
      {children}
    </thead>
  );
}

export interface TableBodyProps {
  className?: string;
  children?: React.ReactNode;
}

export function TableBody({ className = '', children }: TableBodyProps) {
  return (
    <tbody className={`ds-table-body ${className}`}>
      {children}
    </tbody>
  );
}

export interface TableRowProps {
  className?: string;
  children?: React.ReactNode;
}

export function TableRow({ className = '', children }: TableRowProps) {
  return (
    <tr className={`ds-table-row ${className}`}>
      {children}
    </tr>
  );
}

export interface TableHeadProps {
  className?: string;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

export function TableHead({ className = '', children, colSpan, rowSpan }: TableHeadProps) {
  return (
    <th className={`ds-table-head ${className}`} colSpan={colSpan} rowSpan={rowSpan}>
      {children}
    </th>
  );
}

export interface TableCellProps {
  className?: string;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

export function TableCell({ className = '', children, colSpan, rowSpan }: TableCellProps) {
  return (
    <td className={`ds-table-cell ${className}`} colSpan={colSpan} rowSpan={rowSpan}>
      {children}
    </td>
  );
}
