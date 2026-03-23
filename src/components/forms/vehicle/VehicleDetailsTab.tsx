"use client";

import { useTranslations } from "next-intl";
import { StringField } from "@/components/ui/string-field";
import { NumericField } from "@/components/ui/numeric-field";
import { DateTimeField } from "@/components/ui/datetime-field";
import type { Vehicle } from "@/types";

interface VehicleDetailsTabProps {
  vehicle?: Vehicle | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  readOnly: boolean;
}

export function VehicleDetailsTab({
  vehicle,
  formData,
  setFormData,
  readOnly,
}: VehicleDetailsTabProps) {
  const t = useTranslations("vehicles.form");
  const fieldMode = readOnly ? "readonly" : "edit";

  const updateField = (field: string) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      {/* Identification */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold">{t("identification")}</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <StringField
            mode="readonly"
            label={t("plateClass")}
            value={vehicle?.plateClass ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("plate")}
            value={vehicle?.plate}
          />
          <StringField
            mode="readonly"
            label={t("plateCode")}
            value={vehicle?.plateCode ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("vin")}
            value={vehicle?.vin ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("chassisNumber")}
            value={vehicle?.chassisNumber ?? undefined}
          />
        </div>
      </fieldset>

      {/* Registration */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold text-muted-foreground">
          {t("registration")}
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
          <StringField
            mode="readonly"
            label={t("registrationVolume")}
            value={vehicle?.registrationVolume ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("registrationEntry")}
            value={vehicle?.registrationEntry ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("registrationSequence")}
            value={vehicle?.registrationSequence ?? undefined}
          />
          <DateTimeField
            mode="readonly"
            label={t("registrationDate")}
            value={vehicle?.registrationDate ?? undefined}
          />
        </div>
      </fieldset>

      {/* Vehicle description */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold">{t("description")}</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <StringField
            mode="readonly"
            label={t("make")}
            value={vehicle?.make ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("model")}
            value={vehicle?.model ?? undefined}
          />
          <NumericField
            mode="readonly"
            label={t("year")}
            value={vehicle?.year?.toString() ?? ""}
            decimals={0}
          />
          <StringField
            mode="readonly"
            label={t("bodyStyle")}
            value={vehicle?.bodyStyle ?? undefined}
          />
          <NumericField
            mode="readonly"
            label={t("passengerCapacity")}
            value={vehicle?.passengerCapacity?.toString() ?? ""}
            decimals={0}
          />
          <NumericField
            mode="readonly"
            label={t("doorCount")}
            value={vehicle?.doorCount?.toString() ?? ""}
            decimals={0}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <StringField
            mode={fieldMode}
            label={t("exteriorColor")}
            value={formData.exteriorColor}
            onChange={updateField("exteriorColor")}
          />
          <StringField
            mode={fieldMode}
            label={t("interiorColor")}
            value={formData.interiorColor}
            onChange={updateField("interiorColor")}
          />
          <StringField
            mode={fieldMode}
            label={t("condition")}
            value={formData.condition}
            onChange={updateField("condition")}
          />
          <NumericField
            mode={fieldMode}
            label={t("mileageKm")}
            value={formData.mileageKm}
            onChange={updateField("mileageKm")}
            decimals={0}
          />
        </div>
      </fieldset>

      {/* Technical specs */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold text-muted-foreground">
          {t("technical")}
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <StringField
            mode="readonly"
            label={t("fuelType")}
            value={vehicle?.fuelType ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("transmissionType")}
            value={vehicle?.transmissionType ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("drivetrain")}
            value={vehicle?.drivetrain ?? undefined}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <StringField
            mode="readonly"
            label={t("engineMake")}
            value={vehicle?.engineMake ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("engineModel")}
            value={vehicle?.engineModel ?? undefined}
          />
          <StringField
            mode="readonly"
            label={t("engineNumber")}
            value={vehicle?.engineNumber ?? undefined}
          />
          <NumericField
            mode="readonly"
            label={t("engineDisplacementCc")}
            value={vehicle?.engineDisplacementCc?.toString() ?? ""}
            decimals={0}
          />
          <NumericField
            mode="readonly"
            label={t("cylinderCount")}
            value={vehicle?.cylinderCount?.toString() ?? ""}
            decimals={0}
          />
          <NumericField
            mode="readonly"
            label={t("powerKw")}
            value={vehicle?.powerKw?.toString() ?? ""}
            decimals={1}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <NumericField
            mode="readonly"
            label={t("batteryCapacityKwh")}
            value={vehicle?.batteryCapacityKwh?.toString() ?? ""}
            decimals={1}
          />
          <NumericField
            mode="readonly"
            label={t("rangeKm")}
            value={vehicle?.rangeKm?.toString() ?? ""}
            decimals={0}
          />
          <StringField
            mode="readonly"
            label={t("chargingType")}
            value={vehicle?.chargingType ?? undefined}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <NumericField
            mode="readonly"
            label={t("netWeightKg")}
            value={vehicle?.netWeightKg?.toString() ?? ""}
            decimals={0}
          />
          <NumericField
            mode="readonly"
            label={t("grossVehicleWeightKg")}
            value={vehicle?.grossVehicleWeightKg?.toString() ?? ""}
            decimals={0}
          />
          <NumericField
            mode="readonly"
            label={t("lengthM")}
            value={vehicle?.lengthM?.toString() ?? ""}
            decimals={2}
          />
        </div>
      </fieldset>

      {vehicle?.notes && (
        <fieldset className="rounded-md border space-y-3 p-3">
          <legend className="text-sm font-semibold text-muted-foreground">
            {t("notes")}
          </legend>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {vehicle.notes}
          </p>
        </fieldset>
      )}
    </div>
  );
}
