import type { Metadata } from "next";

import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { TypographyH1 } from "@/shared/components/ui/typography";

import { Appointments } from "@/features/appointments/components/appointments";

export const metadata: Metadata = {
  title: "Gastrify | Appointments",
};

export default function AppointmentsPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex h-full flex-col gap-6 pr-6">
        <TypographyH1>Appointments</TypographyH1>

        <Appointments />
      </div>
    </ScrollArea>
  );
}
