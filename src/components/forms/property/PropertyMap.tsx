'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon broken by webpack/next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface FitBoundsProps {
  markerLat: number | null;
  markerLon: number | null;
  outline: object | null;
}

function MapController({ markerLat, markerLon, outline }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (markerLat !== null && markerLon !== null) {
      map.setView([markerLat, markerLon], 14);
    } else if (outline) {
      try {
        const layer = L.geoJSON(outline as Parameters<typeof L.geoJSON>[0]);
        const bounds = layer.getBounds();
        if (bounds.isValid()) map.fitBounds(bounds);
      } catch { /* invalid geojson */ }
    }
  }, [map, markerLat, markerLon, outline]);

  return null;
}

interface PropertyMapProps {
  markerLat: number | null;
  markerLon: number | null;
  outline: object | null;
}

export default function PropertyMap({ markerLat, markerLon, outline }: PropertyMapProps) {
  const defaultCenter: LatLngExpression = [9.7489, -83.7534]; // Costa Rica center
  const markerPosition: LatLngExpression | null =
    markerLat !== null && markerLon !== null ? [markerLat, markerLon] : null;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {outline && (
        <GeoJSON
          key={JSON.stringify(outline).slice(0, 50)}
          data={outline as Parameters<typeof L.geoJSON>[0]}
          style={{ color: '#3b82f6', weight: 2, fillOpacity: 0.1 }}
        />
      )}
      {markerPosition && <Marker position={markerPosition} />}
      <MapController markerLat={markerLat} markerLon={markerLon} outline={outline} />
    </MapContainer>
  );
}