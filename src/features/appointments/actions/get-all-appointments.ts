"use server";

import { headers } from "next/headers";
import { gte, sql, eq } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
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
        start: appointment.start,
        end: appointment.end,
        status: appointment.status,
        type: appointment.type,
        patientId: appointment.patientId,
        color: sql<EventColor>`CASE 
          WHEN ${appointment.status} = 'available' THEN 'emerald'
          WHEN ${appointment.status} = 'booked' THEN 'sky'
          ELSE 'amber'
        END`.as("color"),
      })
      .from(appointment)
      .leftJoin(user, eq(appointment.patientId, user.id))
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

  // Transform the data to create titles based on status
  const transformedData = data?.map((item) => {
    let title = "";

    if (item.status === "available") {
      title = "available"; // Will be translated in the frontend
    } else if (item.status === "booked") {
      title = "booked"; // Will be translated in the frontend
    }

    return {
      id: item.id,
      title,
      start: item.start,
      end: item.end,
      color: item.color,
      type: item.type,
      patientId: item.patientId,
    };
  });

  return { data: transformedData || [], error: null };
}
