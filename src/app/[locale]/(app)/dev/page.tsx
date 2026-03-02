'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useUser, useSession, useAuth } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useUserRole } from '@/hooks';
import { apiLog } from '@/lib/api-log';

function useApiLog() {
  const entries = useSyncExternalStore(
    apiLog.subscribe,
    () => apiLog.getEntries(),
    () => [],
  );
  return entries;
}

export default function DevPage() {
  const t = useTranslations('dev');
  const { user, isLoaded: isUserLoaded } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const { userId, sessionId, orgId } = useAuth();
  const { role, isAdmin } = useUserRole();
  const logEntries = useApiLog();
  const logRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [logEntries]);

  if (!isUserLoaded || !isSessionLoaded) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('userInfo')}</CardTitle>
            <CardDescription>{t('userInfoDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">{t('userId')}:</span>
              <span className="font-mono text-xs break-all">{userId || '-'}</span>

              <span className="text-muted-foreground">{t('email')}:</span>
              <span>{user?.primaryEmailAddress?.emailAddress || '-'}</span>

              <span className="text-muted-foreground">{t('fullName')}:</span>
              <span>{user?.fullName || '-'}</span>

              <span className="text-muted-foreground">{t('firstName')}:</span>
              <span>{user?.firstName || '-'}</span>

              <span className="text-muted-foreground">{t('lastName')}:</span>
              <span>{user?.lastName || '-'}</span>

              <span className="text-muted-foreground">{t('username')}:</span>
              <span>{user?.username || '-'}</span>

              <span className="text-muted-foreground">{t('imageUrl')}:</span>
              <span className="truncate">{user?.imageUrl ? 'Yes' : 'No'}</span>

              <span className="text-muted-foreground">{t('createdAt')}:</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</span>

              <span className="text-muted-foreground">{t('lastSignInAt')}:</span>
              <span>{user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : '-'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Role & Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('rolePermissions')}</CardTitle>
            <CardDescription>{t('rolePermissionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">{t('currentRole')}:</span>
              <span>
                <Badge variant={isAdmin ? 'default' : 'secondary'}>
                  {role}
                </Badge>
              </span>

              <span className="text-muted-foreground">{t('isAdmin')}:</span>
              <span>
                <Badge variant={isAdmin ? 'default' : 'outline'}>
                  {isAdmin ? 'Yes' : 'No'}
                </Badge>
              </span>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">{t('publicMetadata')}:</h4>
              <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-32">
                {JSON.stringify(user?.publicMetadata || {}, null, 2)}
              </pre>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">{t('unsafeMetadata')}:</h4>
              <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-32">
                {JSON.stringify(user?.unsafeMetadata || {}, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sessionInfo')}</CardTitle>
            <CardDescription>{t('sessionInfoDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">{t('sessionId')}:</span>
              <span className="font-mono text-xs break-all">{sessionId || '-'}</span>

              <span className="text-muted-foreground">{t('status')}:</span>
              <span>
                <Badge variant={session?.status === 'active' ? 'default' : 'secondary'}>
                  {session?.status || '-'}
                </Badge>
              </span>

              <span className="text-muted-foreground">{t('lastActiveAt')}:</span>
              <span>{session?.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : '-'}</span>

              <span className="text-muted-foreground">{t('expireAt')}:</span>
              <span>{session?.expireAt ? new Date(session.expireAt).toLocaleString() : '-'}</span>

              <span className="text-muted-foreground">{t('abandonAt')}:</span>
              <span>{session?.abandonAt ? new Date(session.abandonAt).toLocaleString() : '-'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('orgInfo')}</CardTitle>
            <CardDescription>{t('orgInfoDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">{t('orgId')}:</span>
              <span className="font-mono text-xs break-all">{orgId || t('noOrg')}</span>

              <span className="text-muted-foreground">{t('orgMemberships')}:</span>
              <span>{user?.organizationMemberships?.length || 0}</span>
            </div>

            {user?.organizationMemberships && user.organizationMemberships.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">{t('memberships')}:</h4>
                <div className="space-y-2">
                  {user.organizationMemberships.map((membership) => (
                    <div key={membership.id} className="text-xs bg-muted p-2 rounded-md">
                      <div><strong>{membership.organization.name}</strong></div>
                      <div className="text-muted-foreground">Role: {membership.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t('envInfo')}</CardTitle>
          <CardDescription>{t('envInfoDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">{t('nodeEnv')}:</span>
              <Badge variant="outline">{process.env.NODE_ENV}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground block">{t('nextPublicEnv')}:</span>
              <Badge variant="outline">{process.env.NEXT_PUBLIC_ENV || 'Not set'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Log</CardTitle>
              <CardDescription>{logEntries.length} request{logEntries.length !== 1 ? 's' : ''} recorded</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => apiLog.clear()}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <textarea
            ref={logRef}
            readOnly
            value={logEntries.map((e) => apiLog.format(e)).join('\n\n')}
            className="w-full h-80 rounded-md border border-border bg-muted p-3 font-mono text-xs resize-y focus:outline-none"
            placeholder="No API calls yet. Navigate to other pages to see requests here."
          />
        </CardContent>
      </Card>
    </div>
  );
}
