"use client";
import { NotificationsForm } from "@/features/settings/components/notifications-form";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { useTranslation } from "react-i18next";

export default function SettingsNotificationsPage() {
  const { t } = useTranslation("settingsProfile");
  return (
    <>
      <SettingsPageHeader
        title={t("notifications.notificationTitle")}
        description={t("notifications.notificationDescription")}
      />

      <NotificationsForm />
    </>
  );
}
