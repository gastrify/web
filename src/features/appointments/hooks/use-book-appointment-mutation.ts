import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { bookAppointment } from "@/features/appointments/actions/book-appointment";
import type { BookAppointmentValues } from "@/features/appointments/types";

export const useBookAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: BookAppointmentValues) => {
      const { error } = await bookAppointment({
        appointmentId: values.appointmentId,
        patientId: values.patientId,
        appointmentType: values.appointmentType,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Appointment booked successfully 🎉");
    },
    onError: () => {
      toast.error("Failed to book appointment 😢", {
        description: "Please try again later",
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointments", variables.patientId],
      });
    },
  });
};
