"use server";

import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import { ActionResponse, User } from "@/shared/types";
import { eq } from "drizzle-orm";
import { checkIsAdmin } from "@/shared/utils/check-role";
import { auth } from "@/shared/lib/better-auth/server";
import { headers } from "next/headers";

type ErrorCode =
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "TOO_LATE_TO_CANCEL";

export async function deleteAppointment(
  id: string,
): Promise<ActionResponse<{ id: string }, ErrorCode>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        error: { code: "UNAUTHENTICATED", message: "User not authenticated" },
        data: null,
      };
    }

    const is_admin = checkIsAdmin(session.user as User);

    const existing_appointment = await db.query.appointment.findFirst({
      where: eq(appointment.id, id),
      columns: { id: true, user_id: true, start_time: true },
    });

    if (!existing_appointment) {
      return {
        error: { code: "NOT_FOUND", message: "Appointment not found" },
        data: null,
      };
    }

    if (!is_admin) {
      if (existing_appointment.user_id !== session.user.id) {
        return {
          error: {
            code: "FORBIDDEN",
            message: "You can only cancel your own appointments",
          },
          data: null,
        };
      }

      if (!existing_appointment.start_time) {
        return {
          error: {
            code: "SERVER_ERROR",
            message: "Appointment date is missing",
          },
          data: null,
        };
      }

      const appointment_date = new Date(existing_appointment.start_time);
      const now = new Date();
      const hours_difference =
        (appointment_date.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hours_difference < 12) {
        return {
          error: {
            code: "TOO_LATE_TO_CANCEL",
            message:
              "Appointments can only be cancelled at least 12 hours in advance",
          },
          data: null,
        };
      }
    }

    await db.delete(appointment).where(eq(appointment.id, id));

    return { data: { id }, error: null };
  } catch (error) {
    console.error("Error eliminando cita:", error);
    return {
      error: { code: "SERVER_ERROR", message: "Internal server error" },
      data: null,
    };
  }
}
