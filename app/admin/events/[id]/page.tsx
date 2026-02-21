import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditEventForm } from "@/components/admin/edit-event-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime, isEventUpcoming } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `Edit ${event.title} | Admin Dashboard`,
    description: `Edit event details for ${event.title}`,
  };
}
export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: {
        select: { name: true, jisid: true },
      },
      _count: {
        select: { registrations: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/events">
            <Button variant="link" className="pl-0 text-primary hover:text-secondary font-bold transition-colors">
              ← Back to Events
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">Modify <span className="text-gradient">Experience</span></h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">Refining the details for event organizers and attendees</p>
          </div>
          <Badge
            className={`${isEventUpcoming(event.date) ? "bg-secondary text-white" : "bg-primary/10 text-primary"
              } px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest border-none`}
          >
            {isEventUpcoming(event.date) ? "Upcoming" : "Past Event"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-xl shadow-primary/5">
              <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
                <CardTitle className="text-xl font-bold text-primary">Snapshot</CardTitle>
                <CardDescription className="text-primary/40 font-bold uppercase text-[10px] tracking-widest mt-1">Real-time event data</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-extrabold text-2xl text-primary mb-3 leading-tight">{event.title}</h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">{event.description}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-primary/5">
                  <div className="flex items-center space-x-4 group">
                    <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all text-secondary">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Timestamp</p>
                      <p className="font-bold text-primary">{formatDateTime(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-primary">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Basecamp</p>
                      <p className="font-bold text-primary">{event.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group">
                    <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all text-secondary">
                      <UsersIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Community</p>
                      <p className="font-bold text-primary">{event._count.registrations} Confirmed</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-primary/5">
                  <Link href={`/admin/registrations?eventId=${event.id}`}>
                    <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-secondary text-white font-bold transition-all shadow-lg shadow-primary/20">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      Manage Roster
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-primary-gradient text-white shadow-xl shadow-primary/20 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Created by</p>
                <p className="font-bold">{event.organizer.name}</p>
                <p className="text-xs opacity-60 mt-0.5">{formatDate(event.createdAt)}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <ClockIcon size={24} className="opacity-40" />
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-3">
            <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
              <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                <CardTitle className="text-2xl font-bold text-primary">Refine Details</CardTitle>
                <CardDescription className="text-primary/40 font-bold uppercase text-[10px] tracking-widest mt-1">Update parameters for this experience</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <EditEventForm event={event} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
