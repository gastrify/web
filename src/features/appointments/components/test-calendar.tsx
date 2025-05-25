"use client";

import { useIsAdmin } from "@/shared/hooks/is-admin";

export const TestCalendar = () => {
  const isAdmin = useIsAdmin();

  return (
    <div>
      <h2>Test Calendar</h2>
      isAdmin: {isAdmin ? "true" : "false"}
    </div>
  );
};
