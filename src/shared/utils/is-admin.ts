import "server-only";

import type { User, Session } from "@/shared/types";

export function isAdmin(user: User | Session["user"]): boolean {
  return user.role === "admin";
}
