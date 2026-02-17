'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { PropertyFormTabs } from './property/PropertyFormTabs';
import { useIsMobile } from '@/hooks';
import type { Property, PropertyListItem, PropertyUpdateRequest, PropertyTag } from '@/types';

interface PropertyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  listItem?: PropertyListItem | null;
  onSubmit: (data: PropertyUpdateRequest) => void;
  readOnly?: boolean;
  loading?: boolean;
  availableTags?: PropertyTag[];
}

export function PropertyForm({ open, onOpenChange, property, listItem, onSubmit, readOnly = false, loading = false, availableTags = [] }: PropertyFormProps) {
  const t = useTranslations('properties');
  const tCommon = useTranslations('common');
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<Record<string, string>>({
    fiscalValue: '',
    marketValue: '',
    appraisalValue: '',
    usdExchangeRate: '',
    observations: '',
    rnpCert: '',
    rnpPlan: '',
    locationCenterLat: '',
    locationCenterLon: '',
    locationStLat: '',
    locationStLon: '',
  });

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (property) {
      setFormData({
        fiscalValue: property.fiscalValue?.toString() || '',
        marketValue: property.marketValue?.toString() || '',
        appraisalValue: property.appraisalValue?.toString() || '',
        usdExchangeRate: property.usdExchangeRate?.toString() || '',
        observations: property.observations || '',
        rnpCert: property.rnpCert || '',
        rnpPlan: property.rnpPlan || '',
        locationCenterLat: property.locationCenterLat?.toString() || '',
        locationCenterLon: property.locationCenterLon?.toString() || '',
        locationStLat: property.locationStLat?.toString() || '',
        locationStLon: property.locationStLon?.toString() || '',
      });
      setSelectedTagIds(property.tags?.map((tag) => tag.id) || []);
    } else {
      setFormData({
        fiscalValue: '', marketValue: '', appraisalValue: '', usdExchangeRate: '',
        observations: '', rnpCert: '', rnpPlan: '',
        locationCenterLat: '', locationCenterLon: '', locationStLat: '', locationStLon: '',
      });
      setSelectedTagIds(listItem?.tags?.map((tag) => tag.id) || []);
    }
  }, [property, listItem]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    const data: PropertyUpdateRequest = {
      fiscalValue: formData.fiscalValue ? Number(formData.fiscalValue) : undefined,
      marketValue: formData.marketValue ? Number(formData.marketValue) : undefined,
      appraisalValue: formData.appraisalValue ? Number(formData.appraisalValue) : undefined,
      usdExchangeRate: formData.usdExchangeRate ? Number(formData.usdExchangeRate) : undefined,
      observations: formData.observations || undefined,
      rnpCert: formData.rnpCert || undefined,
      rnpPlan: formData.rnpPlan || undefined,
      locationCenterLat: formData.locationCenterLat ? Number(formData.locationCenterLat) : undefined,
      locationCenterLon: formData.locationCenterLon ? Number(formData.locationCenterLon) : undefined,
      locationStLat: formData.locationStLat ? Number(formData.locationStLat) : undefined,
      locationStLon: formData.locationStLon ? Number(formData.locationStLon) : undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const getBaseTitle = () => {
    if (readOnly) return t('viewProperty');
    return property ? t('editProperty') : t('addProperty');
  };

  const tabsContent = loading ? (
    <div className="flex items-center justify-center h-32">
      <p className="text-muted-foreground">{tCommon('loading')}</p>
    </div>
  ) : (
    <PropertyFormTabs
      property={property}
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
        <SheetContent side="right" className="w-full p-0 flex flex-col h-full">
          <SheetHeader className="px-4 pt-4 pb-2 border-b shrink-0">
            <SheetTitle>
              {getBaseTitle()}
            </SheetTitle>
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
        className="sm:max-w-[100vw] w-[100vw] h-[100vh] rounded-none flex flex-col p-0 gap-0 [&~div[data-overlay]]:bg-background/60 [&~div[data-overlay]]:backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="shrink-0">{getBaseTitle()}</DialogTitle>
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
