import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ActionError } from "@/shared/types";

import {
  createAppointment,
  type CreateAppointmentErrorCode,
} from "@/features/appointments/actions/create-appointment";
import type {
  CreateAppointmentValues,
  CalendarEvent,
  IncomingAppointment,
} from "@/features/appointments/types";
import { optimisticAdd } from "@/features/appointments/utils/optimistic-helpers";

interface Props {
  form: UseFormReturn<CreateAppointmentValues>;
}

export const useCreateAppointmentMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: CreateAppointmentValues) => {
      const { data, error } = await createAppointment(variables);

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: async (data, variables) => {
      //check if data is an incoming appointment
      if (
        "patient" in data &&
        variables.status === "booked" &&
        variables.patientIdentificationNumber
      ) {
        optimisticAdd<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          {
            appointment: data.appointment,
            patient: data.patient,
          },
        );

        optimisticAdd<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          {
            id: data.appointment.id,
            title: "booked",
            start: data.appointment.start,
            end: data.appointment.end,
            color: "sky",
          },
        );
      }

      //check if data is an available appointment
      if ("id" in data && variables.status === "available") {
        optimisticAdd<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          {
            id: data.id,
            title: "available",
            start: variables.start,
            end: variables.end,
            color: "emerald",
          },
        );
      }

      toast.success("Appointment created successfully 🎉");
    },
    onError: (error: ActionError<CreateAppointmentErrorCode>) => {
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
          toast.error("Something went wrong creating appointment 😢", {
            description: "Please try again later",
          });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", "list", "incoming"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", "list", "calendar"],
      });
    },
  });
};
