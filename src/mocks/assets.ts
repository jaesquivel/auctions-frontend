import type { Asset } from '@/types';
import { mockEdicts } from './edicts';
import { mockProvinces, mockCantons, mockDistricts } from './territorial';

export const mockAssets: Asset[] = Array.from({ length: 35 }, (_, i) => {
  const edict = mockEdicts[i % mockEdicts.length];
  const province = mockProvinces[i % mockProvinces.length];
  const canton = mockCantons.find(c => c.provinceId === province.id) || mockCantons[0];
  const district = mockDistricts.find(d => d.cantonId === canton.id) || mockDistricts[0];

  const firstBase = Math.floor(Math.random() * 400000000) + 15000000;
  const secondBase = Math.floor(firstBase * 0.75);
  const thirdBase = Math.floor(firstBase * 0.5);

  return {
    id: `asset${i + 1}`,
    firstAuctionTs: `2024-${String((i % 6) + 7).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    firstAuctionBase: firstBase,
    secondAuctionTs: `2024-${String((i % 6) + 8).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    secondAuctionBase: secondBase,
    thirdAuctionTs: `2024-${String((i % 6) + 9).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    thirdAuctionBase: thirdBase,
    currency: 'CRC',
    liens: i % 4 === 0 ? 'Gravámenes registrados' : null,
    registration: `${100000 + i}`,
    propertyNumber: `${100000 + i}`,
    duplicate: i % 3 === 0 ? 'D' : null,
    horizontal: i % 5 === 0 ? 'H' : null,
    subRegistration: null,
    plate: null,
    type: i % 2 === 0 ? 'Terreno con edificación' : 'Terreno',
    geoProvince: { num: province.num, name: province.name },
    geoCanton: { num: canton.num, name: canton.name },
    geoDistrict: { num: district.num, name: district.name },
    area: Math.floor(Math.random() * 5000) + 100,
    description: `Propiedad ubicada en ${province.name}, ${canton.name}. ${i % 2 === 0 ? 'Incluye construcción.' : 'Lote baldío.'}`,
    rights: '100%',
    edictId: edict.id,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  };
});