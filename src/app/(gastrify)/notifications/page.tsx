"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";

export default function NotificationsPage() {
  const { t } = useTranslation("app");

  useEffect(() => {
    document.title = `Gastrify | ${t("page.notificationsTitle")}`;
  }, [t]);

  return (
    <main className="flex flex-col gap-6">
      <div className="space-y-2">
        <TypographyH1>{t("page.notificationsTitle")}</TypographyH1>
        <TypographyMuted>{t("page.notificationsDescription")}</TypographyMuted>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-sm">
        <Image src="/coming-soon.svg" alt={t("page.comingSoon")} fill />
      </div>

      <TypographyMuted className="text-center">
        {t("page.comingSoon")}
      </TypographyMuted>
    </main>
  );
}
