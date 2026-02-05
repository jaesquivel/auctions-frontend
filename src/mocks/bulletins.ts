import type { Bulletin, RawEdict, RawAsset } from '@/types';

export const mockBulletins: Bulletin[] = Array.from({ length: 32 }, (_, i) => ({
  id: `bul${i + 1}`,
  url: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_boletin.aspx?param1=VOL&nValor1=2024&nValor2=${i + 1}`,
  volume: i + 1,
  year: 2024,
  processed: i < 20,
  createdAt: `2024-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T08:00:00Z`,
}));

const mockCreditors = [
  'BANCO BAC SAN JOSE SOCIEDAD ANÓNIMA',
  'BANCO NACIONAL DE COSTA RICA',
  'BANCO DE COSTA RICA',
  'COOPENAE R.L.',
  'BANCO POPULAR Y DE DESARROLLO COMUNAL',
];

const mockDebtors = [
  'JUAN CARLOS PÉREZ RODRÍGUEZ',
  'MARÍA FERNANDA SOLÍS CASTRO',
  'CARLOS ALBERTO VARGAS MORA',
  'ANA LUCÍA JIMÉNEZ QUESADA',
  'ROBERTO JOSÉ HERNÁNDEZ SILVA',
];

const mockCourts = [
  'JUZGADO PRIMERO ESPECIALIZADO DE COBRO DEL I CIRCUITO JUDICIAL DE SAN JOSÉ',
  'JUZGADO SEGUNDO ESPECIALIZADO DE COBRO DEL I CIRCUITO JUDICIAL DE SAN JOSÉ',
  'JUZGADO CIVIL DE HEREDIA',
  'JUZGADO CIVIL DE CARTAGO',
  'JUZGADO CIVIL DE ALAJUELA',
];

export const mockExtractedEdicts: RawEdict[] = Array.from({ length: 35 }, (_, i) => ({
  id: `exed${i + 1}`,
  reference: `2024${String(165000 + i).padStart(6, '0')}`,
  creditor: mockCreditors[i % mockCreditors.length],
  debtor: mockDebtors[i % mockDebtors.length],
  caseNumber: `24-00${String(i + 100).padStart(4, '0')}-1170-CJ`,
  court: mockCourts[i % mockCourts.length],
  publication: String((i % 3) + 1),
  publicationCount: '3',
  bulletin: mockBulletins[i % mockBulletins.length],
  processed: i < 25,
  createdAt: `2024-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T09:00:00Z`,
}));

const mockProvinces = ['SAN JOSÉ', 'ALAJUELA', 'HEREDIA', 'CARTAGO'];
const mockCantons = ['CENTRAL', 'GOICOECHEA', 'ESCAZÚ', 'DESAMPARADOS'];
const mockDistricts = ['GUADALUPE', 'CARMEN', 'HOSPITAL', 'SAN FRANCISCO'];

export const mockExtractedAssets: RawAsset[] = Array.from({ length: 40 }, (_, i) => {
  const edict = mockExtractedEdicts[i % mockExtractedEdicts.length];
  const isVehicle = i % 3 === 0;
  return {
    id: `exas${i + 1}`,
    rawEdict: {
      id: edict.id,
      reference: edict.reference,
      caseNumber: edict.caseNumber,
      publication: edict.publication,
      publicationCount: edict.publicationCount,
      bulletin: { volume: edict.bulletin!.volume, year: edict.bulletin!.year, processed: edict.bulletin!.processed },
    },
    firstAuctionDate: `2024-${String(Math.floor(i / 4) + 3).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    firstAuctionTime: '15:00',
    firstAuctionBase: `${(Math.floor(Math.random() * 50) + 10) * 1000000}`,
    secondAuctionDate: `2024-${String(Math.floor(i / 4) + 3).padStart(2, '0')}-${String((i % 28) + 10).padStart(2, '0')}`,
    secondAuctionTime: '15:00',
    secondAuctionBase: `${(Math.floor(Math.random() * 40) + 5) * 1000000}`,
    thirdAuctionDate: `2024-${String(Math.floor(i / 4) + 4).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    thirdAuctionTime: '15:00',
    thirdAuctionBase: `${(Math.floor(Math.random() * 20) + 2) * 1000000}`,
    currency: 'CRC',
    registration: isVehicle ? '' : `${100000 + i}-000`,
    plate: isVehicle ? `CL${190000 + i}` : '',
    type: isVehicle ? 'VEHICULO' : 'INMUEBLE',
    tdProvince: isVehicle ? '' : mockProvinces[i % mockProvinces.length],
    tdCanton: isVehicle ? '' : mockCantons[i % mockCantons.length],
    tdDistrict: isVehicle ? '' : mockDistricts[i % mockDistricts.length],
    area: isVehicle ? '' : `${(Math.random() * 500 + 100).toFixed(1)}`,
    processed: i < 30,
    createdAt: `2024-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  };
});