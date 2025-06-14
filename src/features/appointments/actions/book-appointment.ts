"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/shared/lib/drizzle/server";
import { appointment } from "@/shared/lib/drizzle/schema";
import { tryCatch } from "@/shared/utils/try-catch";
import { ActionResponse } from "@/shared/types";
import { auth } from "@/shared/lib/better-auth/server";

import { bookAppointmentSchema } from "@/features/appointments/schemas/book-appointment-schema";
import type { BookAppointmentValues } from "@/features/appointments/types";

export type BookAppointmentErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "ALREADY_BOOKED"
  | "PAST_APPOINTMENT"
  | "SERVER_ERROR";

export const bookAppointment = async (
  values: BookAppointmentValues,
): Promise<ActionResponse<null, BookAppointmentErrorCode>> => {
  // check if user is authenticated

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHENTICATED",
        message: "You must be logged in to book an appointment",
      },
    };
  }

  // parse values

  const parsedValues = bookAppointmentSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      data: null,
      error: {
        code: "INVALID_INPUT",
        message: "Invalid input",
      },
    };
  }

  const { appointmentId, patientId, appointmentType } = parsedValues.data;

  // check if patient is the same as the one who is booking the appointment

  if (session.user.id !== patientId) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You can only book your own appointments",
      },
    };
  }

  // check if appointment exists

  const { data: existingAppointment, error: existingAppointmentDbError } =
    await tryCatch(
      db
        .select()
        .from(appointment)
        .where(eq(appointment.id, appointmentId))
        .limit(1),
    );

  if (existingAppointmentDbError) {
    console.error(existingAppointmentDbError);

    return {
      data: null,
      error: {
        code: "SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }

  if (!existingAppointment || existingAppointment.length === 0) {
    return {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Appointment not found",
      },
    };
  }

  // if it exists, check if it's available

  if (existingAppointment[0].status !== "available") {
    return {
      data: null,
      error: {
        code: "ALREADY_BOOKED",
        message: "Appointment is not available",
      },
    };
  }

  // check if appointment is in the past

  if (existingAppointment[0].start < new Date()) {
    return {
      data: null,
      error: {
        code: "PAST_APPOINTMENT",
        message: "Appointment is no longer available",
      },
    };
  }

  // all good, book appointment

  const { error: bookAppointmentDbError } = await tryCatch(
    db
      .update(appointment)
      .set({
        status: "booked",
        patientId,
        type: appointmentType,
      })
      .where(eq(appointment.id, appointmentId)),
  );

  if (bookAppointmentDbError) {
    console.error(bookAppointmentDbError);

    return {
      data: null,
      error: {
        code: "SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};
