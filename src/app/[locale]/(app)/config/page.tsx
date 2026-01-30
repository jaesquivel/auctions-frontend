'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function ConfigPage() {
  const t = useTranslations('config');

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Base URL</label>
              <Input defaultValue="http://localhost:8080/api/v1" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default USD Exchange Rate</label>
              <Input type="number" defaultValue="515" />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Items per Page</label>
              <Input type="number" defaultValue="20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Format</label>
              <Input defaultValue="YYYY-MM-DD HH:mm" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}