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
} from "@/features/appointments/types";

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
    onMutate: async (appointmentValues) => {
      if (appointmentValues.status !== "available") {
        return;
      }

      await queryClient.cancelQueries({ queryKey: ["appointments"] });

      const previousAppointments = queryClient.getQueryData<CalendarEvent[]>([
        "appointments",
      ]);

      queryClient.setQueryData<CalendarEvent[]>(
        ["appointments"],
        (oldAppointments) => {
          if (!oldAppointments) return [];

          const optimisticEvent: CalendarEvent = {
            id: `temp-${Date.now()}`,
            title: "available",
            start: appointmentValues.start,
            end: appointmentValues.end,
            color: "emerald" as const,
          };

          return [...oldAppointments, optimisticEvent];
        },
      );

      return { previousAppointments };
    },
    onError: (
      error: ActionError<CreateAppointmentErrorCode>,
      appointmentValues,
      context,
    ) => {
      if (
        context?.previousAppointments &&
        appointmentValues.status === "available"
      ) {
        queryClient.setQueryData(
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
          toast.error("Something went wrong creating appointment 😢", {
            description: "Please try again later",
          });
      }
    },
    onSuccess: (createdAppointmentData, appointmentValues) => {
      toast.success("Appointment created successfully 🎉");

      queryClient.setQueryData<CalendarEvent[]>(
        ["appointments"],
        (oldAppointments) => {
          if (!oldAppointments) return [];

          if (
            appointmentValues.status === "available" &&
            createdAppointmentData?.id
          ) {
            return oldAppointments.map((event) => {
              if (
                event.id.startsWith("temp-") &&
                event.start.getTime() === appointmentValues.start.getTime() &&
                event.end.getTime() === appointmentValues.end.getTime()
              ) {
                return {
                  ...event,
                  id: createdAppointmentData.id,
                };
              }
              return event;
            });
          }

          const newEvent: CalendarEvent = {
            id: createdAppointmentData.id,
            title: appointmentValues.status,
            start: appointmentValues.start,
            end: appointmentValues.end,
            color: appointmentValues.status === "available" ? "emerald" : "sky",
          };

          return [...oldAppointments, newEvent];
        },
      );

      form.reset();
    },
    onSettled: (data, error, appointmentValues) => {
      if (appointmentValues.status === "booked") {
        queryClient.invalidateQueries({
          queryKey: ["appointments", "incoming"],
        });
      }

      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["appointments", data.id],
        });
      }
    },
  });
};
