import { getEvents } from "@/lib/data/events";
import { EventList } from "@/components/event-list";
import { Suspense } from "react";
import { EventsFilter } from "@/components/events-filter";

export const metadata = {
  title: "Events | JIS College Event Management",
  description: "Browse all events at JIS College of Engineering",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams since it's now a Promise
  const params = await searchParams;
  const events = await getEvents(params);

  return (
    <div className="min-h-screen bg-gradient-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight">
              Event <span className="text-gradient">Explorer</span>
            </h1>
            <p className="text-gray-600 mt-2 text-base sm:text-lg font-medium">
              Discover and participate in upcoming campus experiences.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Suspense fallback={<div className="h-10 w-48 bg-primary/5 animate-pulse rounded-2xl" />}>
              <EventsFilter />
            </Suspense>
          </div>
        </div>

        <EventList events={events} />
      </div>
    </div>
  );
}
