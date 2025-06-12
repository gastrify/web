"use client";

import { useEffect, useMemo } from "react";
import { format, isBefore } from "date-fns";
import { CalendarIcon, IdCardIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
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
import { useIsAdmin } from "@/shared/hooks/is-admin";

import {
  DefaultEndHour,
  DefaultStartHour,
  EndHour,
  StartHour,
} from "@/features/appointments/constants";
import type { CalendarEvent, EventColor } from "@/features/appointments/types";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const eventDialogFormSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    appointmentStatus: z.enum(["available", "reserved"]),
    patientIdentificationNumber: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.appointmentStatus === "reserved") {
        return (
          data.patientIdentificationNumber?.length === 10 &&
          /^\d+$/.test(data.patientIdentificationNumber)
        );
      }

      return true;
    },
    {
      path: ["patientIdentificationNumber"],
      message: "Patient ID must be exactly 10 digits",
    },
  );

type EventDialogFormValues = z.infer<typeof eventDialogFormSchema>;

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  // const [description, setDescription] = useState("");
  const isAdmin = useIsAdmin();

  // Debug log to check what event is being passed
  useEffect(() => {
    console.log("EventDialog received event:", event);
  }, [event]);

  const form = useForm<EventDialogFormValues>({
    resolver: zodResolver(eventDialogFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      startTime: `${DefaultStartHour}:00`,
      endTime: `${DefaultEndHour}:00`,
      appointmentStatus: "available",
      patientIdentificationNumber: "",
    },
  });

  useEffect(() => {
    if (event) {
      // setDescription(event.description || "");

      const start = new Date(event.start);
      const end = new Date(event.end);

      form.setValue("startDate", start);
      form.setValue("endDate", end);
      form.setValue("startTime", formatTimeForInput(start));
      form.setValue("endTime", formatTimeForInput(end));
      form.setValue("appointmentStatus", event.appointmentStatus);
      form.setValue(
        "patientIdentificationNumber",
        event.patientIdentificationNumber,
      );

      form.clearErrors(); // Reset error when opening dialog
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Memoize time options so they're only calculated once
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
  }, []); // Empty dependency array ensures this only runs once

  const onSubmit = (values: EventDialogFormValues) => {
    // console.log(values);

    const start = new Date(values.startDate);
    const end = new Date(values.endDate);

    const [startHours = 0, startMinutes = 0] = values.startTime
      .split(":")
      .map(Number);
    const [endHours = 0, endMinutes = 0] = values.endTime
      .split(":")
      .map(Number);

    if (
      startHours < StartHour ||
      startHours > EndHour ||
      endHours < StartHour ||
      endHours > EndHour
    ) {
      form.setError("startTime", {
        message: `Selected time must be between ${StartHour}:00 and ${EndHour}:00`,
      });
      form.setError("endTime", {
        message: `Selected time must be between ${StartHour}:00 and ${EndHour}:00`,
      });
      return;
    }

    start.setHours(startHours, startMinutes, 0);
    end.setHours(endHours, endMinutes, 0);

    // Validate that end date is not before start date
    if (isBefore(end, start)) {
      form.setError("endDate", {
        message: "End date cannot be before start date",
      });
      form.setError("endTime", {
        message: "End date cannot be before start date",
      });
      return;
    }

    const eventTitle =
      (values.appointmentStatus === "available" ? "Available" : "Reserved") +
      " Appointment";

    const eventColor: EventColor =
      values.appointmentStatus === "available" ? "emerald" : "sky";

    onSave({
      id: event?.id || "",
      title: eventTitle,
      start,
      end,
      color: eventColor,
      appointmentStatus: values.appointmentStatus,
      patientIdentificationNumber: values.patientIdentificationNumber,
    });

    // resetForm();
    form.reset();
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  // Updated color options to match types.ts
  // const colorOptions: Array<{
  //   value: EventColor;
  //   label: string;
  //   bgClass: string;
  //   borderClass: string;
  // }> = [
  //   {
  //     value: "sky",
  //     label: "Sky",
  //     bgClass: "bg-sky-400 data-[state=checked]:bg-sky-400",
  //     borderClass: "border-sky-400 data-[state=checked]:border-sky-400",
  //   },
  //   {
  //     value: "amber",
  //     label: "Amber",
  //     bgClass: "bg-amber-400 data-[state=checked]:bg-amber-400",
  //     borderClass: "border-amber-400 data-[state=checked]:border-amber-400",
  //   },
  //   {
  //     value: "violet",
  //     label: "Violet",
  //     bgClass: "bg-violet-400 data-[state=checked]:bg-violet-400",
  //     borderClass: "border-violet-400 data-[state=checked]:border-violet-400",
  //   },
  //   {
  //     value: "rose",
  //     label: "Rose",
  //     bgClass: "bg-rose-400 data-[state=checked]:bg-rose-400",
  //     borderClass: "border-rose-400 data-[state=checked]:border-rose-400",
  //   },
  //   {
  //     value: "emerald",
  //     label: "Emerald",
  //     bgClass: "bg-emerald-400 data-[state=checked]:bg-emerald-400",
  //     borderClass: "border-emerald-400 data-[state=checked]:border-emerald-400",
  //   },
  //   {
  //     value: "orange",
  //     label: "Orange",
  //     bgClass: "bg-orange-400 data-[state=checked]:bg-orange-400",
  //     borderClass: "border-orange-400 data-[state=checked]:border-orange-400",
  //   },
  // ];

  return (
    <Form {...form}>
      <form id="event-dialog-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {event?.id ? "Edit Appointment" : "Create Appointment"}
              </DialogTitle>

              <DialogDescription className="sr-only">
                {event?.id
                  ? "Edit the details of this appointment"
                  : "Add a new appointment to your schedule"}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 flex flex-col gap-6">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>Start Date</FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
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
                                <span>Pick a date</span>
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

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>Start Time</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>End Date</FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
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
                                <span>Pick a date</span>
                              )}

                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              form.clearErrors("endTime");
                              field.onChange(value);
                            }}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>End Time</FormLabel>

                      <Select
                        onValueChange={(value) => {
                          form.clearErrors("endDate");
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="appointmentStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4">
                    <FormLabel>Appointment Status</FormLabel>

                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="available" />
                          </FormControl>

                          <FormLabel className="font-normal">
                            Available
                          </FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="reserved" />
                          </FormControl>

                          <FormLabel className="font-normal">
                            Reserved
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("appointmentStatus") === "reserved" && (
                <FormField
                  control={form.control}
                  name="patientIdentificationNumber"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col gap-4">
                      <FormLabel>Patient Identification Number</FormLabel>

                      <div className="relative">
                        <FormControl>
                          <Input
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
                            fieldState.invalid && "text-destructive-foreground",
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
              )}
            </div>

            <DialogFooter className="flex-row sm:justify-between">
              {event?.id && isAdmin && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleDelete}
                  aria-label="Delete event"
                >
                  <TrashIcon size={16} aria-hidden="true" />
                </Button>
              )}
              <div className="flex flex-1 justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>

                <Button type="submit" form="event-dialog-form">
                  Save
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
