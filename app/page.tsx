import { Button } from "@/components/ui/button";
import { EventList } from "@/components/event-list";
import { getUpcomingEvents } from "@/lib/data/events";
import Link from "next/link";
import { HomeHero } from "@/components/home/home-hero";
import { FeaturesGrid } from "@/components/home/features-grid";

export default async function Home() {
  const events = await getUpcomingEvents(3);

  return (
    <div className="min-h-screen bg-gradient-premium">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <HomeHero />

        {/* Featured Events */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Upcoming Buzz</h2>
              <p className="text-gray-500 mt-2 text-lg font-medium">Don't miss out on what's happening this month.</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-primary hover:text-secondary hover:bg-secondary/10 group text-lg font-bold">
                View all events
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </Link>
          </div>
          <EventList events={events} />
        </section>

        {/* Features Grid */}
        <FeaturesGrid />
      </div>
    </div>
  );
}
