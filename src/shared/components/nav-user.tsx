"use client";

import {
  EllipsisIcon,
  LoaderIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useNavUser } from "@/shared/hooks/use-nav-user";
import type { Session } from "@/shared/types";
import { useTranslation } from "react-i18next";

interface Props {
  user: Session["user"];
}

export const NavUser = ({ user }: Props) => {
  const { isMobile, handleSignOut, handleThemeChange, isSigningOut, theme } =
    useNavUser();

  const { t } = useTranslation("app");

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger>
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src={user.image || undefined} alt={user.name} />

              <AvatarFallback>
                {user.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <span className="border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
              <span className="sr-only">Online</span>
            </span>
          </div>
        </DrawerTrigger>

        <DrawerContent className="pb-4">
          <DrawerHeader>
            <DrawerTitle>{t("nav-user.my-account")}</DrawerTitle>

            <DrawerDescription className="sr-only">
              {t("nav-user.account-settings-description")}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-2 px-4">
            <Button
              title={t("nav-user.toggle-theme")}
              aria-label="Toggle theme"
              variant="ghost"
              className="w-full justify-start !p-0"
              onClick={() => handleThemeChange()}
            >
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
              {t("nav-user.toggle-theme")}
            </Button>

            <Button
              variant="ghost"
              className="text-destructive w-full justify-start !p-0"
              onClick={() => handleSignOut()}
            >
              {isSigningOut ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <LogOutIcon />
              )}
              {t("nav-user.sign-out")}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="flex w-full items-center gap-4">
      <div className="relative">
        <Avatar className="size-10">
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((name, index) => (index % 2 === 0 ? name[0] : ""))
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
          <span className="sr-only">Online</span>
        </span>
      </div>

      <div className="hidden flex-col overflow-hidden sm:flex">
        <span className="text-sm font-semibold text-ellipsis">{user.name}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="hidden rounded-full sm:flex"
          >
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t("nav-user.my-account")}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={handleThemeChange}>
            {theme === "dark" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            {t("nav-user.toggle-theme")}
            <DropdownMenuShortcut>⌘⇧T</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
            {isSigningOut ? (
              <LoaderIcon className="animate-spin" size={18} />
            ) : (
              <LogOutIcon size={18} />
            )}
            {t("nav-user.sign-out")}
            <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
