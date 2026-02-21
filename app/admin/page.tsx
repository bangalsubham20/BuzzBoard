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
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
              Admin <span className="text-gradient">Command Center</span>
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Monitor campus activity and orchestrate upcoming events.
            </p>
          </div>
          <Link href="/admin/events/create">
            <Button className="h-12 px-6 rounded-2xl bg-primary hover:bg-secondary shadow-lg shadow-primary/20 transition-all hover:scale-105 font-bold">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Event
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Events", value: totalEvents, icon: CalendarIcon, lightBg: "secondary/10", darkText: "secondary", desc: "System-wide" },
            { label: "Students", value: totalUsers, icon: UsersIcon, lightBg: "primary/10", darkText: "primary", desc: "Active members" },
            { label: "Registrations", value: totalRegistrations, icon: SettingsIcon, lightBg: "secondary/10", darkText: "secondary", desc: "All-time" },
            { label: "Your Events", value: events.length, icon: PlusIcon, lightBg: "primary/10", darkText: "primary", desc: "Created by you" }
          ].map((stat, i) => (
            <Card key={i} className="glass border-white/20 rounded-3xl overflow-hidden transition-all hover:shadow-xl group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/60">{stat.label}</CardTitle>
                <div className={`h-8 w-8 rounded-lg bg-${stat.lightBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-4 w-4 text-${stat.darkText}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1 font-bold">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Recent Events */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-primary tracking-tight">Your Event Portfolio</h2>
              <Link href="/admin/events">
                <Button variant="ghost" className="text-primary hover:text-secondary hover:bg-secondary/10 rounded-2xl font-bold">
                  Manage All
                </Button>
              </Link>
            </div>

            <Card className="glass border-white/20 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                {events.length === 0 ? (
                  <div className="text-center py-20 border-dashed border-2 border-primary/10 m-6 rounded-3xl">
                    <CalendarIcon className="h-16 w-16 text-primary/20 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-primary">No events yet</h3>
                    <p className="text-gray-500 mb-6 max-w-[200px] mx-auto font-medium">Build your first college experience today.</p>
                    <Link href="/admin/events/create">
                      <Button className="rounded-2xl bg-primary hover:bg-secondary font-bold">Create Event</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-primary/5">
                    {events.slice(0, 5).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-6 transition-colors hover:bg-primary/5"
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-primary">
                            {event.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1 font-bold">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-secondary" />
                            <span>{formatDate(event.date)}</span>
                            <span className="mx-2 text-primary/20">•</span>
                            <MapPinIcon className="h-3.5 w-3.5 mr-1.5 text-secondary" />
                            <span>{event.venue}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            className={
                              isEventUpcoming(event.date)
                                ? "bg-secondary/10 text-secondary border-none px-3 rounded-full font-bold"
                                : "bg-primary/5 text-primary/60 border-none px-3 rounded-full font-bold"
                            }
                          >
                            {isEventUpcoming(event.date) ? "Live" : "Ended"}
                          </Badge>
                          <Link href={`/admin/events/${event.id}`}>
                            <Button variant="outline" size="sm" className="rounded-xl glass border-primary/10 text-primary font-bold">
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
            <h2 className="text-2xl font-extrabold text-primary tracking-tight mb-8">Administrative Suite</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Create Event", href: "/admin/events/create", icon: PlusIcon, bg: "primary/10", text: "primary" },
                { label: "Manage Inventory", href: "/admin/events", icon: CalendarIcon, bg: "secondary/10", text: "secondary" },
                { label: "User Directory", href: "/admin/users", icon: UsersIcon, bg: "primary/10", text: "primary" },
                { label: "Registration Log", href: "/admin/registrations", icon: SettingsIcon, bg: "secondary/10", text: "secondary" }
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <Button
                    className="w-full h-24 glass border-white/20 hover:bg-white/50 hover:shadow-xl transition-all group rounded-3xl flex flex-col items-center justify-center gap-2 p-0"
                    variant="outline"
                  >
                    <div className={`h-10 w-10 rounded-xl bg-${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className={`h-5 w-5 text-${action.text}`} />
                    </div>
                    <span className="font-bold text-primary/80 group-hover:text-primary transition-colors">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>

            <Link href="/attendance/scan" className="mt-6 block">
              <Button className="w-full h-16 rounded-3xl bg-primary-gradient hover:opacity-90 shadow-xl shadow-primary/20 text-lg font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99]">
                Launch Attendance Scanner
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
