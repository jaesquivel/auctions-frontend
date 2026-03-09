'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types';
import { formatCurrency, formatDate, formatArea, formatPercent } from '@/lib/formatters';

interface PropertySummaryTabProps {
  property?: Property | null;
}

export function PropertySummaryTab({ property }: PropertySummaryTabProps) {
  const t = useTranslations('properties.form');
  const [copied, setCopied] = useState(false);

  if (!property) {
    return <p className="text-sm text-muted-foreground">{t('noData')}</p>;
  }

  const cur = property.asset?.currency ?? 'CRC';
  const edict = property.asset?.edict;

  const rows: string[] = [];

  // Header
  rows.push(`${t('registration')}: ${property.fullRegistrationNumber}`);
  rows.push(`${t('tags')}: ${property.tags.map((tag) => tag.name).join(', ')}`);
  rows.push('');

  // Auction
  rows.push(`=== ${t('auction').toUpperCase()} ===`);
  rows.push(
    `${t('firstAuction')}: ${formatDate(property.asset?.firstAuctionTs)}   ${t('firstAuction')} Base: ${formatCurrency(property.asset?.firstAuctionBase, cur)}`
  );
  rows.push(
    `${t('secondAuction')}: ${formatDate(property.asset?.secondAuctionTs)}   ${t('secondAuction')} Base: ${formatCurrency(property.asset?.secondAuctionBase, cur)}`
  );
  rows.push(
    `${t('thirdAuction')}: ${formatDate(property.asset?.thirdAuctionTs)}   ${t('thirdAuction')} Base: ${formatCurrency(property.asset?.thirdAuctionBase, cur)}`
  );
  rows.push(`${t('firstGuarantee')}: ${formatCurrency(property.firstAuctionGuarantee, 'USD')}`);
  rows.push(`${t('firstBaseAdj')}: ${formatCurrency(property.firstAuctionBaseAdj, 'USD')}`);
  rows.push('');

  // Location
  const tdParts = [
    property.asset?.tdProvince?.name,
    property.asset?.tdCanton?.name,
    property.asset?.tdDistrict?.name,
  ].filter(Boolean);

  rows.push(`=== ${t('location').toUpperCase()} ===`);
  if (tdParts.length) rows.push(`${t('tdLocation')}: ${tdParts.join(', ')}`);
    // Waze link
  rows.push(`Waze: https://waze.com/ul?ll=${property.locationStLat != null ? property.locationStLat : ''},${property.locationStLon != null ? property.locationStLon : ''}`);
  rows.push(`${t('locationStreet')}: ${property.locationStLat != null ? property.locationStLat : ''},${property.locationStLon != null ? property.locationStLon : ''}`);
  rows.push('');

  // Valuation
  rows.push(`=== ${t('valuation').toUpperCase()} ===`);
  rows.push(`${t('marketValue')}: ${formatCurrency(property.marketValue, 'USD')}`);
  rows.push(`${t('appraisalValue')}: ${formatCurrency(property.appraisalValue, 'USD')}`);
  rows.push(`${t('fiscalValue')}: ${formatCurrency(property.fiscalValue, 'CRC')}`);
  rows.push(`${t('fiscalValueUsd')}: ${formatCurrency(property.fiscalValueUsd, 'USD')}`);
  rows.push(`${t('fiscalBaseRatio')}: ${formatPercent(property.fiscalBaseRatio, 0)}`);
  rows.push(`${t('usdExchangeRate')}: ${formatCurrency(property.usdExchangeRate, 'CRC')}`);
  rows.push(`${t('area')}: ${formatArea(property.asset.area)}`);
  rows.push('');

  // Case / Edict
  rows.push(`=== ${t('case').toUpperCase()} ===`);
  rows.push(`${t('caseNumber')}: ${edict.caseNumber}`);
  rows.push(`${t('reference')}: ${edict.reference}`);
  rows.push(`${t('court')}: ${edict.court}`);
  rows.push(`${t('judiciaryOffice')}: ${edict.judiciaryOffice?.officeName}`);
  rows.push(`${t('creditor')}: ${edict.creditor.name}`);
  rows.push(`${t('debtor')}: ${edict.debtor.name}`);
  rows.push(`${t('bulletinPub')}: ${edict.bulletin.year} vol. ${edict.bulletin.volume}, ${edict.publication}/${edict.publicationCount}`);
  rows.push('');

  // Description
  rows.push(`=== ${t('description').toUpperCase()} ===`);
  if (property.asset?.description) {
    rows.push(property.asset.description);
  }
  rows.push('');

  // Liens
  rows.push(`=== ${t('liens').toUpperCase()} ===`);
  if (property.asset?.liens) {
    rows.push(property.asset.liens);
  }
  rows.push('');

  // Observations
  rows.push(`=== ${t('observations').toUpperCase()} ===`);
  if (property.observations) {
    rows.push(property.observations);
  }
  rows.push('');

  const text = rows.join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the textarea
      const el = document.getElementById('property-summary-text') as HTMLTextAreaElement | null;
      el?.select();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              {t('copied')}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1.5" />
              {t('copy')}
            </>
          )}
        </Button>
      </div>
      <textarea
        id="property-summary-text"
        readOnly
        value={text}
        className="w-full min-h-[480px] rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono resize-y focus:outline-none"
      />
    </div>
  );
}
