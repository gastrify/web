import { User } from "../types";

export function checkIsAdmin(user: User): boolean {
  return user.role === "admin";
}
