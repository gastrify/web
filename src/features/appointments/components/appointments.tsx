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
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",
  });

  if (isError)
    toast.error("Something went wrong fetching appointments", {
      description: "Please try again later",
    });

  return <EventCalendar initialView="agenda" events={data} />;
}
