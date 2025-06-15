import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAppointment } from "@/features/appointments/actions/delete-appointment";
import { optimisticSet, rollback } from "./optimistic-helpers";
import type { Appointment } from "@/features/appointments/types";

type IncomingAppointment = { appointment: { id: string } };

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await deleteAppointment(appointmentId);
      if (error) return Promise.reject(error);
    },
    onMutate: async (appointmentId: string) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      await queryClient.cancelQueries({
        queryKey: ["appointments", "incoming"],
      });

      const prevAppointments = optimisticSet<Appointment>(
        queryClient,
        ["appointments"],
        (old) => old.filter((a) => a.id !== appointmentId),
      );
      const prevIncoming = optimisticSet<IncomingAppointment>(
        queryClient,
        ["appointments", "incoming"],
        (old) => old.filter((a) => a.appointment.id !== appointmentId),
      );

      return { prevAppointments, prevIncoming };
    },
    onError: (_err, _appointmentId, ctx) => {
      rollback(queryClient, ["appointments"], ctx?.prevAppointments ?? []);
      rollback(
        queryClient,
        ["appointments", "incoming"],
        ctx?.prevIncoming ?? [],
      );
    },
    onSuccess: () => {
      toast.success("Appointment deleted successfully 🎉");
    },
    onSettled: (_data, _error, appointmentId) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });
      queryClient.invalidateQueries({
        queryKey: ["appointments", appointmentId],
      });
    },
  });
};
