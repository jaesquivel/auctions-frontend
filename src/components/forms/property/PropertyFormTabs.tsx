'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PropertyInfoTab } from './PropertyInfoTab';
import { PropertyEdictTab } from './PropertyEdictTab';
import { PropertyRegistryTab } from './PropertyRegistryTab';
import { PropertyRegistryPlanTab } from './PropertyRegistryPlanTab';
import { PropertyImagesTab } from './PropertyImagesTab';
import type { Property, PropertyTag } from '@/types';

interface PropertyFormTabsProps {
  property?: Property | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedTagIds: string[];
  toggleTag: (tagId: string) => void;
  availableTags: PropertyTag[];
  readOnly: boolean;
}

export function PropertyFormTabs({ property, formData, setFormData, selectedTagIds, toggleTag, availableTags, readOnly }: PropertyFormTabsProps) {
  const t = useTranslations('properties.form');

  return (
    <Tabs defaultValue="information" className="w-full">
      <TabsList className="w-full overflow-x-auto">
        <TabsTrigger value="information">{t('tabInformation')}</TabsTrigger>
        <TabsTrigger value="edict">{t('tabEdict')}</TabsTrigger>
        <TabsTrigger value="registry">{t('tabRegistry')}</TabsTrigger>
        <TabsTrigger value="registryPlan">{t('tabRegistryPlan')}</TabsTrigger>
        <TabsTrigger value="images">{t('tabImages')}</TabsTrigger>
      </TabsList>

      <TabsContent value="information" className="mt-4">
        <PropertyInfoTab
          property={property}
          formData={formData}
          setFormData={setFormData}
          selectedTagIds={selectedTagIds}
          toggleTag={toggleTag}
          availableTags={availableTags}
          readOnly={readOnly}
        />
      </TabsContent>

      <TabsContent value="edict" className="mt-4">
        <PropertyEdictTab property={property} />
      </TabsContent>

      <TabsContent value="registry" className="mt-4">
        <PropertyRegistryTab property={property} />
      </TabsContent>

      <TabsContent value="registryPlan" className="mt-4">
        <PropertyRegistryPlanTab property={property} />
      </TabsContent>

      <TabsContent value="images" className="mt-4">
        <PropertyImagesTab property={property} />
      </TabsContent>
    </Tabs>
  );
}
