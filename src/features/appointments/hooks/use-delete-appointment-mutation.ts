import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAppointment } from "@/features/appointments/actions/delete-appointment";
import type { CalendarEvent } from "@/features/appointments/types";

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data, error } = await deleteAppointment(appointmentId);

      if (error) return Promise.reject(error);

      return data;
    },
    onMutate: async (appointmentId) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      await queryClient.cancelQueries({
        queryKey: ["appointments", "incoming"],
      });

      const previousAppointments = queryClient.getQueryData<CalendarEvent[]>([
        "appointments",
      ]);
      const previousIncomingAppointments = queryClient.getQueryData([
        "appointments",
        "incoming",
      ]);

      queryClient.setQueryData<CalendarEvent[]>(
        ["appointments"],
        (oldAppointments) => {
          if (!oldAppointments) return [];
          return oldAppointments.filter(
            (appointment) => appointment.id !== appointmentId,
          );
        },
      );

      queryClient.setQueryData<{ appointment: CalendarEvent }[]>(
        ["appointments", "incoming"],
        (oldIncomingAppointments) => {
          if (!oldIncomingAppointments) return [];
          return oldIncomingAppointments.filter(
            (incomingAppointment) =>
              incomingAppointment.appointment.id !== appointmentId,
          );
        },
      );

      return { previousAppointments, previousIncomingAppointments };
    },
    onError: (_error, _appointmentId, context) => {
      if (context?.previousAppointments) {
        queryClient.setQueryData(
          ["appointments"],
          context.previousAppointments,
        );
      }
      if (context?.previousIncomingAppointments) {
        queryClient.setQueryData(
          ["appointments", "incoming"],
          context.previousIncomingAppointments,
        );
      }

      toast.error("Failed to delete appointment 😢");
    },
    onSuccess: () => {
      toast.success("Appointment deleted successfully 🎉");
    },
    onSettled: (_data, _error, appointmentId) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", appointmentId],
      });

      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });
    },
  });
};
