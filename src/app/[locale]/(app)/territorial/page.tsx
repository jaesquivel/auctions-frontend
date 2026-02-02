'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { ProvinceForm } from '@/components/forms/ProvinceForm';
import { territorialService } from '@/services/territorial';
import type { Province, Canton, District, ProvinceCreateRequest } from '@/types';

export default function TerritorialPage() {
  const t = useTranslations('territorial');

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cantons, setCantons] = useState<Canton[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCantons, setLoadingCantons] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCanton, setSelectedCanton] = useState<Canton | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Province modal state
  const [provinceModalOpen, setProvinceModalOpen] = useState(false);
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);

  // Fetch provinces on mount
  const fetchProvinces = useCallback(async () => {
    setLoadingProvinces(true);
    try {
      const data = await territorialService.getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
    } finally {
      setLoadingProvinces(false);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // Fetch cantons when province is selected
  const fetchCantons = useCallback(async (provinceId: string) => {
    setLoadingCantons(true);
    try {
      const data = await territorialService.getCantons(provinceId);
      setCantons(data);
    } catch (error) {
      console.error('Failed to fetch cantons:', error);
    } finally {
      setLoadingCantons(false);
    }
  }, []);

  // Fetch districts when canton is selected
  const fetchDistricts = useCallback(async (cantonId: string) => {
    setLoadingDistricts(true);
    try {
      const data = await territorialService.getDistricts(cantonId);
      setDistricts(data);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  const provinceColumns: ColumnDef<Province>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: t('columns.code'), width: 80, accessorKey: 'code' },
    { id: 'name', header: t('columns.name'), width: 150, accessorKey: 'name' }
  ];

  const cantonColumns: ColumnDef<Canton>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: t('columns.code'), width: 80, accessorKey: 'code' },
    { id: 'name', header: t('columns.name'), width: 150, accessorKey: 'name' }
  ];

  const districtColumns: ColumnDef<District>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: t('columns.code'), width: 80, accessorKey: 'code' },
    { id: 'name', header: t('columns.name'), width: 150, accessorKey: 'name' }
  ];

  // Province handlers
  const handleAddProvince = () => {
    setEditingProvince(null);
    setProvinceModalOpen(true);
  };

  const handleEditProvince = (province: Province) => {
    setEditingProvince(province);
    setProvinceModalOpen(true);
  };

  const handleProvinceSubmit = async (data: ProvinceCreateRequest) => {
    try {
      if (editingProvince) {
        await territorialService.updateProvince(editingProvince.id, data);
      } else {
        await territorialService.createProvince(data);
      }
      fetchProvinces();
    } catch (error) {
      console.error('Failed to save province:', error);
    }
  };

  const renderProvinceActions = (province: Province) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditProvince(province)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderCantonActions = () => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  const renderDistrictActions = () => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    setSelectedCanton(null);
    setSelectedDistrict(null);
    setCantons([]);
    setDistricts([]);
    fetchCantons(province.id);
  };

  const handleCantonSelect = (canton: Canton) => {
    setSelectedCanton(canton);
    setSelectedDistrict(null);
    setDistricts([]);
    fetchDistricts(canton.id);
  };

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Provinces */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('provinces')}</h2>
              <Button size="sm" className="gap-1" onClick={handleAddProvince}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-[calc(100vh-16rem)]">
              <DataGrid
                columns={provinceColumns}
                data={provinces}
                keyField="id"
                loading={loadingProvinces}
                onRowSelect={handleProvinceSelect}
                selectedRow={selectedProvince}
                actions={renderProvinceActions}
                onReload={fetchProvinces}
              />
            </div>
          </div>

          {/* Cantons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('cantons')}</h2>
              <Button size="sm" className="gap-1" disabled={!selectedProvince}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-[calc(100vh-16rem)]">
              <DataGrid
                columns={cantonColumns}
                data={cantons}
                keyField="id"
                loading={loadingCantons}
                onRowSelect={handleCantonSelect}
                selectedRow={selectedCanton}
                actions={renderCantonActions}
                onReload={selectedProvince ? () => fetchCantons(selectedProvince.id) : undefined}
              />
            </div>
          </div>

          {/* Districts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('districts')}</h2>
              <Button size="sm" className="gap-1" disabled={!selectedCanton}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-[calc(100vh-16rem)]">
              <DataGrid
                columns={districtColumns}
                data={districts}
                keyField="id"
                loading={loadingDistricts}
                onRowSelect={setSelectedDistrict}
                selectedRow={selectedDistrict}
                actions={renderDistrictActions}
                onReload={selectedCanton ? () => fetchDistricts(selectedCanton.id) : undefined}
              />
            </div>
          </div>
        </div>
      </div>

      <ProvinceForm
        open={provinceModalOpen}
        onOpenChange={setProvinceModalOpen}
        province={editingProvince}
        onSubmit={handleProvinceSubmit}
      />
    </>
  );
}