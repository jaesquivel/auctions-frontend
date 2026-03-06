'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2, Check, X, Eye } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState, type SortState, type FilterState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BulletinForm } from '@/components/forms/BulletinForm';
import { bulletinsService } from '@/services/bulletins';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { usePermissions } from '@/hooks';
import type { Bulletin, BulletinCreateRequest, BulletinUpdateRequest } from '@/types';

export default function BulletinsPage() {
  const t = useTranslations('bulletins');
  const { can } = usePermissions();

  const [data, setData] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formReadOnly, setFormReadOnly] = useState(false);
  const [editingBulletin, setEditingBulletin] = useState<Bulletin | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [sort, setSort] = useState<SortState[]>([]);
  const [filterState, setFilterState] = useState<FilterState | undefined>();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bulletinsService.getAll({
        page: pagination.page - 1,  // Convert to 0-indexed
        size: pagination.pageSize,
        sort: sort.length > 0 ? sort.map((s) => `${s.columnId},${s.direction}`) : undefined,
        filters: filterState,
      });
      setData(response.content);
      setPagination((prev) => ({ ...prev, total: response.totalElements }));
    } catch (error) {
      console.error('Failed to fetch bulletins:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, sort, filterState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleView = (bulletin: Bulletin) => {
    setEditingBulletin(bulletin);
    setFormReadOnly(true);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingBulletin(null);
    setFormReadOnly(false);
    setFormOpen(true);
  };

  const handleEdit = async (bulletin: Bulletin) => {
    setEditingBulletin(null);
    setFormReadOnly(false);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const fullBulletin = await bulletinsService.getById(bulletin.id);
      setEditingBulletin(fullBulletin);
    } catch (error) {
      console.error('Failed to fetch bulletin:', error);
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (bulletin: Bulletin) => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleteError(null);
    try {
      await bulletinsService.delete(bulletin.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete bulletin:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const handleSubmit = async (data: BulletinCreateRequest | BulletinUpdateRequest) => {
    try {
      if (editingBulletin) {
        await bulletinsService.update(editingBulletin.id, data);
      } else {
        await bulletinsService.create(data);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to save bulletin:', error);
    }
  };

  const columns: ColumnDef<Bulletin>[] = [
    { id: 'volume', header: t('columns.volume'), width: 100, align: 'center', sortable: true, filterable: true, filterType: 'number', accessorFn: (row) => row.volume?.toString() || '-' },
    { id: 'year', header: t('columns.year'), width: 80, align: 'center', sortable: true, filterable: true, filterType: 'number', accessorFn: (row) => row.year?.toString() || '-' },
    { id: 'url', header: t('columns.url'), width: 400, sortable: true, filterable: true, filterType: 'text', accessorKey: 'url' },
    { id: 'processed', header: t('columns.processed'), width: 100, align: 'center', sortable: true, filterable: true, filterType: 'boolean', accessorFn: (row) => row.processed ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" /> },
  ];

  const renderActions = (row: Bulletin) => (
    <div className="flex items-center gap-1">
      {can('bulletins.update') ? (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(row)}><Edit className="h-4 w-4" /></Button>
      ) : (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleView(row)}><Eye className="h-4 w-4" /></Button>
      )}
      {can('bulletins.delete') && (
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(row)}><Trash2 className="h-4 w-4" /></Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {can('bulletins.create') && <Button size="icon" onClick={handleAdd}><Plus className="h-4 w-4" /></Button>}
      </div>

      {deleteError && (
        <Alert variant="destructive" onClose={() => setDeleteError(null)}>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="h-[calc(100vh-12rem)]">
        <DataGrid columns={columns} data={data} keyField="id" loading={loading} pagination={pagination} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, page: 1 }))} onRowSelect={setSelectedBulletin} selectedRow={selectedBulletin} actions={renderActions} onReload={fetchData} sort={sort} onSort={setSort} filterState={filterState} onFilterApply={(state) => { setFilterState(state); setPagination((prev) => ({ ...prev, page: 1 })); }} />
      </div>

      <BulletinForm
        key={editingBulletin?.id ?? 'new'}
        open={formOpen}
        onOpenChange={setFormOpen}
        bulletin={editingBulletin}
        onSubmit={handleSubmit}
        readOnly={formReadOnly}
        loading={formLoading}
      />
    </div>
  );
}