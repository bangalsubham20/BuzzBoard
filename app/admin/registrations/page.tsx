import { requireAdmin } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersIcon, TicketIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { RegistrationsFilter } from "@/components/admin/registrations-filter";
import { ExportRegistrationsButton } from "@/components/admin/export-registrations-button";

export const metadata = {
  title: "Manage Registrations | Admin Dashboard",
  description: "View and manage all event registrations",
};

interface RegistrationsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminRegistrationsPage({
  searchParams,
}: RegistrationsPageProps) {
  await requireAdmin();

  // Await searchParams since it's now a Promise
  const params = await searchParams;

  const eventId = params.eventId as string;
  const search = params.search as string;
  const status = params.status as string;

  // Build filter conditions
  const where: any = {};

  if (eventId) {
    where.eventId = eventId;
  }

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { user: { jisid: { contains: search, mode: "insensitive" } } },
      { ticketId: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status === "upcoming") {
    where.event = { date: { gte: new Date() } };
  } else if (status === "past") {
    where.event = { date: { lt: new Date() } };
  }

  const registrations = await prisma.registration.findMany({
    where,
    include: {
      user: {
        select: { name: true, email: true, jisid: true },
      },
      event: {
        select: { title: true, date: true, venue: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get events for filter dropdown
  const events = await prisma.event.findMany({
    select: { id: true, title: true, date: true },
    orderBy: { date: "desc" },
  });

  // Get selected event details if filtering by event
  const selectedEvent = eventId
    ? await prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true, date: true, venue: true },
    })
    : null;

  // Get statistics
  const totalRegistrations = await prisma.registration.count();
  const upcomingRegistrations = await prisma.registration.count({
    where: { event: { date: { gte: new Date() } } },
  });
  const todayRegistrations = await prisma.registration.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">
          Manage <span className="text-gradient">Registrations</span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg font-medium">
          {selectedEvent
            ? `Registrations for "${selectedEvent.title}"`
            : "Monitor and manage student event participation"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">
              Total Count
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TicketIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">
              {eventId ? registrations.length : totalRegistrations}
            </div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
              {eventId ? "For this event" : "All time registrations"}
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
            <div className="text-3xl font-black text-primary">{upcomingRegistrations}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
              Active registrations
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">
              Today
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UsersIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{todayRegistrations}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Registered today</p>
          </CardContent>
        </Card>
      </div>

      {/* Selected Event Info */}
      {selectedEvent && (
        <Card className="mb-8 glass border-secondary/20 bg-secondary/5 rounded-3xl overflow-hidden shadow-xl shadow-secondary/5">
          <CardHeader className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                  <CalendarIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-primary tracking-tight">
                    {selectedEvent.title}
                  </CardTitle>
                  <CardDescription className="text-primary/60 font-bold flex items-center mt-1">
                    <span className="text-secondary mr-2">•</span>
                    {formatDateTime(selectedEvent.date)} <span className="mx-2">|</span> {selectedEvent.venue}
                  </CardDescription>
                </div>
              </div>
              <Link href="/admin/registrations">
                <Button variant="outline" className="rounded-2xl glass border-primary/10 text-primary font-bold px-6 h-12 transition-all hover:bg-primary/5">
                  View All Registrations
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-8 glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold text-primary tracking-tight">Filter Registrations</CardTitle>
            <ExportRegistrationsButton
              registrations={registrations}
              eventTitle={selectedEvent?.title}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <RegistrationsFilter events={events} />
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
          <CardTitle className="text-xl font-bold text-primary">
            {selectedEvent
              ? "Participants"
              : "Global Ledger"}{" "}
            ({registrations.length})
          </CardTitle>
          <CardDescription className="text-primary/40 font-bold uppercase text-[10px] tracking-widest mt-1">
            {selectedEvent
              ? "Students registered for this specific experience"
              : "Consolidated record of all event enrollment"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {registrations.length === 0 ? (
            <div className="text-center py-24">
              <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <TicketIcon className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                No records found
              </h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto">
                {search || status || eventId
                  ? "Try adjusting your filters to see more results"
                  : "Attendance log is currently empty."}
              </p>
              {!eventId && (
                <Link href="/admin/events">
                  <Button className="mt-8 bg-primary hover:bg-secondary rounded-2xl font-bold px-8">Manage Events</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-primary/5">
                  <TableRow className="hover:bg-transparent border-primary/5">
                    <TableHead className="py-4 pl-6 text-primary font-bold uppercase text-[10px] tracking-widest">Student</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Event</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Registration Date</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Event Date</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Ticket ID</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="py-4 pr-6 text-right text-primary font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id} className="hover:bg-primary/[0.02] border-primary/5 transition-colors">
                      <TableCell className="py-5 pl-6">
                        <div>
                          <div className="font-bold text-primary">
                            {registration.user.name}
                          </div>
                          <div className="text-secondary font-bold text-[10px] uppercase tracking-wider">
                            {registration.user.jisid}
                          </div>
                          <div className="text-[10px] text-primary/40 font-bold uppercase mt-0.5">
                            {registration.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="max-w-[150px]">
                          <div className="font-bold text-primary line-clamp-1">
                            {registration.event.title}
                          </div>
                          <div className="text-primary/40 font-bold text-[10px] uppercase tracking-wider line-clamp-1">
                            {registration.event.venue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="text-sm font-bold text-primary">
                          {formatDate(registration.createdAt)}
                          <div className="text-primary/40 font-bold text-[10px] uppercase tracking-wider">
                            {new Date(
                              registration.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="text-sm font-bold text-primary">
                          {formatDate(registration.event.date)}
                          <div className="text-secondary font-bold text-[10px] uppercase tracking-wider">
                            {new Date(
                              registration.event.date
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <code className="text-xs bg-primary/5 text-primary font-bold px-3 py-1 rounded-full border border-primary/10">
                          {registration.ticketId}
                        </code>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          className={`${new Date(registration.event.date) > new Date()
                              ? "bg-secondary text-white"
                              : "bg-primary/10 text-primary/40"
                            } border-none font-bold py-1 px-3 rounded-full`}
                        >
                          {new Date(registration.event.date) > new Date()
                            ? "Active"
                            : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/dashboard/tickets/${registration.ticketId}`}
                          >
                            <Button variant="outline" size="sm" className="rounded-xl glass border-primary/10 text-primary font-bold hover:bg-primary/5 transition-all">
                              View Ticket
                            </Button>
                          </Link>
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
