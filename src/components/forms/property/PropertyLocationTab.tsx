'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { MapPin, LocateFixed, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NumericField } from '@/components/ui/numeric-field';
import { StringField } from '@/components/ui/string-field';
import { territorialService } from '@/services/territorial';
import type { Property } from '@/types';
import type { LatLon } from './PropertyMap';

const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false });

interface PropertyLocationTabProps {
  property?: Property | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  readOnly: boolean;
}

function parseCoord(v: string | undefined): number | null {
  if (!v) return null;
  const n = parseFloat(v);
  return isNaN(n) || n === 0 ? null : n;
}

function coordsFromFormData(formData: Record<string, string>, prefix: 'locationSt' | 'locationCenter'): LatLon | null {
  const lat = parseCoord(formData[`${prefix}Lat`]);
  const lon = parseCoord(formData[`${prefix}Lon`]);
  return lat !== null && lon !== null ? { lat, lon } : null;
}

export function PropertyLocationTab({ property, formData, setFormData, readOnly }: PropertyLocationTabProps) {
  const t = useTranslations('properties.form');
  const tc = useTranslations('common');
  const [districtGeoJson, setDistrictGeoJson] = useState<object | null>(null);
  const [cantonGeoJson, setCantonGeoJson] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editStreet, setEditStreet] = useState(false);
  const [editCenter, setEditCenter] = useState(false);
  const [pendingStreet, setPendingStreet] = useState<LatLon | null>(null);
  const [pendingCenter, setPendingCenter] = useState<LatLon | null>(null);

  const asset = property?.asset;
  const tdDistrictId = asset?.tdDistrict?.id ?? null;
  const tdCantonId = asset?.tdCanton?.id ?? null;

  // View mode: single display marker (street preferred over center)
  // Read from formData — source of truth for unsaved edits
  const validCoord = (v: string | undefined): number | null => {
    const n = parseFloat(v ?? '');
    return !isNaN(n) && n !== 0 ? n : null;
  };
  const stLat = validCoord(formData.locationStLat);
  const stLon = validCoord(formData.locationStLon);
  const centerLat = validCoord(formData.locationCenterLat);
  const centerLon = validCoord(formData.locationCenterLon);
  const rnpLat = validCoord(property?.locationRnpLat?.toString());
  const rnpLon = validCoord(property?.locationRnpLon?.toString());
  const rnpCoords = (rnpLat !== null && rnpLon !== null) ? { lat: rnpLat, lon: rnpLon } : null;
  const viewLat = (stLat !== null && stLon !== null) ? stLat : centerLat;
  const viewLon = (stLat !== null && stLon !== null) ? stLon : centerLon;

  useEffect(() => {
    if (!tdDistrictId && !tdCantonId) return;
    setLoading(true);
    const fetchGeoJson = async () => {
      if (tdDistrictId) {
        const district = await territorialService.getTdDistrictById(tdDistrictId);
        if (district?.geojson) {
          try { setDistrictGeoJson(JSON.parse(district.geojson)); } catch { /* invalid json */ }
        }
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

  const tdLocationLabel = [
    asset?.tdProvince?.name,
    asset?.tdCanton?.name,
    asset?.tdDistrict?.name,
  ].filter(Boolean).join(', ') || null;

  const outline = districtGeoJson ?? cantonGeoJson;
  const outlineLabel = districtGeoJson
    ? `${t('district')}: ${asset?.tdDistrict?.name ?? ''}`
    : cantonGeoJson
    ? `${t('canton')}: ${asset?.tdCanton?.name ?? ''}`
    : null;
  const hasMarker = viewLat !== null && viewLon !== null;
  const hasData = hasMarker || outline !== null;

  function enterEditMode() {
    setPendingStreet(coordsFromFormData(formData, 'locationSt'));
    setPendingCenter(coordsFromFormData(formData, 'locationCenter'));
    setEditStreet(true);
    setEditCenter(false);
    setEditMode(true);
  }

  function cancelEdit() {
    setEditMode(false);
    setEditStreet(false);
    setEditCenter(false);
  }

  function confirmEdit() {
    setFormData((prev) => {
      const next = { ...prev };
      if (pendingStreet) {
        next.locationStLat = pendingStreet.lat.toFixed(8);
        next.locationStLon = pendingStreet.lon.toFixed(8);
      }
      if (pendingCenter) {
        next.locationCenterLat = pendingCenter.lat.toFixed(8);
        next.locationCenterLon = pendingCenter.lon.toFixed(8);
      }
      return next;
    });
    setEditMode(false);
    setEditStreet(false);
    setEditCenter(false);
  }

  function handleMapClick(lat: number, lon: number) {
    if (editStreet) setPendingStreet({ lat, lon });
    if (editCenter) setPendingCenter({ lat, lon });
  }

  if (!property) return null;

  // In edit mode, use pending coords as the initial center
  const initialLat = editMode
    ? (pendingStreet?.lat ?? pendingCenter?.lat ?? viewLat)
    : viewLat;
  const initialLon = editMode
    ? (pendingStreet?.lon ?? pendingCenter?.lon ?? viewLon)
    : viewLon;

  return (
    <div className="space-y-3">
      {loading && (
        <p className="text-sm text-muted-foreground">{t('tabLocationLoading')}</p>
      )}

      {!loading && !hasData && !editMode && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
          <MapPin className="h-4 w-4" />
          <span>{t('tabLocationNoData')}</span>
        </div>
      )}

      {!loading && (hasData || editMode) && (
        <div className="space-y-2">
          <div className="h-[500px] rounded-md overflow-hidden border border-border">
            <PropertyMap
              outline={outline}
              initialLat={initialLat}
              initialLon={initialLon}
              editMode={editMode}
              editStreet={editStreet}
              editCenter={editCenter}
              streetCoords={editMode ? pendingStreet : null}
              centerCoords={editMode ? pendingCenter : null}
              rnpCoords={rnpCoords}
              onStreetDrag={(lat, lon) => setPendingStreet({ lat, lon })}
              onCenterDrag={(lat, lon) => setPendingCenter({ lat, lon })}
              onMapClick={handleMapClick}
            />
          </div>

          {outlineLabel && (
            <p className="text-xs text-muted-foreground">{outlineLabel}</p>
          )}

          {/* Toolbar */}
          {!editMode && !readOnly && (
            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={enterEditMode}>
                <LocateFixed className="h-4 w-4 mr-1.5" />
                {t('setLocation')}
              </Button>
            </div>
          )}

          {editMode && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium mr-1">{t('setLocationFor')}:</span>

              <button
                type="button"
                onClick={() => setEditStreet((v) => !v)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border transition-colors ${
                  editStreet
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
                {t('locationStreet')}
              </button>

              <button
                type="button"
                onClick={() => setEditCenter((v) => !v)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border transition-colors ${
                  editCenter
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block" />
                {t('locationCenter')}
              </button>

              <div className="flex-1" />

              <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-1" />
                {tc('cancel')}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={confirmEdit}
                disabled={!pendingStreet && !pendingCenter}
              >
                <Check className="h-4 w-4 mr-1" />
                {tc('confirm')}
              </Button>
            </div>
          )}

          {editMode && (editStreet || editCenter) && (
            <p className="text-xs text-muted-foreground">{t('setLocationHint')}</p>
          )}
        </div>
      )}

      {/* Location details */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('location')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StringField mode="readonly" label={t('tdLocation')} value={tdLocationLabel ?? undefined} className="max-w-150" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold">{t('locationStreet')}</p>
            <NumericField mode={readOnly ? 'readonly' : 'edit'} label={t('latitude')} value={formData.locationStLat} onChange={(v) => setFormData((p) => ({ ...p, locationStLat: v }))} decimals={8} />
            <NumericField mode={readOnly ? 'readonly' : 'edit'} label={t('longitude')} value={formData.locationStLon} onChange={(v) => setFormData((p) => ({ ...p, locationStLon: v }))} decimals={8} />
          </div>
          <div className="space-y-4 self-end">
            <p className="text-sm text-muted-foreground">
              {formData.locationStLat || '0.00000000'},{formData.locationStLon || '0.00000000'}
            </p>
            <p className="text-sm text-muted-foreground">
              Waze:{' '}
              <a
                href={`https://waze.com/ul?ll=${formData.locationStLat || '0'},${formData.locationStLon || '0'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline break-all"
              >
                {`https://waze.com/ul?ll=${formData.locationStLat || '0'},${formData.locationStLon || '0'}`}
              </a>
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">{t('locationCenter')}</p>
            <NumericField mode={readOnly ? 'readonly' : 'edit'} label={t('latitude')} value={formData.locationCenterLat} onChange={(v) => setFormData((p) => ({ ...p, locationCenterLat: v }))} decimals={8} />
            <NumericField mode={readOnly ? 'readonly' : 'edit'} label={t('longitude')} value={formData.locationCenterLon} onChange={(v) => setFormData((p) => ({ ...p, locationCenterLon: v }))} decimals={8} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">{t('locationRnp')}</p>
            <NumericField mode="readonly" label={t('latitude')} value={property?.locationRnpLat?.toString() ?? ''} decimals={8} />
            <NumericField mode="readonly" label={t('longitude')} value={property?.locationRnpLon?.toString() ?? ''} decimals={8} />
          </div>
        </div>
      </fieldset>
    </div>
  );
}