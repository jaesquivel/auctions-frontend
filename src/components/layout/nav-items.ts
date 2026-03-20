import {
  Building2,
  Car,
  Package,
  FileText,
  Newspaper,
  FileSearch,
  PackageSearch,
  Tags,
  MapPin,
  Settings,
  Gavel,
  Code2,
} from 'lucide-react';

export interface NavItem {
  titleKey: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
  permissionKey?: string;
}

const isDev = process.env.NODE_ENV === 'development';

export const navItems: NavItem[] = [
  {
    titleKey: 'auctions',
    icon: Gavel,
    permissionKey: 'auctions.menu',
    children: [
      { titleKey: 'properties', href: '/properties', icon: Building2, permissionKey: 'properties.menu' },
      { titleKey: 'vehicles', href: '/vehicles', icon: Car, permissionKey: 'vehicles.menu' },
      { titleKey: 'edicts', href: '/edicts', icon: FileText, permissionKey: 'edicts.menu' },
      { titleKey: 'assets', href: '/assets', icon: Package, permissionKey: 'assets.menu' },
    ],
  },
  {
    titleKey: 'dataExtraction',
    icon: FileSearch,
    permissionKey: 'data_extraction.menu',
    children: [
      { titleKey: 'bulletins', href: '/bulletins', icon: Newspaper, permissionKey: 'bulletins.menu' },
      { titleKey: 'extractedEdicts', href: '/extracted-edicts', icon: FileSearch, permissionKey: 'raw-edicts.menu' },
      { titleKey: 'extractedAssets', href: '/extracted-assets', icon: PackageSearch, permissionKey: 'raw-assets.menu' },
    ],
  },
  {
    titleKey: 'configuration',
    icon: Settings,
    permissionKey: 'configuration.menu',
    children: [
      { titleKey: 'tags', href: '/tags', icon: Tags, permissionKey: 'properties-tags.menu' },
      { titleKey: 'vehicleTags', href: '/vehicle-tags', icon: Tags, permissionKey: 'vehicles-tags.menu' },
      { titleKey: 'territorial', href: '/territorial', icon: MapPin, permissionKey: 'territorial-division.menu' },
      { titleKey: 'generalConfig', href: '/config', icon: Settings, permissionKey: 'general-configuration.menu' },
      ...(isDev ? [{ titleKey: 'dev', href: '/dev', icon: Code2 }] : []),
    ],
  },
];
