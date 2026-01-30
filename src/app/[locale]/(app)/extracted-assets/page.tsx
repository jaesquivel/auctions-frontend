'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Check, X } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { mockExtractedAssets } from '@/mocks';
import { formatDate } from '@/lib/formatters';
import type { ExtractedAsset } from '@/types';

export default function ExtractedAssetsPage() {
  const t = useTranslations('extractedAssets');

  const [selectedItem, setSelectedItem] = useState<ExtractedAsset | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: mockExtractedAssets.length,
  });

  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedData = mockExtractedAssets.slice(startIndex, startIndex + pagination.pageSize);

  const columns: ColumnDef<ExtractedAsset>[] = [
    { id: 'id', header: 'ID', width: 80, accessorFn: (row) => row.id.replace('exas', '') },
    { id: 'rawText', header: 'Texto Extraído', width: 500, accessorFn: (row) => row.rawText.substring(0, 120) + '...' },
    { id: 'processed', header: 'Procesado', width: 100, align: 'center', accessorFn: (row) => row.processed ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" /> },
    { id: 'createdAt', header: 'Fecha', width: 140, accessorFn: (row) => formatDate(row.createdAt) },
  ];

  const renderActions = (row: ExtractedAsset) => (
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