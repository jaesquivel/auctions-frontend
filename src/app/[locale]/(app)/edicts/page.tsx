'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState, type FilterState, type ActionItem } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EdictForm } from '@/components/forms/EdictForm';
import { edictsService } from '@/services/edicts';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { usePermissions } from '@/hooks';
import type { Edict, EdictListItem, EdictUpdateRequest } from '@/types';

export default function EdictsPage() {
  const t = useTranslations('edicts');
  const tc = useTranslations('common');
  const { can } = usePermissions();

  const [data, setData] = useState<EdictListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdict, setSelectedEdict] = useState<EdictListItem | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState[]>([]);
  const [filterState, setFilterState] = useState<FilterState | undefined>();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEdict, setEditingEdict] = useState<Edict | null>(null);
  const [editingListItem, setEditingListItem] = useState<EdictListItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formReadOnly, setFormReadOnly] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await edictsService.getAll({
        page: pagination.page - 1,
        size: pagination.pageSize,
        sort: sort.length > 0 ? sort.map((s) => `${s.columnId},${s.direction}`) : undefined,
        filters: filterState,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch edicts:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, sort, filterState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleView = async (row: EdictListItem) => {
    setEditingEdict(null);
    setEditingListItem(row);
    setFormReadOnly(true);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const fullEdict = await edictsService.getById(row.id);
      if (fullEdict) setEditingEdict(fullEdict);
    } catch (error) {
      console.error('Failed to fetch edict details:', error);
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEdict(null);
    setEditingListItem(null);
    setFormReadOnly(false);
    setFormOpen(true);
  };

  const handleEdit = async (row: EdictListItem) => {
    setEditingEdict(null);
    setEditingListItem(row);
    setFormReadOnly(false);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const fullEdict = await edictsService.getById(row.id);
      if (fullEdict) {
        setEditingEdict(fullEdict);
      }
    } catch (error) {
      console.error('Failed to fetch edict details:', error);
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (data: EdictUpdateRequest) => {
    try {
      if (editingEdict) {
        await edictsService.update(editingEdict.id, data);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to save edict:', error);
    }
  };

  const handleDelete = async (edict: EdictListItem) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await edictsService.delete(edict.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete edict:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const columns: ColumnDef<EdictListItem>[] = [
    { id: 'caseNumber', header: t('columns.caseNumber'), width: 180, filterable: true, filterType: 'text', accessorKey: 'caseNumber' },
    { id: 'reference', header: t('columns.reference'), width: 140, filterable: true, filterType: 'text', accessorKey: 'reference' },
    { id: 'creditor', header: t('columns.creditor'), width: 200, filterable: true, filterType: 'text', accessorFn: (row) => row.creditor?.name ?? '-' },
    { id: 'debtor', header: t('columns.debtor'), width: 200, filterable: true, filterType: 'text', accessorFn: (row) => row.debtor?.name ?? '-' },
    { id: 'court', header: t('columns.court'), width: 200, filterable: true, filterType: 'text', accessorFn: (row) => row.court || '-' },
    { id: 'publication', header: t('columns.publication'), width: 100, align: 'center', filterable: true, filterType: 'number', accessorFn: (row) => `${row.publication || 0}/${row.publicationCount || 0}` },
    { id: 'bulletinYear', header: t('columns.bulletin'), width: 120, align: 'center', filterable: true, filterType: 'number', accessorFn: (row) => `${row.bulletin.volume}-${row.bulletin.year}` },
  ];

  const renderActions = (row: EdictListItem): ActionItem[] => [
    can('edicts.update')
      ? { icon: Edit, label: tc('edit'), onClick: () => handleEdit(row) }
      : { icon: Eye, label: tc('view'), onClick: () => handleView(row) },
    ...(can('edicts.delete') ? [{ icon: Trash2, label: tc('delete'), onClick: () => handleDelete(row), destructive: true }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {can('edicts.create') && <Button size="icon" onClick={handleCreate}><Plus className="h-4 w-4" /></Button>}
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
          onRowSelect={setSelectedEdict}
          selectedRow={selectedEdict}
          actions={renderActions}
          onReload={fetchData}
          sort={sort}
          onSort={setSort}
          filterState={filterState}
          onFilterApply={(state) => { setFilterState(state); setPagination((prev) => ({ ...prev, page: 1 })); }}
        />
      </div>

      <EdictForm
        key={editingEdict?.id ?? 'new'}
        open={formOpen}
        onOpenChange={setFormOpen}
        edict={editingEdict}
        listItem={editingListItem}
        onSubmit={handleSubmit}
        readOnly={formReadOnly}
        loading={formLoading}
      />
    </div>
  );
}