'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { TagBadge } from '@/components/ui/tag-badge';
import { Info, FileText, Building2, Map, ImageIcon } from 'lucide-react';
import { PropertyInfoTab } from './PropertyInfoTab';
import { PropertyEdictTab } from './PropertyEdictTab';
import { PropertyRegistryTab } from './PropertyRegistryTab';
import { PropertyRegistryPlanTab } from './PropertyRegistryPlanTab';
import { PropertyImagesTab } from './PropertyImagesTab';
import { useIsMobile } from '@/hooks';
import type { Property, PropertyTag } from '@/types';

interface PropertyFormTabsProps {
  property?: Property | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedTagIds: string[];
  toggleTag: (tagId: string) => void;
  availableTags: PropertyTag[];
  readOnly: boolean;
  onRefresh?: () => void;
}

const TABS = [
  { value: 'information', icon: Info },
  { value: 'edict',       icon: FileText },
  { value: 'registry',    icon: Building2 },
  { value: 'registryPlan', icon: Map },
  { value: 'images',      icon: ImageIcon },
] as const;

export function PropertyFormTabs({ property, formData, setFormData, selectedTagIds, toggleTag, availableTags, readOnly, onRefresh }: PropertyFormTabsProps) {
  const t = useTranslations('properties.form');
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('information');

  return (
    <div className="w-full space-y-4">
      {/* Registration + Tags bar */}
      <div className="flex items-center gap-4">
        {property?.fullRegistrationNumber && (
          <span className="text-base font-semibold">{property.fullRegistrationNumber}</span>
        )}
        {availableTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild disabled={readOnly}>
              <button
                type="button"
                className="flex gap-1 min-h-9 max-w-250 items-center rounded-md border border-input bg-transparent px-3 py-1.5 text-sm cursor-pointer hover:bg-accent/50 transition-colors disabled:pointer-events-none disabled:opacity-50 overflow-hidden"
              >
                {selectedTagIds.length > 0 ? (
                  availableTags
                    .filter((tag) => selectedTagIds.includes(tag.id))
                    .map((tag) => (
                      <TagBadge
                        key={tag.id}
                        name={tag.name}
                        color={tag.color}
                        onRemove={!readOnly ? () => toggleTag(tag.id) : undefined}
                      />
                    ))
                ) : (
                  <span className="text-muted-foreground">{t('selectTags')}</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-0" onWheel={(e) => e.stopPropagation()}>
              <div className="space-y-1 p-2 max-h-60 overflow-y-auto">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`flex items-center w-full rounded-md px-2 py-1.5 text-sm transition-colors ${
                      selectedTagIds.includes(tag.id) ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                  >
                    <TagBadge name={tag.name} color={tag.color} />
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABS.map(({ value }) => (
                <SelectItem key={value} value={value}>
                  {t(`tab${value.charAt(0).toUpperCase() + value.slice(1)}` as Parameters<typeof t>[0])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <TabsList className="w-full">
            {TABS.map(({ value, icon: Icon }) => (
              <TabsTrigger key={value} value={value}>
                <Icon className="h-4 w-4 mr-1.5" />
                {t(`tab${value.charAt(0).toUpperCase() + value.slice(1)}` as Parameters<typeof t>[0])}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        <TabsContent value="information" className="mt-4">
          <PropertyInfoTab
            property={property}
            formData={formData}
            setFormData={setFormData}
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
          <PropertyImagesTab property={property} propertyId={property?.id} onRefresh={onRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
}