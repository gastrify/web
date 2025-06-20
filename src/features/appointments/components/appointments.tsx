"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAllAppointments } from "@/features/appointments/actions/get-all-appointments";
import { EventCalendar } from "@/features/appointments/components/event-calendar";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";

export function Appointments() {
  const { errors } = useAppointmentsTranslations();

  const { data, isError } = useQuery({
    queryKey: ["appointments", "list", "calendar"],
    queryFn: async () => {
      const { data, error } = await getAllAppointments();

      if (error) return Promise.reject(error);

      return data;
    },
  });

  if (isError)
    toast.error(errors.fetchError, {
      description: errors.fetchErrorDescription,
    });

  return <EventCalendar initialView="agenda" events={data} />;
}
