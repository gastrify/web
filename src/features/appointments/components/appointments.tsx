"use client";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAllAppointments } from "@/features/appointments/actions/get-all-appointments";
import { EventCalendar } from "@/features/appointments/components/event-calendar";

export function Appointments() {
  const { t } = useTranslation("appointments");
  const { data, isError } = useQuery({
    queryKey: ["appointments", "list", "calendar"],
    queryFn: async () => {
      const { data, error } = await getAllAppointments();

      if (error) return Promise.reject(error);

      return data;
    },
  });

  if (isError)
    toast.error(t("errors.fetchError"), {
      description: t("errors.fetchErrorDescription"),
    });

  return <EventCalendar initialView="agenda" events={data} />;
}
