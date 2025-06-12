import { Metadata } from "next";

import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";

import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";
import { PageWrapper } from "@/features/settings/components/page-wrapper";
import { MobileWrapper } from "@/features/settings/components/mobile-wrapper";

export const metadata: Metadata = {
  title: "Gastrify | Settings",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col space-y-8">
      <MobileWrapper>
        <div className="space-y-2">
          <TypographyH1>Settings</TypographyH1>

          <TypographyMuted>
            Manage your account settings and set e-mail preferences.
          </TypographyMuted>
        </div>
      </MobileWrapper>

      <div className="flex min-h-0 flex-1 gap-6">
        <SettingsSidebar />

        <PageWrapper>
          <ScrollArea className="h-full flex-1">
            <div className="space-y-8 px-4 pb-16">{children}</div>
          </ScrollArea>
        </PageWrapper>
      </div>
    </div>
  );
}
