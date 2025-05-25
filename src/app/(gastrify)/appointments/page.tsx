import type { Metadata } from "next";

import { TypographyH1 } from "@/shared/components/ui/typography";

import { TestCalendar } from "@/features/appointments/components/test-calendar";

export const metadata: Metadata = {
  title: "Gastrify | Appointments",
};

export default function ChatPage() {
  return (
    <main className="flex flex-col gap-6">
      <TypographyH1>Appointments</TypographyH1>

      <TestCalendar />
    </main>
  );
}
