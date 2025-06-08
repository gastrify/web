"use server";

import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import { appointmentSchema } from "./helpers/validation";
import { Appointment } from "./helpers/appointment";
import { ActionResponse, User } from "@/shared/types";
import { auth } from "@/shared/lib/better-auth/server";
import { checkIsAdmin } from "@/shared/utils/check-role";
import { and, eq, gt, gte, lt, lte, or, ne } from "drizzle-orm";
import { headers } from "next/headers";

type ErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TOO_LATE_TO_RESCHEDULE"
  | "SERVER_ERROR";

export async function updateAppointment(
  id: string,
  form_data: FormData,
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
      columns: {
        id: true,
        user_id: true,
        start_time: true,
        end_time: true,
      },
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
            message: "Patients can only edit their own appointments",
          },
          data: null,
        };
      }

      if (!existing_appointment.start_time) {
        return {
          error: {
            code: "SERVER_ERROR",
            message: "Appointment start time is missing",
          },
          data: null,
        };
      }

      const appointment_date = new Date(existing_appointment.start_time);
      const now = new Date();
      const hoursDifference =
        (appointment_date.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDifference < 12) {
        return {
          error: {
            code: "TOO_LATE_TO_RESCHEDULE",
            message:
              "Appointments can only be rescheduled at least 12 hours in advance",
          },
          data: null,
        };
      }
    }

    const raw_data = {
      user_id: form_data.get("user_id") as string,
      start_time: new Date(form_data.get("start_time") as string),
      end_time: new Date(form_data.get("end_time") as string),
      type: form_data.get("type") as "virtual" | "in-person",
      link: (() => {
        const link_value = form_data.get("link");
        if (!link_value || link_value === "") return undefined;
        return link_value as string;
      })(),
    };

    const validation = appointmentSchema.safeParse(raw_data);
    if (!validation.success) {
      return {
        error: {
          code: "INVALID_INPUT",
          message: `Invalid data: ${validation.error.errors.map((e) => e.message).join(", ")}`,
        },
        data: null,
      };
    }

    const validated_data = validation.data;

    if (validated_data.type === "virtual" && !validated_data.link) {
      return {
        error: {
          code: "INVALID_INPUT",
          message: "Virtual appointments require a meeting link",
        },
        data: null,
      };
    }

    if (!is_admin) {
      if (validated_data.user_id !== session.user.id) {
        return {
          error: {
            code: "FORBIDDEN",
            message: "Patients cannot change appointment to another user",
          },
          data: null,
        };
      }
    }

    const overlapping = await db.query.appointment.findMany({
      where: and(
        ne(appointment.id, id),
        or(
          and(
            gte(appointment.start_time, validated_data.start_time),
            lt(appointment.start_time, validated_data.end_time),
          ),
          and(
            gt(appointment.end_time, validated_data.start_time),
            lte(appointment.end_time, validated_data.end_time),
          ),
          and(
            lte(appointment.start_time, validated_data.start_time),
            gte(appointment.end_time, validated_data.end_time),
          ),
        ),
      ),
    });

    if (overlapping.length > 0) {
      return {
        error: {
          code: "CONFLICT",
          message: "An appointment already exists at this time",
        },
        data: null,
      };
    }

    const updated_appointment = new Appointment({ ...validated_data, id });
    await db
      .update(appointment)
      .set(updated_appointment.toObject())
      .where(eq(appointment.id, id));

    return { data: { id }, error: null };
  } catch (error) {
    return {
      error: { code: "SERVER_ERROR", message: "Error interno del servidor" },
      data: null,
    };
  }
}
