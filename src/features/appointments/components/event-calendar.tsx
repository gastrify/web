"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { RiCalendarCheckLine } from "@remixicon/react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useIsAdmin } from "@/shared/hooks/is-admin";

import {
  AgendaDaysToShow,
  EventGap,
  EventHeight,
  WeekCellsHeight,
} from "@/features/appointments/constants";
import { AgendaView } from "@/features/appointments/components/agenda-view";
import { BookingDialog } from "@/features/appointments/components/booking-dialog";
import { DayView } from "@/features/appointments/components/day-view";
import { CreateEventDialog } from "@/features/appointments/components/create-event-dialog";
import { MonthView } from "@/features/appointments/components/month-view";
import { WeekView } from "@/features/appointments/components/week-view";
import { UpdateEventDialog } from "@/features/appointments/components/update-event-dialog";
import { CalendarDndProvider } from "@/features/appointments/providers/calendar-dnd-provider";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";
import { useDateConfig } from "@/features/appointments/lib/date-config";
import type {
  CalendarEvent,
  CalendarView,
} from "@/features/appointments/types";
import { addMinutesToDate } from "@/features/appointments/utils/add-minutes-to-date";

export interface EventCalendarProps {
  events?: CalendarEvent[];
  className?: string;
  initialView?: CalendarView;
}

export function EventCalendar({
  events = [],
  className,
  initialView = "month",
}: EventCalendarProps) {
  const { calendar, errors, shortcuts } = useAppointmentsTranslations();
  const { locale, weekStartsOn } = useDateConfig();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [createEventData, setCreateEventData] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const isAdmin = useIsAdmin();

  const isCreateEventDialogOpen = !!createEventData;
  const isUpdateEventDialogOpen = !!selectedEvent;

  // Add keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      // or if the event dialog is open
      if (
        isCreateEventDialogOpen ||
        isUpdateEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "w":
          setView("week");
          break;
        case "d":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCreateEventDialogOpen, isUpdateEventDialogOpen]);

  // Memoize navigation handlers
  const handlePrevious = useCallback(() => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  }, [currentDate, view]);

  const handleNext = useCallback(() => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  }, [currentDate, view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleEventSelect = useCallback(
    (event: CalendarEvent) => {
      if (!isAdmin && event.title !== "available") return;

      setSelectedEvent(event);
    },
    [isAdmin],
  );

  const handleEventCreate = useCallback(
    (startTime: Date) => {
      if (!isAdmin) return;

      // Snap to 15-minute intervals
      const minutes = startTime.getMinutes();
      const remainder = minutes % 15;
      if (remainder !== 0) {
        if (remainder < 7.5) {
          startTime.setMinutes(minutes - remainder);
        } else {
          startTime.setMinutes(minutes + (15 - remainder));
        }
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
      }

      setCreateEventData({
        start: startTime,
        end: addMinutesToDate(startTime, 15),
      });
    },
    [isAdmin],
  );

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    // Show toast notification when an event is updated via drag and drop
    toast.success(errors.eventMoved.replace("{{title}}", updatedEvent.title), {
      description: errors.eventMovedDescription.replace(
        "{{date}}",
        format(new Date(updatedEvent.start), "MMM d, yyyy"),
      ),
    });
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale });
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn });
      const end = endOfWeek(currentDate, { weekStartsOn });
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale });
      } else {
        return `${format(start, "MMM", { locale })} - ${format(end, "MMM yyyy", { locale })}`;
      }
    } else if (view === "day") {
      return (
        <>
          <span className="min-[480px]:hidden" aria-hidden="true">
            {format(currentDate, "MMM d, yyyy", { locale })}
          </span>
          <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, "MMMM d, yyyy", { locale })}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, "EEE MMMM d, yyyy", { locale })}
          </span>
        </>
      );
    } else if (view === "agenda") {
      // Show the month range for agenda view
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);

      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale });
      } else {
        return `${format(start, "MMM", { locale })} - ${format(end, "MMM yyyy", { locale })}`;
      }
    } else {
      return format(currentDate, "MMMM yyyy", { locale });
    }
  }, [currentDate, view, locale, weekStartsOn]);

  return (
    <div
      className="flex flex-col rounded-lg border has-data-[slot=month-view]:flex-1"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div
          className={cn(
            "flex items-center justify-between p-2 sm:p-4",
            className,
          )}
        >
          <div className="flex items-center gap-1 sm:gap-4">
            <Button
              variant="outline"
              className="aspect-square max-[479px]:p-0!"
              onClick={handleToday}
            >
              <RiCalendarCheckLine
                className="min-[480px]:hidden"
                size={16}
                aria-hidden="true"
              />
              <span className="max-[479px]:sr-only">{calendar.today}</span>
            </Button>
            <div className="flex items-center sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                aria-label={calendar.previous}
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                aria-label={calendar.next}
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </div>
            <h2 className="text-sm font-semibold sm:text-lg md:text-xl">
              {viewTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 max-[479px]:h-8">
                  <span>
                    <span className="min-[480px]:hidden" aria-hidden="true">
                      {view === "month"
                        ? shortcuts.month
                        : view === "week"
                          ? shortcuts.week
                          : view === "day"
                            ? shortcuts.day
                            : shortcuts.agenda}
                    </span>
                    <span className="max-[479px]:sr-only">
                      {view === "month"
                        ? calendar.month
                        : view === "week"
                          ? calendar.week
                          : view === "day"
                            ? calendar.day
                            : calendar.agenda}
                    </span>
                  </span>
                  <ChevronDownIcon
                    className="-me-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem onClick={() => setView("month")}>
                  {calendar.month}{" "}
                  <DropdownMenuShortcut>{shortcuts.month}</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("week")}>
                  {calendar.week}{" "}
                  <DropdownMenuShortcut>{shortcuts.week}</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("day")}>
                  {calendar.day}{" "}
                  <DropdownMenuShortcut>{shortcuts.day}</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("agenda")}>
                  {calendar.agenda}{" "}
                  <DropdownMenuShortcut>
                    {shortcuts.agenda}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isAdmin && (
              <Button
                className="aspect-square max-[479px]:p-0!"
                onClick={() => {
                  const today = new Date();

                  // Snap to 15-minute intervals
                  const minutes = today.getMinutes();
                  const remainder = minutes % 15;
                  if (remainder !== 0) {
                    if (remainder < 7.5) {
                      today.setMinutes(minutes - remainder);
                    } else {
                      today.setMinutes(minutes + (15 - remainder));
                    }
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                  }

                  setCreateEventData({
                    start: today,
                    end: addMinutesToDate(today, 15),
                  });
                }}
              >
                <PlusIcon
                  className="opacity-60 sm:-ms-1"
                  size={16}
                  aria-hidden="true"
                />
                <span className="max-sm:sr-only">
                  {calendar.newAppointment}
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "agenda" && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )}
        </div>

        {isAdmin && createEventData && (
          <CreateEventDialog
            isOpen={isCreateEventDialogOpen}
            onClose={() => setCreateEventData(null)}
            data={createEventData}
          />
        )}

        {isAdmin && selectedEvent && (
          <UpdateEventDialog
            isOpen={isUpdateEventDialogOpen}
            onClose={() => setSelectedEvent(null)}
            event={selectedEvent}
          />
        )}

        {!isAdmin && selectedEvent && (
          <BookingDialog
            isOpen={isUpdateEventDialogOpen}
            onClose={() => setSelectedEvent(null)}
            event={selectedEvent}
          />
        )}
      </CalendarDndProvider>
    </div>
  );
}
