import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAppointment } from "@/features/appointments/actions/delete-appointment";

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data, error } = await deleteAppointment(appointmentId);

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: () => {
      toast.success("Appointment deleted successfully 🎉");
    },
    onError: () => {
      toast.error("Failed to delete appointment 😢");
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
