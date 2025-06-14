import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ActionError } from "@/shared/types";

import {
  updateAppointment,
  type UpdateAppointmentErrorCode,
} from "@/features/appointments/actions/update-appointment";
import type { UpdateAppointmentValues } from "@/features/appointments/types";

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
    onSuccess: () => {
      toast.success("Appointment updated successfully 🎉");
    },
    onError: (error: ActionError<UpdateAppointmentErrorCode>) => {
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
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "incoming"] });
      queryClient.invalidateQueries({
        queryKey: ["appointments", variables.id],
      });
    },
  });
};
