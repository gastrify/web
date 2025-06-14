import { TypographyH1, TypographyH3 } from "@/shared/components/ui/typography";

import { Appointments } from "@/features/appointments/components/appointments";
import { UserAppointments } from "@/features/appointments/components/user-appointments";

export function UserAppointmentsPage() {
  return (
    <div className="flex h-full flex-col gap-6 pr-6">
      <TypographyH1>Appointments</TypographyH1>

      <TypographyH3>My Appointments</TypographyH3>

      <UserAppointments />

      <TypographyH3>Book an Appointment</TypographyH3>

      <Appointments />
    </div>
  );
}
