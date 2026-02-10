import type { AssetListItem } from '@/types';
import { mockEdicts } from './edicts';
import { mockTdProvinces, mockTdCantons, mockTdDistricts } from './territorial';

export const mockAssets: AssetListItem[] = Array.from({ length: 35 }, (_, i) => {
  const edict = mockEdicts[i % mockEdicts.length];
  const tdProvince = mockTdProvinces[i % mockTdProvinces.length];
  const tdCanton = mockTdCantons.find(c => c.tdProvinceId === tdProvince.id) || mockTdCantons[0];
  const tdDistrict = mockTdDistricts.find(d => d.tdCantonId === tdCanton.id) || mockTdDistricts[0];

  const firstBase = Math.floor(Math.random() * 400000000) + 15000000;
  const secondBase = Math.floor(firstBase * 0.75);
  const thirdBase = Math.floor(firstBase * 0.5);

  return {
    id: `asset${i + 1}`,
    edictId: edict.id,
    rawAssetId: `ra${i + 1}`,
    firstAuctionTs: `2024-${String((i % 6) + 7).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    firstAuctionBase: firstBase,
    secondAuctionTs: `2024-${String((i % 6) + 8).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    secondAuctionBase: secondBase,
    thirdAuctionTs: `2024-${String((i % 6) + 9).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    thirdAuctionBase: thirdBase,
    currency: 'CRC',
    registration: `${100000 + i}`,
    propertyNumber: `${100000 + i}`,
    duplicate: i % 3 === 0 ? 'D' : null,
    horizontal: i % 5 === 0 ? 'H' : null,
    subRegistration: null,
    plate: null,
    type: i % 2 === 0 ? 'Terreno con edificación' : 'Terreno',
    tdProvince: { num: tdProvince.num, name: tdProvince.name },
    tdCanton: { num: tdCanton.num, name: tdCanton.name },
    tdDistrict: { num: tdDistrict.num, name: tdDistrict.name },
    area: Math.floor(Math.random() * 5000) + 100,
    rights: '100%',
    edict,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  };
});