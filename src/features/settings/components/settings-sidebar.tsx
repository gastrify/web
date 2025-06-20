"use client";

import { BellRingIcon, KeyRoundIcon, UserRoundPenIcon } from "lucide-react";
import { SettingsNavLink } from "@/features/settings/components/settings-nav-link";
import { useSettingsInMobile } from "@/features/settings/hooks/use-settings-in-mobile";
import { useTranslation } from "react-i18next";

export function SettingsSidebar() {
  const { t } = useTranslation("settingsProfile");
  const { isMobile, isMounted, isSettingsPage } = useSettingsInMobile();

  const items = [
    {
      label: t("sidebar.account"),
      href: "/settings/account",
      icon: <UserRoundPenIcon />,
    },
    {
      label: t("sidebar.security"),
      href: "/settings/security",
      icon: <KeyRoundIcon />,
    },
    {
      label: t("sidebar.notifications"),
      href: "/settings/notifications",
      icon: <BellRingIcon />,
    },
  ];

  if (!isMounted) return null;
  if (isMobile && !isSettingsPage) return null;

  return (
    <aside className="h-full w-full md:w-max">
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <SettingsNavLink
            key={item.href}
            href={item.href}
            additionalMatches={
              !isMobile && item.href === "/settings/account"
                ? ["/settings"]
                : undefined
            }
            label={item.label}
            icon={item.icon}
            includeArrow
            exactMatch
          />
        ))}
      </nav>
    </aside>
  );
}
