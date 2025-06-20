"use client";

import { TypographyH1, TypographyH3 } from "@/shared/components/ui/typography";

import { AdminIncomingAppointments } from "@/features/appointments/components/admin-incoming-appointments";
import { EventCalendar } from "@/features/appointments/components/event-calendar";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";
import { useAllAppointments } from "@/features/appointments/hooks/use-all-appointments";

export function AdminAppointmentsPage() {
  const { calendar } = useAppointmentsTranslations();
  const { data: appointments } = useAllAppointments();

  return (
    <div className="flex h-full flex-col gap-6 pr-6">
      <TypographyH1>{calendar.appointments}</TypographyH1>

      <TypographyH3>{calendar.incomingAppointments}</TypographyH3>

      <AdminIncomingAppointments />

      <TypographyH3>{calendar.manageAppointments}</TypographyH3>

      <EventCalendar events={appointments || []} initialView="agenda" />
    </div>
  );
}
