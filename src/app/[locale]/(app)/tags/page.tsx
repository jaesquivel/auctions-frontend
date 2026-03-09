'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { DataGrid, type ColumnDef, type ActionItem } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TagBadge } from '@/components/ui/tag-badge';
import { TagForm } from '@/components/forms/TagForm';
import { tagsService } from '@/services/tags';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/toast';
import { usePermissions } from '@/hooks';
import type { PropertyTag, PropertyTagCreateRequest, PropertyTagUpdateRequest } from '@/types';

export default function TagsPage() {
  const t = useTranslations('tags');
  const tc = useTranslations('common');
  const { can } = usePermissions();

  const [data, setData] = useState<PropertyTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<PropertyTag | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<PropertyTag | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const tags = await tagsService.getAll();
      setData(tags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditingTag(null);
    setFormOpen(true);
  };

  const handleEdit = (tag: PropertyTag) => {
    setEditingTag(tag);
    setFormOpen(true);
  };

  const handleDelete = async (tag: PropertyTag) => {
    if (!confirm(`Delete "${tag.name}"?`)) return;
    setDeleteError(null);
    try {
      await tagsService.delete(tag.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete tag:', error);
      if (error instanceof ApiError && error.status === 409) {
        setDeleteError(getErrorMessage(error.status, error.message));
      }
    }
  };

  const handleSubmit = async (data: PropertyTagCreateRequest | PropertyTagUpdateRequest) => {
    try {
      if (editingTag) {
        await tagsService.update(editingTag.id, data);
      } else {
        await tagsService.create(data);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  const columns: ColumnDef<PropertyTag>[] = [
    { id: 'name', header: t('columns.name'), width: 150, accessorFn: (row) => <TagBadge name={row.name} color={row.color} /> },
    { id: 'description', header: t('columns.description'), width: 300, accessorFn: (row) => row.description || '-' }
  ];

  const handleView = (tag: PropertyTag) => {
    setEditingTag(tag);
    setFormOpen(true);
  };

  const renderActions = (row: PropertyTag): ActionItem[] => [
    can('properties-tags.update')
      ? { icon: Edit, label: tc('edit'), onClick: () => handleEdit(row) }
      : { icon: Eye, label: tc('view'), onClick: () => handleView(row) },
    ...(can('properties-tags.delete') ? [{ icon: Trash2, label: tc('delete'), onClick: () => handleDelete(row), destructive: true }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {can('properties-tags.create') && (
          <Button size="icon" onClick={handleAdd}><Plus className="h-4 w-4" /></Button>
        )}
      </div>

      {deleteError && (
        <Alert variant="destructive" onClose={() => setDeleteError(null)}>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="h-[calc(100vh-12rem)]">
        <DataGrid columns={columns} data={data} keyField="id" loading={loading} onRowSelect={setSelectedTag} selectedRow={selectedTag} actions={renderActions} onReload={fetchData} />
      </div>

      <TagForm
        key={editingTag?.id ?? 'new'}
        open={formOpen}
        onOpenChange={setFormOpen}
        tag={editingTag}
        onSubmit={handleSubmit}
        readOnly={!can('properties-tags.update')}
      />
    </div>
  );
}