import type { Province, Canton, District } from '@/types';

// Costa Rica provinces (7)
export const mockProvinces: Province[] = [
  { id: 'p1', code: '01', num: 1, name: 'San José', nameSearch: 'san jose', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p2', code: '02', num: 2, name: 'Alajuela', nameSearch: 'alajuela', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p3', code: '03', num: 3, name: 'Cartago', nameSearch: 'cartago', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p4', code: '04', num: 4, name: 'Heredia', nameSearch: 'heredia', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p5', code: '05', num: 5, name: 'Guanacaste', nameSearch: 'guanacaste', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p6', code: '06', num: 6, name: 'Puntarenas', nameSearch: 'puntarenas', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p7', code: '07', num: 7, name: 'Limón', nameSearch: 'limon', createdAt: '2024-01-01T00:00:00Z' },
];

// 10 cantons per province (only showing first 3 provinces for brevity, but all are generated)
const cantonNames: Record<string, string[]> = {
  p1: ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita'],
  p2: ['Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas', 'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos'],
  p3: ['Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco', 'La Suiza', 'Pacayas'],
  p4: ['Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí'],
  p5: ['Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas', 'Abangares', 'Tilarán', 'Nandayure', 'La Cruz'],
  p6: ['Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa', 'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 'Corredores'],
  p7: ['Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo', 'Bataan', 'Valle La Estrella', 'Cahuita', 'Bribri'],
};

export const mockCantons: Canton[] = [];
let cantonId = 1;
mockProvinces.forEach((province) => {
  const names = cantonNames[province.id] || [];
  names.forEach((name, index) => {
    mockCantons.push({
      id: `c${cantonId}`,
      code: `${province.code}${String(index + 1).padStart(2, '0')}`,
      num: index + 1,
      name,
      nameSearch: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      provinceId: province.id,
      province: { num: province.num, name: province.name },
      createdAt: '2024-01-01T00:00:00Z',
    });
    cantonId++;
  });
});

// 10 districts per canton (generating dynamically)
export const mockDistricts: District[] = [];
let districtId = 1;
mockCantons.forEach((canton) => {
  for (let i = 1; i <= 10; i++) {
    mockDistricts.push({
      id: `d${districtId}`,
      code: `${canton.code}${String(i).padStart(2, '0')}`,
      num: i,
      name: `Distrito ${i} de ${canton.name}`,
      nameSearch: `distrito ${i} de ${canton.name}`.toLowerCase(),
      area: Math.floor(Math.random() * 100) + 10,
      altitude: Math.floor(Math.random() * 2000) + 100,
      cantonId: canton.id,
      canton: { num: canton.num, name: canton.name },
      createdAt: '2024-01-01T00:00:00Z',
    });
    districtId++;
  }
});