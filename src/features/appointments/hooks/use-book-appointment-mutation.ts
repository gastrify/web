import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { bookAppointment } from "@/features/appointments/actions/book-appointment";
import type {
  Appointment,
  BookAppointmentValues,
  CalendarEvent,
} from "@/features/appointments/types";
import {
  optimisticAdd,
  optimisticSet,
  rollback,
} from "@/features/appointments/utils/optimistic-helpers";
import { useSession } from "@/shared/hooks/use-session";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";

export const useBookAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { success } = useAppointmentsTranslations();

  return useMutation({
    mutationFn: async (variables: BookAppointmentValues) => {
      const { error } = await bookAppointment(variables);

      if (error) return Promise.reject(error);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["appointments", "list"],
      });

      let bookedCalendarAppointment: CalendarEvent = {} as CalendarEvent;

      const previousCalendarAppointments = optimisticSet<CalendarEvent>(
        queryClient,
        ["appointments", "list", "calendar"],
        (oldCalendarAppointments) =>
          oldCalendarAppointments.map((calendarAppointment) => {
            if (calendarAppointment.id === variables.appointmentId) {
              bookedCalendarAppointment = {
                ...calendarAppointment,
                title: "booked",
                color: "sky",
              };

              return bookedCalendarAppointment;
            }

            return calendarAppointment;
          }),
      );

      const previousAllAppointments = optimisticSet<CalendarEvent>(
        queryClient,
        ["appointments", "list", "all", session?.user?.id],
        (oldCalendarAppointments) =>
          oldCalendarAppointments.map((calendarAppointment) => {
            if (calendarAppointment.id === variables.appointmentId) {
              return {
                ...calendarAppointment,
                title: "booked",
                color: "sky",
              };
            }

            return calendarAppointment;
          }),
      );

      const previousUserAppointments = optimisticAdd<Appointment>(
        queryClient,
        ["appointments", "list", "user", variables.patientId],
        {
          id: variables.appointmentId,
          start: bookedCalendarAppointment.start,
          end: bookedCalendarAppointment.end,
          status: "booked",
          patientId: variables.patientId,
          type: variables.appointmentType,
          location: null,
          meetingLink: null,
          createdAt: new Date(),
        },
      );

      return {
        previousCalendarAppointments,
        previousAllAppointments,
        previousUserAppointments,
      };
    },
    onSuccess: () => {
      toast.success(success.bookedSuccessfully, {
        description: success.bookedDescription,
      });
    },
    onError: (_error, variables, context) => {
      if (context?.previousCalendarAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "calendar"],
          context.previousCalendarAppointments,
        );
      }

      if (context?.previousAllAppointments) {
        rollback<CalendarEvent>(
          queryClient,
          ["appointments", "list", "all", session?.user?.id],
          context.previousAllAppointments,
        );
      }

      if (context?.previousUserAppointments) {
        rollback<Appointment>(
          queryClient,
          ["appointments", "list", "user", variables.patientId],
          context.previousUserAppointments,
        );
      }

      toast.error("Failed to book appointment 😢", {
        description: "Please try again later",
      });
    },
    onSettled: () => {
      // Invalidate all appointment-related queries
      queryClient.invalidateQueries({
        queryKey: ["appointments", "list"],
      });
    },
  });
};
