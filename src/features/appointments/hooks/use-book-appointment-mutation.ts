import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { bookAppointment } from "@/features/appointments/actions/book-appointment";
import type {
  BookAppointmentValues,
  CalendarEvent,
} from "@/features/appointments/types";

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
      const previousUserAppointments = queryClient.getQueryData<
        CalendarEvent[]
      >(["appointments", bookingValues.patientId]);

      queryClient.setQueryData<CalendarEvent[]>(
        ["appointments"],
        (oldAppointments) => {
          if (!oldAppointments) return [];

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
      if (bookedAppointment) {
        queryClient.setQueryData<CalendarEvent[]>(
          ["appointments", bookingValues.patientId],
          (oldUserAppointments) => {
            const userAppointment = {
              ...bookedAppointment,
              title: "booked",
              color: "sky" as const,
            };

            return [...(oldUserAppointments || []), userAppointment];
          },
        );
      }

      return { previousAppointments, previousUserAppointments };
    },
    onError: (_error, bookingValues, context) => {
      if (context?.previousAppointments) {
        queryClient.setQueryData(
          ["appointments"],
          context.previousAppointments,
        );
      }
      if (context?.previousUserAppointments) {
        queryClient.setQueryData(
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
    },
  });
};
