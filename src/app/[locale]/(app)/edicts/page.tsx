'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { edictsService } from '@/services/edicts';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { formatDate } from '@/lib/formatters';
import type { Edict } from '@/types';

export default function EdictsPage() {
  const t = useTranslations('edicts');

  const [data, setData] = useState<Edict[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdict, setSelectedEdict] = useState<Edict | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await edictsService.getAll({
        page: pagination.page - 1,  // Convert to 0-indexed
        size: pagination.pageSize,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch edicts:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (edict: Edict) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await edictsService.delete(edict.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete edict:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const columns: ColumnDef<Edict>[] = [
    { id: 'caseNumber', header: 'Número de Caso', width: 180, accessorKey: 'caseNumber' },
    { id: 'reference', header: 'Referencia', width: 140, accessorKey: 'reference' },
    { id: 'creditor', header: 'Acreedor', width: 200, accessorFn: (row) => row.creditor.name },
    { id: 'debtor', header: 'Deudor', width: 200, accessorFn: (row) => row.debtor.name },
    { id: 'court', header: 'Juzgado', width: 200, accessorFn: (row) => row.court || '-' },
    { id: 'publication', header: 'Publicación', width: 100, align: 'center', accessorFn: (row) => `${row.publication || 0}/${row.publicationCount || 0}` },
  ];

  const renderActions = (row: Edict) => (
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
        <DataGrid columns={columns} data={data} keyField="id" loading={loading} pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, page: 1 }))} onRowSelect={setSelectedEdict} selectedRow={selectedEdict} actions={renderActions} onFilter={() => {}} onReload={fetchData} />
      </div>
    </div>
  );
}