'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { territorialService } from '@/services/territorial';
import type { Property } from '@/types';

const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false });

interface PropertyLocationTabProps {
  property?: Property | null;
}

export function PropertyLocationTab({ property }: PropertyLocationTabProps) {
  const t = useTranslations('properties.form');
  const [districtGeoJson, setDistrictGeoJson] = useState<object | null>(null);
  const [cantonGeoJson, setCantonGeoJson] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  const asset = property?.asset;
  const tdDistrictId = asset?.tdDistrict?.id ?? null;
  const tdCantonId = asset?.tdCanton?.id ?? null;

  const validCoord = (v: number | null | undefined): number | null =>
    v !== null && v !== undefined && v !== 0 ? v : null;

  const stLat = validCoord(property?.locationStLat);
  const stLon = validCoord(property?.locationStLon);
  const centerLat = validCoord(property?.locationCenterLat);
  const centerLon = validCoord(property?.locationCenterLon);

  const markerLat = (stLat !== null && stLon !== null) ? stLat : (centerLat !== null && centerLon !== null) ? centerLat : null;
  const markerLon = (stLat !== null && stLon !== null) ? stLon : (centerLat !== null && centerLon !== null) ? centerLon : null;

  useEffect(() => {
    if (!tdDistrictId && !tdCantonId) return;

    setLoading(true);
    const fetchGeoJson = async () => {
      if (tdDistrictId) {
        const district = await territorialService.getTdDistrictById(tdDistrictId);
        if (district?.geojson) {
          try { setDistrictGeoJson(JSON.parse(district.geojson)); } catch { /* invalid json */ }
        }
        // Also fetch canton for fallback
        const cantonId = district?.tdCantonId ?? tdCantonId;
        if (cantonId) {
          const canton = await territorialService.getTdCantonById(cantonId);
          if (canton?.geojson) {
            try { setCantonGeoJson(JSON.parse(canton.geojson)); } catch { /* invalid json */ }
          }
        }
      } else if (tdCantonId) {
        const canton = await territorialService.getTdCantonById(tdCantonId);
        if (canton?.geojson) {
          try { setCantonGeoJson(JSON.parse(canton.geojson)); } catch { /* invalid json */ }
        }
      }
      setLoading(false);
    };

    fetchGeoJson();
  }, [tdDistrictId, tdCantonId]);

  const outline = districtGeoJson ?? cantonGeoJson;
  const outlineLabel = districtGeoJson
    ? `${t('district')}: ${asset?.tdDistrict?.name ?? ''}`
    : cantonGeoJson
    ? `${t('canton')}: ${asset?.tdCanton?.name ?? ''}`
    : null;
  const hasMarker = markerLat !== null && markerLon !== null;
  const hasData = hasMarker || outline !== null;

  if (!property) return null;

  return (
    <div className="space-y-3">
      {loading && (
        <p className="text-sm text-muted-foreground">{t('tabLocationLoading')}</p>
      )}
      {!loading && !hasData && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
          <MapPin className="h-4 w-4" />
          <span>{t('tabLocationNoData')}</span>
        </div>
      )}
      {!loading && hasData && (
        <div className="space-y-1">
          <div className="h-[500px] rounded-md overflow-hidden border border-border">
            <PropertyMap
              markerLat={markerLat}
              markerLon={markerLon}
              outline={outline}
            />
          </div>
          {outlineLabel && (
            <p className="text-xs text-muted-foreground">{outlineLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}