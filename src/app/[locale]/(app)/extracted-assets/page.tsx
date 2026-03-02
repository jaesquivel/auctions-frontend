'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Check, X, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState, type FilterState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RawAssetForm } from '@/components/forms/RawAssetForm';
import { rawAssetsService } from '@/services/raw-assets';
import { rawEdictsService } from '@/services/raw-edicts';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import type { RawAsset, RawAssetUpdateRequest } from '@/types';

export default function ExtractedAssetsPage() {
  const t = useTranslations('extractedAssets');

  const [data, setData] = useState<RawAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<RawAsset | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRawAsset, setEditingRawAsset] = useState<RawAsset | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [edictFullText, setEdictFullText] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState[]>([]);
  const [filterState, setFilterState] = useState<FilterState | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await rawAssetsService.getAll({
        page: pagination.page - 1,
        size: pagination.pageSize,
        sort: sort.length > 0 ? sort.map((s) => `${s.columnId},${s.direction}`) : undefined,
        filters: filterState,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch extracted assets:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, sort, filterState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = async (rawAsset: RawAsset) => {
    setEditingRawAsset(rawAsset);
    setEdictFullText(null);
    setFormOpen(true);
    setFormLoading(true);
    try {
      if (rawAsset.rawEdict?.id) {
        const fullEdict = await rawEdictsService.getById(rawAsset.rawEdict.id);
        if (fullEdict) {
          setEdictFullText(fullEdict.fullText || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch raw edict details:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (data: RawAssetUpdateRequest) => {
    try {
      if (editingRawAsset) {
        await rawAssetsService.update(editingRawAsset.id, data);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to save extracted asset:', error);
    }
  };

  const handleDelete = async (item: RawAsset) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await rawAssetsService.delete(item.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete extracted asset:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const columns: ColumnDef<RawAsset>[] = [
    { id: 'type', header: t('columns.type'), width: 100, sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.type || '-' },
    { id: 'registration', header: t('columns.registration'), width: 130, sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.registration || '-' },
    { id: 'plate', header: t('columns.plate'), width: 110, sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.plate || '-' },
    { id: 'firstAuctionDate', header: t('columns.firstDate'), width: 110, sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.firstAuctionDate || '-' },
    { id: 'firstAuctionBase', header: t('columns.firstBase'), width: 130, align: 'right', sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.firstAuctionBase || '-' },
    { id: 'currency', header: t('columns.currency'), width: 90, align: 'center', sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.currency || '-' },
    { id: 'tdProvince', header: t('columns.province'), width: 120, sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.tdProvince || '-' },
    { id: 'tdCanton', header: t('columns.canton'), width: 120, sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.tdCanton || '-' },
    { id: 'tdDistrict', header: t('columns.district'), width: 120, sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.tdDistrict || '-' },
    { id: 'rawEdictCaseNumber', header: t('columns.caseNumber'), width: 160, sortable: true, filterable: true, filterType: 'text', accessorFn: (row) => row.rawEdict?.caseNumber || '-' },
    { id: 'processed', header: t('columns.processed'), width: 100, align: 'center', sortable: true, filterable: true, filterType: 'boolean', accessorFn: (row) => row.processed ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" /> },
  ];

  const renderActions = (row: RawAsset) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(row)}><Edit className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(row)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
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
          onRowSelect={setSelectedItem}
          selectedRow={selectedItem}
          actions={renderActions}
          onReload={fetchData}
          sort={sort}
          onSort={setSort}
          filterState={filterState}
          onFilterApply={(state) => { setFilterState(state); setPagination((prev) => ({ ...prev, page: 1 })); }}
        />
      </div>

      <RawAssetForm
        key={editingRawAsset?.id ?? 'new'}
        open={formOpen}
        onOpenChange={setFormOpen}
        rawAsset={editingRawAsset}
        onSubmit={handleSubmit}
        loading={formLoading}
        edictFullText={edictFullText}
      />
    </div>
  );
}