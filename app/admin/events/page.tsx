import { requireAdmin } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, EditIcon, UsersIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, isEventUpcoming } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { EventsFilter } from "@/components/admin/events-filter";
import { DeleteEventButton } from "@/components/admin/delete-event-button";

export const metadata = {
  title: "Manage Events | Admin Dashboard",
  description: "View and manage all events in the system",
};

interface EventsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminEventsPage({
  searchParams,
}: EventsPageProps) {
  await requireAdmin();

  // Await searchParams since it's now a Promise
  const params = await searchParams;

  // Build filter conditions
  const where: any = {};
  const search = params.search as string;
  const status = params.status as string;
  const venue = params.venue as string;

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status === "upcoming") {
    where.date = { gte: new Date() };
  } else if (status === "past") {
    where.date = { lt: new Date() };
  }

  if (venue && venue !== "all") {
    where.venue = venue;
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      organizer: {
        select: { name: true, jisid: true },
      },
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { date: "desc" },
  });

  const totalEvents = await prisma.event.count();
  const upcomingEvents = await prisma.event.count({
    where: { date: { gte: new Date() } },
  });
  const totalRegistrations = await prisma.registration.count();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">Manage <span className="text-gradient">Events</span></h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            View and manage all campus experiences.
          </p>
        </div>
        <Link href="/admin/events/create">
          <Button className="bg-primary hover:bg-secondary h-12 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">Total Events</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{totalEvents}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
              All events in system
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">
              Upcoming
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarIcon className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{upcomingEvents}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
              Events scheduled ahead
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">
              Registrations
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UsersIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{totalRegistrations}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
              All time registrations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 glass border-white/20 rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xl font-bold text-primary">Filter Events</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <EventsFilter />
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-primary">All Events ({events.length})</CardTitle>
              <CardDescription className="text-primary/40 font-bold uppercase text-[10px] tracking-widest mt-1">Manage platform inventory</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <div className="text-center py-24">
              <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                No events found
              </h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
                {search || status || venue
                  ? "Try adjusting your filters to find what you're looking for."
                  : "Start by creating your first event to reach the community."}
              </p>
              <Link href="/admin/events/create">
                <Button className="bg-primary hover:bg-secondary rounded-2xl font-bold px-8">Create Event</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-primary/5">
                  <TableRow className="hover:bg-transparent border-primary/5">
                    <TableHead className="font-bold text-primary py-4 pl-6 uppercase text-[10px] tracking-widest">Event</TableHead>
                    <TableHead className="font-bold text-primary py-4 uppercase text-[10px] tracking-widest">Date & Time</TableHead>
                    <TableHead className="font-bold text-primary py-4 uppercase text-[10px] tracking-widest">Venue</TableHead>
                    <TableHead className="font-bold text-primary py-4 uppercase text-[10px] tracking-widest">Organizer</TableHead>
                    <TableHead className="font-bold text-primary py-4 uppercase text-[10px] tracking-widest">Registrations</TableHead>
                    <TableHead className="font-bold text-primary py-4 uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="font-bold text-primary py-4 pr-6 text-right uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} className="hover:bg-primary/[0.02] border-primary/5 transition-colors">
                      <TableCell className="py-5 pl-6">
                        <div>
                          <div className="font-bold text-primary text-base">{event.title}</div>
                          <div className="text-sm text-primary/40 font-medium line-clamp-1 mt-0.5">
                            {event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="text-sm">
                          <div className="font-bold text-primary">{formatDate(event.date)}</div>
                          <div className="text-secondary font-bold text-xs">
                            {new Date(event.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 font-bold text-primary/70">{event.venue}</TableCell>
                      <TableCell className="py-5">
                        <div className="text-sm">
                          <div className="font-bold text-primary">{event.organizer.name}</div>
                          <div className="text-primary/40 font-bold text-[10px] uppercase tracking-wider">
                            {event.organizer.jisid}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <Link href={`/admin/registrations?eventId=${event.id}`}>
                          <Button
                            variant="link"
                            className="p-0 h-auto font-black text-secondary hover:text-primary transition-colors"
                          >
                            {event._count.registrations} registered
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          className={`${isEventUpcoming(event.date)
                            ? "bg-secondary text-white"
                            : "bg-primary/10 text-primary/40"
                            } border-none font-bold py-1 px-3 rounded-full`}
                        >
                          {isEventUpcoming(event.date) ? "Upcoming" : "Past"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/events/${event.id}`}>
                            <Button variant="outline" size="sm" className="rounded-xl glass border-primary/10 text-primary hover:bg-primary/5 transition-all">
                              <EditIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/admin/registrations?eventId=${event.id}`}
                          >
                            <Button variant="outline" size="sm" className="rounded-xl glass border-primary/10 text-primary hover:bg-primary/5 transition-all">
                              <UsersIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteEventButton
                            eventId={event.id}
                            eventTitle={event.title}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
