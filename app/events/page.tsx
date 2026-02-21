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
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Event <span className="text-gradient">Explorer</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">
              Discover and participate in upcoming campus experiences.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Suspense fallback={<div className="h-10 w-48 bg-gray-200 animate-pulse rounded-2xl" />}>
              <EventsFilter />
            </Suspense>
          </div>
        </div>

        <EventList events={events} />
      </div>
    </div>
  );
}
