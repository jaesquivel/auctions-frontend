'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { mockAssets } from '@/mocks';
import { formatCurrency, formatDate, formatArea } from '@/lib/formatters';
import type { Asset } from '@/types';

export default function AssetsPage() {
  const t = useTranslations('assets');

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: mockAssets.length,
  });

  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedData = mockAssets.slice(startIndex, startIndex + pagination.pageSize);

  const columns: ColumnDef<Asset>[] = [
    { id: 'registration', header: 'Matrícula', width: 100, accessorFn: (row) => row.registration || '-' },
    { id: 'type', header: 'Tipo', width: 150, accessorFn: (row) => row.type || '-' },
    { id: 'province', header: 'Provincia', width: 120, accessorFn: (row) => row.geoProvince?.name || '-' },
    { id: 'canton', header: 'Cantón', width: 120, accessorFn: (row) => row.geoCanton?.name || '-' },
    { id: 'area', header: 'Área', width: 100, align: 'right', accessorFn: (row) => formatArea(row.area) },
    { id: 'firstAuctionTs', header: 'Primera Subasta', width: 140, accessorFn: (row) => formatDate(row.firstAuctionTs) },
    { id: 'firstAuctionBase', header: 'Base', width: 130, align: 'right', accessorFn: (row) => formatCurrency(row.firstAuctionBase, row.currency) },
  ];

  const renderActions = (row: Asset) => (
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
        <DataGrid columns={columns} data={paginatedData} keyField="id" pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onRowSelect={setSelectedAsset} selectedRow={selectedAsset} actions={renderActions} onFilter={() => {}} onReload={() => {}} />
      </div>
    </div>
  );
}