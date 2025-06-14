"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAllAppointments } from "@/features/appointments/actions/get-all-appointments";
import { EventCalendar } from "@/features/appointments/components/event-calendar";

export function Appointments() {
  const { data, isError } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await getAllAppointments();

      if (error) return Promise.reject(error);

      return data;
    },
  });

  if (isError)
    toast.error("Something went wrong fetching appointments", {
      description: "Please try again later",
    });

  return <EventCalendar initialView="agenda" events={data} />;
}
