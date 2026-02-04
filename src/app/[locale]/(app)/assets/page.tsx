'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { assetsService } from '@/services/assets';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { formatCurrency, formatDate, formatArea } from '@/lib/formatters';
import type { Asset } from '@/types';

export default function AssetsPage() {
  const t = useTranslations('assets');

  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await assetsService.getAll({
        page: pagination.page - 1,  // Convert to 0-indexed
        size: pagination.pageSize,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (asset: Asset) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await assetsService.delete(asset.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete asset:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const columns: ColumnDef<Asset>[] = [
    { id: 'registration', header: 'Matrícula', width: 100, accessorFn: (row) => row.registration || '-' },
    { id: 'type', header: 'Tipo', width: 150, accessorFn: (row) => row.type || '-' },
    { id: 'tdProvince', header: 'Provincia', width: 120, accessorFn: (row) => row.tdProvince?.name || '-' },
    { id: 'tdCanton', header: 'Cantón', width: 120, accessorFn: (row) => row.tdCanton?.name || '-' },
    { id: 'area', header: 'Área', width: 100, align: 'right', accessorFn: (row) => formatArea(row.area) },
    { id: 'firstAuctionTs', header: 'Primera Subasta', width: 140, accessorFn: (row) => formatDate(row.firstAuctionTs) },
    { id: 'firstAuctionBase', header: 'Base', width: 130, align: 'right', accessorFn: (row) => formatCurrency(row.firstAuctionBase, row.currency) },
  ];

  const renderActions = (row: Asset) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(row)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button size="icon"><Plus className="h-4 w-4" /></Button>
      </div>

      {deleteError && (
        <Alert variant="destructive" onClose={() => setDeleteError(null)}>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="h-[calc(100vh-12rem)]">
        <DataGrid columns={columns} data={data} keyField="id" loading={loading} pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, page: 1 }))} onRowSelect={setSelectedAsset} selectedRow={selectedAsset} actions={renderActions} onFilter={() => {}} onReload={fetchData} />
      </div>
    </div>
  );
}