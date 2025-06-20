"use client";

import { useTranslation } from "react-i18next";

import { ActiveSessions } from "@/features/settings/components/active-sessions";
import { ChangePasswordForm } from "@/features/settings/components/change-password-form";
import { GenerateBackupCodesForm } from "@/features/settings/components/generate-backup-codes-form";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { Toggle2FAForm } from "@/features/settings/components/toggle-2fa-form";

export function SettingsSecurityPage() {
  const { t } = useTranslation("settingsProfile");
  return (
    <>
      <SettingsPageHeader
        title={t("security.securityTitle")}
        description={t("security.securityDescription")}
      />

      <ChangePasswordForm />
      <Toggle2FAForm />
      <GenerateBackupCodesForm />
      <ActiveSessions />
    </>
  );
}
