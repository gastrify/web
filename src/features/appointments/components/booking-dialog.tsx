"use client";

import { useState } from "react";
import { format } from "date-fns";

import type { CalendarEvent } from "@/features/appointments/types";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useSession } from "@/shared/hooks/use-session";
import { toast } from "sonner";

interface BookingDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (event: CalendarEvent) => void;
}

export function BookingDialog({
  event,
  isOpen,
  onClose,
  onBook,
}: BookingDialogProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!event) return null;

  // Check if the event is already booked by the current user
  const isBookedByUser =
    event.status === "booked" && event.userId === session?.user.id;

  const handleBook = () => {
    const updatedEvent: CalendarEvent = {
      ...event,
      userId: session?.user.id || "",
      status: "booked",
    };

    onBook(updatedEvent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isBookedByUser ? "Your Appointment" : "Book Appointment"}
          </DialogTitle>
          <DialogDescription>
            {isBookedByUser
              ? "This is your booked appointment"
              : "Book this available time slot for your appointment"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Date & Time</Label>
            <div className="text-sm text-muted-foreground">
              {format(new Date(event.start), "EEEE, MMMM d, yyyy")}
              <br />
              {format(new Date(event.start), "h:mm a")} -{" "}
              {format(new Date(event.end), "h:mm a")}
            </div>
          </div>

          {isBookedByUser && (
            // Show booked appointment details
            <div className="grid gap-2">
              <Label>Appointment Details</Label>
              <div className="text-sm text-muted-foreground">
                <div className="font-medium">{event.title}</div>
                {event.description && (
                  <div className="mt-1">{event.description}</div>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isBookedByUser ? "Close" : "Cancel"}
          </Button>
          {!isBookedByUser && (
            <Button onClick={handleBook}>Book Appointment</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
