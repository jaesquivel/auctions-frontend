'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState, type FilterState, type ActionItem } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TagList } from '@/components/ui/tag-badge';
import { VehicleForm } from '@/components/forms/VehicleForm';
import { vehiclesService } from '@/services/vehicles';
import { vehicleTagsService } from '@/services/vehicle-tags';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { formatCurrency, formatTimestamp } from '@/lib/formatters';
import { usePermissions } from '@/hooks';
import type { Vehicle, VehicleListItem, VehicleUpdateRequest, VehicleTag } from '@/types';

export default function VehiclesPage() {
  const t = useTranslations('vehicles');
  const tc = useTranslations('common');
  const { can } = usePermissions();

  const [data, setData] = useState<VehicleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleListItem | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 20, total: 0 });
  const [sort, setSort] = useState<SortState[]>([]);
  const [filterState, setFilterState] = useState<FilterState | undefined>();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formReadOnly, setFormReadOnly] = useState(false);
  const [availableTags, setAvailableTags] = useState<VehicleTag[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vehiclesService.getAll({
        page: pagination.page - 1,
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

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    vehicleTagsService.getAll().then(setAvailableTags).catch(console.error);
  }, []);

  const openForm = async (row: VehicleListItem, readOnly: boolean) => {
    setEditingVehicle(null);
    setFormReadOnly(readOnly);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const full = await vehiclesService.getById(row.id);
      if (full) setEditingVehicle(full);
    } catch (error) {
      console.error('Failed to fetch vehicle details:', error);
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (data: VehicleUpdateRequest) => {
    try {
      if (editingVehicle) {
        await vehiclesService.update(editingVehicle.id, data);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const handleDelete = async (vehicle: VehicleListItem) => {
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

  const columns: ColumnDef<VehicleListItem>[] = [
    {
      id: 'tagIds',
      header: t('columns.tags'),
      width: 150,
      filterable: true,
      filterType: 'tagId',
      tagOptions: availableTags,
      accessorFn: (row) => <TagList tags={row.tags} max={10} />,
    },
    {
      id: 'plate',
      header: t('columns.plate'),
      width: 110,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.plate,
    },
    {
      id: 'make',
      header: t('columns.make'),
      width: 120,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.make || '-',
    },
    {
      id: 'model',
      header: t('columns.model'),
      width: 140,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.model || '-',
    },
    {
      id: 'year',
      header: t('columns.year'),
      width: 70,
      align: 'center',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => row.year?.toString() || '-',
    },
    {
      id: 'bodyStyle',
      header: t('columns.bodyStyle'),
      width: 110,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.bodyStyle || '-',
    },
    {
      id: 'exteriorColor',
      header: t('columns.exteriorColor'),
      width: 110,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.exteriorColor || '-',
    },
    {
      id: 'firstAuctionTs',
      header: t('columns.firstDate'),
      width: 140,
      sortable: true,
      filterable: true,
      filterType: 'datetime',
      accessorFn: (row) => formatTimestamp(row.asset.firstAuctionTs),
    },
    {
      id: 'secondAuctionTs',
      header: t('columns.secondDate'),
      width: 140,
      sortable: true,
      filterable: true,
      filterType: 'datetime',
      accessorFn: (row) => formatTimestamp(row.asset.secondAuctionTs),
    },
    {
      id: 'thirdAuctionTs',
      header: t('columns.thirdDate'),
      width: 140,
      sortable: true,
      filterable: true,
      filterType: 'datetime',
      accessorFn: (row) => formatTimestamp(row.asset.thirdAuctionTs),
    },
    {
      id: 'firstAuctionBase',
      header: t('columns.firstBase'),
      width: 130,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatCurrency(row.asset.firstAuctionBase, row.asset.currency),
    },
    {
      id: 'firstAuctionBaseAdj',
      header: t('columns.firstBaseAdj'),
      width: 150,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatCurrency(row.firstAuctionBaseAdj, 'USD'),
    },
    {
      id: 'firstAuctionGuarantee',
      header: t('columns.firstGuarantee'),
      width: 150,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatCurrency(row.firstAuctionGuarantee, 'USD'),
    },
    {
      id: 'fiscalValue',
      header: t('columns.fiscalValue'),
      width: 150,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatCurrency(row.fiscalValue, 'CRC'),
    },
    {
      id: 'marketValue',
      header: t('columns.marketValue'),
      width: 130,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatCurrency(row.marketValue, 'USD'),
    },
    {
      id: 'appraisalValue',
      header: t('columns.appraisalValue'),
      width: 150,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatCurrency(row.appraisalValue, 'USD'),
    },
    {
      id: 'caseNumber',
      header: t('columns.caseNumber'),
      width: 160,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.asset.edict?.caseNumber || '-',
    },
  ];

  const renderActions = (row: VehicleListItem): ActionItem[] => [
    can('vehicles.update')
      ? { icon: Edit, label: tc('edit'), onClick: () => openForm(row, false) }
      : { icon: Eye, label: tc('view'), onClick: () => openForm(row, true) },
    ...(can('vehicles.delete') ? [{ icon: Trash2, label: tc('delete'), onClick: () => handleDelete(row), destructive: true }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {can('vehicles.create') && (
          <Button size="icon" onClick={() => {}}><Plus className="h-4 w-4" /></Button>
        )}
      </div>

      {deleteError && (
        <Alert variant="destructive" onClose={() => setDeleteError(null)}>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="h-[calc(100vh-12rem)]">
        <DataGrid
          columns={columns}
          data={data}
          keyField="id"
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
          onPageSizeChange={(size) => setPagination((prev) => ({ ...prev, pageSize: size, page: 1 }))}
          onRowSelect={setSelectedVehicle}
          selectedRow={selectedVehicle}
          actions={renderActions}
          filterState={filterState}
          onFilterApply={(state) => { setFilterState(state); setPagination((prev) => ({ ...prev, page: 1 })); }}
          filterMode="advanced"
          filterStorageKey="filters:vehicles"
          onDownload={() => console.log('Download clicked')}
          onReload={fetchData}
          sort={sort}
          onSort={setSort}
        />
      </div>

      <VehicleForm
        key={editingVehicle?.id ?? 'view'}
        open={formOpen}
        onOpenChange={setFormOpen}
        vehicle={editingVehicle}
        onSubmit={handleSubmit}
        readOnly={formReadOnly}
        loading={formLoading}
        availableTags={availableTags}
      />
    </div>
  );
}
