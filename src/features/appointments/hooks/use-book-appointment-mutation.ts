import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookAppointment } from "@/features/appointments/actions/book-appointment";
import type {
  BookAppointmentValues,
  Appointment,
} from "@/features/appointments/types";
import { optimisticSet, rollback } from "./optimistic-helpers";

export const useBookAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: BookAppointmentValues) => {
      const { error } = await bookAppointment(values);
      if (error) throw error;
    },
    onMutate: async (values: BookAppointmentValues) => {
      const appointments =
        queryClient.getQueryData<Appointment[]>(["appointments"]) || [];
      const appointment = appointments.find(
        (a) => a.id === values.appointmentId,
      );

      if (!appointment || new Date(appointment.start) < new Date()) {
        toast.error("No puedes reservar una cita anterior al momento actual.");
        return;
      }

      await queryClient.cancelQueries({ queryKey: ["appointments"] });

      const prevAppointments = optimisticSet<Appointment>(
        queryClient,
        ["appointments"],
        (old) =>
          old.map((a) =>
            a.id === values.appointmentId ? { ...a, status: "booked" } : a,
          ),
      );

      const prevUserAppointments = optimisticSet(
        queryClient,
        ["appointments", values.patientId],
        (old) => [
          ...old,
          {
            ...appointment,
            status: "booked",
            type: values.appointmentType,
            patientId: values.patientId,
          },
        ],
      );

      const prevIncoming = optimisticSet(
        queryClient,
        ["appointments", "incoming"],
        (old) => [
          ...old,
          {
            appointment: {
              ...appointment,
              status: "booked",
              type: values.appointmentType,
              patientId: values.patientId,
            },
            patient: {
              name: "",
              identificationNumber: "",
              email: "",
            },
          },
        ],
      );
      return { prevAppointments, prevUserAppointments, prevIncoming };
    },
    onError: (_error, values, ctx) => {
      rollback(queryClient, ["appointments"], ctx?.prevAppointments ?? []);
      rollback(
        queryClient,
        ["appointments", values.patientId],
        ctx?.prevUserAppointments ?? [],
      );
      rollback(
        queryClient,
        ["appointments", "incoming"],
        ctx?.prevIncoming ?? [],
      );
    },
    onSuccess: () => {
      toast.success("Appointment booked successfully 🎉");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if (variables?.patientId) {
        queryClient.invalidateQueries({
          queryKey: ["appointments", variables.patientId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });
    },
  });
};
