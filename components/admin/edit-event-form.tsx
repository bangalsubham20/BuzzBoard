"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Event } from "@prisma/client";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(3, "Venue must be at least 3 characters"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EditEventFormProps {
  event: Event;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Format date and time for form inputs
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toISOString().split("T")[0];
  const formattedTime = eventDate.toTimeString().slice(0, 5);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      date: formattedDate,
      time: formattedTime,
      venue: event.venue,
    },
  });

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      // Combine date and time
      const eventDateTime = new Date(`${data.date}T${data.time}`);

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          date: eventDateTime.toISOString(),
          venue: data.venue,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to update event");
        setIsLoading(false);
        return;
      }

      toast({
        title: "Event updated successfully",
        description: "The event details have been updated",
      });

      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-8 rounded-2xl border-2">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-bold ml-2">{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase tracking-widest text-primary/60">Experience Name</FormLabel>
                <FormControl>
                  <Input placeholder="Annual Tech Fest 2024" className="h-14 rounded-2xl border-primary/10 glass focus:ring-primary/20 focus:border-primary/30 font-bold text-primary placeholder:text-primary/20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase tracking-widest text-primary/60">Storyline & Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the event, its purpose, and what attendees can expect..."
                    className="min-h-[150px] rounded-2xl border-primary/10 glass focus:ring-primary/20 focus:border-primary/30 font-bold text-primary placeholder:text-primary/20 p-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-black uppercase tracking-widest text-primary/60">Date</FormLabel>
                  <FormControl>
                    <Input type="date" className="h-14 rounded-2xl border-primary/10 glass focus:ring-primary/20 focus:border-primary/30 font-bold text-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-black uppercase tracking-widest text-primary/60">Time</FormLabel>
                  <FormControl>
                    <Input type="time" className="h-14 rounded-2xl border-primary/10 glass focus:ring-primary/20 focus:border-primary/30 font-bold text-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase tracking-widest text-primary/60">Current Venue</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-primary/10 glass focus:ring-primary/20 focus:border-primary/30 font-bold text-primary">
                      <SelectValue placeholder="Select a venue" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20 rounded-2xl">
                      <SelectItem value="Auditorium" className="rounded-xl focus:bg-primary/5">Auditorium</SelectItem>
                      <SelectItem value="Seminar Hall" className="rounded-xl focus:bg-primary/5">Seminar Hall</SelectItem>
                      <SelectItem value="Sports Ground" className="rounded-xl focus:bg-primary/5">
                        Sports Ground
                      </SelectItem>
                      <SelectItem value="Computer Lab" className="rounded-xl focus:bg-primary/5">Computer Lab</SelectItem>
                      <SelectItem value="Library" className="rounded-xl focus:bg-primary/5">Library</SelectItem>
                      <SelectItem value="Conference Room" className="rounded-xl focus:bg-primary/5">
                        Conference Room
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button type="submit" disabled={isLoading} className="h-14 flex-1 rounded-2xl bg-primary hover:bg-secondary text-white font-bold shadow-lg shadow-primary/20 transition-all">
              {isLoading ? "Synchronizing..." : "Update Experience"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="h-14 flex-1 rounded-2xl glass border-primary/10 text-primary font-bold hover:bg-primary/5 transition-all"
              onClick={() => router.push("/admin/events")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
