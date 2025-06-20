import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ActionError } from "@/shared/types";
import { useSession } from "@/shared/hooks/use-session";

import {
  createAppointment,
  type CreateAppointmentErrorCode,
} from "@/features/appointments/actions/create-appointment";
import type {
  CreateAppointmentValues,
  CalendarEvent,
  IncomingAppointment,
} from "@/features/appointments/types";
import {
  optimisticAdd,
  rollback,
} from "@/features/appointments/utils/optimistic-helpers";

interface Props {
  form: UseFormReturn<CreateAppointmentValues>;
}

export const useCreateAppointmentMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (variables: CreateAppointmentValues) => {
      const { data, error } = await createAppointment(variables);

      if (error) return Promise.reject(error);

      return data;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list"],
      });

      // Create optimistic data
      const optimisticAppointment: CalendarEvent = {
        id: `temp-${Date.now()}`, // Temporary ID
        title: variables.status === "available" ? "available" : "booked",
        start: variables.start,
        end: variables.end,
        color: variables.status === "available" ? "emerald" : "sky",
      };

      // Add to all appointments query (with user ID)
      const previousAllAppointments = optimisticAdd<CalendarEvent>(
        queryClient,
        ["appointments", "list", "all", session?.user?.id],
        optimisticAppointment,
      );

      // Add to calendar query
      const previousCalendarAppointments = optimisticAdd<CalendarEvent>(
        queryClient,
        ["appointments", "list", "calendar"],
        optimisticAppointment,
      );

      // Add to incoming appointments if it's a booked appointment
      let previousIncomingAppointments: IncomingAppointment[] = [];
      if (
        variables.status === "booked" &&
        variables.patientIdentificationNumber
      ) {
        const optimisticIncoming: IncomingAppointment = {
          appointment: {
            id: optimisticAppointment.id,
            start: variables.start,
            end: variables.end,
            status: "booked",
            patientId: variables.patientIdentificationNumber,
            type: variables.type || "in-person",
            meetingLink: null,
            location: null,
            createdAt: new Date(),
          },
          patient: {
            name: "Cargando...",
            identificationNumber: variables.patientIdentificationNumber,
            email: "cargando@example.com",
          },
        };

        previousIncomingAppointments = optimisticAdd<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          optimisticIncoming,
        );
      }

      return {
        previousAllAppointments,
        previousCalendarAppointments,
        previousIncomingAppointments,
        optimisticAppointment,
      };
    },
    onSuccess: async (data, variables, context) => {
      // Update the temporary ID with the real ID from the server
      if (context?.optimisticAppointment) {
        let realId = context.optimisticAppointment.id;

        // Check if data has an id property (for available appointments)
        if ("id" in data && data.id) {
          realId = data.id;
        }
        // Check if data has an appointment property (for booked appointments)
        else if ("appointment" in data && data.appointment?.id) {
          realId = data.appointment.id;
        }

        const realAppointment: CalendarEvent = {
          id: realId,
          title: variables.status === "available" ? "available" : "booked",
          start: variables.start,
          end: variables.end,
          color: variables.status === "available" ? "emerald" : "sky",
        };

        // Update the optimistic data with real data
        queryClient.setQueryData<CalendarEvent[]>(
          ["appointments", "list", "all", session?.user?.id],
          (old) =>
            old?.map((item) =>
              item.id === context.optimisticAppointment.id
                ? realAppointment
                : item,
            ) || [],
        );

        queryClient.setQueryData<CalendarEvent[]>(
          ["appointments", "list", "calendar"],
          (old) =>
            old?.map((item) =>
              item.id === context.optimisticAppointment.id
                ? realAppointment
                : item,
            ) || [],
        );
      }

      toast.success("Appointment created successfully 🎉");
    },
    onError: (
      error: ActionError<CreateAppointmentErrorCode>,
      variables,
      context,
    ) => {
      // Rollback optimistic updates
      if (context?.previousAllAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "all", session?.user?.id],
          context.previousAllAppointments,
        );
      }

      if (context?.previousCalendarAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          context.previousCalendarAppointments,
        );
      }

      if (context?.previousIncomingAppointments) {
        rollback<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          context.previousIncomingAppointments,
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
    onSettled: () => {
      // Invalidate all appointment-related queries
      queryClient.invalidateQueries({
        queryKey: ["appointments", "list"],
      });
    },
  });
};
