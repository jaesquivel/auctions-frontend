'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TagList } from '@/components/ui/tag-badge';
import { propertiesService } from '@/services/properties';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { formatCurrency, formatDate, formatArea, formatRatio } from '@/lib/formatters';
import type { PropertySummary } from '@/types';

export default function PropertiesPage() {
  const t = useTranslations('properties');

  const [data, setData] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertySummary | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [sort, setSort] = useState<SortState | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await propertiesService.getAll({
        page: pagination.page - 1,  // Convert to 0-indexed
        size: pagination.pageSize,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnDef<PropertySummary>[] = [
    {
      id: 'tags',
      header: t('columns.tags'),
      width: 150,
      accessorFn: (row) => <TagList tags={row.tags} max={10} />,
    },
    {
      id: 'registration',
      header: t('columns.registration'),
      width: 100,
      sortable: true,
      accessorFn: (row) => row.registrationFull || '-',
    },
    {
      id: 'location',
      header: t('columns.location'),
      width: 200,
      sortable: true,
      accessorFn: (row) => row.tdLocation || '-',
    },
    {
      id: 'firstDate',
      header: t('columns.firstDate'),
      width: 140,
      sortable: true,
      accessorFn: (row) => formatDate(row.asset.firstAuctionTs),
    },
    {
      id: 'firstBase',
      header: t('columns.firstBase'),
      width: 130,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatCurrency(row.asset.firstAuctionBase, row.asset.currency),
    },
    {
      id: 'firstBaseAdj',
      header: t('columns.firstBaseAdj'),
      width: 130,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatCurrency(row.firstAuctionBaseAdj, row.asset.currency),
    },
    {
      id: 'firstGuarantee',
      header: t('columns.firstGuarantee'),
      width: 130,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatCurrency(row.firstAuctionGuarantee, row.asset.currency),
    },
    {
      id: 'fiscalValue',
      header: t('columns.fiscalValue'),
      width: 130,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatCurrency(row.fiscalValue, 'CRC'),
    },
    {
      id: 'fiscalValueUsd',
      header: t('columns.fiscalValueUsd'),
      width: 120,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatCurrency(row.fiscalValueUsd, 'USD'),
    },
    {
      id: 'fiscalBaseRatio',
      header: t('columns.fiscalBaseRatio'),
      width: 90,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatRatio(row.fiscalBaseRatio),
    },
    {
      id: 'marketValue',
      header: t('columns.marketValue'),
      width: 130,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatCurrency(row.marketValue, 'CRC'),
    },
    {
      id: 'appraisalValue',
      header: t('columns.appraisalValue'),
      width: 130,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatCurrency(row.appraisalValue, 'CRC'),
    },
    {
      id: 'area',
      header: t('columns.area'),
      width: 100,
      align: 'right',
      sortable: true,
      accessorFn: (row) => formatArea(row.asset.area),
    },
    {
      id: 'caseNumber',
      header: t('columns.caseNumber'),
      width: 160,
      sortable: true,
      accessorFn: (row) => row.edict.caseNumber,
    },
  ];

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const handleDelete = async (property: PropertySummary) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await propertiesService.delete(property.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete property:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const renderActions = (row: PropertySummary) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(row)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {deleteError && (
        <Alert variant="destructive" onClose={() => setDeleteError(null)}>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="h-[calc(100vh-12rem)]">
        <DataGrid
          columns={columns}
          data={data}
          keyField="id"
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRowSelect={setSelectedProperty}
          selectedRow={selectedProperty}
          actions={renderActions}
          onFilter={() => console.log('Filter clicked')}
          onEditFilters={() => console.log('Edit filters clicked')}
          onDownload={() => console.log('Download clicked')}
          onReload={fetchData}
          sort={sort}
          onSort={setSort}
        />
      </div>
    </div>
  );
}