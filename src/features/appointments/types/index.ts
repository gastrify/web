export type CalendarView = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor;
  location?: string;
  appointmentStatus: "available" | "reserved";
  patientIdentificationNumber?: string;
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";
