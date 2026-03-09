'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState, type FilterState, type ActionItem } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TagList } from '@/components/ui/tag-badge';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { propertiesService } from '@/services/properties';
import { tagsService } from '@/services/tags';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { formatCurrency, formatTimestamp, formatArea, formatRatio } from '@/lib/formatters';
import { usePermissions } from '@/hooks';
import type { Property, PropertyListItem, PropertyUpdateRequest, PropertyTag } from '@/types';

export default function PropertiesPage() {
  const t = useTranslations('properties');
  const tc = useTranslations('common');
  const { can } = usePermissions();

  const [data, setData] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListItem | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [sort, setSort] = useState<SortState[]>([]);
  const [filterState, setFilterState] = useState<FilterState | undefined>();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingListItem, setEditingListItem] = useState<PropertyListItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formReadOnly, setFormReadOnly] = useState(false);
  const [availableTags, setAvailableTags] = useState<PropertyTag[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await propertiesService.getAll({
        page: pagination.page - 1,
        size: pagination.pageSize,
        sort: sort.length > 0 ? sort.map((s) => `${s.columnId},${s.direction}`) : undefined,
        filters: filterState,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, sort, filterState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load tags once for the form
  useEffect(() => {
    tagsService.getAll().then(setAvailableTags).catch(console.error);
  }, []);

  const handleView = async (row: PropertyListItem) => {
    setEditingProperty(null);
    setEditingListItem(row);
    setFormReadOnly(true);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const full = await propertiesService.getById(row.id);
      if (full) setEditingProperty(full);
    } catch (error) {
      console.error('Failed to fetch property details:', error);
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProperty(null);
    setEditingListItem(null);
    setFormReadOnly(false);
    setFormOpen(true);
  };

  const handleEdit = async (row: PropertyListItem) => {
    setEditingProperty(null);
    setEditingListItem(row);
    setFormReadOnly(false);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const full = await propertiesService.getById(row.id);
      if (full) setEditingProperty(full);
    } catch (error) {
      console.error('Failed to fetch property details:', error);
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRefreshProperty = async () => {
    if (!editingProperty) return;
    try {
      const full = await propertiesService.getById(editingProperty.id);
      if (full) setEditingProperty(full);
    } catch (error) {
      console.error('Failed to refresh property:', error);
    }
  };

  const handleSubmit = async (data: PropertyUpdateRequest) => {
    try {
      if (editingProperty) {
        await propertiesService.update(editingProperty.id, data);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to save property:', error);
    }
  };

  const handleDelete = async (property: PropertyListItem) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await propertiesService.delete(property.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete property:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const columns: ColumnDef<PropertyListItem>[] = [
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
      id: 'fullRegistrationNumber',
      header: t('columns.registration'),
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.fullRegistrationNumber || '-',
    },
    {
      id: 'tdProvince',
      header: t('columns.province'),
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.asset.tdProvince?.name,
    },
    {
      id: 'tdCanton',
      header: t('columns.canton'),
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.asset.tdCanton?.name,
    },
    {
      id: 'tdDistrict',
      header: t('columns.district'),
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.asset.tdDistrict?.name,
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
      accessorFn: (row) => formatCurrency(row.firstAuctionGuarantee, row.asset.currency),
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
      id: 'fiscalValueUsd',
      header: t('columns.fiscalValueUsd'),
      width: 150,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatCurrency(row.fiscalValueUsd, 'USD'),
    },
    {
      id: 'fiscalBaseRatio',
      header: t('columns.fiscalBaseRatio'),
      width: 90,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatRatio(row.fiscalBaseRatio),
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
      id: 'area',
      header: t('columns.area'),
      width: 100,
      align: 'right',
      sortable: true,
      filterable: true,
      filterType: 'number',
      accessorFn: (row) => formatArea(row.asset.area),
    },
    {
      id: 'caseNumber',
      header: t('columns.caseNumber'),
      width: 160,
      sortable: true,
      filterable: true,
      filterType: 'text',
      accessorFn: (row) => row.asset.edict.caseNumber,
    },
  ];

  const renderActions = (row: PropertyListItem): ActionItem[] => [
    can('properties.update')
      ? { icon: Edit, label: tc('edit'), onClick: () => handleEdit(row) }
      : { icon: Eye, label: tc('view'), onClick: () => handleView(row) },
    ...(can('properties.delete') ? [{ icon: Trash2, label: tc('delete'), onClick: () => handleDelete(row), destructive: true }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {can('properties.create') && (
          <Button size="icon" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
          </Button>
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
          onRowSelect={setSelectedProperty}
          selectedRow={selectedProperty}
          actions={renderActions}
          filterState={filterState}
          onFilterApply={(state) => {
            setFilterState(state);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          filterMode="advanced"
          filterStorageKey="filters:properties"
          onDownload={() => console.log('Download clicked')}
          onReload={fetchData}
          sort={sort}
          onSort={setSort}
        />
      </div>

      <PropertyForm
        key={editingProperty?.id ?? 'new'}
        open={formOpen}
        onOpenChange={setFormOpen}
        property={editingProperty}
        listItem={editingListItem}
        onSubmit={handleSubmit}
        onRefresh={handleRefreshProperty}
        readOnly={formReadOnly}
        loading={formLoading}
        availableTags={availableTags}
      />
    </div>
  );
}