"use client";

import { useMemo, useState } from "react";

import { EventCalendar } from "@/features/appointments/components/event-calendar";
import { mockEvents } from "@/features/appointments/mock-events";
import { type CalendarEvent } from "@/features/appointments/types";
import { useIsAdmin } from "@/shared/hooks/is-admin";
import { useSession } from "@/shared/hooks/use-session";
import { EventDialog } from "@/features/appointments/components/event-dialog";
import { BookingDialog } from "@/features/appointments/components/booking-dialog";

export default function BigCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const { data: session } = useSession();

  // Filter events based on user type and availability
  const filteredEvents = useMemo(() => {
    if (isAdmin) {
      // Admins can see all events
      return events;
    }

    // Regular users can only see:
    // 1. Available slots
    // 2. Their own booked appointments
    return events.filter(
      (event) =>
        event.status === "available" ||
        (event.status === "booked" && event.userId === session?.user.id),
    );
  }, [events, isAdmin, session?.user.id]);

  const handleEventSelect = (event: CalendarEvent) => {
    console.log("Selected event", event);
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <EventCalendar
        events={filteredEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        onEventSelect={handleEventSelect}
      />

      {isAdmin ? (
        <EventDialog
          event={selectedEvent}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSave={handleEventUpdate}
          onDelete={handleEventDelete}
        />
      ) : (
        <BookingDialog
          event={selectedEvent}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onBook={handleEventUpdate}
        />
      )}
    </>
  );
}
