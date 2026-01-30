'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { TagList } from '@/components/ui/tag-badge';
import { mockProperties } from '@/mocks';
import { formatCurrency, formatDate, formatArea, formatRatio } from '@/lib/formatters';
import type { PropertySummary } from '@/types';

export default function PropertiesPage() {
  const t = useTranslations('properties');
  const tCommon = useTranslations('common');

  const [selectedProperty, setSelectedProperty] = useState<PropertySummary | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: mockProperties.length,
  });

  // Calculate paginated data
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = mockProperties.slice(startIndex, endIndex);

  const columns: ColumnDef<PropertySummary>[] = [
    {
      id: 'tags',
      header: t('columns.tags'),
      width: 150,
      accessorFn: (row) => <TagList tags={row.tags} max={2} />,
    },
    {
      id: 'registration',
      header: t('columns.registration'),
      width: 100,
      accessorFn: (row) => row.registrationFull || '-',
    },
    {
      id: 'location',
      header: t('columns.location'),
      width: 200,
      accessorFn: (row) => row.geoLocation || '-',
    },
    {
      id: 'firstDate',
      header: t('columns.firstDate'),
      width: 140,
      accessorFn: (row) => formatDate(row.asset.firstAuctionTs),
    },
    {
      id: 'firstBase',
      header: t('columns.firstBase'),
      width: 130,
      align: 'right',
      accessorFn: (row) => formatCurrency(row.asset.firstAuctionBase, row.asset.currency),
    },
    {
      id: 'firstBaseAdj',
      header: t('columns.firstBaseAdj'),
      width: 130,
      align: 'right',
      accessorFn: (row) => formatCurrency(row.firstAuctionBaseAdj, row.asset.currency),
    },
    {
      id: 'firstGuarantee',
      header: t('columns.firstGuarantee'),
      width: 130,
      align: 'right',
      accessorFn: (row) => formatCurrency(row.firstAuctionGuarantee, row.asset.currency),
    },
    {
      id: 'fiscalValue',
      header: t('columns.fiscalValue'),
      width: 130,
      align: 'right',
      accessorFn: (row) => formatCurrency(row.fiscalValue, 'CRC'),
    },
    {
      id: 'fiscalValueUsd',
      header: t('columns.fiscalValueUsd'),
      width: 120,
      align: 'right',
      accessorFn: (row) => formatCurrency(row.fiscalValueUsd, 'USD'),
    },
    {
      id: 'fiscalBaseRatio',
      header: t('columns.fiscalBaseRatio'),
      width: 90,
      align: 'right',
      accessorFn: (row) => formatRatio(row.fiscalBaseRatio),
    },
    {
      id: 'marketValue',
      header: t('columns.marketValue'),
      width: 130,
      align: 'right',
      accessorFn: (row) => formatCurrency(row.marketValue, 'CRC'),
    },
    {
      id: 'appraisalValue',
      header: t('columns.appraisalValue'),
      width: 130,
      align: 'right',
      accessorFn: (row) => formatCurrency(row.appraisalValue, 'CRC'),
    },
    {
      id: 'area',
      header: t('columns.area'),
      width: 100,
      align: 'right',
      accessorFn: (row) => formatArea(row.asset.area),
    },
    {
      id: 'caseNumber',
      header: t('columns.caseNumber'),
      width: 160,
      accessorFn: (row) => row.edict.caseNumber,
    },
  ];

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const renderActions = (row: PropertySummary) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t('addProperty')}
        </Button>
      </div>

      <div className="h-[calc(100vh-12rem)]">
        <DataGrid
          columns={columns}
          data={paginatedData}
          keyField="id"
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowSelect={setSelectedProperty}
          selectedRow={selectedProperty}
          actions={renderActions}
          onFilter={() => console.log('Filter clicked')}
          onEditFilters={() => console.log('Edit filters clicked')}
          onDownload={() => console.log('Download clicked')}
          onReload={() => console.log('Reload clicked')}
        />
      </div>
    </div>
  );
}