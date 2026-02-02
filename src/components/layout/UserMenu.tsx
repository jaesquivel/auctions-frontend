'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  collapsed?: boolean;
}

export function UserMenu({ collapsed = false }: UserMenuProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const t = useTranslations('nav');
  const params = useParams();
  const locale = (params.locale as string) || 'es';

  const handleSignOut = async () => {
    await signOut({ redirectUrl: `/${locale}/sign-in` });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'sm'}
          className={collapsed ? 'h-9 w-9' : 'justify-start gap-2 w-full'}
        >
          <User className="h-4 w-4" />
          {!collapsed && (
            <span className="truncate">
              {user?.firstName || user?.emailAddresses[0]?.emailAddress || t('profile')}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">{user?.fullName || 'User'}</span>
              <span className="text-muted-foreground text-xs truncate">
                {user?.emailAddresses[0]?.emailAddress}
              </span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            {t('profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}