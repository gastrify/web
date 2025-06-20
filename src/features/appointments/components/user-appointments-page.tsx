import { TypographyH1, TypographyH3 } from "@/shared/components/ui/typography";

import { Appointments } from "@/features/appointments/components/appointments";
import { UserAppointments } from "@/features/appointments/components/user-appointments";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";

export function UserAppointmentsPage() {
  const { calendar, user } = useAppointmentsTranslations();

  return (
    <div className="flex h-full flex-col gap-6 pr-6">
      <TypographyH1>{calendar.appointments}</TypographyH1>

      <TypographyH3>{user.myAppointments}</TypographyH3>

      <UserAppointments />

      <TypographyH3>{user.bookAppointment}</TypographyH3>

      <Appointments />
    </div>
  );
}
