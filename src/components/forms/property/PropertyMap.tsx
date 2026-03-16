'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon broken by webpack/next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const streetIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const rnpIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Green-tinted icon for center marker
const centerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface LatLon { lat: number; lon: number; }

interface MapControllerProps {
  initialLat: number | null;
  initialLon: number | null;
  outline: object | null;
}

function MapController({ initialLat, initialLon, outline }: MapControllerProps) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;
    if (initialLat !== null && initialLon !== null) {
      map.setView([initialLat, initialLon], 14);
      fitted.current = true;
    } else if (outline) {
      try {
        const layer = L.geoJSON(outline as Parameters<typeof L.geoJSON>[0]);
        const bounds = layer.getBounds();
        if (bounds.isValid()) { map.fitBounds(bounds); fitted.current = true; }
      } catch { /* invalid geojson */ }
    }
  }, [map, initialLat, initialLon, outline]);

  return null;
}

interface MapClickHandlerProps {
  editStreet: boolean;
  editCenter: boolean;
  onMapClick: (lat: number, lon: number) => void;
}

function MapClickHandler({ editStreet, editCenter, onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      if (editStreet || editCenter) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export interface PropertyMapProps {
  // View mode
  outline: object | null;
  initialLat: number | null;
  initialLon: number | null;
  // Edit mode
  editMode?: boolean;
  editStreet?: boolean;
  editCenter?: boolean;
  streetCoords?: LatLon | null;
  centerCoords?: LatLon | null;
  rnpCoords?: LatLon | null;
  onStreetDrag?: (lat: number, lon: number) => void;
  onCenterDrag?: (lat: number, lon: number) => void;
  onMapClick?: (lat: number, lon: number) => void;
}

export default function PropertyMap({
  outline,
  initialLat,
  initialLon,
  editMode = false,
  editStreet = false,
  editCenter = false,
  streetCoords,
  centerCoords,
  rnpCoords,
  onStreetDrag,
  onCenterDrag,
  onMapClick,
}: PropertyMapProps) {
  const defaultCenter: LatLngExpression = [9.7489, -83.7534];

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
          data={outline as GeoJSON.GeoJsonObject}
          style={{ color: '#3b82f6', weight: 2, fillOpacity: 0.1 }}
        />
      )}

      {editMode ? (
        <>
          {streetCoords && (
            <Marker
              position={[streetCoords.lat, streetCoords.lon]}
              icon={streetIcon}
              draggable={editStreet}
              eventHandlers={editStreet && onStreetDrag ? {
                dragend(e) {
                  const { lat, lng } = e.target.getLatLng();
                  onStreetDrag(lat, lng);
                },
              } : {}}
            />
          )}
          {centerCoords && (
            <Marker
              position={[centerCoords.lat, centerCoords.lon]}
              icon={centerIcon}
              draggable={editCenter}
              eventHandlers={editCenter && onCenterDrag ? {
                dragend(e) {
                  const { lat, lng } = e.target.getLatLng();
                  onCenterDrag(lat, lng);
                },
              } : {}}
            />
          )}
          <MapClickHandler
            editStreet={editStreet}
            editCenter={editCenter}
            onMapClick={onMapClick ?? (() => {})}
          />
        </>
      ) : (
        initialLat !== null && initialLon !== null && (
          <Marker position={[initialLat, initialLon]} icon={streetIcon} />
        )
      )}

      {rnpCoords && (
        <Marker position={[rnpCoords.lat, rnpCoords.lon]} icon={rnpIcon} />
      )}

      <MapController initialLat={initialLat} initialLon={initialLon} outline={outline} />
    </MapContainer>
  );
}