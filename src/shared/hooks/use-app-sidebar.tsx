import { useMemo } from "react";
import {
  HomeIcon,
  UserRoundIcon,
  SettingsIcon,
  CalendarIcon,
  BellIcon,
} from "lucide-react";

import { useSession } from "@/shared/hooks/use-session";

export const useAppSidebar = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const links = useMemo(
    () => [
      { href: "/home", label: "Home", icon: <HomeIcon /> },
      {
        href: "/appointments",
        label: "Appointments",
        icon: <CalendarIcon />,
      },
      {
        href: "/notifications",
        label: "Notifications",
        icon: <BellIcon />,
      },
      {
        href: `/${session?.user.identificationNumber}`,
        label: "Profile",
        icon: <UserRoundIcon />,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <SettingsIcon />,
      },
    ],
    [session?.user.identificationNumber],
  );

  return {
    links,
    session,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  };
};
