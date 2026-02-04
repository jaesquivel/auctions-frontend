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
  ChevronLeft,
  ChevronRight,
  Gavel,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';
import { useUserRole } from '@/hooks';

interface NavItem {
  titleKey: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
  adminOnly?: boolean;
}

const isDev = process.env.NODE_ENV === 'development';

const navItems: NavItem[] = [
  {
    titleKey: 'auctions',
    icon: Gavel,
    children: [
      { titleKey: 'properties', href: '/properties', icon: Building2 },
      { titleKey: 'vehicles', href: '/vehicles', icon: Car },
      { titleKey: 'assets', href: '/assets', icon: Package },
      { titleKey: 'edicts', href: '/edicts', icon: FileText },
    ],
  },
  {
    titleKey: 'dataExtraction',
    icon: FileSearch,
    children: [
      { titleKey: 'bulletins', href: '/bulletins', icon: Newspaper },
      { titleKey: 'extractedEdicts', href: '/extracted-edicts', icon: FileSearch },
      { titleKey: 'extractedAssets', href: '/extracted-assets', icon: PackageSearch },
    ],
  },
  {
    titleKey: 'configuration',
    icon: Settings,
    children: [
      { titleKey: 'tags', href: '/tags', icon: Tags },
      { titleKey: 'territorial', href: '/territorial', icon: MapPin },
      { titleKey: 'generalConfig', href: '/config', icon: Settings, adminOnly: true },
      ...(isDev ? [{ titleKey: 'dev', href: '/dev', icon: Code2 }] : []),
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['auctions', 'dataExtraction', 'configuration']);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');
  const { isAdmin } = useUserRole();

  // Filter nav items based on user role
  const filteredNavItems = navItems.map((group) => ({
    ...group,
    children: group.children?.filter((item) => !item.adminOnly || isAdmin),
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
    <aside
      className={cn(
        'flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href={`/${locale}/properties`} className="flex items-center gap-2">
            <Gavel className="h-6 w-6 text-sidebar-primary" />
            <span className="font-bold text-lg whitespace-nowrap">{t('auctions')}</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-2">
          {filteredNavItems.map((group) => (
            <div key={group.titleKey} className="space-y-1">
              {!collapsed ? (
                <>
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
                </>
              ) : (
                <div className="space-y-1">
                  {group.children?.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${locale}${item.href}`}
                      className={cn(
                        'flex items-center justify-center p-2 rounded-md',
                        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        'transition-colors',
                        isActive(item.href!) && 'bg-sidebar-accent text-sidebar-accent-foreground'
                      )}
                      title={t(item.titleKey)}
                    >
                      <item.icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <Separator className="bg-sidebar-border" />
      <div className={cn('p-2 space-y-1', collapsed && 'flex flex-col items-center')}>
        <ThemeToggle collapsed={collapsed} />
        <LanguageSelector collapsed={collapsed} />
        <UserMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}