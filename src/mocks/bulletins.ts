import type { Bulletin, RawEdict, ExtractedAsset } from '@/types';

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

export const mockExtractedAssets: ExtractedAsset[] = Array.from({ length: 40 }, (_, i) => ({
  id: `exas${i + 1}`,
  extractedEdictId: mockExtractedEdicts[i % mockExtractedEdicts.length].id,
  rawText: `Finca ${Math.floor(Math.random() * 9) + 1}-${100000 + i} del Partido de San José, naturaleza: terreno con casa, situación: distrito primero, cantón central, provincia de San José, medida: ${Math.floor(Math.random() * 500) + 100} metros cuadrados...`,
  processed: i < 30,
  createdAt: `2024-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
}));