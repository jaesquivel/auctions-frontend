'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState, type FilterState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AssetForm } from '@/components/forms/AssetForm';
import { assetsService } from '@/services/assets';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { formatCurrency, formatDate, formatArea } from '@/lib/formatters';
import type { Asset, AssetListItem, AssetUpdateRequest } from '@/types';

export default function AssetsPage() {
  const t = useTranslations('assets');

  const [data, setData] = useState<AssetListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<AssetListItem | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState[]>([]);
  const [filterState, setFilterState] = useState<FilterState | undefined>();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingListItem, setEditingListItem] = useState<AssetListItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await assetsService.getAll({
        page: pagination.page - 1,  // Convert to 0-indexed
        size: pagination.pageSize,
        sort: sort.length > 0 ? sort.map((s) => `${s.columnId},${s.direction}`) : undefined,
        filters: filterState,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, sort, filterState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingAsset(null);
    setEditingListItem(null);
    setFormOpen(true);
  };

  const handleEdit = async (row: AssetListItem) => {
    setEditingAsset(null);
    setEditingListItem(row);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const fullAsset = await assetsService.getById(row.id);
      if (fullAsset) {
        setEditingAsset(fullAsset);
      }
    } catch (error) {
      console.error('Failed to fetch asset details:', error);
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (data: AssetUpdateRequest) => {
    try {
      if (editingAsset) {
        await assetsService.update(editingAsset.id, data);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to save asset:', error);
    }
  };

  const handleDelete = async (asset: AssetListItem) => {
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

  const columns: ColumnDef<AssetListItem>[] = [
    { id: 'registration', header: t('columns.registration'), width: 100, filterable: true, filterType: 'text', accessorFn: (row) => row.registration || '-' },
    { id: 'type', header: t('columns.type'), width: 150, filterable: true, filterType: 'text', accessorFn: (row) => row.type || '-' },
    { id: 'tdProvince', header: t('columns.province'), width: 120, filterable: true, filterType: 'text', accessorFn: (row) => row.tdProvince?.name || '-' },
    { id: 'tdCanton', header: t('columns.canton'), width: 120, filterable: true, filterType: 'text', accessorFn: (row) => row.tdCanton?.name || '-' },
    { id: 'area', header: t('columns.area'), width: 100, align: 'right', filterable: true, filterType: 'number', accessorFn: (row) => formatArea(row.area) },
    { id: 'firstAuctionTs', header: t('columns.firstAuction'), width: 140, filterable: true, filterType: 'date', accessorFn: (row) => formatDate(row.firstAuctionTs) },
    { id: 'firstAuctionBase', header: t('columns.firstBase'), width: 130, align: 'right', filterable: true, filterType: 'number', accessorFn: (row) => formatCurrency(row.firstAuctionBase, row.currency) },
  ];

  const renderActions = (row: AssetListItem) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(row)}><Edit className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(row)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button size="icon" onClick={handleCreate}><Plus className="h-4 w-4" /></Button>
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
          onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
          onPageSizeChange={(size) => setPagination((prev) => ({ ...prev, pageSize: size, page: 1 }))}
          onRowSelect={setSelectedAsset}
          selectedRow={selectedAsset}
          actions={renderActions}
          onReload={fetchData}
          sort={sort}
          onSort={setSort}
          filterState={filterState}
          onFilterApply={(state) => { setFilterState(state); setPagination((prev) => ({ ...prev, page: 1 })); }}
        />
      </div>

      <AssetForm
        key={editingAsset?.id ?? 'new'}
        open={formOpen}
        onOpenChange={setFormOpen}
        asset={editingAsset}
        listItem={editingListItem}
        onSubmit={handleSubmit}
        loading={formLoading}
      />
    </div>
  );
}