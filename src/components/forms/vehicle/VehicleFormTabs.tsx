'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { TagBadge } from '@/components/ui/tag-badge';
import { Info, Car, FileText, ClipboardList, ScrollText } from 'lucide-react';
import { VehicleInfoTab } from './VehicleInfoTab';
import { VehicleDetailsTab } from './VehicleDetailsTab';
import { VehicleEdictTab } from './VehicleEdictTab';
import { VehicleSummaryTab } from './VehicleSummaryTab';
import { VehicleRnpTab } from './VehicleRnpTab';
import { useIsMobile } from '@/hooks';
import type { Vehicle, VehicleTag } from '@/types';

interface VehicleFormTabsProps {
  vehicle?: Vehicle | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedTagIds: string[];
  toggleTag: (tagId: string) => void;
  availableTags: VehicleTag[];
  readOnly: boolean;
}

const TABS = [
  { value: 'information', icon: Info },
  { value: 'details',     icon: Car },
  { value: 'edict',       icon: FileText },
  { value: 'rnp',         icon: ScrollText },
  { value: 'summary',     icon: ClipboardList },
] as const;

export function VehicleFormTabs({ vehicle, formData, setFormData, selectedTagIds, toggleTag, availableTags, readOnly }: VehicleFormTabsProps) {
  const t = useTranslations('vehicles.form');
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('information');

  return (
    <div className="w-full space-y-4">
      {/* Plate + Tags bar */}
      <div className="flex items-center gap-4">
        {vehicle?.plate && (
          <span className="text-base font-semibold">{vehicle.plate}</span>
        )}
        {vehicle?.make && vehicle?.model && (
          <span className="text-sm text-muted-foreground">
            {[vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(' ')}
          </span>
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
          <VehicleInfoTab vehicle={vehicle} formData={formData} setFormData={setFormData} readOnly={readOnly} />
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <VehicleDetailsTab vehicle={vehicle} formData={formData} setFormData={setFormData} readOnly={readOnly} />
        </TabsContent>

        <TabsContent value="edict" className="mt-4">
          <VehicleEdictTab vehicle={vehicle} />
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <VehicleSummaryTab vehicle={vehicle} />
        </TabsContent>

        <TabsContent value="rnp" className="mt-4">
          <VehicleRnpTab vehicle={vehicle} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
