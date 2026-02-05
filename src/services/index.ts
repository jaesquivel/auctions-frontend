// Services
export { propertiesService, type PropertyFilters } from './properties';
export { edictsService, type EdictFilters } from './edicts';
export { edictsRawService, type EdictRawFilters } from './edicts-raw';
export { tagsService } from './tags';
export { vehiclesService, type VehicleFilters } from './vehicles';
export { assetsService, type AssetFilters } from './assets';
export { bulletinsService, type BulletinFilters } from './bulletins';
export { territorialService } from './territorial';

// Re-export config for convenience
export { config } from '@/lib/config';

// Re-export pagination types from common
export type { SpringPage, SpringPageParams } from '@/types';