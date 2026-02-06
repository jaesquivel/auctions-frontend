'use client';

import { Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { DataGridPagination } from './DataGridPagination';
import { PAGE_SIZE_OPTIONS, type PaginationState } from './types';

interface DataGridToolbarProps {
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFilterClick?: () => void;
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
  onDownload?: () => void;
  onReload?: () => void;
}

export function DataGridToolbar({
  pagination,
  onPageChange,
  onPageSizeChange,
  onFilterClick,
  hasActiveFilters,
  activeFilterCount,
  onDownload,
  onReload,
}: DataGridToolbarProps) {
  const t = useTranslations('common');

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-2 py-1 sticky bottom-0 z-10">
        <div className="flex items-center gap-1">
          {onFilterClick && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('h-7 w-7 relative', hasActiveFilters && 'text-primary')}
                  onClick={onFilterClick}
                >
                  <Filter className="h-4 w-4" />
                  {hasActiveFilters && activeFilterCount != null && activeFilterCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('filter')}</TooltipContent>
            </Tooltip>
          )}

          {onDownload && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('download')}</TooltipContent>
            </Tooltip>
          )}

          {onReload && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onReload}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('reload')}</TooltipContent>
            </Tooltip>
          )}
        </div>

        {pagination && (
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              {pagination.total.toLocaleString()} {t('records')}
            </div>
            {onPageSizeChange && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{t('rowsPerPage')}:</span>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
                >
                  <SelectTrigger className="h-7 w-[70px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {pagination && onPageChange && (
          <DataGridPagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </TooltipProvider>
  );
}