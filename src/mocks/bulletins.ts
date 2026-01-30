import type { Bulletin, ExtractedEdict, ExtractedAsset } from '@/types';

export const mockBulletins: Bulletin[] = Array.from({ length: 32 }, (_, i) => ({
  id: `bul${i + 1}`,
  url: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_boletin.aspx?param1=VOL&nValor1=2024&nValor2=${i + 1}`,
  volume: i + 1,
  year: 2024,
  processed: i < 20,
  createdAt: `2024-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T08:00:00Z`,
}));

export const mockExtractedEdicts: ExtractedEdict[] = Array.from({ length: 35 }, (_, i) => ({
  id: `exed${i + 1}`,
  bulletinId: mockBulletins[i % mockBulletins.length].id,
  rawText: `EDICTO DE REMATE\n\nJUZGADO CIVIL DE SAN JOSÉ\n\nExpediente: 24-00${String(i + 100).padStart(4, '0')}-0180-CI\n\nSe hace saber que en este Juzgado se tramita proceso de ejecución...`,
  caseNumber: `24-00${String(i + 100).padStart(4, '0')}-0180-CI`,
  reference: `REF-2024-${String(i + 1).padStart(3, '0')}`,
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