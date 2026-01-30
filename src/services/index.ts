// Services
export { propertiesService, type PaginatedResponse, type PropertyFilters } from './properties';
export { edictsService, type EdictFilters } from './edicts';
export { tagsService, type TagFilters } from './tags';
export { vehiclesService, type VehicleFilters } from './vehicles';
export { assetsService, type AssetFilters } from './assets';
export { bulletinsService, type BulletinFilters } from './bulletins';
export { territorialService } from './territorial';

// Re-export config for convenience
export { config } from '@/lib/config';