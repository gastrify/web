import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAppointment } from "@/features/appointments/actions/create-appointment";
import type { CreateAppointmentValues } from "@/features/appointments/types";
import { optimisticSet, rollback } from "./optimistic-helpers";

export const useCreateAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateAppointmentValues) => {
      const { data, error } = await createAppointment(values);
      if (error) return Promise.reject(error);
      return { ...values, id: data?.id ?? `temp-${Date.now()}` };
    },
    onMutate: async (newAppointment) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      await queryClient.cancelQueries({
        queryKey: ["appointments", "incoming"],
      });

      const prevAppointments = optimisticSet(
        queryClient,
        ["appointments"],
        (old) => [...old, { ...newAppointment, id: `temp-${Date.now()}` }],
      );
      let prevIncoming: {
        appointment: CreateAppointmentValues & { id: string };
        patient: { name: string; identificationNumber: string; email: string };
      }[] = [];
      if (
        newAppointment.status === "booked" &&
        newAppointment.patientIdentificationNumber
      ) {
        prevIncoming = optimisticSet(
          queryClient,
          ["appointments", "incoming"],
          (old) => [
            ...old,
            {
              appointment: { ...newAppointment, id: `temp-${Date.now()}` },
              patient: {
                name: "",
                identificationNumber:
                  newAppointment.patientIdentificationNumber,
                email: "",
              },
            },
          ],
        );
      }
      return { prevAppointments, prevIncoming };
    },
    onError: (_err, _newAppointment, ctx) => {
      rollback(queryClient, ["appointments"], ctx?.prevAppointments);
      rollback(queryClient, ["appointments", "incoming"], ctx?.prevIncoming);
    },
    onSuccess: () => {
      toast.success("Appointment created successfully 🎉");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });
    },
  });
};
