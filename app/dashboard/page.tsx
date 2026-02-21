import { requireAuth } from "@/lib/auth";
import { getUserRegistrations } from "@/lib/data/registrations";
import { getEventsByOrganizer } from "@/lib/data/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TicketIcon, PlusIcon, UsersIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, isEventUpcoming } from "@/lib/utils";

export const metadata = {
  title: "Dashboard | JIS College Event Management",
  description: "Your personal dashboard for events and registrations",
};

export default async function DashboardPage() {
  const user = (await requireAuth()) as any;
  const registrations = await getUserRegistrations(user.id);
  const organizedEvents =
    user.role === "ADMIN" ? await getEventsByOrganizer(user.id) : [];

  const upcomingRegistrations = registrations.filter((reg) =>
    isEventUpcoming(reg.event.date)
  );
  const pastRegistrations = registrations.filter(
    (reg) => !isEventUpcoming(reg.event.date)
  );

  return (
    <div className="min-h-screen bg-gradient-premium">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">
            Welcome back, <span className="text-gradient">{user.name}</span>!
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            Your personalized hub for campus life and events.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass border-white/20 rounded-3xl overflow-hidden transition-all hover:shadow-xl group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/60">
                Upcoming Events
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarIcon className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-primary">
                {upcomingRegistrations.length}
              </div>
              <p className="text-xs text-gray-500 mt-1 font-bold">
                Confirmed spots
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 rounded-3xl overflow-hidden transition-all hover:shadow-xl group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/60">Total Tickets</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TicketIcon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-primary">{registrations.length}</div>
              <p className="text-xs text-gray-500 mt-1 font-bold">
                Lifetime experiences
              </p>
            </CardContent>
          </Card>

          {user.role === "ADMIN" && (
            <>
              <Card className="glass border-white/20 rounded-3xl overflow-hidden transition-all hover:shadow-xl group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/60">
                    Events Organized
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusIcon className="h-4 w-4 text-secondary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-primary">
                    {organizedEvents.length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-bold">
                    Content creator
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-white/20 rounded-3xl overflow-hidden transition-all hover:shadow-xl p-2">
                <div className="flex flex-col gap-2">
                  <Link href="/admin">
                    <Button size="sm" className="w-full h-10 rounded-2xl bg-primary hover:bg-secondary shadow-md font-bold">
                      Admin Panel
                    </Button>
                  </Link>
                  <Link href="/attendance/scan">
                    <Button size="sm" variant="outline" className="w-full h-10 rounded-2xl glass border-primary/10 text-primary font-bold">
                      Scan Attendance
                    </Button>
                  </Link>
                </div>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-primary tracking-tight">Your Next Adventures</h2>
              <Link href="/dashboard/tickets">
                <Button variant="ghost" className="text-primary hover:text-secondary hover:bg-secondary/10 rounded-2xl font-bold">
                  All Tickets
                </Button>
              </Link>
            </div>

            {upcomingRegistrations.length === 0 ? (
              <div className="text-center py-16 glass rounded-3xl border-dashed border-2 border-primary/20">
                <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-8 w-8 text-primary/40" />
                </div>
                <h3 className="text-lg font-bold text-primary">Empty calendar?</h3>
                <p className="text-gray-500 mb-6 max-w-[240px] mx-auto font-medium">
                  Discovery awaits. Explore what's happening on campus.
                </p>
                <Link href="/events">
                  <Button className="rounded-2xl px-8 bg-primary hover:bg-secondary font-bold">Browse Events</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingRegistrations.slice(0, 4).map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-5 glass border-white/20 rounded-3xl transition-all hover:shadow-lg group"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors">
                        {registration.event.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1 font-bold">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-secondary" />
                        <span>{formatDate(registration.event.date)}</span>
                        <span className="mx-2 text-primary/20">•</span>
                        <MapPinIcon className="h-3.5 w-3.5 mr-1.5 text-secondary" />
                        <span>{registration.event.venue}</span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/tickets/${registration.ticketId}`}
                    >
                      <Button variant="outline" size="sm" className="rounded-2xl glass hover:bg-secondary/10 hover:text-secondary border-primary/10 font-bold">
                        View Ticket
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-primary tracking-tight">Recent Activity</h2>
            </div>
            <Card className="glass border-white/20 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                {registrations.length === 0 ? (
                  <div className="text-center py-16">
                    <TicketIcon className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">No recent activity detected.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-primary/5">
                    {registrations.slice(0, 6).map((registration) => (
                      <div
                        key={registration.id}
                        className="flex items-center justify-between p-5 transition-colors hover:bg-primary/5"
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-primary">
                            {registration.event.title}
                          </h4>
                          <p className="text-sm text-gray-500 font-bold mt-0.5">
                            Joined {new Date(registration.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <Badge
                          className={
                            isEventUpcoming(registration.event.date)
                              ? "bg-secondary/10 text-secondary border-none px-3 rounded-full font-bold"
                              : "bg-primary/5 text-primary/60 border-none px-3 rounded-full font-bold"
                          }
                        >
                          {isEventUpcoming(registration.event.date)
                            ? "Active"
                            : "Past"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
