import type { PropertySummary } from '@/types';
import { mockEdicts } from './edicts';
import { mockTags } from './tags';
import { mockTdProvinces, mockTdCantons, mockTdDistricts } from './territorial';

// Helper to get random items from array
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper to format currency
function randomCurrency(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Generate 35 properties
export const mockProperties: PropertySummary[] = Array.from({ length: 35 }, (_, i) => {
  const edict = mockEdicts[i % mockEdicts.length];
  const tdProvince = mockTdProvinces[i % mockTdProvinces.length];
  const tdCanton = mockTdCantons.find(c => c.tdProvinceId === tdProvince.id) || mockTdCantons[0];
  const tdDistrict = mockTdDistricts.find(d => d.tdCantonId === tdCanton.id) || mockTdDistricts[0];

  const fiscalValue = randomCurrency(20000000, 500000000);
  const exchangeRate = 515;
  const firstAuctionBase = randomCurrency(15000000, 400000000);
  const margin = edict.creditor.margin;

  return {
    id: `prop${i + 1}`,
    fiscalValue,
    marketValue: randomCurrency(25000000, 600000000),
    appraisalValue: randomCurrency(22000000, 550000000),
    usdExchangeRate: exchangeRate,
    fiscalValueUsd: Math.round(fiscalValue / exchangeRate),
    firstAuctionBaseAdj: Math.round(firstAuctionBase * (1 + margin / 100)),
    firstAuctionGuarantee: Math.round(firstAuctionBase / 2),
    registrationFull: `${tdProvince.num}-${100000 + i}`,
    tdLocation: `${tdProvince.name}, ${tdCanton.name}, ${tdDistrict.name}`,
    fiscalBaseRatio: Math.round((fiscalValue / (firstAuctionBase * exchangeRate)) * 100) / 100,
    edict: { id: edict.id, caseNumber: edict.caseNumber },
    asset: {
      id: `asset${i + 1}`,
      firstAuctionTs: `2024-${String((i % 6) + 7).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
      firstAuctionBase,
      currency: 'CRC',
      propertyNumber: `${100000 + i}`,
      registration: `${100000 + i}`,
      duplicate: i % 3 === 0 ? 'D' : null,
      horizontal: i % 5 === 0 ? 'H' : null,
      area: randomCurrency(100, 5000),
      rights: '100%',
      tdProvince: { num: tdProvince.num, name: tdProvince.name },
      tdCanton: { num: tdCanton.num, name: tdCanton.name },
      tdDistrict: { num: tdDistrict.num, name: tdDistrict.name },
    },
    tags: getRandomItems(mockTags, Math.floor(Math.random() * 3) + 1).map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
    })),
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  };
});