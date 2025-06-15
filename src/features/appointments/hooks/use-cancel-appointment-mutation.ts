import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelAppointment } from "@/features/appointments/actions/cancel-appointment";
import { useSession } from "@/shared/hooks/use-session";
import type { CalendarEvent } from "@/features/appointments/types";

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await cancelAppointment(appointmentId);

      if (error) return Promise.reject(error);
    },
    onMutate: async (appointmentId) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      await queryClient.cancelQueries({
        queryKey: ["appointments", session?.user.id],
      });

      const previousAppointments = queryClient.getQueryData<CalendarEvent[]>([
        "appointments",
      ]);
      const previousUserAppointments = queryClient.getQueryData<
        CalendarEvent[]
      >(["appointments", session?.user.id]);

      queryClient.setQueryData<CalendarEvent[]>(
        ["appointments"],
        (oldAppointments) => {
          if (!oldAppointments) return [];

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

      queryClient.setQueryData<CalendarEvent[]>(
        ["appointments", session?.user.id],
        (oldUserAppointments) => {
          if (!oldUserAppointments) return [];
          return oldUserAppointments.filter(
            (appointment) => appointment.id !== appointmentId,
          );
        },
      );

      return { previousAppointments, previousUserAppointments };
    },
    onError: (_error, _appointmentId, context) => {
      if (context?.previousAppointments) {
        queryClient.setQueryData(
          ["appointments"],
          context.previousAppointments,
        );
      }
      if (context?.previousUserAppointments) {
        queryClient.setQueryData(
          ["appointments", session?.user.id],
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
    onSettled: (data, error, appointmentId) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", session?.user.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", appointmentId],
      });
    },
  });
};
