"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";
import { formatDuration, intervalToDuration, format } from "date-fns";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/shared/components/ui/card";
import { TypographyP } from "@/shared/components/ui/typography";

import { useAppointmentCard } from "@/features/appointments/hooks/use-appointment-card";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";
import type { Appointment } from "@/features/appointments/types";

interface Props {
  appointment: Appointment;
}

export function UserAppointmentCard({ appointment }: Props) {
  const {
    isCancelAppointmentPending,
    isCancelAppointmentError,
    handleCancelAppointment,
  } = useAppointmentCard();
  const { user } = useAppointmentsTranslations();

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader>
        <CardTitle>
          {appointment.type === "in-person"
            ? user.inPersonAppointment
            : user.virtualAppointment}
        </CardTitle>

        <CardDescription className="flex flex-col">
          <TypographyP className="!mt-2 leading-normal">
            <span className="font-bold">{user.start}:</span>{" "}
            {format(appointment.start, "PPp")}
          </TypographyP>

          <TypographyP className="!m-0 leading-normal">
            <span className="font-bold">{user.end}:</span>{" "}
            {format(appointment.end, "PPp")}
          </TypographyP>

          <TypographyP className="!m-0 leading-normal">
            <span className="font-bold">{user.duration}:</span>{" "}
            {formatDuration(
              intervalToDuration({
                start: appointment.start,
                end: appointment.end,
              }),
            )}
          </TypographyP>

          {appointment.location && (
            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{user.location}:</span>{" "}
              {appointment.location}
            </TypographyP>
          )}

          {appointment.meetingLink && (
            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{user.meetingLink}:</span>{" "}
              {appointment.meetingLink}
            </TypographyP>
          )}
        </CardDescription>

        <CardAction>
          <Button
            disabled={isCancelAppointmentPending}
            variant="destructive"
            onClick={() => handleCancelAppointment(appointment.id)}
          >
            {isCancelAppointmentPending && (
              <LoaderIcon className="animate-spin" />
            )}
            {isCancelAppointmentError && <RotateCcwIcon />}
            {user.cancel}
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
