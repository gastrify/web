"use client";

import { useTranslation } from "react-i18next";
import { TypographyH1, TypographyH3 } from "@/shared/components/ui/typography";

import { Appointments } from "@/features/appointments/components/appointments";
import { UserAppointments } from "@/features/appointments/components/user-appointments";

export function UserAppointmentsPage() {
  const { t } = useTranslation("appointments");

  return (
    <div className="flex h-full flex-col gap-6 pr-6">
      <TypographyH1>{t("page.title")}</TypographyH1>

      <TypographyH3>{t("user.myAppointments")}</TypographyH3>

      <UserAppointments />

      <TypographyH3>{t("user.bookAppointment")}</TypographyH3>

      <Appointments />
    </div>
  );
}
