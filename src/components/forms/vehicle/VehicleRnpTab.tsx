"use client";

import { useTranslations } from "next-intl";
import { formatTimestamp } from "@/lib/formatters";
import type { Vehicle } from "@/types";

interface VehicleRnpTabProps {
  vehicle?: Vehicle | null;
}

export function VehicleRnpTab({ vehicle }: VehicleRnpTabProps) {
  const t = useTranslations("vehicles.form");

  if (!vehicle?.rnpRecord) {
    return <p className="text-sm text-muted-foreground">{t("noRnpRecord")}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {t("rnpRecordUpdated")}: {formatTimestamp(vehicle?.rnpRecordUpdated)}
      </p>
      <div
        className="prose prose-lg dark:prose-invert max-w-none rounded-md border p-4 overflow-auto min-h-16"
        dangerouslySetInnerHTML={{ __html: vehicle?.rnpRecord ?? "" }}
      />
    </div>
  );
}
