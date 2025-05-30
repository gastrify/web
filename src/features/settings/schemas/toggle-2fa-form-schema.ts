import { z } from "zod";

export const toggle2FAFormSchema = z.object({
  enable2FA: z.boolean(),
  currentPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(50, {
      message: "Password must be at most 50 characters",
    }),
});
