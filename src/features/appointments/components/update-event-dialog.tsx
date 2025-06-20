"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, IdCardIcon, LoaderIcon, TrashIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { getAppointment } from "@/features/appointments/actions/get-appointment";
import { EndHour, StartHour } from "@/features/appointments/constants";
import { updateAppointmentSchema } from "@/features/appointments/schemas/update-appointment-schema";
import { useAppointmentsTranslations } from "@/features/appointments/hooks/use-appointments-translations";
import type {
  CalendarEvent,
  UpdateAppointmentValues,
} from "@/features/appointments/types";
import { useUpdateAppointmentMutation } from "@/features/appointments/hooks/use-update-appointment-mutation";
import { formatTimeForInput } from "@/features/appointments/utils/format-time-for-input";
import { useDeleteAppointmentMutation } from "../hooks/use-delete-appointment-mutation";

interface Props {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateEventDialog({ event, isOpen, onClose }: Props) {
  const { update, create, booking } = useAppointmentsTranslations();

  const { data, isFetching } = useQuery({
    queryKey: ["appointments", "details", event.id],
    queryFn: async () => {
      const { data, error } = await getAppointment(event.id);

      if (error) return Promise.reject(error);

      return data;
    },
  });

  const form = useForm<UpdateAppointmentValues>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues: {
      id: event.id,
      start: event.start,
      end: event.end,
    },
    values: {
      id: event.id,
      start: data?.start ?? event.start,
      end: data?.end ?? event.end,
      status: data?.status ?? "available",
      patientIdentificationNumber: data?.patientIdentificationNumber ?? "",
      type: data?.type ?? "in-person",
    },
  });

  const timeOptions = useMemo(() => {
    const options = [];

    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        // Use a fixed date to avoid unnecessary date object creations
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "h:mm a");
        options.push({ value, label });
      }
    }
    return options;
  }, []);

  const { mutate, isPending } = useUpdateAppointmentMutation({ form });

  const onSubmit = (values: UpdateAppointmentValues) => {
    mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const { mutate: deleteAppointment, isPending: isDeleting } =
    useDeleteAppointmentMutation();

  const onDelete = () => {
    deleteAppointment({
      appointmentId: event.id,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form id="event-dialog-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{update.title}</DialogTitle>

              <DialogDescription className="sr-only">
                {update.description}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      <FormItem className="flex flex-1 flex-col">
                        <FormLabel>{create.startDate}</FormLabel>

                        <Popover>
                          <PopoverTrigger
                            disabled={isPending || isFetching}
                            asChild
                          >
                            <FormControl>
                              <Button
                                type="button"
                                variant={"outline"}
                                className={cn(
                                  "w-fit pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{create.pickDate}</span>
                                )}

                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>

                      <div className="flex flex-1 flex-col gap-2">
                        <FormLabel>{create.startTime}</FormLabel>

                        <Select
                          disabled={isPending || isFetching}
                          onValueChange={(value) => {
                            const [startHours = 0, startMinutes = 0] = value
                              .split(":")
                              .map(Number);

                            const updatedStartDate = new Date(field.value);
                            updatedStartDate.setHours(
                              startHours,
                              startMinutes,
                              0,
                            );

                            field.onChange(updatedStartDate);
                          }}
                          defaultValue={formatTimeForInput(event.start)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder={create.selectTime} />
                          </SelectTrigger>

                          <SelectContent>
                            {timeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="end"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      <FormItem className="flex flex-1 flex-col">
                        <FormLabel>{create.endDate}</FormLabel>

                        <Popover>
                          <PopoverTrigger
                            disabled={isPending || isFetching}
                            asChild
                          >
                            <FormControl>
                              <Button
                                type="button"
                                variant={"outline"}
                                className={cn(
                                  "w-fit pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{create.pickDate}</span>
                                )}

                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>

                      <div className="flex flex-1 flex-col gap-2">
                        <FormLabel>{create.endTime}</FormLabel>

                        <Select
                          disabled={isPending || isFetching}
                          onValueChange={(value) => {
                            const [endHours = 0, endMinutes = 0] = value
                              .split(":")
                              .map(Number);

                            const updatedEndDate = new Date(field.value);
                            updatedEndDate.setHours(endHours, endMinutes, 0);

                            field.onChange(updatedEndDate);
                          }}
                          defaultValue={formatTimeForInput(event.end)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder={create.selectTime} />
                          </SelectTrigger>

                          <SelectContent>
                            {timeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4">
                    <FormLabel>{create.status}</FormLabel>

                    <FormControl>
                      <RadioGroup
                        disabled={isPending || isFetching}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="available" />
                          </FormControl>

                          <FormLabel className="font-normal">
                            {create.available}
                          </FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="booked" />
                          </FormControl>

                          <FormLabel className="font-normal">
                            {create.booked}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("status") === "booked" && (
                <>
                  <FormField
                    control={form.control}
                    name="patientIdentificationNumber"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col gap-4">
                        <FormLabel>{create.patientId}</FormLabel>

                        <div className="relative">
                          <FormControl>
                            <Input
                              disabled={isPending || isFetching}
                              maxLength={10}
                              minLength={10}
                              className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                              placeholder={
                                fieldState.invalid
                                  ? undefined
                                  : create.patientIdPlaceholder
                              }
                              {...field}
                            />
                          </FormControl>

                          <div
                            className={cn(
                              "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
                              fieldState.invalid &&
                                "text-destructive-foreground",
                              fieldState.isDirty &&
                                !fieldState.invalid &&
                                "text-foreground",
                            )}
                          >
                            <IdCardIcon size={16} aria-hidden="true" />
                          </div>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-4">
                        <FormLabel>{create.appointmentType}</FormLabel>

                        <FormControl>
                          <RadioGroup
                            disabled={isPending || isFetching}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex"
                          >
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="in-person" />
                              </FormControl>

                              <FormLabel className="font-normal">
                                {booking.inPerson}
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="virtual" />
                              </FormControl>

                              <FormLabel className="font-normal">
                                {booking.virtual}
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <DialogFooter className="flex-row sm:justify-between">
              <div className="flex flex-1 justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  {booking.cancel}
                </Button>

                <Button
                  type="submit"
                  form="event-dialog-form"
                  disabled={isPending || isFetching}
                >
                  {isPending && <LoaderIcon className="animate-spin" />}{" "}
                  {update.updateAppointment}
                </Button>
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                disabled={isDeleting || isFetching}
                onClick={onDelete}
              >
                {isDeleting ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <TrashIcon size={16} />
                )}
                <span className="sr-only">{update.deleteAppointment}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
