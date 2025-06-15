import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelAppointment } from "@/features/appointments/actions/cancel-appointment";
import { useSession } from "@/shared/hooks/use-session";
import { optimisticSet, rollback } from "./optimistic-helpers";

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await cancelAppointment(appointmentId);
      if (error) throw error;
    },
    onMutate: async (appointmentId: string) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });

      const prevAppointments = optimisticSet(
        queryClient,
        ["appointments"],
        (old) => old.filter((a) => a.id !== appointmentId),
      );
      const prevUserAppointments = optimisticSet(
        queryClient,
        ["appointments", session?.user.id],
        (old) => old.filter((a) => a.id !== appointmentId),
      );
      const prevIncoming = optimisticSet(
        queryClient,
        ["appointments", "incoming"],
        (old) => old.filter((a) => a.appointment.id !== appointmentId),
      );

      return { prevAppointments, prevUserAppointments, prevIncoming };
    },
    onError: (_err, _appointmentId, ctx) => {
      rollback(queryClient, ["appointments"], ctx?.prevAppointments);
      rollback(
        queryClient,
        ["appointments", session?.user.id],
        ctx?.prevUserAppointments,
      );
      rollback(queryClient, ["appointments", "incoming"], ctx?.prevIncoming);
    },
    onSuccess: () => {
      toast.success("Appointment cancelled successfully 🎉");
    },
    onSettled: (_data, _error, appointmentId) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointments", session?.user.id],
      });
      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });
      queryClient.invalidateQueries({
        queryKey: ["appointments", appointmentId],
      });
    },
  });
};
