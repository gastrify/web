import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelAppointment } from "@/features/appointments/actions/cancel-appointment";
import { useSession } from "@/shared/hooks/use-session";
import type { CalendarEvent } from "@/features/appointments/types";
import {
  optimisticSet,
  rollback,
} from "@/features/appointments/hooks/optimistic-helpers";

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await cancelAppointment(appointmentId);

      if (error) return Promise.reject(error);
    },
    onMutate: async (appointmentId) => {
      if (!session?.user?.id) {
        throw new Error("User session not available");
      }

      const userId = session.user.id;

      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      await queryClient.cancelQueries({
        queryKey: ["appointments", userId],
      });

      const previousAppointments = optimisticSet<CalendarEvent>(
        queryClient,
        ["appointments"],
        (oldAppointments) => {
          return oldAppointments.map((appointment) => {
            if (appointment.id === appointmentId) {
              return {
                ...appointment,
                title: "available",
                color: "emerald" as const,
              };
            }
            return appointment;
          });
        },
      );

      const previousUserAppointments = optimisticSet<CalendarEvent>(
        queryClient,
        ["appointments", userId],
        (oldUserAppointments) => {
          return oldUserAppointments.filter(
            (appointment) => appointment.id !== appointmentId,
          );
        },
      );

      return { previousAppointments, previousUserAppointments, userId };
    },
    onError: (_error, _appointmentId, context) => {
      if (context?.previousAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments"],
          context.previousAppointments,
        );
      }
      if (context?.previousUserAppointments && context?.userId) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", context.userId],
          context.previousUserAppointments,
        );
      }

      toast.error("Failed to cancel appointment 😢", {
        description: "Please try again later",
      });
    },
    onSuccess: () => {
      toast.success("Appointment cancelled successfully 🎉");
    },
    onSettled: (data, error, appointmentId, context) => {
      if (!context?.userId) return;

      queryClient.invalidateQueries({
        queryKey: ["appointments", context.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", appointmentId],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments"],
        exact: true,
      });
    },
  });
};
