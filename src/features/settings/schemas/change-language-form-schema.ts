import { z } from "zod";

export const changeLanguageFormSchema = z.object({
  language: z.enum(["es", "en"]),
});
