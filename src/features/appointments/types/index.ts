import type { z } from "zod";

import { appointment } from "@/shared/lib/drizzle/schema";

import { createAppointmentSchema } from "@/features/appointments/schemas/create-appointment-schema";
import { bookAppointmentSchema } from "@/features/appointments/schemas/book-appointment-schema";
import { updateAppointmentSchema } from "@/features/appointments/schemas/update-appointment-schema";

export type CalendarView = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: EventColor;
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";

export type Appointment = typeof appointment.$inferSelect;
export type CreateAppointmentValues = z.infer<typeof createAppointmentSchema>;
export type BookAppointmentValues = z.infer<typeof bookAppointmentSchema>;
export type UpdateAppointmentValues = z.infer<typeof updateAppointmentSchema>;

export interface IncomingAppointment {
  appointment: Appointment;
  patient: {
    name: string;
    identificationNumber: string;
    email: string;
  };
}
