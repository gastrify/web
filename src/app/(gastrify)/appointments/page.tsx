import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/shared/lib/better-auth/server";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { AdminAppointmentsPage } from "@/features/appointments/components/admin-appointments-page";
import { UserAppointmentsPage } from "@/features/appointments/components/user-appointments-page";

export const metadata: Metadata = {
  title: "Gastrify | Appointments",
};

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const isAdmin = session.user.role === "admin";

  return (
    <ScrollArea className="h-full">
      {isAdmin ? <AdminAppointmentsPage /> : <UserAppointmentsPage />}
    </ScrollArea>
  );
}
