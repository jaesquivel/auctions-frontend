import type { VehicleSummary } from '@/types';
import { mockEdicts } from './edicts';

const brands = ['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Ford', 'Chevrolet', 'Mazda', 'Mitsubishi', 'Suzuki'];
const models: Record<string, string[]> = {
  Toyota: ['Corolla', 'RAV4', 'Hilux', 'Yaris', 'Land Cruiser'],
  Honda: ['Civic', 'CR-V', 'Accord', 'HR-V', 'Fit'],
  Nissan: ['Sentra', 'Frontier', 'X-Trail', 'Kicks', 'Versa'],
  Hyundai: ['Tucson', 'Santa Fe', 'Elantra', 'Accent', 'Kona'],
  Kia: ['Sportage', 'Sorento', 'Rio', 'Seltos', 'Carnival'],
  Ford: ['Ranger', 'Explorer', 'Escape', 'F-150', 'Bronco'],
  Chevrolet: ['Silverado', 'Trax', 'Equinox', 'Spark', 'Captiva'],
  Mazda: ['CX-5', 'CX-30', 'Mazda3', 'CX-9', 'MX-5'],
  Mitsubishi: ['L200', 'Outlander', 'ASX', 'Montero', 'Eclipse Cross'],
  Suzuki: ['Vitara', 'Swift', 'Jimny', 'S-Cross', 'Baleno'],
};

function randomPlate(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const l1 = letters[Math.floor(Math.random() * letters.length)];
  const l2 = letters[Math.floor(Math.random() * letters.length)];
  const l3 = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${l1}${l2}${l3}${num}`;
}

export const mockVehicles: VehicleSummary[] = Array.from({ length: 32 }, (_, i) => {
  const brand = brands[i % brands.length];
  const modelList = models[brand];
  const model = modelList[i % modelList.length];
  const year = 2015 + (i % 10);
  const edict = mockEdicts[i % mockEdicts.length];

  return {
    id: `veh${i + 1}`,
    plate: randomPlate(),
    brand,
    model,
    year,
    firstAuctionTs: `2024-${String((i % 6) + 7).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    firstAuctionBase: Math.floor(Math.random() * 15000000) + 3000000,
    currency: 'CRC',
    edict: { id: edict.id, caseNumber: edict.caseNumber },
  };
});