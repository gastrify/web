import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAppointment } from "@/features/appointments/actions/delete-appointment";
import type {
  CalendarEvent,
  IncomingAppointment,
} from "@/features/appointments/types";
import {
  optimisticRemove,
  rollback,
} from "@/features/appointments/utils/optimistic-helpers";

interface DeleteAppointmentVariables {
  appointmentId: string;
}

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: DeleteAppointmentVariables) => {
      const { error } = await deleteAppointment(variables.appointmentId);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list", "calendar"],
      });
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list", "incoming"],
      });

      const previousCalendarAppointments = optimisticRemove<CalendarEvent>(
        queryClient,
        ["appointments", "list", "calendar"],
        (appointment) => appointment.id === variables.appointmentId,
      );

      const previousIncomingAppointments =
        optimisticRemove<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          (incomingAppointment) =>
            incomingAppointment.appointment.id === variables.appointmentId,
        );

      return { previousCalendarAppointments, previousIncomingAppointments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCalendarAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          context.previousCalendarAppointments,
        );
      }

      if (context?.previousIncomingAppointments) {
        rollback<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          context.previousIncomingAppointments,
        );
      }

      toast.error("Failed to delete appointment 😢", {
        description: "Please try again later",
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", "details", variables.appointmentId],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", "list", "incoming"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", "list", "calendar"],
      });
    },
  });
};
