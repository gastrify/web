"use client";

import { useState } from "react";

import { EventCalendar } from "@/features/appointments/components/event-calendar";
import type { CalendarEvent } from "@/features/appointments/types";

//TODO: Remove this
import { mockEvents } from "../mock-events";

export function Appointments() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <EventCalendar
      initialView="week"
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
}
