"use client";

import { BellRingIcon, KeyRoundIcon, UserRoundPenIcon } from "lucide-react";

import { SettingsNavLink } from "@/features/settings/components/settings-nav-link";
import { useSettingsInMobile } from "@/features/settings/hooks/use-settings-in-mobile";

const items = [
  {
    label: "Account",
    href: "/settings/account",
    icon: <UserRoundPenIcon />,
  },
  {
    label: "Security",
    href: "/settings/security",
    icon: <KeyRoundIcon />,
  },
  {
    label: "Notifications",
    href: "/settings/notifications",
    icon: <BellRingIcon />,
  },
];

export function SettingsSidebar() {
  const { isMobile, isMounted, isSettingsPage } = useSettingsInMobile();

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
