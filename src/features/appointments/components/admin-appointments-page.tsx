"use client";

import { useTranslation } from "react-i18next";
import { TypographyH1, TypographyH3 } from "@/shared/components/ui/typography";

import { AdminIncomingAppointments } from "@/features/appointments/components/admin-incoming-appointments";
import { Appointments } from "@/features/appointments/components/appointments";

export function AdminAppointmentsPage() {
  const { t } = useTranslation("appointments");

  return (
    <div className="flex h-full flex-col gap-6 pr-6">
      <TypographyH1>{t("page.title")}</TypographyH1>

      <TypographyH3>{t("calendar.incomingAppointments")}</TypographyH3>

      <AdminIncomingAppointments />

      <TypographyH3>{t("calendar.manageAppointments")}</TypographyH3>

      <Appointments />
    </div>
  );
}
