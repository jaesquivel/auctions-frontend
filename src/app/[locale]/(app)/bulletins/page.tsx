'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { mockBulletins } from '@/mocks';
import { formatDate } from '@/lib/formatters';
import type { Bulletin } from '@/types';

export default function BulletinsPage() {
  const t = useTranslations('bulletins');

  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: mockBulletins.length,
  });

  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedData = mockBulletins.slice(startIndex, startIndex + pagination.pageSize);

  const columns: ColumnDef<Bulletin>[] = [
    { id: 'volume', header: 'Volumen', width: 100, align: 'center', accessorFn: (row) => row.volume?.toString() || '-' },
    { id: 'year', header: 'Año', width: 80, align: 'center', accessorFn: (row) => row.year?.toString() || '-' },
    { id: 'url', header: 'URL', width: 400, accessorKey: 'url' },
    { id: 'processed', header: 'Procesado', width: 100, align: 'center', accessorFn: (row) => row.processed ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" /> },
    { id: 'createdAt', header: 'Fecha', width: 140, accessorFn: (row) => formatDate(row.createdAt) },
  ];

  const renderActions = (row: Bulletin) => (
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
        <Button className="gap-2"><Plus className="h-4 w-4" />{t('addBulletin')}</Button>
      </div>
      <div className="h-[calc(100vh-12rem)]">
        <DataGrid columns={columns} data={paginatedData} keyField="id" pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onRowSelect={setSelectedBulletin} selectedRow={selectedBulletin} actions={renderActions} onFilter={() => {}} onReload={() => {}} />
      </div>
    </div>
  );
}