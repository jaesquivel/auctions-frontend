'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Check, X } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { mockExtractedEdicts } from '@/mocks';
import { formatDate } from '@/lib/formatters';
import type { ExtractedEdict } from '@/types';

export default function ExtractedEdictsPage() {
  const t = useTranslations('extractedEdicts');

  const [selectedItem, setSelectedItem] = useState<ExtractedEdict | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: mockExtractedEdicts.length,
  });

  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedData = mockExtractedEdicts.slice(startIndex, startIndex + pagination.pageSize);

  const columns: ColumnDef<ExtractedEdict>[] = [
    { id: 'caseNumber', header: 'Número de Caso', width: 180, accessorFn: (row) => row.caseNumber || '-' },
    { id: 'reference', header: 'Referencia', width: 140, accessorFn: (row) => row.reference || '-' },
    { id: 'rawText', header: 'Texto Extraído', width: 400, accessorFn: (row) => row.rawText.substring(0, 100) + '...' },
    { id: 'processed', header: 'Procesado', width: 100, align: 'center', accessorFn: (row) => row.processed ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" /> },
    { id: 'createdAt', header: 'Fecha', width: 140, accessorFn: (row) => formatDate(row.createdAt) },
  ];

  const renderActions = (row: ExtractedEdict) => (
    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>
      <div className="h-[calc(100vh-12rem)]">
        <DataGrid columns={columns} data={paginatedData} keyField="id" pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onRowSelect={setSelectedItem} selectedRow={selectedItem} actions={renderActions} onFilter={() => {}} onReload={() => {}} />
      </div>
    </div>
  );
}