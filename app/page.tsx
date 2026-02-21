"use client";

import { Button } from "@/components/ui/button";
import { EventList } from "@/components/event-list";
import { getEvents } from "@/lib/data/events";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Event } from "@prisma/client";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-premium">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden rounded-3xl mb-16">
          <div className="absolute inset-0 bg-primary/5 -z-10 blur-3xl opacity-50" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-white/50 backdrop-blur-sm rounded-full">
                  Campus Life Reimagined
                </Badge>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block text-primary">JIS College</span>
                  <span className="text-gradient">BuzzBoard</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-gray-600 md:text-xl/relaxed lg:text-2xl/relaxed font-medium">
                  Your hub for discovery, connection, and growth. Stay updated with the pulse of JIS College of Engineering.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-6"
              >
                <Link href="/events">
                  <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-secondary shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    Explore Events
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg glass border-primary/10 text-primary transition-all hover:scale-105 active:scale-95">
                    Join Community
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Upcoming Buzz</h2>
              <p className="text-gray-500 mt-2 text-lg">Don't miss out on what's happening this month.</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-primary hover:text-secondary hover:bg-secondary/10 group text-lg">
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
          <EventList events={events.slice(0, 3)} />
        </motion.section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Discover Events",
              desc: "From hackathons to cultural fests, find events that match your passion.",
              icon: (
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              )
            },
            {
              title: "Smart Registration",
              desc: "One-click registration and digital tickets for all college activities.",
              icon: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            },
            {
              title: "Real-time Access",
              desc: "Instant updates and QR code scanning for seamless attendance management.",
              icon: <path d="M12 2v20M2 12h20" />
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group"
            >
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}

function Badge({ children, className, variant }: any) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
