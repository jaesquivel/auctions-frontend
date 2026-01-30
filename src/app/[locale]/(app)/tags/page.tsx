'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/ui/tag-badge';
import { mockTags } from '@/mocks';
import { formatDate } from '@/lib/formatters';
import type { PropertyTag } from '@/types';

export default function TagsPage() {
  const t = useTranslations('tags');

  const [selectedTag, setSelectedTag] = useState<PropertyTag | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: mockTags.length,
  });

  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedData = mockTags.slice(startIndex, startIndex + pagination.pageSize);

  const columns: ColumnDef<PropertyTag>[] = [
    { id: 'name', header: t('columns.name'), width: 150, accessorFn: (row) => <TagBadge name={row.name} color={row.color} /> },
    { id: 'description', header: t('columns.description'), width: 300, accessorFn: (row) => row.description || '-' },
    { id: 'color', header: t('columns.color'), width: 100, accessorFn: (row) => <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ backgroundColor: row.color }} /><span className="text-xs font-mono">{row.color}</span></div> },
    { id: 'createdAt', header: 'Fecha', width: 140, accessorFn: (row) => formatDate(row.createdAt) },
  ];

  const renderActions = (row: PropertyTag) => (
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
        <DataGrid columns={columns} data={paginatedData} keyField="id" pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onRowSelect={setSelectedTag} selectedRow={selectedTag} actions={renderActions} onFilter={() => {}} onReload={() => {}} />
      </div>
    </div>
  );
}