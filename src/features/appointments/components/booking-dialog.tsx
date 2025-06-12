"use client";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { TypographyP } from "@/shared/components/ui/typography";

import type { CalendarEvent } from "@/features/appointments/types";

interface BookingDialogProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

const bookingDialogFormSchema = z.object({
  appointmentMethod: z.enum(["online", "in-person"]),
});

type BookingDialogFormValues = z.infer<typeof bookingDialogFormSchema>;

export function BookingDialog({ event, isOpen, onClose }: BookingDialogProps) {
  const form = useForm<BookingDialogFormValues>({
    resolver: zodResolver(bookingDialogFormSchema),
    defaultValues: {
      appointmentMethod: "in-person",
    },
  });

  const onSubmit = (values: BookingDialogFormValues) => {
    console.log(values);

    // form.reset();
  };

  return (
    <Form {...form}>
      <form id="event-dialog-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>

              <DialogDescription className="sr-only">
                Book an appointment for this date
              </DialogDescription>
            </DialogHeader>

            {event && (
              <div className="flex flex-col gap-4">
                <TypographyP>
                  <span className="font-bold">Date:</span>{" "}
                  {format(event.start, "PPpp")}
                </TypographyP>
                {/* <TypographyP>
                Appointment method: {event?.appointmentMethod}
              </TypographyP> */}
              </div>
            )}

            <FormField
              control={form.control}
              name="appointmentMethod"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4">
                  <FormLabel>Appointment Method</FormLabel>

                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="online" />
                        </FormControl>

                        <FormLabel className="font-normal">Online</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="in-person" />
                        </FormControl>

                        <FormLabel className="font-normal">In-person</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-row sm:justify-between">
              <div className="flex flex-1 justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>

                <Button type="submit" form="event-dialog-form">
                  Book Appointment
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
