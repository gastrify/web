import { addDays, setHours, setMinutes, subDays } from "date-fns";

import type { CalendarEvent } from "@/features/appointments/types";

// Sample events data with hardcoded times
export const mockEvents: CalendarEvent[] = [
  {
    id: "2",
    title: "Project Deadline",
    description: "Submit final deliverables",
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0), // 1:00 PM, 9 days before
    end: setMinutes(setHours(subDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days before
    color: "amber",
    location: "Office",
    appointmentStatus: "available",
  },
  {
    id: "4",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(new Date(), 10), 0), // 10:00 AM today
    end: setMinutes(setHours(new Date(), 11), 0), // 11:00 AM today
    color: "sky",
    location: "Conference Room A",
    appointmentStatus: "available",
  },
  {
    id: "5",
    title: "Lunch with Client",
    description: "Discuss new project requirements",
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0), // 12:00 PM, 1 day from now
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 15), // 1:15 PM, 1 day from now
    color: "emerald",
    location: "Downtown Cafe",
    appointmentStatus: "available",
  },
  {
    id: "8",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 0), // 9:00 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 10), 30), // 10:30 AM, 5 days from now
    color: "orange",
    location: "Conference Room A",
    appointmentStatus: "available",
  },
  {
    id: "9",
    title: "Review contracts",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 14), 0), // 2:00 PM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 15), 30), // 3:30 PM, 5 days from now
    color: "sky",
    location: "Conference Room A",
    appointmentStatus: "available",
  },
  {
    id: "10",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 45), // 9:45 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 11), 0), // 11:00 AM, 5 days from now
    color: "amber",
    location: "Conference Room A",
    appointmentStatus: "available",
  },
  {
    id: "11",
    title: "Marketing Strategy Session",
    description: "Quarterly marketing planning",
    start: setMinutes(setHours(addDays(new Date(), 9), 10), 0), // 10:00 AM, 9 days from now
    end: setMinutes(setHours(addDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days from now
    color: "emerald",
    location: "Marketing Department",
    appointmentStatus: "available",
  },
  {
    id: "13",
    title: "Product Development Workshop",
    description: "Brainstorming for new features",
    start: setMinutes(setHours(addDays(new Date(), 26), 9), 0), // 9:00 AM, 26 days from now
    end: setMinutes(setHours(addDays(new Date(), 27), 17), 0), // 5:00 PM, 27 days from now
    color: "rose",
    location: "Innovation Lab",
    appointmentStatus: "available",
  },
];
