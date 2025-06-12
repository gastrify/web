import { z } from "zod";

export const appointmentSchema = z
  .object({
    user_id: z.string().min(1),
    start_time: z.date(),
    end_time: z.date(),
    type: z.enum(["virtual", "in-person"]),
    link: z.string().url().optional(),
  })
  .refine((data) => data.start_time > new Date(), {
    message: "La fecha de inicio no puede estar en el pasado",
    path: ["startTime"],
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "La fecha de inicio debe ser anterior a la fecha de término",
    path: ["startTime"], // Puedes usar ["endTime"] si prefieres
  });
