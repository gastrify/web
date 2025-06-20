import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/shared/lib/better-auth/server";
import AppointmentsClient from "./AppointmentsClient";

export const metadata: Metadata = {
  title: "Gastrify | Appointments",
};

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const isAdmin = session.user.role === "admin";

  return <AppointmentsClient isAdmin={isAdmin} />;
}
