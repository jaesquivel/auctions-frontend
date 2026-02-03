import type { TdProvince, TdCanton, TdDistrict } from '@/types';

// Costa Rica provinces (7)
export const mockTdProvinces: TdProvince[] = [
  { id: 'p1', code: '01', num: 1, name: 'San José', nameSearch: 'san jose', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p2', code: '02', num: 2, name: 'Alajuela', nameSearch: 'alajuela', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p3', code: '03', num: 3, name: 'Cartago', nameSearch: 'cartago', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p4', code: '04', num: 4, name: 'Heredia', nameSearch: 'heredia', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p5', code: '05', num: 5, name: 'Guanacaste', nameSearch: 'guanacaste', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p6', code: '06', num: 6, name: 'Puntarenas', nameSearch: 'puntarenas', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p7', code: '07', num: 7, name: 'Limón', nameSearch: 'limon', createdAt: '2024-01-01T00:00:00Z' },
];

// 10 cantons per province (only showing first 3 provinces for brevity, but all are generated)
const tdCantonNames: Record<string, string[]> = {
  p1: ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita'],
  p2: ['Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas', 'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos'],
  p3: ['Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco', 'La Suiza', 'Pacayas'],
  p4: ['Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí'],
  p5: ['Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas', 'Abangares', 'Tilarán', 'Nandayure', 'La Cruz'],
  p6: ['Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa', 'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 'Corredores'],
  p7: ['Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo', 'Bataan', 'Valle La Estrella', 'Cahuita', 'Bribri'],
};

export const mockTdCantons: TdCanton[] = [];
let tdCantonId = 1;
mockTdProvinces.forEach((tdProvince) => {
  const names = tdCantonNames[tdProvince.id] || [];
  names.forEach((name, index) => {
    mockTdCantons.push({
      id: `c${tdCantonId}`,
      code: `${tdProvince.code}${String(index + 1).padStart(2, '0')}`,
      num: index + 1,
      name,
      nameSearch: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      tdProvinceId: tdProvince.id,
      tdProvince: { num: tdProvince.num, name: tdProvince.name },
      createdAt: '2024-01-01T00:00:00Z',
    });
    tdCantonId++;
  });
});

// 10 districts per canton (generating dynamically)
export const mockTdDistricts: TdDistrict[] = [];
let tdDistrictId = 1;
mockTdCantons.forEach((tdCanton) => {
  for (let i = 1; i <= 10; i++) {
    mockTdDistricts.push({
      id: `d${tdDistrictId}`,
      code: `${tdCanton.code}${String(i).padStart(2, '0')}`,
      num: i,
      name: `Distrito ${i} de ${tdCanton.name}`,
      nameSearch: `distrito ${i} de ${tdCanton.name}`.toLowerCase(),
      area: Math.floor(Math.random() * 100) + 10,
      altitude: Math.floor(Math.random() * 2000) + 100,
      tdCantonId: tdCanton.id,
      tdCanton: { num: tdCanton.num, name: tdCanton.name },
      createdAt: '2024-01-01T00:00:00Z',
    });
    tdDistrictId++;
  }
});