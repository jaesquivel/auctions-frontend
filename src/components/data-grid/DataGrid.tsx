'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

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

  // Sync vertical scroll between content and actions column
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrollTop(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col h-full border border-border rounded-md overflow-hidden bg-card">
      <div className="flex flex-1 min-h-0">
        {/* Scrollable content area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto"
        >
          <div className="min-w-max">
            {/* Header */}
            <div className="flex bg-muted border-b border-border sticky top-0 z-10">
              {columns.map((column) => (
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
                    'flex border-b border-border cursor-pointer transition-colors',
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
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fixed actions column - always anchored to the right */}
        {actions && (
          <div
            className="flex flex-col flex-shrink-0 border-l border-border shadow-[-2px_0_4px_rgba(0,0,0,0.1)]"
            style={{ width: 80 }}
          >
            {/* Actions header - fixed at top, never scrolls */}
            <div className="flex-shrink-0 px-3 py-2 text-xs bg-muted/50 border-b border-border">
              &nbsp;
            </div>
            {/* Actions body container - clips the transformed content */}
            <div className="flex-1 overflow-hidden relative">
              {/* Actions rows - synced with main content scroll via transform */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{ transform: `translateY(-${scrollTop}px)` }}
              >
                {!loading && data.length > 0 && data.map((row) => (
                  <div
                    key={String(row[keyField])}
                    className={cn(
                      'border-b border-border cursor-pointer transition-colors',
                      'hover:bg-accent/50',
                      isSelected(row) ? 'bg-accent' : 'bg-card'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(row);
                    }}
                  >
                    <div
                      className="px-2 flex items-center justify-center"
                      style={{ height: 32, lineHeight: '20px' }}
                    >
                      {actions(row)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

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