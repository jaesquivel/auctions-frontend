import type { PropertyListItem } from '@/types';
import { mockEdicts } from './edicts';
import { mockAssets } from './assets';
import { mockTags } from './tags';

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
export const mockProperties: PropertyListItem[] = Array.from({ length: 35 }, (_, i) => {
  const edict = mockEdicts[i % mockEdicts.length];
  const asset = mockAssets[i % mockAssets.length];
  const margin = edict.creditor?.margin ?? 0;

  const fiscalValue = randomCurrency(20000000, 500000000);
  const exchangeRate = 515;
  const firstAuctionBase = asset.firstAuctionBase ?? randomCurrency(15000000, 400000000);

  return {
    id: `prop${i + 1}`,
    fiscalValue,
    marketValue: randomCurrency(25000000, 600000000),
    appraisalValue: randomCurrency(22000000, 550000000),
    usdExchangeRate: exchangeRate,
    fiscalValueUsd: Math.round(fiscalValue / exchangeRate),
    firstAuctionBaseAdj: Math.round(firstAuctionBase * (1 + margin / 100)),
    firstAuctionGuarantee: Math.round(firstAuctionBase / 2),
    registration: asset.registration ? `${asset.tdProvince?.num ?? 1}-${asset.registration}` : null,
    tdProvince: asset.tdProvince?.name || null,
    tdCanton: asset.tdProvince?.name || null,
    tdDistrict: asset.tdProvince?.name || null,
    fiscalBaseRatio: Math.round((fiscalValue / (firstAuctionBase * exchangeRate)) * 100) / 100,
    edict,
    asset,
    tags: getRandomItems(mockTags, Math.floor(Math.random() * 3) + 1).map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
    })),
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  };
});