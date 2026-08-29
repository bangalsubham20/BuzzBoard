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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-16 md:space-y-24">
        {/* Hero Section */}
        <HomeHero />

        {/* Featured Events */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-primary">Upcoming <span className="text-gradient">Buzz</span></h2>
              <p className="text-gray-600 mt-2 text-base sm:text-lg font-medium">Don't miss out on what's happening on campus this month.</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-primary hover:text-secondary hover:bg-secondary/10 group text-base sm:text-lg font-bold rounded-2xl">
                View all events
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 transition-transform group-hover:translate-x-1.5 text-secondary"
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
