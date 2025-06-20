import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAppointment } from "@/features/appointments/actions/delete-appointment";
import { useSession } from "@/shared/hooks/use-session";
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
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (variables: DeleteAppointmentVariables) => {
      const { error } = await deleteAppointment(variables.appointmentId);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list"],
      });

      // Remove from all queries optimistically
      const previousAllAppointments = optimisticRemove<CalendarEvent>(
        queryClient,
        ["appointments", "list", "all", session?.user?.id],
        (appointment) => appointment.id === variables.appointmentId,
      );

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

      return {
        previousAllAppointments,
        previousCalendarAppointments,
        previousIncomingAppointments,
      };
    },
    onSuccess: () => {
      toast.success("Appointment deleted successfully 🗑️");
    },
    onError: (_error, _variables, context) => {
      // Rollback optimistic updates
      if (context?.previousAllAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "all", session?.user?.id],
          context.previousAllAppointments,
        );
      }

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
    onSettled: () => {
      // Invalidate all appointment-related queries
      queryClient.invalidateQueries({
        queryKey: ["appointments", "list"],
      });
    },
  });
};
