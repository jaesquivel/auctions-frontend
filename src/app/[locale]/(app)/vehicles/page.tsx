'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { mockVehicles } from '@/mocks';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { VehicleSummary } from '@/types';

export default function VehiclesPage() {
  const t = useTranslations('vehicles');

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSummary | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: mockVehicles.length,
  });

  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedData = mockVehicles.slice(startIndex, startIndex + pagination.pageSize);

  const columns: ColumnDef<VehicleSummary>[] = [
    { id: 'plate', header: 'Placa', width: 100, accessorKey: 'plate' },
    { id: 'brand', header: 'Marca', width: 120, accessorFn: (row) => row.brand || '-' },
    { id: 'model', header: 'Modelo', width: 120, accessorFn: (row) => row.model || '-' },
    { id: 'year', header: 'Año', width: 80, align: 'center', accessorFn: (row) => row.year?.toString() || '-' },
    { id: 'firstAuctionTs', header: 'Primera Subasta', width: 140, accessorFn: (row) => formatDate(row.firstAuctionTs) },
    { id: 'firstAuctionBase', header: 'Base', width: 130, align: 'right', accessorFn: (row) => formatCurrency(row.firstAuctionBase, row.currency) },
    { id: 'caseNumber', header: 'Caso', width: 160, accessorFn: (row) => row.edict?.caseNumber || '-' },
  ];

  const renderActions = (row: VehicleSummary) => (
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
        <DataGrid columns={columns} data={paginatedData} keyField="id" pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onRowSelect={setSelectedVehicle} selectedRow={selectedVehicle} actions={renderActions} onFilter={() => {}} onReload={() => {}} />
      </div>
    </div>
  );
}