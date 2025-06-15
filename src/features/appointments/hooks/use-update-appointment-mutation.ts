import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ActionError } from "@/shared/types";

import {
  updateAppointment,
  type UpdateAppointmentErrorCode,
} from "@/features/appointments/actions/update-appointment";
import type {
  UpdateAppointmentValues,
  CalendarEvent,
} from "@/features/appointments/types";
import {
  optimisticSet,
  rollback,
} from "@/features/appointments/hooks/optimistic-helpers";

interface Props {
  form: UseFormReturn<UpdateAppointmentValues>;
}

export const useUpdateAppointmentMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateAppointmentValues) => {
      const { data, error } = await updateAppointment(values);

      if (error) return Promise.reject(error);

      return data;
    },
    onMutate: async (updatedAppointmentValues) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });

      const previousAppointments = optimisticSet<CalendarEvent>(
        queryClient,
        ["appointments"],
        (oldAppointments) => {
          const currentAppointment = oldAppointments.find(
            (apt) => apt.id === updatedAppointmentValues.id,
          );

          if (!currentAppointment) return oldAppointments;

          return oldAppointments.map((appointment) => {
            if (appointment.id === updatedAppointmentValues.id) {
              return {
                ...appointment,
                title: updatedAppointmentValues.status,
                start: updatedAppointmentValues.start,
                end: updatedAppointmentValues.end,
                color:
                  updatedAppointmentValues.status === "available"
                    ? "emerald"
                    : "sky",
              };
            }
            return appointment;
          });
        },
      );

      const currentAppointment = previousAppointments.find(
        (apt) => apt.id === updatedAppointmentValues.id,
      );

      const wasOptimisticUpdate =
        currentAppointment?.title === "booked" &&
        updatedAppointmentValues.status === "available";

      return { previousAppointments, wasOptimisticUpdate };
    },
    onError: (
      error: ActionError<UpdateAppointmentErrorCode>,
      updatedAppointmentValues,
      context,
    ) => {
      if (context?.previousAppointments && context.wasOptimisticUpdate) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments"],
          context.previousAppointments,
        );
      }

      switch (error.code) {
        case "CONFLICT":
          form.setError("start", {
            message:
              "An appointment already exists for this time. Please try a different one.",
          });
          form.setError("end", {
            message:
              "An appointment already exists for this time. Please try a different one.",
          });
          break;

        case "USER_NOT_FOUND":
          form.setError("patientIdentificationNumber", {
            message:
              "User not found, please try a different identification number",
          });
          break;

        default:
          toast.error("Something went wrong updating appointment 😢", {
            description: "Please try again later",
          });
      }
    },
    onSuccess: () => {
      toast.success("Appointment updated successfully 🎉");
    },
    onSettled: (_data, _error, appointmentVariables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", appointmentVariables.id],
      });

      const previousAppointments = queryClient.getQueryData<CalendarEvent[]>([
        "appointments",
      ]);
      const currentAppointment = previousAppointments?.find(
        (apt) => apt.id === appointmentVariables.id,
      );

      if (
        appointmentVariables.status === "booked" ||
        currentAppointment?.title === "booked"
      ) {
        queryClient.invalidateQueries({
          queryKey: ["appointments", "incoming"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["appointments"],
        exact: true,
      });
    },
  });
};
