"use server";

import { headers } from "next/headers";
import { gte, sql } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import type { CalendarEvent, EventColor } from "@/features/appointments/types";

type ErrorCode = "UNAUTHENTICATED" | "SERVER_ERROR" | "NOT_FOUND";

export async function getAllAppointments(): Promise<
  ActionResponse<CalendarEvent[], ErrorCode>
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHENTICATED", message: "User not authenticated" },
    };
  }

  const { data, error } = await tryCatch(
    db
      .select({
        id: appointment.id,
        title: appointment.status,
        start: appointment.start,
        end: appointment.end,
        color: sql<EventColor>`CASE 
          WHEN ${appointment.status} = 'available' THEN 'emerald'
          WHEN ${appointment.status} = 'booked' THEN 'sky'
          ELSE 'amber'
        END`.as("color"),
      })
      .from(appointment)
      .where(
        session.user.role === "admin"
          ? undefined
          : gte(appointment.start, new Date()),
      ),
  );

  if (error) {
    console.error(error);

    return {
      data: null,
      error: { code: "SERVER_ERROR", message: "Error getting appointments" },
    };
  }

  return { data, error: null };
}
