"use client";

import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { AdminAppointmentsPage } from "@/features/appointments/components/admin-appointments-page";
import { UserAppointmentsPage } from "@/features/appointments/components/user-appointments-page";

interface AppointmentsClientProps {
  isAdmin: boolean;
}

export default function AppointmentsClient({
  isAdmin,
}: AppointmentsClientProps) {
  return (
    <ScrollArea className="h-full">
      {isAdmin ? <AdminAppointmentsPage /> : <UserAppointmentsPage />}
    </ScrollArea>
  );
}
