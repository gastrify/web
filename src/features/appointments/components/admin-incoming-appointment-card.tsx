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
import type { IncomingAppointment } from "@/features/appointments/types";

interface Props {
  incomingAppointment: IncomingAppointment;
}

export function AdminIncomingAppointmentCard({ incomingAppointment }: Props) {
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
            ? "In-Person"
            : "Virtual"}{" "}
          (
          {formatDistanceToNow(incomingAppointment.appointment.start, {
            addSuffix: true,
          })}
          )
        </CardTitle>

        <CardDescription className="flex items-center">
          <div className="flex flex-1 flex-col">
            <TypographyP className="!mt-2 leading-normal">
              <span className="font-bold">Start:</span>{" "}
              {format(incomingAppointment.appointment.start, "PPp")}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">End:</span>{" "}
              {format(incomingAppointment.appointment.end, "PPp")}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">Duration:</span>{" "}
              {formatDuration(
                intervalToDuration({
                  start: incomingAppointment.appointment.start,
                  end: incomingAppointment.appointment.end,
                }),
              )}
            </TypographyP>
          </div>

          <div className="flex flex-1 flex-col">
            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">Patient:</span>{" "}
              {incomingAppointment.patient.name}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">
                Patient&apos;s identification number:
              </span>{" "}
              {incomingAppointment.patient.identificationNumber}
            </TypographyP>

            <TypographyP className="!m-0 leading-normal">
              <span className="font-bold">Patient&apos;s email:</span>{" "}
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
            Delete
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
