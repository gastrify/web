"use client";
import { ChangeLanguageForm } from "@/features/settings/components/change-language-form";
import { useTranslation } from "react-i18next";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { ChangeEmailForm } from "@/features/settings/components/change-email-form";
import { ChangeNameForm } from "@/features/settings/components/change-name-form";
import { ChangeIdentificationNumberForm } from "@/features/settings/components/change-identification-number-form";

export function SettingsAccountPage() {
  const { t } = useTranslation("settingsProfile");

  return (
    <>
      <SettingsPageHeader
        title={t("account.title")}
        description={t("account.description")}
      />

      <ChangeNameForm />
      <ChangeIdentificationNumberForm />
      <ChangeEmailForm />
      <ChangeLanguageForm />
    </>
  );
}
