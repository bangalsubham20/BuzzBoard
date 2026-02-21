"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Event } from "@prisma/client";
import { motion } from "framer-motion";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-20 glass rounded-3xl">
        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">No events found</h3>
        <p className="mt-2 text-gray-500 max-w-xs mx-auto text-lg cursor-default">
          The campus is quiet for now. Check back soon for the next big thing!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            className="overflow-hidden glass border-white/20 transition-all hover:shadow-2xl hover:shadow-primary/10 group h-full flex flex-col rounded-3xl"
          >
            <CardHeader className="p-0 relative h-52 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="absolute top-4 left-4 z-20">
                <Badge className="glass border-white/30 text-white bg-white/10 backdrop-blur-md px-3 py-1 font-bold">
                  Upcoming
                </Badge>
              </div>
              <div className="h-full w-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-secondary/50"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 z-20">
                <p className="text-white/80 text-sm font-bold flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-secondary" />
                  {formatDate(event.date)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <h3 className="font-bold text-2xl mb-3 text-primary group-hover:text-secondary transition-colors line-clamp-2">
                {event.title}
              </h3>
              <div className="flex items-center text-gray-500 mb-4 text-sm font-bold">
                <MapPinIcon className="h-4 w-4 mr-2 text-secondary" />
                <span>{event.venue}</span>
              </div>
              <p className="text-gray-600 line-clamp-3 leading-relaxed font-medium">
                {event.description}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0 mt-auto">
              <Link href={`/events/${event.id}`} className="w-full">
                <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-secondary shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-all font-bold">
                  Get My Ticket
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
