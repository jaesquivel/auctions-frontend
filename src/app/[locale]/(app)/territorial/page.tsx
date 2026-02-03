'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TdProvinceForm } from '@/components/forms/TdProvinceForm';
import { TdCantonForm } from '@/components/forms/TdCantonForm';
import { TdDistrictForm } from '@/components/forms/TdDistrictForm';
import { territorialService } from '@/services/territorial';
import type { TdProvince, TdCanton, TdDistrict, TdProvinceCreateRequest, TdCantonCreateRequest, TdDistrictCreateRequest } from '@/types';

export default function TerritorialPage() {
  const t = useTranslations('territorial');
  const tCommon = useTranslations('common');

  const [tdProvinces, setTdProvinces] = useState<TdProvince[]>([]);
  const [tdCantons, setTdCantons] = useState<TdCanton[]>([]);
  const [tdDistricts, setTdDistricts] = useState<TdDistrict[]>([]);
  const [loadingTdProvinces, setLoadingTdProvinces] = useState(true);
  const [loadingTdCantons, setLoadingTdCantons] = useState(false);
  const [loadingTdDistricts, setLoadingTdDistricts] = useState(false);
  const [selectedTdProvince, setSelectedTdProvince] = useState<TdProvince | null>(null);
  const [selectedTdCanton, setSelectedTdCanton] = useState<TdCanton | null>(null);
  const [selectedTdDistrict, setSelectedTdDistrict] = useState<TdDistrict | null>(null);

  // TdProvince modal state
  const [tdProvinceModalOpen, setTdProvinceModalOpen] = useState(false);
  const [editingTdProvince, setEditingTdProvince] = useState<TdProvince | null>(null);

  // TdCanton modal state
  const [tdCantonModalOpen, setTdCantonModalOpen] = useState(false);
  const [editingTdCanton, setEditingTdCanton] = useState<TdCanton | null>(null);

  // TdDistrict modal state
  const [tdDistrictModalOpen, setTdDistrictModalOpen] = useState(false);
  const [editingTdDistrict, setEditingTdDistrict] = useState<TdDistrict | null>(null);

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingTdProvince, setDeletingTdProvince] = useState<TdProvince | null>(null);
  const [deletingTdCanton, setDeletingTdCanton] = useState<TdCanton | null>(null);
  const [deletingTdDistrict, setDeletingTdDistrict] = useState<TdDistrict | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tdProvinces on mount
  const fetchTdProvinces = useCallback(async () => {
    setLoadingTdProvinces(true);
    try {
      const data = await territorialService.getTdProvinces();
      setTdProvinces(data);
    } catch (error) {
      console.error('Failed to fetch tdProvinces:', error);
    } finally {
      setLoadingTdProvinces(false);
    }
  }, []);

  useEffect(() => {
    fetchTdProvinces();
  }, [fetchTdProvinces]);

  // Fetch tdCantons when tdProvince is selected
  const fetchTdCantons = useCallback(async (tdProvinceId: string) => {
    setLoadingTdCantons(true);
    try {
      const data = await territorialService.getTdCantons(tdProvinceId);
      setTdCantons(data);
    } catch (error) {
      console.error('Failed to fetch tdCantons:', error);
    } finally {
      setLoadingTdCantons(false);
    }
  }, []);

  // Fetch tdDistricts when tdCanton is selected
  const fetchTdDistricts = useCallback(async (tdCantonId: string) => {
    setLoadingTdDistricts(true);
    try {
      const data = await territorialService.getTdDistricts(tdCantonId);
      setTdDistricts(data);
    } catch (error) {
      console.error('Failed to fetch tdDistricts:', error);
    } finally {
      setLoadingTdDistricts(false);
    }
  }, []);

  const tdProvinceColumns: ColumnDef<TdProvince>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: t('columns.code'), width: 80, accessorKey: 'code' },
    { id: 'name', header: t('columns.name'), width: 150, accessorKey: 'name' }
  ];

  const tdCantonColumns: ColumnDef<TdCanton>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: t('columns.code'), width: 80, accessorKey: 'code' },
    { id: 'name', header: t('columns.name'), width: 150, accessorKey: 'name' }
  ];

  const tdDistrictColumns: ColumnDef<TdDistrict>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: t('columns.code'), width: 80, accessorKey: 'code' },
    { id: 'name', header: t('columns.name'), width: 150, accessorKey: 'name' }
  ];

  // TdProvince handlers
  const handleAddTdProvince = () => {
    setEditingTdProvince(null);
    setTdProvinceModalOpen(true);
  };

  const handleEditTdProvince = (tdProvince: TdProvince) => {
    setEditingTdProvince(tdProvince);
    setTdProvinceModalOpen(true);
  };

  const handleTdProvinceSubmit = async (data: TdProvinceCreateRequest) => {
    if (editingTdProvince) {
      await territorialService.updateTdProvince(editingTdProvince.id, data);
    } else {
      await territorialService.createTdProvince(data);
    }
    fetchTdProvinces();
  };

  const handleDeleteTdProvince = (tdProvince: TdProvince) => {
    setDeletingTdProvince(tdProvince);
    setDeleteConfirmOpen(true);
  };

  const renderTdProvinceActions = (tdProvince: TdProvince) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditTdProvince(tdProvince)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteTdProvince(tdProvince)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // TdCanton handlers
  const handleAddTdCanton = () => {
    setEditingTdCanton(null);
    setTdCantonModalOpen(true);
  };

  const handleEditTdCanton = (tdCanton: TdCanton) => {
    setEditingTdCanton(tdCanton);
    setTdCantonModalOpen(true);
  };

  const handleTdCantonSubmit = async (data: TdCantonCreateRequest) => {
    if (editingTdCanton) {
      await territorialService.updateTdCanton(editingTdCanton.id, data);
    } else {
      await territorialService.createTdCanton(data);
    }
    if (selectedTdProvince) {
      fetchTdCantons(selectedTdProvince.id);
    }
  };

  const handleDeleteTdCanton = (tdCanton: TdCanton) => {
    setDeletingTdCanton(tdCanton);
    setDeleteConfirmOpen(true);
  };

  const renderTdCantonActions = (tdCanton: TdCanton) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditTdCanton(tdCanton)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteTdCanton(tdCanton)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // TdDistrict handlers
  const handleAddTdDistrict = () => {
    setEditingTdDistrict(null);
    setTdDistrictModalOpen(true);
  };

  const handleEditTdDistrict = (tdDistrict: TdDistrict) => {
    setEditingTdDistrict(tdDistrict);
    setTdDistrictModalOpen(true);
  };

  const handleTdDistrictSubmit = async (data: TdDistrictCreateRequest) => {
    if (editingTdDistrict) {
      await territorialService.updateTdDistrict(editingTdDistrict.id, data);
    } else {
      await territorialService.createTdDistrict(data);
    }
    if (selectedTdCanton) {
      fetchTdDistricts(selectedTdCanton.id);
    }
  };

  const handleDeleteTdDistrict = (tdDistrict: TdDistrict) => {
    setDeletingTdDistrict(tdDistrict);
    setDeleteConfirmOpen(true);
  };

  const renderTdDistrictActions = (tdDistrict: TdDistrict) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditTdDistrict(tdDistrict)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteTdDistrict(tdDistrict)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const handleTdProvinceSelect = (tdProvince: TdProvince) => {
    setSelectedTdProvince(tdProvince);
    setSelectedTdCanton(null);
    setSelectedTdDistrict(null);
    setTdCantons([]);
    setTdDistricts([]);
    fetchTdCantons(tdProvince.id);
  };

  const handleTdCantonSelect = (tdCanton: TdCanton) => {
    setSelectedTdCanton(tdCanton);
    setSelectedTdDistrict(null);
    setTdDistricts([]);
    fetchTdDistricts(tdCanton.id);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deletingTdProvince) {
        await territorialService.deleteTdProvince(deletingTdProvince.id);
        if (selectedTdProvince?.id === deletingTdProvince.id) {
          setSelectedTdProvince(null);
          setSelectedTdCanton(null);
          setSelectedTdDistrict(null);
          setTdCantons([]);
          setTdDistricts([]);
        }
        fetchTdProvinces();
      } else if (deletingTdCanton) {
        await territorialService.deleteTdCanton(deletingTdCanton.id);
        if (selectedTdCanton?.id === deletingTdCanton.id) {
          setSelectedTdCanton(null);
          setSelectedTdDistrict(null);
          setTdDistricts([]);
        }
        if (selectedTdProvince) {
          fetchTdCantons(selectedTdProvince.id);
        }
      } else if (deletingTdDistrict) {
        await territorialService.deleteTdDistrict(deletingTdDistrict.id);
        if (selectedTdDistrict?.id === deletingTdDistrict.id) {
          setSelectedTdDistrict(null);
        }
        if (selectedTdCanton) {
          fetchTdDistricts(selectedTdCanton.id);
        }
      }
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
      setDeletingTdProvince(null);
      setDeletingTdCanton(null);
      setDeletingTdDistrict(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeletingTdProvince(null);
    setDeletingTdCanton(null);
    setDeletingTdDistrict(null);
  };

  const deletingItem = deletingTdProvince || deletingTdCanton || deletingTdDistrict;
  const deletingItemType = deletingTdProvince
    ? t('provinces')
    : deletingTdCanton
      ? t('cantons')
      : t('districts');

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* TdProvinces */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('provinces')}</h2>
              <Button size="sm" className="gap-1" onClick={handleAddTdProvince}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-[calc(100vh-16rem)]">
              <DataGrid
                columns={tdProvinceColumns}
                data={tdProvinces}
                keyField="id"
                loading={loadingTdProvinces}
                onRowSelect={handleTdProvinceSelect}
                selectedRow={selectedTdProvince}
                actions={renderTdProvinceActions}
                onReload={fetchTdProvinces}
              />
            </div>
          </div>

          {/* TdCantons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('cantons')}</h2>
              <Button size="sm" className="gap-1" disabled={!selectedTdProvince} onClick={handleAddTdCanton}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-[calc(100vh-16rem)]">
              <DataGrid
                columns={tdCantonColumns}
                data={tdCantons}
                keyField="id"
                loading={loadingTdCantons}
                onRowSelect={handleTdCantonSelect}
                selectedRow={selectedTdCanton}
                actions={renderTdCantonActions}
                onReload={selectedTdProvince ? () => fetchTdCantons(selectedTdProvince.id) : undefined}
              />
            </div>
          </div>

          {/* TdDistricts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('districts')}</h2>
              <Button size="sm" className="gap-1" disabled={!selectedTdCanton} onClick={handleAddTdDistrict}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-[calc(100vh-16rem)]">
              <DataGrid
                columns={tdDistrictColumns}
                data={tdDistricts}
                keyField="id"
                loading={loadingTdDistricts}
                onRowSelect={setSelectedTdDistrict}
                selectedRow={selectedTdDistrict}
                actions={renderTdDistrictActions}
                onReload={selectedTdCanton ? () => fetchTdDistricts(selectedTdCanton.id) : undefined}
              />
            </div>
          </div>
        </div>
      </div>

      <TdProvinceForm
        open={tdProvinceModalOpen}
        onOpenChange={setTdProvinceModalOpen}
        tdProvince={editingTdProvince}
        onSubmit={handleTdProvinceSubmit}
      />

      {selectedTdProvince && (
        <TdCantonForm
          open={tdCantonModalOpen}
          onOpenChange={setTdCantonModalOpen}
          tdCanton={editingTdCanton}
          tdProvince={selectedTdProvince}
          onSubmit={handleTdCantonSubmit}
        />
      )}

      {selectedTdCanton && (
        <TdDistrictForm
          open={tdDistrictModalOpen}
          onOpenChange={setTdDistrictModalOpen}
          tdDistrict={editingTdDistrict}
          tdCanton={selectedTdCanton}
          onSubmit={handleTdDistrictSubmit}
        />
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={handleCancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tCommon('confirm')}</DialogTitle>
            <DialogDescription>
              {t('confirmDelete', { type: deletingItemType, name: deletingItem?.name ?? '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={isDeleting}>
              {tCommon('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? tCommon('loading') : tCommon('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}