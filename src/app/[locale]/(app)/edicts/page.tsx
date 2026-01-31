'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { edictsService } from '@/services/edicts';
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await edictsService.getAll({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      setData(response.data);
      setPagination((prev) => ({ ...prev, total: response.total }));
    } catch (error) {
      console.error('Failed to fetch edicts:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnDef<Edict>[] = [
    { id: 'caseNumber', header: 'Número de Caso', width: 180, accessorKey: 'caseNumber' },
    { id: 'reference', header: 'Referencia', width: 140, accessorKey: 'reference' },
    { id: 'creditor', header: 'Acreedor', width: 200, accessorFn: (row) => row.creditor.name },
    { id: 'debtor', header: 'Deudor', width: 200, accessorFn: (row) => row.debtor.name },
    { id: 'court', header: 'Juzgado', width: 200, accessorFn: (row) => row.court || '-' },
    { id: 'publication', header: 'Publicación', width: 100, align: 'center', accessorFn: (row) => `${row.publication || 0}/${row.publicationCount || 0}` },
    { id: 'createdAt', header: 'Fecha', width: 140, accessorFn: (row) => formatDate(row.createdAt) },
  ];

  const renderActions = (row: Edict) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button size="icon"><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="h-[calc(100vh-12rem)]">
        <DataGrid columns={columns} data={data} keyField="id" loading={loading} pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onRowSelect={setSelectedEdict} selectedRow={selectedEdict} actions={renderActions} onFilter={() => {}} onReload={fetchData} />
      </div>
    </div>
  );
}