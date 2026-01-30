'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DataGridToolbar } from './DataGridToolbar';
import type { DataGridProps, ColumnDef } from './types';

export function DataGrid<T>({
  columns,
  data,
  keyField,
  loading = false,
  pagination,
  onPageChange,
  onRowSelect,
  selectedRow,
  actions,
  onFilter,
  onEditFilters,
  onDownload,
  onReload,
}: DataGridProps<T>) {
  const t = useTranslations('common');

  const getCellValue = (row: T, column: ColumnDef<T>) => {
    if (column.accessorFn) {
      return column.accessorFn(row);
    }
    if (column.accessorKey) {
      return String(row[column.accessorKey] ?? '');
    }
    return '';
  };

  const handleRowClick = (row: T) => {
    if (onRowSelect) {
      onRowSelect(row);
    }
  };

  const isSelected = (row: T) => {
    if (!selectedRow) return false;
    return row[keyField] === selectedRow[keyField];
  };

  return (
    <div className="flex flex-col border border-border rounded-md overflow-hidden bg-card">
      <ScrollArea className="flex-1">
        <div className="min-w-max">
          {/* Header */}
          <div className="flex bg-muted/50 border-b border-border sticky top-0 z-10">
            {columns.map((column, index) => (
              <div
                key={column.id}
                className={cn(
                  'px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate',
                  'border-r border-border last:border-r-0',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
                style={{ width: column.width || 150, minWidth: column.width || 150 }}
              >
                {column.header}
              </div>
            ))}
            {actions && (
              <div
                className="px-3 py-2 text-xs font-semibold sticky right-0 bg-muted/50 border-l border-border"
                style={{ width: 80, minWidth: 80 }}
              />
            )}
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              {t('loading')}
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              {t('noData')}
            </div>
          ) : (
            data.map((row) => (
              <div
                key={String(row[keyField])}
                className={cn(
                  'flex border-b border-border last:border-b-0 cursor-pointer transition-colors',
                  'hover:bg-accent/50',
                  isSelected(row) && 'bg-accent'
                )}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className={cn(
                      'px-3 py-1.5 text-sm truncate border-r border-border last:border-r-0',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                    style={{
                      width: column.width || 150,
                      minWidth: column.width || 150,
                      height: 32,
                      lineHeight: '20px',
                    }}
                  >
                    {getCellValue(row, column)}
                  </div>
                ))}
                {actions && (
                  <div
                    className="px-2 py-1 flex items-center justify-center sticky right-0 bg-card border-l border-border"
                    style={{ width: 80, minWidth: 80, height: 32 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(row)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Toolbar */}
      <DataGridToolbar
        pagination={pagination}
        onPageChange={onPageChange}
        onFilter={onFilter}
        onEditFilters={onEditFilters}
        onDownload={onDownload}
        onReload={onReload}
      />
    </div>
  );
}