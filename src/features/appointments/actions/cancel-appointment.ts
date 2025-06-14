"use server";

import { headers } from "next/headers";

import { auth } from "@/shared/lib/better-auth/server";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";
import { db } from "@/shared/lib/drizzle/server";
import { eq } from "drizzle-orm";
import { appointment } from "@/shared/lib/drizzle/schema";

export type CancelAppointmentErrorCode =
  | "UNAUTHENTICATED"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR";

export const cancelAppointment = async (
  appointmentId: string,
): Promise<ActionResponse<null, CancelAppointmentErrorCode>> => {
  //check if user is authenticated

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: {
        code: "UNAUTHENTICATED",
        message: "You are not authenticated",
      },
    };
  }

  //check if appointment exists

  const { data: existingAppointment, error: existingAppointmentDbError } =
    await tryCatch(
      db.select().from(appointment).where(eq(appointment.id, appointmentId)),
    );

  if (existingAppointmentDbError) {
    console.error(existingAppointmentDbError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
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

  //check if user is the patient of the appointment

  if (existingAppointment[0].patientId !== session.user.id) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You can only cancel your own appointments",
      },
    };
  }

  //cancel the appointment

  const { error: cancelAppointmentDbError } = await tryCatch(
    db
      .update(appointment)
      .set({
        status: "available",
        patientId: null,
        type: null,
        location: null,
        meetingLink: null,
      })
      .where(eq(appointment.id, appointmentId)),
  );

  if (cancelAppointmentDbError) {
    console.error(cancelAppointmentDbError);

    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};
