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
            className="overflow-hidden graphic-card rounded-[2rem] group h-full flex flex-col border-secondary/20"
          >
            <CardHeader className="p-0 relative h-56 overflow-hidden bg-primary-gradient">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <Badge className="graphic-badge px-3 py-1 text-xs">
                  ✦ Live Event
                </Badge>
              </div>
              <div className="h-full w-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700 opacity-20 group-hover:opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 z-20">
                <p className="text-white text-sm font-extrabold flex items-center bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                  <CalendarIcon className="h-4 w-4 mr-2 text-secondary" />
                  {formatDate(event.date)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <h3 className="font-black text-2xl mb-3 text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                {event.title}
              </h3>
              <div className="flex items-center text-gray-700 mb-4 text-sm font-bold bg-secondary/10 px-3 py-1.5 rounded-xl w-fit border border-secondary/20">
                <MapPinIcon className="h-4 w-4 mr-2 text-secondary" />
                <span>{event.venue}</span>
              </div>
              <p className="text-gray-600 line-clamp-3 leading-relaxed font-medium">
                {event.description}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0 mt-auto">
              <Link href={`/events/${event.id}`} className="w-full">
                <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-secondary text-white shadow-graphic font-extrabold text-base tracking-wide transition-all group-hover:scale-[1.02]">
                  Reserve Pass
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
