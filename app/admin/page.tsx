import { requireAdmin } from "@/lib/auth";
import { getEventsByOrganizer } from "@/lib/data/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, CalendarIcon, UsersIcon, SettingsIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, isEventUpcoming } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Dashboard | JIS College Event Management",
  description: "Admin panel for managing events and users",
};

export default async function AdminPage() {
  const user = await requireAdmin();
  const events = await getEventsByOrganizer(user.id);

  // Get total statistics
  const totalEvents = await prisma.event.count();
  const totalUsers = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalRegistrations = await prisma.registration.count();

  const upcomingEvents = events.filter((event) => isEventUpcoming(event.date));
  const pastEvents = events.filter((event) => !isEventUpcoming(event.date));

  return (
    <div className="min-h-screen bg-gradient-premium">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Admin <span className="text-gradient">Command Center</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Monitor campus activity and orchestrate upcoming events.
            </p>
          </div>
          <Link href="/admin/events/create">
            <Button className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Event
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Events", value: totalEvents, icon: CalendarIcon, color: "blue", desc: "System-wide" },
            { label: "Total Students", value: totalUsers, icon: UsersIcon, color: "purple", desc: "Active members" },
            { label: "Registrations", value: totalRegistrations, icon: SettingsIcon, color: "indigo", desc: "All-time" },
            { label: "Your Events", value: events.length, icon: PlusIcon, color: "blue", desc: "Created by you" }
          ].map((stat, i) => (
            <Card key={i} className="glass border-white/20 rounded-3xl overflow-hidden transition-all hover:shadow-xl group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">{stat.label}</CardTitle>
                <div className={`h-8 w-8 rounded-lg bg-${stat.color}-100/50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1 font-medium">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Recent Events */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Your Event Portfolio</h2>
              <Link href="/admin/events">
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 rounded-2xl">
                  Manage All
                </Button>
              </Link>
            </div>

            <Card className="glass border-white/20 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                {events.length === 0 ? (
                  <div className="text-center py-20">
                    <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No events yet</h3>
                    <p className="text-gray-500 mb-6 max-w-[200px] mx-auto">Build your first college experience today.</p>
                    <Link href="/admin/events/create">
                      <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700">Create Event</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {events.slice(0, 5).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-6 transition-colors hover:bg-white/5"
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">
                            {event.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1 font-medium">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                            <span>{formatDate(event.date)}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <MapPinIcon className="h-3.5 w-3.5 mr-1.5" />
                            <span>{event.venue}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            className={
                              isEventUpcoming(event.date)
                                ? "bg-blue-100 text-blue-700 border-none px-3 rounded-full"
                                : "bg-gray-100 text-gray-600 border-none px-3 rounded-full"
                            }
                          >
                            {isEventUpcoming(event.date) ? "Live" : "Ended"}
                          </Badge>
                          <Link href={`/admin/events/${event.id}`}>
                            <Button variant="outline" size="sm" className="rounded-xl glass">
                              Manage
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">Administrative Suite</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Create Event", href: "/admin/events/create", icon: PlusIcon, color: "blue" },
                { label: "Manage Inventory", href: "/admin/events", icon: CalendarIcon, color: "indigo" },
                { label: "User Directory", href: "/admin/users", icon: UsersIcon, color: "purple" },
                { label: "Registration Log", href: "/admin/registrations", icon: SettingsIcon, color: "slate" }
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <Button
                    className="w-full h-24 glass border-white/20 hover:bg-white/50 hover:shadow-xl transition-all group rounded-3xl flex flex-col items-center justify-center gap-2 p-0"
                    variant="outline"
                  >
                    <div className={`h-10 w-10 rounded-xl bg-${action.color}-100/50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                    </div>
                    <span className="font-bold text-gray-700">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>

            <Link href="/attendance/scan" className="mt-6 block">
              <Button className="w-full h-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/20 text-lg font-bold">
                Launch Attendance Scanner
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
