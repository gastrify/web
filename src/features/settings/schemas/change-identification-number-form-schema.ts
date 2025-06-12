import { z } from "zod";

export const changeIdentificationNumberFormSchema = z.object({
  identificationNumber: z
    .string()
    .trim()
    .length(10, {
      message: "Identification number must be 10 characters long",
    })
    .regex(/^[0-9]+$/, {
      message: "Identification number must contain only numbers",
    }),
});
