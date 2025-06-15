import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelAppointment } from "@/features/appointments/actions/cancel-appointment";
import { useSession } from "@/shared/hooks/use-session";
import type { Appointment, CalendarEvent } from "@/features/appointments/types";
import {
  optimisticRemove,
  optimisticUpdate,
  rollback,
} from "@/features/appointments/utils/optimistic-helpers";

type CancelAppointmentValues = {
  appointmentId: string;
};

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (variables: CancelAppointmentValues) => {
      const { error } = await cancelAppointment(variables.appointmentId);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list", "calendar"],
      });
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list", "user", session?.user?.id],
      });

      const previousCalendarAppointments = optimisticUpdate<CalendarEvent>(
        queryClient,
        ["appointments", "list", "calendar"],
        (calendarAppointment) =>
          calendarAppointment.id === variables.appointmentId,
        (calendarAppointment) => ({
          ...calendarAppointment,
          title: "available",
          color: "emerald",
        }),
      );

      const previousUserAppointments = optimisticRemove<Appointment>(
        queryClient,
        ["appointments", "list", "user", session?.user?.id],
        (appointment) => appointment.id === variables.appointmentId,
      );

      return { previousCalendarAppointments, previousUserAppointments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCalendarAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          context.previousCalendarAppointments,
        );
      }
      if (context?.previousUserAppointments) {
        rollback<Appointment>(
          queryClient,
          ["appointments", "list", "user", session?.user?.id],
          context.previousUserAppointments,
        );
      }

      toast.error("Failed to cancel appointment 😢", {
        description: "Please try again later",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", "list", "user", session?.user?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", "list", "calendar"],
      });
    },
  });
};
