'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { User, LogOut } from 'lucide-react';
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

  const handleSignOut = () => {
    signOut();
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
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">{user?.fullName || 'User'}</p>
          <p className="text-muted-foreground text-xs truncate">
            {user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}