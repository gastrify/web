"use server";

import { db } from "@/shared/lib/drizzle/server";
import { appointment, user } from "@/shared/lib/drizzle/schema";
import { ActionResponse, Appointment } from "@/shared/types";
import { auth } from "@/shared/lib/better-auth/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

type ErrorCode = "UNAUTHENTICATED" | "SERVER_ERROR" | "NOT_FOUND";

export async function getAppointments(): Promise<
  ActionResponse<Appointment[], ErrorCode>
> {
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

    const results = await db.query.appointment.findMany();
    return { data: results, error: null };
  } catch (error) {
    console.error("Error al listar citas:", error);
    return {
      error: { code: "SERVER_ERROR", message: "Error interno del servidor" },
      data: null,
    };
  }
}

export async function getAppointmentById(
  id: string,
): Promise<ActionResponse<Appointment, ErrorCode>> {
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

    const result = await db.query.appointment.findFirst({
      where: eq(appointment.id, id),
    });

    if (!result) {
      return {
        error: { code: "NOT_FOUND", message: "Cita no encontrada" },
        data: null,
      };
    }

    return { data: result, error: null };
  } catch (error) {
    console.error("Error al obtener cita:", error);
    return {
      error: { code: "SERVER_ERROR", message: "Error interno del servidor" },
      data: null,
    };
  }
}
