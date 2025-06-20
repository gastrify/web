import type { Metadata } from "next";
import Image from "next/image";

import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";

export const metadata: Metadata = {
  title: "Gastrify | Notifications",
};

export default function NotificationsPage() {
  return (
    <main className="flex flex-col gap-6">
      <TypographyH1>Notifications</TypographyH1>

      <div className="relative mx-auto aspect-square w-full max-w-sm">
        <Image src="/coming-soon.svg" alt="Coming soon" fill />
      </div>

      <TypographyMuted className="text-center">Coming soon...</TypographyMuted>
    </main>
  );
}
