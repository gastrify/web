"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";

export default function ProfilePage({}: {
  params: Promise<{ identificationNumber: string }>;
}) {
  const { t } = useTranslation("settingsProfile");

  return (
    <main className="flex flex-col gap-6">
      <div className="space-y-2">
        <TypographyH1>{t("profile.title")}</TypographyH1>
        <TypographyMuted>{t("profile.description")}</TypographyMuted>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-sm">
        <Image src="/coming-soon.svg" alt={t("comingSoon")} fill />
      </div>

      <TypographyMuted className="text-center">
        {t("profile.comingSoon")}
      </TypographyMuted>
    </main>
  );
}
