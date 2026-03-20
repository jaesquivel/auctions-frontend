'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { VehicleFormTabs } from './vehicle/VehicleFormTabs';
import { useIsMobile } from '@/hooks';
import type { Vehicle, VehicleUpdateRequest, VehicleTag } from '@/types';

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onSubmit: (data: VehicleUpdateRequest) => void;
  readOnly?: boolean;
  loading?: boolean;
  availableTags?: VehicleTag[];
}

export function VehicleForm({ open, onOpenChange, vehicle, onSubmit, readOnly = false, loading = false, availableTags = [] }: VehicleFormProps) {
  const t = useTranslations('vehicles');
  const tCommon = useTranslations('common');
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<Record<string, string>>({
    fiscalValue: '',
    marketValue: '',
    appraisalValue: '',
    usdExchangeRate: '',
    observations: '',
    mileageKm: '',
    exteriorColor: '',
    interiorColor: '',
    condition: '',
  });

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        fiscalValue: vehicle.fiscalValue?.toString() || '',
        marketValue: vehicle.marketValue?.toString() || '',
        appraisalValue: vehicle.appraisalValue?.toString() || '',
        usdExchangeRate: vehicle.usdExchangeRate?.toString() || '',
        observations: vehicle.observations || '',
        mileageKm: vehicle.mileageKm?.toString() || '',
        exteriorColor: vehicle.exteriorColor || '',
        interiorColor: vehicle.interiorColor || '',
        condition: vehicle.condition || '',
      });
      setSelectedTagIds(vehicle.tags?.map((tag) => tag.id) || []);
    } else {
      setFormData({
        fiscalValue: '', marketValue: '', appraisalValue: '', usdExchangeRate: '',
        observations: '', mileageKm: '', exteriorColor: '', interiorColor: '', condition: '',
      });
      setSelectedTagIds([]);
    }
  }, [vehicle]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    const data: VehicleUpdateRequest = {
      fiscalValue: formData.fiscalValue ? Number(formData.fiscalValue) : undefined,
      marketValue: formData.marketValue ? Number(formData.marketValue) : undefined,
      appraisalValue: formData.appraisalValue ? Number(formData.appraisalValue) : undefined,
      usdExchangeRate: formData.usdExchangeRate ? Number(formData.usdExchangeRate) : undefined,
      observations: formData.observations || undefined,
      mileageKm: formData.mileageKm ? Number(formData.mileageKm) : undefined,
      exteriorColor: formData.exteriorColor || undefined,
      interiorColor: formData.interiorColor || undefined,
      condition: formData.condition || undefined,
      tagIds: selectedTagIds,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const getTitle = () => {
    if (readOnly) return t('viewVehicle');
    return vehicle ? t('editVehicle') : t('addVehicle');
  };

  const tabsContent = loading ? (
    <div className="flex items-center justify-center h-32">
      <p className="text-muted-foreground">{tCommon('loading')}</p>
    </div>
  ) : (
    <VehicleFormTabs
      vehicle={vehicle}
      formData={formData}
      setFormData={setFormData}
      selectedTagIds={selectedTagIds}
      toggleTag={toggleTag}
      availableTags={availableTags}
      readOnly={readOnly}
    />
  );

  const footer = readOnly ? (
    <div className="flex justify-end">
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        {tCommon('close')}
      </Button>
    </div>
  ) : (
    <div className="flex gap-2 justify-end">
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        {tCommon('cancel')}
      </Button>
      <Button onClick={handleSubmit} disabled={loading}>
        {tCommon('save')}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full h-full p-0 flex flex-col">
          <SheetHeader className="px-4 pt-4 pb-2 border-b shrink-0">
            <SheetTitle>{getTitle()}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 min-h-0 px-4 py-4">
            {tabsContent}
          </ScrollArea>
          <SheetFooter className="px-4 py-3 border-t shrink-0">
            {footer}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[100vw] w-screen h-screen rounded-none flex flex-col p-0 gap-0 [&~div[data-overlay]]:bg-background/60 [&~div[data-overlay]]:backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="shrink-0">{getTitle()}</DialogTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 min-h-0 px-6 py-4">
          {tabsContent}
        </ScrollArea>
        <DialogFooter className="px-6 py-3 border-t shrink-0">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
