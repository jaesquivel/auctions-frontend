'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataGrid, type ColumnDef, type PaginationState } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { mockProvinces, mockCantons, mockDistricts } from '@/mocks';
import type { Province, Canton, District } from '@/types';

export default function TerritorialPage() {
  const t = useTranslations('territorial');

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCanton, setSelectedCanton] = useState<Canton | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Filter cantons by selected province
  const filteredCantons = selectedProvince
    ? mockCantons.filter((c) => c.provinceId === selectedProvince.id)
    : [];

  // Filter districts by selected canton
  const filteredDistricts = selectedCanton
    ? mockDistricts.filter((d) => d.cantonId === selectedCanton.id)
    : [];

  const provinceColumns: ColumnDef<Province>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: 'Código', width: 80, accessorKey: 'code' },
    { id: 'name', header: 'Nombre', width: 150, accessorKey: 'name' },
  ];

  const cantonColumns: ColumnDef<Canton>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: 'Código', width: 80, accessorKey: 'code' },
    { id: 'name', header: 'Nombre', width: 150, accessorKey: 'name' },
  ];

  const districtColumns: ColumnDef<District>[] = [
    { id: 'num', header: '#', width: 50, align: 'center', accessorFn: (row) => row.num.toString() },
    { id: 'code', header: 'Código', width: 80, accessorKey: 'code' },
    { id: 'name', header: 'Nombre', width: 200, accessorKey: 'name' },
  ];

  const renderProvinceActions = (row: Province) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    setSelectedCanton(null);
    setSelectedDistrict(null);
  };

  const handleCantonSelect = (canton: Canton) => {
    setSelectedCanton(canton);
    setSelectedDistrict(null);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Provinces */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('provinces')}</h2>
            <Button size="sm" className="gap-1"><Plus className="h-3 w-3" /></Button>
          </div>
          <div className="h-[calc(100vh-16rem)]">
            <DataGrid
              columns={provinceColumns}
              data={mockProvinces}
              keyField="id"
              onRowSelect={handleProvinceSelect}
              selectedRow={selectedProvince}
              actions={renderProvinceActions}
            />
          </div>
        </div>

        {/* Cantons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('cantons')}</h2>
            <Button size="sm" className="gap-1" disabled={!selectedProvince}><Plus className="h-3 w-3" /></Button>
          </div>
          <div className="h-[calc(100vh-16rem)]">
            <DataGrid
              columns={cantonColumns}
              data={filteredCantons}
              keyField="id"
              onRowSelect={handleCantonSelect}
              selectedRow={selectedCanton}
              actions={renderProvinceActions}
            />
          </div>
        </div>

        {/* Districts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('districts')}</h2>
            <Button size="sm" className="gap-1" disabled={!selectedCanton}><Plus className="h-3 w-3" /></Button>
          </div>
          <div className="h-[calc(100vh-16rem)]">
            <DataGrid
              columns={districtColumns}
              data={filteredDistricts}
              keyField="id"
              onRowSelect={setSelectedDistrict}
              selectedRow={selectedDistrict}
              actions={renderProvinceActions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}