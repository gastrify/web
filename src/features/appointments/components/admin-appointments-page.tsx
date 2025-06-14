import { TypographyH1, TypographyH3 } from "@/shared/components/ui/typography";

import { AdminIncomingAppointments } from "@/features/appointments/components/admin-incoming-appointments";
import { Appointments } from "@/features/appointments/components/appointments";

export function AdminAppointmentsPage() {
  return (
    <div className="flex h-full flex-col gap-6 pr-6">
      <TypographyH1>Appointments</TypographyH1>

      <TypographyH3>Incoming Appointments</TypographyH3>

      <AdminIncomingAppointments />

      <TypographyH3>Manage Appointments</TypographyH3>

      <Appointments />
    </div>
  );
}
