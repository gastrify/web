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
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";

type CancelAppointmentValues = {
  appointmentId: string;
};

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { success } = useAppointmentsTranslations();

  return useMutation({
    mutationFn: async (variables: CancelAppointmentValues) => {
      const { error } = await cancelAppointment(variables.appointmentId);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list"],
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

      const previousAllAppointments = optimisticUpdate<CalendarEvent>(
        queryClient,
        ["appointments", "list", "all", session?.user?.id],
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

      return {
        previousCalendarAppointments,
        previousAllAppointments,
        previousUserAppointments,
      };
    },
    onSuccess: () => {
      toast.success(success.cancelledSuccessfully, {
        description: success.cancelledDescription,
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCalendarAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          context.previousCalendarAppointments,
        );
      }
      if (context?.previousAllAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "all", session?.user?.id],
          context.previousAllAppointments,
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
      // Invalidate all appointment-related queries
      queryClient.invalidateQueries({
        queryKey: ["appointments", "list"],
      });
    },
  });
};
