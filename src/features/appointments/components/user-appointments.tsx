"use client";

import { useTranslation } from "react-i18next";
import { LoaderIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { TypographyP } from "@/shared/components/ui/typography";

import { useUserAppointments } from "@/features/appointments/hooks/use-user-appointments";
import { UserAppointmentCard } from "@/features/appointments/components/user-appointment-card";
import { UserAppointmentsSkeleton } from "@/features/appointments/components/user-appointments-skeleton";

export function UserAppointments() {
  const { t } = useTranslation("appointments");
  const { data, isLoading, isError, refetch, isRefetching } =
    useUserAppointments();

  if (isLoading) return <UserAppointmentsSkeleton />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {t("user.fetchError")}
        <Button
          disabled={isRefetching}
          variant="destructive"
          onClick={() => refetch()}
        >
          {isRefetching && <LoaderIcon className="animate-spin" />}
          {t("user.refetch")}
        </Button>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <TypographyP className="!m-0 text-center leading-normal">
        {t("user.noAppointmentsYet")}
      </TypographyP>
    );

  return (
    <div className="flex flex-col gap-4">
      {data?.map((appointment) => (
        <UserAppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}
