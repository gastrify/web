import { addDays, addHours, setHours, setMinutes } from "date-fns";
import type { CalendarEvent } from "./types";

// Helper function to create a date with specific time
const createDate = (date: Date, hours: number, minutes: number) => {
  return setMinutes(setHours(date, hours), minutes);
};

// Get today's date
const today = new Date();

// Create mock events
export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Morning Check-up",
    description: "Regular health check-up appointment",
    start: createDate(today, 9, 0),
    end: createDate(today, 10, 0),
    allDay: false,
    color: "sky",
    location: "Room 101",
    type: "in-person",
    userId: "user1",
    doctorId: "doctor1",
    status: "booked",
  },
  {
    id: "2",
    title: "Virtual Consultation",
    description: "Online consultation with Dr. Smith",
    start: createDate(today, 14, 30),
    end: createDate(today, 15, 30),
    allDay: false,
    color: "violet",
    type: "virtual",
    userId: "user2",
    doctorId: "doctor1",
    meetingLink: "https://meet.example.com/123",
    status: "booked",
  },
  {
    id: "3",
    title: "Available Slot",
    description: "Open appointment slot",
    start: createDate(addDays(today, 1), 11, 0),
    end: createDate(addDays(today, 1), 12, 0),
    allDay: false,
    color: "emerald",
    location: "Room 102",
    type: "in-person",
    userId: "doctor1",
    doctorId: "doctor1",
    status: "available",
  },
  {
    id: "4",
    title: "Follow-up Appointment",
    description: "Post-treatment follow-up",
    start: createDate(addDays(today, 2), 15, 0),
    end: createDate(addDays(today, 2), 16, 0),
    allDay: false,
    color: "rose",
    location: "Room 103",
    type: "in-person",
    userId: "user3",
    doctorId: "doctor1",
    status: "booked",
  },
  {
    id: "5",
    title: "All Day Conference",
    description: "Medical conference",
    start: createDate(addDays(today, 3), 0, 0),
    end: createDate(addDays(today, 3), 23, 59),
    allDay: true,
    color: "orange",
    location: "Conference Hall",
    type: "in-person",
    userId: "doctor1",
    doctorId: "doctor1",
    status: "booked",
  },
  {
    id: "6",
    title: "Available Morning Slot",
    description: "Open morning appointment",
    start: createDate(addDays(today, 4), 9, 0),
    end: createDate(addDays(today, 4), 10, 0),
    allDay: false,
    color: "amber",
    location: "Room 101",
    type: "in-person",
    userId: "doctor1",
    doctorId: "doctor1",
    status: "available",
  },
];
