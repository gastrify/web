"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarIcon, IdCardIcon, LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
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
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/cn";

import { EndHour, StartHour } from "@/features/appointments/constants";
import { createAppointmentSchema } from "@/features/appointments/schemas/create-appointment-schema";
import type { CreateAppointmentValues } from "@/features/appointments/types";
import { formatTimeForInput } from "@/features/appointments/utils/format-time-for-input";
import { useCreateAppointmentMutation } from "../hooks/use-create-appointment-mutation";
import { useDateConfig } from "@/features/appointments/lib/date-config";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    start: Date;
    end: Date;
  };
}

export function CreateEventDialog({ isOpen, onClose, data }: EventDialogProps) {
  const { t } = useTranslation("appointments");
  const { locale } = useDateConfig();

  const form = useForm<CreateAppointmentValues>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      start: data.start,
      end: data.end,
      status: "available",
      patientIdentificationNumber: "",
      type: "in-person",
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
        const label = format(date, "h:mm a", { locale });
        options.push({ value, label });
      }
    }
    return options;
  }, [locale]);

  const { mutate, isPending } = useCreateAppointmentMutation({ form });

  const onSubmit = (values: CreateAppointmentValues) => {
    mutate(values, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <Form {...form}>
      <form id="event-dialog-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("create.title")}</DialogTitle>

              <DialogDescription className="sr-only">
                {t("create.description")}
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
                        <FormLabel>{t("create.startDate.label")}</FormLabel>

                        <Popover>
                          <PopoverTrigger disabled={isPending} asChild>
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
                                  format(field.value, "PPP", { locale })
                                ) : (
                                  <span>
                                    {t("create.startDate.placeholder")}
                                  </span>
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
                        <FormLabel>{t("create.startTime.label")}</FormLabel>

                        <Select
                          disabled={isPending}
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
                          defaultValue={formatTimeForInput(data.start)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue
                              placeholder={t("create.startTime.placeholder")}
                            />
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
                        <FormLabel>{t("create.endDate.label")}</FormLabel>

                        <Popover>
                          <PopoverTrigger disabled={isPending} asChild>
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
                                  format(field.value, "PPP", { locale })
                                ) : (
                                  <span>{t("create.endDate.placeholder")}</span>
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
                        <FormLabel>{t("create.endTime.label")}</FormLabel>

                        <Select
                          disabled={isPending}
                          onValueChange={(value) => {
                            const [endHours = 0, endMinutes = 0] = value
                              .split(":")
                              .map(Number);

                            const updatedEndDate = new Date(field.value);
                            updatedEndDate.setHours(endHours, endMinutes, 0);

                            field.onChange(updatedEndDate);
                          }}
                          defaultValue={formatTimeForInput(data.end)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue
                              placeholder={t("create.endTime.placeholder")}
                            />
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
                    <FormLabel>{t("create.appointmentStatus.label")}</FormLabel>

                    <FormControl>
                      <RadioGroup
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="available" />
                          </FormControl>

                          <FormLabel className="font-normal">
                            {t("create.appointmentStatus.available")}
                          </FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="booked" />
                          </FormControl>

                          <FormLabel className="font-normal">
                            {t("create.appointmentStatus.booked")}
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
                        <FormLabel>{t("create.patientId")}</FormLabel>

                        <div className="relative">
                          <FormControl>
                            <Input
                              disabled={isPending}
                              maxLength={10}
                              minLength={10}
                              className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                              placeholder={
                                fieldState.invalid ? undefined : "1234567890"
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
                        <FormLabel>
                          {t("create.appointmentType.label")}
                        </FormLabel>

                        <FormControl>
                          <RadioGroup
                            disabled={isPending}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex"
                          >
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="in-person" />
                              </FormControl>

                              <FormLabel className="font-normal">
                                {t("create.appointmentType.inPerson")}
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="virtual" />
                              </FormControl>

                              <FormLabel className="font-normal">
                                {t("create.appointmentType.virtual")}
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
                  {t("create.cancel")}
                </Button>

                <Button
                  type="submit"
                  form="event-dialog-form"
                  disabled={isPending}
                >
                  {isPending && <LoaderIcon className="animate-spin" />}{" "}
                  {t("create.save")}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
