import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { bookAppointment } from "@/features/appointments/actions/book-appointment";
import type {
  BookAppointmentValues,
  CalendarEvent,
} from "@/features/appointments/types";
import {
  optimisticSet,
  rollback,
} from "@/features/appointments/hooks/optimistic-helpers";

export const useBookAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: BookAppointmentValues) => {
      const { error } = await bookAppointment({
        appointmentId: values.appointmentId,
        patientId: values.patientId,
        appointmentType: values.appointmentType,
      });

      if (error) return Promise.reject(error);
    },
    onMutate: async (bookingValues) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      await queryClient.cancelQueries({
        queryKey: ["appointments", bookingValues.patientId],
      });

      const previousAppointments = queryClient.getQueryData<CalendarEvent[]>([
        "appointments",
      ]);

      const prevMainAppointments = optimisticSet<CalendarEvent>(
        queryClient,
        ["appointments"],
        (oldAppointments) => {
          return oldAppointments.map((appointment) => {
            if (appointment.id === bookingValues.appointmentId) {
              return {
                ...appointment,
                title: "booked",
                color: "sky" as const,
              };
            }
            return appointment;
          });
        },
      );

      const bookedAppointment = previousAppointments?.find(
        (apt) => apt.id === bookingValues.appointmentId,
      );

      let prevUserAppointments: CalendarEvent[] = [];
      if (bookedAppointment) {
        prevUserAppointments = optimisticSet<CalendarEvent>(
          queryClient,
          ["appointments", bookingValues.patientId],
          (oldUserAppointments) => {
            const userAppointment = {
              ...bookedAppointment,
              title: "booked",
              color: "sky" as const,
            };

            return [...oldUserAppointments, userAppointment];
          },
        );
      }

      return {
        previousAppointments: prevMainAppointments,
        previousUserAppointments: prevUserAppointments,
      };
    },
    onError: (_error, bookingValues, context) => {
      if (context?.previousAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments"],
          context.previousAppointments,
        );
      }
      if (context?.previousUserAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", bookingValues.patientId],
          context.previousUserAppointments,
        );
      }

      toast.error("Failed to book appointment 😢", {
        description: "Please try again later",
      });
    },
    onSuccess: () => {
      toast.success("Appointment booked successfully 🎉");
    },
    onSettled: (_data, _error, bookingVariables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", bookingVariables.patientId],
      });

      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });

      queryClient.invalidateQueries({
        queryKey: ["appointments", bookingVariables.appointmentId],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments"],
        exact: true,
      });
    },
  });
};
