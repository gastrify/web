import type { CalendarEvent } from "@/features/appointments/types";

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: CalendarEvent): boolean {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return eventStart.getDate() !== eventEnd.getDate();
}
