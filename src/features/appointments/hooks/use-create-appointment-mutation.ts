import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ActionError } from "@/shared/types";

import {
  createAppointment,
  type CreateAppointmentErrorCode,
} from "@/features/appointments/actions/create-appointment";
import type { CreateAppointmentValues } from "@/features/appointments/types";

interface Props {
  form: UseFormReturn<CreateAppointmentValues>;
}

export const useCreateAppointmentMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateAppointmentValues) => {
      const { data, error } = await createAppointment(values);

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });
    },
  });
};
