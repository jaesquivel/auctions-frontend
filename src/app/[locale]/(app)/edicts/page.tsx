'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { mockEdicts } from '@/mocks';
import { formatDate } from '@/lib/formatters';
import type { Edict } from '@/types';

export default function EdictsPage() {
  const t = useTranslations('edicts');

  const [selectedEdict, setSelectedEdict] = useState<Edict | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: mockEdicts.length,
  });

  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedData = mockEdicts.slice(startIndex, startIndex + pagination.pageSize);

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
      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
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
        <DataGrid columns={columns} data={paginatedData} keyField="id" pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onRowSelect={setSelectedEdict} selectedRow={selectedEdict} actions={renderActions} onFilter={() => {}} onReload={() => {}} />
      </div>
    </div>
  );
}