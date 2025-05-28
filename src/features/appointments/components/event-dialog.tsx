"use client";

import { useEffect, useState } from "react";
import { RiCalendarLine, RiDeleteBinLine } from "@remixicon/react";
import { format } from "date-fns";

import type {
  CalendarEvent,
  EventColor,
} from "@/features/appointments/types/index";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import { Textarea } from "@/shared/components/ui/textarea";
import { useIsAdmin } from "@/shared/hooks/is-admin";
import { useSession } from "@/shared/hooks/use-session";
import { toast } from "sonner";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const isAdmin = useIsAdmin();
  const { data: session } = useSession();
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [start, setStart] = useState<Date>(event?.start || new Date());
  const [end, setEnd] = useState<Date>(event?.end || new Date());
  const [allDay, setAllDay] = useState(event?.allDay || false);
  const [color, setColor] = useState<EventColor>(event?.color || "sky");
  const [location, setLocation] = useState(event?.location || "");
  const [type, setType] = useState<"virtual" | "in-person">(
    event?.type || "in-person",
  );
  const [meetingLink, setMeetingLink] = useState(event?.meetingLink || "");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setStart(new Date(event.start));
      setEnd(new Date(event.end));
      setAllDay(event.allDay || false);
      setColor(event.color || "sky");
      setLocation(event.location || "");
      setType(event.type || "in-person");
      setMeetingLink(event.meetingLink || "");
    }
  }, [event]);

  const handleSave = () => {
    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    if (type === "virtual" && !meetingLink) {
      toast.error("Please enter a meeting link for virtual appointments");
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in to create appointments");
      return;
    }

    const updatedEvent: CalendarEvent = {
      ...event!,
      title,
      description,
      start,
      end,
      allDay,
      color,
      location,
      type,
      meetingLink: type === "virtual" ? meetingLink : undefined,
      userId: isAdmin ? event?.userId || "" : session.user.id,
      doctorId: isAdmin ? session.user.id : event?.doctorId || "",
      status: event?.status || "available",
    };

    onSave(updatedEvent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Edit Event" : "New Event"}</DialogTitle>
          <DialogDescription>
            {isAdmin
              ? "Create or edit availability slots"
              : "Book an appointment"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAdmin ? "Availability Slot" : "Appointment Title"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description"
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value: "virtual" | "in-person") => setType(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person">In-person</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual">Virtual</Label>
              </div>
            </RadioGroup>
          </div>
          {type === "virtual" && (
            <div className="grid gap-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Enter meeting link"
              />
            </div>
          )}
          {type === "in-person" && (
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label>Date & Time</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !start && "text-muted-foreground",
                    )}
                  >
                    <RiCalendarLine className="mr-2 h-4 w-4" />
                    {start ? format(start, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={start}
                    onSelect={(date) => date && setStart(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !end && "text-muted-foreground",
                    )}
                  >
                    <RiCalendarLine className="mr-2 h-4 w-4" />
                    {end ? format(end, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={end}
                    onSelect={(date) => date && setEnd(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Color</Label>
            <Select
              value={color}
              onValueChange={(value: EventColor) => setColor(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sky">Sky</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="violet">Violet</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="emerald">Emerald</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked as boolean)}
            />
            <Label htmlFor="allDay">All day</Label>
          </div>
        </div>
        <DialogFooter>
          {event?.id && (
            <Button
              variant="destructive"
              onClick={() => onDelete(event.id)}
              className="mr-auto"
            >
              <RiDeleteBinLine className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
