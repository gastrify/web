import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAppointment } from "@/features/appointments/actions/delete-appointment";
import type { CalendarEvent } from "@/features/appointments/types";
import {
  optimisticSet,
  rollback,
} from "@/features/appointments/hooks/optimistic-helpers";

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

      const previousAppointments = optimisticSet<CalendarEvent>(
        queryClient,
        ["appointments"],
        (oldAppointments) => {
          return oldAppointments.filter(
            (appointment) => appointment.id !== appointmentId,
          );
        },
      );

      const previousIncomingAppointments = optimisticSet<{
        appointment: CalendarEvent;
      }>(
        queryClient,
        ["appointments", "incoming"],
        (oldIncomingAppointments) => {
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
        rollback<CalendarEvent>(
          queryClient,
          ["appointments"],
          context.previousAppointments,
        );
      }
      if (context?.previousIncomingAppointments) {
        rollback<{ appointment: CalendarEvent }>(
          queryClient,
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

      queryClient.invalidateQueries({
        queryKey: ["appointments"],
        exact: true,
      });
    },
  });
};
