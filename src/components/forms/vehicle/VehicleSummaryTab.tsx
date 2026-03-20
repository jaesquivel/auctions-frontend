'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatTimestamp } from '@/lib/formatters';
import type { Vehicle } from '@/types';

interface VehicleSummaryTabProps {
  vehicle?: Vehicle | null;
}

export function VehicleSummaryTab({ vehicle }: VehicleSummaryTabProps) {
  const t = useTranslations('vehicles.form');
  const tc = useTranslations('common');
  const [copied, setCopied] = useState(false);

  if (!vehicle) {
    return <p className="text-sm text-muted-foreground">{tc('noData')}</p>;
  }

  const cur = vehicle.asset?.currency ?? 'USD';
  const edict = vehicle.asset?.edict;

  const rows: string[] = [];

  // Header
  rows.push(`${t('plate')}: ${vehicle.plate}`);
  rows.push(`${t('make')}: ${vehicle.make ?? '-'}  ${t('model')}: ${vehicle.model ?? '-'}  ${t('year')}: ${vehicle.year ?? '-'}`);
  rows.push(`${t('tags')}: ${vehicle.tags.map((tag) => tag.name).join(', ') || '-'}`);
  rows.push('');

  // Auction
  rows.push(`=== ${t('auction').toUpperCase()} ===`);
  rows.push(`${t('firstAuction')}: ${formatTimestamp(vehicle.asset?.firstAuctionTs)}   Base: ${formatCurrency(vehicle.asset?.firstAuctionBase, cur)}`);
  rows.push(`${t('secondAuction')}: ${formatTimestamp(vehicle.asset?.secondAuctionTs)}   Base: ${formatCurrency(vehicle.asset?.secondAuctionBase, cur)}`);
  rows.push(`${t('thirdAuction')}: ${formatTimestamp(vehicle.asset?.thirdAuctionTs)}   Base: ${formatCurrency(vehicle.asset?.thirdAuctionBase, cur)}`);
  rows.push(`${t('firstGuarantee')}: ${formatCurrency(vehicle.firstAuctionGuarantee, 'USD')}`);
  rows.push(`${t('firstBaseAdj')}: ${formatCurrency(vehicle.firstAuctionBaseAdj, 'USD')}`);
  rows.push('');

  // Vehicle details
  rows.push(`=== ${t('description').toUpperCase()} ===`);
  rows.push(`${t('bodyStyle')}: ${vehicle.bodyStyle ?? '-'}`);
  rows.push(`${t('exteriorColor')}: ${vehicle.exteriorColor ?? '-'}   ${t('interiorColor')}: ${vehicle.interiorColor ?? '-'}`);
  rows.push(`${t('fuelType')}: ${vehicle.fuelType ?? '-'}   ${t('transmissionType')}: ${vehicle.transmissionType ?? '-'}`);
  rows.push(`${t('mileageKm')}: ${vehicle.mileageKm != null ? vehicle.mileageKm.toLocaleString() + ' km' : '-'}`);
  rows.push(`${t('condition')}: ${vehicle.condition ?? '-'}`);
  rows.push('');

  // Identification
  rows.push(`=== ${t('identification').toUpperCase()} ===`);
  rows.push(`VIN: ${vehicle.vin ?? '-'}`);
  rows.push(`${t('chassisNumber')}: ${vehicle.chassisNumber ?? '-'}`);
  rows.push(`${t('rnpRecord')}: ${vehicle.rnpRecord ?? '-'}`);
  rows.push('');

  // Valuation
  rows.push(`=== ${t('valuation').toUpperCase()} ===`);
  rows.push(`${t('marketValue')}: ${formatCurrency(vehicle.marketValue, 'USD')}`);
  rows.push(`${t('appraisalValue')}: ${formatCurrency(vehicle.appraisalValue, 'USD')}`);
  rows.push(`${t('fiscalValue')}: ${formatCurrency(vehicle.fiscalValue, 'CRC')}`);
  rows.push(`${t('fiscalValueUsd')}: ${formatCurrency(vehicle.fiscalValueUsd, 'USD')}`);
  rows.push(`${t('usdExchangeRate')}: ${vehicle.usdExchangeRate}`);
  rows.push(`${t('contractValue')}: ${formatCurrency(vehicle.contractValue, vehicle.contractCurrency ?? 'USD')}`);
  rows.push('');

  // Case
  rows.push(`=== ${t('case').toUpperCase()} ===`);
  rows.push(`${t('caseNumber')}: ${edict?.caseNumber ?? '-'}`);
  rows.push(`${t('reference')}: ${edict?.reference ?? '-'}`);
  rows.push(`${t('court')}: ${edict?.court ?? '-'}`);
  rows.push(`${t('judiciaryOffice')}: ${edict?.judiciaryOffice?.officeName ?? '-'}`);
  rows.push(`${t('creditor')}: ${edict?.creditor?.name ?? '-'}`);
  rows.push(`${t('debtor')}: ${edict?.debtor?.name ?? '-'}`);
  if (edict?.bulletin) {
    rows.push(`${t('bulletinPub')}: ${edict.bulletin.year} vol. ${edict.bulletin.volume}, ${edict.publication}/${edict.publicationCount}`);
  }
  rows.push('');

  // Observations
  rows.push(`=== ${t('observations').toUpperCase()} ===`);
  if (vehicle.observations) rows.push(vehicle.observations);
  rows.push('');

  const text = rows.join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.getElementById('vehicle-summary-text') as HTMLTextAreaElement | null;
      el?.select();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <><Check className="h-4 w-4 mr-1.5" />{t('copied')}</>
          ) : (
            <><Copy className="h-4 w-4 mr-1.5" />{t('copy')}</>
          )}
        </Button>
      </div>
      <textarea
        id="vehicle-summary-text"
        readOnly
        value={text}
        className="w-full min-h-[480px] rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono resize-y focus:outline-none"
      />
    </div>
  );
}
