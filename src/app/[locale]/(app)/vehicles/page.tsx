'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState, type FilterState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { vehiclesService } from '@/services/vehicles';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { VehicleSummary } from '@/types';

export default function VehiclesPage() {
  const t = useTranslations('vehicles');

  const [data, setData] = useState<VehicleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSummary | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState[]>([]);
  const [filterState, setFilterState] = useState<FilterState | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vehiclesService.getAll({
        page: pagination.page - 1,  // Convert to 0-indexed
        size: pagination.pageSize,
        sort: sort.length > 0 ? sort.map((s) => `${s.columnId},${s.direction}`) : undefined,
        filters: filterState,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, sort, filterState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (vehicle: VehicleSummary) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await vehiclesService.delete(vehicle.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const columns: ColumnDef<VehicleSummary>[] = [
    { id: 'plate', header: 'Placa', width: 100, filterable: true, filterType: 'text', accessorKey: 'plate' },
    { id: 'brand', header: 'Marca', width: 120, filterable: true, filterType: 'text', accessorFn: (row) => row.brand || '-' },
    { id: 'model', header: 'Modelo', width: 120, filterable: true, filterType: 'text', accessorFn: (row) => row.model || '-' },
    { id: 'year', header: 'Año', width: 80, align: 'center', filterable: true, filterType: 'number', accessorFn: (row) => row.year?.toString() || '-' },
    { id: 'firstAuctionTs', header: 'Primera Subasta', width: 140, filterable: true, filterType: 'date', accessorFn: (row) => formatDate(row.firstAuctionTs) },
    { id: 'firstAuctionBase', header: 'Base', width: 130, align: 'right', filterable: true, filterType: 'number', accessorFn: (row) => formatCurrency(row.firstAuctionBase) },
    { id: 'caseNumber', header: 'Caso', width: 160, filterable: true, filterType: 'text', accessorFn: (row) => row.edict?.caseNumber || '-' },
  ];

  const renderActions = (row: VehicleSummary) => (
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
        <DataGrid columns={columns} data={data} keyField="id" loading={loading} pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, page: 1 }))} onRowSelect={setSelectedVehicle} selectedRow={selectedVehicle} actions={renderActions} onReload={fetchData} sort={sort} onSort={setSort} filterState={filterState} onFilterApply={(state) => { setFilterState(state); setPagination((prev) => ({ ...prev, page: 1 })); }} />
      </div>
    </div>
  );
}