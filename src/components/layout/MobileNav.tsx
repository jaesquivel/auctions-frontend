'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
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
  ChevronDown,
  Menu,
  Gavel,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';
import { usePermissions } from '@/hooks';

interface NavItem {
  titleKey: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
  permissionKey?: string;
}

const navItems: NavItem[] = [
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
      { titleKey: 'territorial', href: '/territorial', icon: MapPin, permissionKey: 'territorial-division.menu' },
      { titleKey: 'generalConfig', href: '/config', icon: Settings, permissionKey: 'general-configuration.menu' },
    ],
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['auctions', 'dataExtraction', 'configuration']);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');
  const { can } = usePermissions();

  const filteredNavItems = navItems
    .filter((group) => !group.permissionKey || can(group.permissionKey))
    .map((group) => ({
      ...group,
      children: group.children?.filter((item) => !item.permissionKey || can(item.permissionKey)),
    }));

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupKey)
        ? prev.filter((k) => k !== groupKey)
        : [...prev, groupKey]
    );
  };

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground">
        <SheetHeader className="h-14 px-4 border-b border-sidebar-border flex flex-row items-center">
          <Gavel className="h-6 w-6 text-sidebar-primary mr-2" />
          <SheetTitle className="text-sidebar-foreground">{t('auctions')}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
          <nav className="p-4 space-y-2">
            {filteredNavItems.map((group) => (
              <div key={group.titleKey} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.titleKey)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    'transition-colors'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <group.icon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{t(group.titleKey)}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedGroups.includes(group.titleKey) ? 'rotate-0' : '-rotate-90'
                    )}
                  />
                </button>
                {expandedGroups.includes(group.titleKey) && group.children && (
                  <div className="ml-4 space-y-1">
                    {group.children.map((item) => (
                      <Link
                        key={item.href}
                        href={`/${locale}${item.href}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 text-sm rounded-md',
                          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          'transition-colors whitespace-nowrap',
                          isActive(item.href!) && 'bg-sidebar-accent text-sidebar-accent-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.titleKey)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        <Separator className="bg-sidebar-border" />
        <div className="p-4 space-y-2">
          <ThemeToggle />
          <LanguageSelector />
          <UserMenu />
        </div>
      </SheetContent>
    </Sheet>
  );
}
