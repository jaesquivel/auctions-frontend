'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Check, X, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RawEdictForm } from '@/components/forms/RawEdictForm';
import { rawEdictsService } from '@/services/raw-edicts';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { formatDate } from '@/lib/formatters';
import type { RawEdict, RawEdictUpdateRequest } from '@/types';

export default function ExtractedEdictsPage() {
  const t = useTranslations('extractedEdicts');

  const [data, setData] = useState<RawEdict[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<RawEdict | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRawEdict, setEditingRawEdict] = useState<RawEdict | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [sort, setSort] = useState<SortState[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await rawEdictsService.getAll({
        page: pagination.page - 1,  // Convert to 0-indexed
        size: pagination.pageSize,
        sort: sort.length > 0 ? sort.map((s) => `${s.columnId},${s.direction}`) : undefined,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch extracted edicts:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = async (rawEdict: RawEdict) => {
    setEditingRawEdict(null);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const fullRawEdict = await rawEdictsService.getById(rawEdict.id);
      if (fullRawEdict) {
        // Merge bulletin from list data since detail response only has bulletinId
        setEditingRawEdict({ ...fullRawEdict, bulletin: rawEdict.bulletin });
      }
    } catch (error) {
      console.error('Failed to fetch raw edict details:', error);
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (data: RawEdictUpdateRequest) => {
    try {
      if (editingRawEdict) {
        await rawEdictsService.update(editingRawEdict.id, data);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to save extracted edict:', error);
    }
  };

  const handleDelete = async (item: RawEdict) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await rawEdictsService.delete(item.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete extracted edict:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const columns: ColumnDef<RawEdict>[] = [
    { id: 'caseNumber', header: t('columns.caseNumber'), width: 180, sortable: true, accessorFn: (row) => row.caseNumber || '-' },
    { id: 'reference', header: t('columns.reference'), width: 140, sortable: true, accessorFn: (row) => row.reference || '-' },
    { id: 'creditor', header: t('columns.creditor'), width: 200, sortable: true, accessorFn: (row) => row.creditor || '-' },
    { id: 'debtor', header: t('columns.debtor'), width: 200, sortable: true, accessorFn: (row) => row.debtor || '-' },
    { id: 'court', header: t('columns.court'), width: 200, sortable: true, accessorFn: (row) => row.court || '-' },
    { id: 'publication', header: t('columns.publication'), width: 100, align: 'center', sortable: true, accessorFn: (row) => `${row.publication || 0}/${row.publicationCount || 0}` },
    { id: 'bulletinVolume', header: t('columns.bulletin'), width: 120, align: 'center', accessorFn: (row) => row.bulletin ? `${row.bulletin.volume}/${row.bulletin.year}` : '-' },
    { id: 'processed', header: t('columns.processed'), width: 100, align: 'center', sortable: true, accessorFn: (row) => row.processed ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" /> },
  ];

  const renderActions = (row: RawEdict) => (
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
        />
      </div>

      <RawEdictForm
        key={editingRawEdict?.id ?? 'new'}
        open={formOpen}
        onOpenChange={setFormOpen}
        rawEdict={editingRawEdict}
        onSubmit={handleSubmit}
        loading={formLoading}
      />
    </div>
  );
}