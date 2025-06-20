import {
  formatDuration,
  intervalToDuration,
  format,
  formatDistanceToNow,
} from "date-fns";
import { LoaderIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/shared/components/ui/card";
import { TypographyP } from "@/shared/components/ui/typography";

import { useAdminIncomingAppointmentCard } from "@/features/appointments/hooks/use-admin-incoming-appointment-card";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";
import { useDateConfig } from "@/features/appointments/lib/date-config";
import type { IncomingAppointment } from "@/features/appointments/types";

interface Props {
  incomingAppointment: IncomingAppointment;
}

export function AdminIncomingAppointmentCard({ incomingAppointment }: Props) {
  const { incoming, booking } = useAppointmentsTranslations();
  const { locale } = useDateConfig();

  const {
    isDeleteAppointmentPending,
    isDeleteAppointmentError,
    handleDeleteAppointment,
  } = useAdminIncomingAppointmentCard();

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader>
        <CardTitle>
          {incomingAppointment.appointment.type === "in-person"
            ? booking.inPerson
            : booking.virtual}{" "}
          (
          {formatDistanceToNow(incomingAppointment.appointment.start, {
            addSuffix: true,
            locale,
          })}
          )
        </CardTitle>

        <CardDescription className="flex items-center">
          <div className="flex flex-1 flex-col">
            <TypographyP className="!mt-2 leading-normal">
              <span className="font-bold">{incoming.start}:</span>{" "}
              {format(incomingAppointment.appointment.start, "PPp", { locale })}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{incoming.end}:</span>{" "}
              {format(incomingAppointment.appointment.end, "PPp", { locale })}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{booking.duration}:</span>{" "}
              {formatDuration(
                intervalToDuration({
                  start: incomingAppointment.appointment.start,
                  end: incomingAppointment.appointment.end,
                }),
                { locale },
              )}
            </TypographyP>
          </div>

          <div className="flex flex-1 flex-col">
            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{incoming.patient}:</span>{" "}
              {incomingAppointment.patient.name}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{incoming.patientId}:</span>{" "}
              {incomingAppointment.patient.identificationNumber}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">{incoming.patientEmail}:</span>{" "}
              {incomingAppointment.patient.email}
            </TypographyP>
          </div>
        </CardDescription>

        <CardAction>
          <Button
            disabled={isDeleteAppointmentPending}
            variant="destructive"
            onClick={() =>
              handleDeleteAppointment(incomingAppointment.appointment.id)
            }
          >
            {isDeleteAppointmentPending && (
              <LoaderIcon className="animate-spin" />
            )}
            {isDeleteAppointmentError && <RotateCcwIcon />}
            {incoming.delete}
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
