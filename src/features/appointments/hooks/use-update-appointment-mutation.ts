import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAppointment } from "@/features/appointments/actions/update-appointment";
import type {
  UpdateAppointmentValues,
  Appointment,
} from "@/features/appointments/types";
import { optimisticSet, rollback } from "./optimistic-helpers";

export const useUpdateAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateAppointmentValues) => {
      const { error } = await updateAppointment(values);
      if (error) return Promise.reject(error);
      return { ...values };
    },
    onMutate: async (updatedAppointment) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      await queryClient.cancelQueries({
        queryKey: ["appointments", "incoming"],
      });

      const prevAppointments = optimisticSet<Appointment>(
        queryClient,
        ["appointments"],
        (old) =>
          old.map((a) =>
            a.id === updatedAppointment.id
              ? { ...a, ...updatedAppointment }
              : a,
          ),
      );
      type IncomingAppointment = {
        appointment: UpdateAppointmentValues;
        patient: {
          name: string;
          identificationNumber: string;
          email: string;
        };
      };
      let prevIncoming: IncomingAppointment[] = [];
      if (
        updatedAppointment.status === "booked" &&
        updatedAppointment.patientIdentificationNumber
      ) {
        const incomingList =
          queryClient.getQueryData<IncomingAppointment[]>([
            "appointments",
            "incoming",
          ]) || [];
        const exists = incomingList.some(
          (a) => a.appointment.id === updatedAppointment.id,
        );
        if (exists) {
          prevIncoming = optimisticSet<IncomingAppointment>(
            queryClient,
            ["appointments", "incoming"],
            (old) =>
              old.map((a) =>
                a.appointment.id === updatedAppointment.id
                  ? {
                      ...a,
                      appointment: { ...a.appointment, ...updatedAppointment },
                      patient: {
                        ...a.patient,
                        identificationNumber:
                          updatedAppointment.patientIdentificationNumber || "",
                      },
                    }
                  : a,
              ),
          );
        } else {
          prevIncoming = optimisticSet<IncomingAppointment>(
            queryClient,
            ["appointments", "incoming"],
            (old) => [
              ...old,
              {
                appointment: { ...updatedAppointment },
                patient: {
                  name: "",
                  identificationNumber:
                    updatedAppointment.patientIdentificationNumber || "",
                  email: "",
                },
              },
            ],
          );
        }
      } else {
        prevIncoming = optimisticSet<IncomingAppointment>(
          queryClient,
          ["appointments", "incoming"],
          (old) =>
            old.filter((a) => a.appointment.id !== updatedAppointment.id),
        );
      }
      return { prevAppointments, prevIncoming };
    },
    onError: (_err, _updatedAppointment, ctx) => {
      rollback(queryClient, ["appointments"], ctx?.prevAppointments ?? []);
      rollback(
        queryClient,
        ["appointments", "incoming"],
        ctx?.prevIncoming ?? [],
      );
    },
    onSuccess: () => {
      toast.success("Appointment updated successfully 🎉");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });
      queryClient.invalidateQueries({
        queryKey: ["appointments", variables.id],
      });
    },
  });
};
