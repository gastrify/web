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
  IncomingAppointment,
} from "@/features/appointments/types";
import {
  optimisticAdd,
  optimisticRemove,
  optimisticUpdate,
} from "@/features/appointments/utils/optimistic-helpers";

interface Props {
  form: UseFormReturn<UpdateAppointmentValues>;
}

export const useUpdateAppointmentMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: UpdateAppointmentValues) => {
      const { data, error } = await updateAppointment(variables);

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: async (data, variables) => {
      //check if data is an available appointment
      if ("id" in data && variables.status === "available") {
        optimisticUpdate<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          (calendarAppointment) => calendarAppointment.id === data.id,
          (calendarAppointment) => ({
            ...calendarAppointment,
            title: "available",
            color: "emerald",
          }),
        );

        optimisticRemove<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          (incomingAppointment) =>
            incomingAppointment.appointment.id === data.id,
        );
      }

      //check if data is an incoming appointment
      if (
        "patient" in data &&
        variables.status === "booked" &&
        variables.patientIdentificationNumber
      ) {
        optimisticUpdate<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          (calendarAppointment) =>
            calendarAppointment.id === data.appointment.id,
          (calendarAppointment) => ({
            ...calendarAppointment,
            title: "booked",
            color: "sky",
          }),
        );

        optimisticAdd<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          {
            appointment: data.appointment,
            patient: data.patient,
          },
        );
      }

      toast.success("Appointment updated successfully 🎉");
    },
    onError: (error: ActionError<UpdateAppointmentErrorCode>) => {
      console.log(error);

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
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", "details", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", "list", "incoming"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", "list", "calendar"],
      });
    },
  });
};
