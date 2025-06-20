import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ActionError } from "@/shared/types";
import { useSession } from "@/shared/hooks/use-session";

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
  rollback,
} from "@/features/appointments/utils/optimistic-helpers";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";

interface Props {
  form: UseFormReturn<UpdateAppointmentValues>;
}

export const useUpdateAppointmentMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { success } = useAppointmentsTranslations();

  return useMutation({
    mutationFn: async (variables: UpdateAppointmentValues) => {
      const { data, error } = await updateAppointment(variables);

      if (error) return Promise.reject(error);

      return data;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list"],
      });

      // Store previous data for rollback
      const previousAllAppointments =
        queryClient.getQueryData<CalendarEvent[]>([
          "appointments",
          "list",
          "all",
          session?.user?.id,
        ]) || [];
      const previousCalendarAppointments =
        queryClient.getQueryData<CalendarEvent[]>([
          "appointments",
          "list",
          "calendar",
        ]) || [];
      const previousIncomingAppointments =
        queryClient.getQueryData<IncomingAppointment[]>([
          "appointments",
          "list",
          "incoming",
        ]) || [];

      // Update optimistically based on status
      if (variables.status === "available") {
        // Update to available
        optimisticUpdate<CalendarEvent>(
          queryClient,
          ["appointments", "list", "all", session?.user?.id],
          (calendarAppointment) => calendarAppointment.id === variables.id,
          (calendarAppointment) => ({
            ...calendarAppointment,
            title: "available",
            color: "emerald",
            start: variables.start,
            end: variables.end,
          }),
        );

        optimisticUpdate<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          (calendarAppointment) => calendarAppointment.id === variables.id,
          (calendarAppointment) => ({
            ...calendarAppointment,
            title: "available",
            color: "emerald",
            start: variables.start,
            end: variables.end,
          }),
        );

        // Remove from incoming appointments
        optimisticRemove<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          (incomingAppointment) =>
            incomingAppointment.appointment.id === variables.id,
        );
      } else if (
        variables.status === "booked" &&
        variables.patientIdentificationNumber
      ) {
        // Update to booked
        const isAdmin = session?.user?.role === "admin";
        optimisticUpdate<CalendarEvent>(
          queryClient,
          ["appointments", "list", "all", session?.user?.id],
          (calendarAppointment) => calendarAppointment.id === variables.id,
          (calendarAppointment) => ({
            ...calendarAppointment,
            title: isAdmin ? "Cita Reservada" : "Reservado",
            color: "sky",
            start: variables.start,
            end: variables.end,
          }),
        );

        optimisticUpdate<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          (calendarAppointment) => calendarAppointment.id === variables.id,
          (calendarAppointment) => ({
            ...calendarAppointment,
            title: "booked",
            color: "sky",
            start: variables.start,
            end: variables.end,
          }),
        );

        // Add to incoming appointments
        const optimisticIncoming: IncomingAppointment = {
          appointment: {
            id: variables.id,
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

        optimisticAdd<IncomingAppointment>(
          queryClient,
          ["appointments", "list", "incoming"],
          optimisticIncoming,
        );
      }

      return {
        previousAllAppointments,
        previousCalendarAppointments,
        previousIncomingAppointments,
      };
    },
    onSuccess: () => {
      toast.success(success.updatedSuccessfully);
    },
    onError: (
      error: ActionError<UpdateAppointmentErrorCode>,
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
          toast.error("Something went wrong updating appointment 😢", {
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
