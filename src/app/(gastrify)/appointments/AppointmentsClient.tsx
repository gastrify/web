"use client";

import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { AdminAppointmentsPage } from "@/features/appointments/components/admin-appointments-page";
import { UserAppointmentsPage } from "@/features/appointments/components/user-appointments-page";

interface Props {
  isAdmin: boolean;
}

export default function AppointmentsClient({ isAdmin }: Props) {
  const { t, i18n } = useTranslation("appointments");

  // Actualizar el título de la página dinámicamente
  useEffect(() => {
    const title = t("page.title");
    document.title = `Gastrify | ${title}`;
  }, [t, i18n.language]);

  return (
    <ScrollArea className="h-full">
      {isAdmin ? <AdminAppointmentsPage /> : <UserAppointmentsPage />}
    </ScrollArea>
  );
}
