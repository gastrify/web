import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelAppointment } from "@/features/appointments/actions/cancel-appointment";
import { useSession } from "@/shared/hooks/use-session";

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();

  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await cancelAppointment(appointmentId);

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Appointment cancelled successfully 🎉");
    },
    onError: () => {
      toast.error("Failed to cancel appointment 😢", {
        description: "Please try again later",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointments", session?.user.id],
      });
    },
  });
};
