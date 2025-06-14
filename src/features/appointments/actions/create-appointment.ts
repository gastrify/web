"use server";

import { headers } from "next/headers";
import { generateId } from "better-auth";
import { and, eq, gte, lte } from "drizzle-orm";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { isAdmin } from "@/shared/utils/is-admin";
import { tryCatch } from "@/shared/utils/try-catch";

import type { CreateAppointmentValues } from "@/features/appointments/types";
import { createAppointmentSchema } from "@/features/appointments/schemas/create-appointment-schema";

export type CreateAppointmentErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "CONFLICT"
  | "SERVER_ERROR"
  | "USER_NOT_FOUND";

export async function createAppointment(
  values: CreateAppointmentValues,
): Promise<ActionResponse<{ id: string }, CreateAppointmentErrorCode>> {
  //get the session and check if the user is authenticated

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHENTICATED", message: "User not authenticated" },
    };
  }

  //check if the user is an admin

  if (!isAdmin(session.user)) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You are not authorized to create appointments",
      },
    };
  }

  //validate the values

  const parsedValues = createAppointmentSchema
    .transform((data) => ({
      ...data,
      patientIdentificationNumber:
        data.status === "booked" ? data.patientIdentificationNumber : undefined,
      type: data.status === "booked" ? data.type : undefined,
    }))
    .safeParse(values);

  if (!parsedValues.success) {
    return {
      data: null,
      error: {
        code: "INVALID_INPUT",
        message: `Invalid data: ${parsedValues.error.errors.map((e) => e.message).join(", ")}`,
      },
    };
  }

  const { start, end, status, patientIdentificationNumber, type } =
    parsedValues.data;

  //if booked, check if the patient exists and get the patient id

  let patientId: string | null = null;

  if (status === "booked" && patientIdentificationNumber) {
    const { data: patient, error: patientDbError } = await tryCatch(
      db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.identificationNumber, patientIdentificationNumber)),
    );

    if (patientDbError) {
      console.error(patientDbError);

      return {
        data: null,
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong fetching patient data",
        },
      };
    }

    if (!patient || patient.length !== 1) {
      return {
        data: null,
        error: {
          code: "USER_NOT_FOUND",
          message:
            "The patient with the provided identification number was not found",
        },
      };
    }

    patientId = patient[0].id;
  }

  //TODO: check if patient does not have other appointments in the same time

  //check conflicts with other appointments

  const { data: dbCheckConflictsData, error: dbCheckConflictsError } =
    await tryCatch(
      db
        .select({ id: appointment.id })
        .from(appointment)
        .where(and(gte(appointment.start, start), lte(appointment.end, end))),
    );

  if (dbCheckConflictsError) {
    console.error(dbCheckConflictsError);

    return {
      data: null,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to check conflicts",
      },
    };
  }

  if (dbCheckConflictsData && dbCheckConflictsData.length > 0)
    return {
      data: null,
      error: {
        code: "CONFLICT",
        message: "The appointment conflicts with another appointment",
      },
    };

  //all good, create the appointment

  const { data: dbInsertAppointmentData, error: dbInsertAppointmentError } =
    await tryCatch(
      db
        .insert(appointment)
        .values({
          id: generateId(32),
          start,
          end,
          status,
          patientId: status === "booked" ? patientId : null,
          type: status === "booked" ? type : null,
        })
        .returning({ id: appointment.id }),
    );

  if (dbInsertAppointmentError) {
    console.error(dbInsertAppointmentError);

    return {
      data: null,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to create appointment",
      },
    };
  }

  return {
    data: { id: dbInsertAppointmentData[0].id },
    error: null,
  };
}
