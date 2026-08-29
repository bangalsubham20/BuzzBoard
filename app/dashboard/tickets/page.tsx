import { requireAuth } from "@/lib/auth";
import { getUserRegistrations } from "@/lib/data/registrations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, isEventUpcoming } from "@/lib/utils";

export const metadata = {
  title: "My Tickets | JIS College Event Management",
  description: "View all your event tickets and registrations",
};

export default async function TicketsPage() {
  const user = await requireAuth() as any;
  const registrations = await getUserRegistrations(user.id);

  const upcomingRegistrations = registrations.filter((reg) =>
    isEventUpcoming(reg.event.date)
  );
  const pastRegistrations = registrations.filter(
    (reg) => !isEventUpcoming(reg.event.date)
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">My <span className="text-gradient">Tickets</span></h1>
        <p className="text-gray-600 mt-2 text-lg font-medium">View and manage your event tickets</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-primary/5 p-1 rounded-2xl h-14">
          <TabsTrigger value="upcoming" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Upcoming Events ({upcomingRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Past Events ({pastRegistrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-10">
          {upcomingRegistrations.length === 0 ? (
            <Card className="glass border-primary/10 rounded-3xl overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <TicketIcon className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  No upcoming events
                </h3>
                <p className="text-gray-500 mb-8 max-w-sm font-medium">
                  You haven't registered for any upcoming events yet. Browse our
                  campus pulse to find your next favorite activity!
                </p>
                <Link href="/events">
                  <Button size="lg" className="bg-primary hover:bg-secondary shadow-lg shadow-primary/20 rounded-2xl font-bold px-8 h-12">
                    Browse Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingRegistrations.map((registration) => (
                <Card
                  key={registration.id}
                  className="overflow-hidden glass border-white/20 transition-all hover:shadow-2xl hover:shadow-primary/10 group flex flex-col rounded-3xl"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-secondary/10 text-secondary border-none px-3 py-1 font-bold">
                        Active Ticket
                      </Badge>
                      <span className="text-xs font-bold text-primary/30 tracking-widest uppercase">
                        #{registration.ticketId.slice(-8)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 flex-grow">
                    <div>
                      <h3 className="font-bold text-2xl mb-4 text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                        {registration.event.title}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm font-bold text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-3 text-secondary" />
                          <span>{formatDate(registration.event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm font-bold text-gray-500">
                          <MapPinIcon className="h-4 w-4 mr-3 text-secondary" />
                          <span>{registration.event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-primary/5">
                      <Link
                        href={`/dashboard/tickets/${registration.ticketId}`}
                      >
                        <Button className="w-full bg-primary hover:bg-secondary shadow-lg shadow-primary/10 rounded-2xl font-bold h-12 transition-all">
                          View Full Ticket
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-10">
          {pastRegistrations.length === 0 ? (
            <Card className="glass border-primary/10 rounded-3xl overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <CalendarIcon className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  No past events
                </h3>
                <p className="text-gray-500 font-medium">
                  Your journey at BuzzBoard starts today.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastRegistrations.map((registration) => (
                <Card
                  key={registration.id}
                  className="overflow-hidden glass border-white/20 opacity-80 hover:opacity-100 transition-all group flex flex-col rounded-3xl"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/5 text-primary/60 border-none px-3 py-1 font-bold">
                        Past Event
                      </Badge>
                      <span className="text-xs font-bold text-primary/30 tracking-widest uppercase">
                        #{registration.ticketId.slice(-8)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 flex-grow">
                    <div>
                      <h3 className="font-bold text-2xl mb-4 text-primary/70 line-clamp-2 leading-tight">
                        {registration.event.title}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm font-bold text-gray-400">
                          <CalendarIcon className="h-4 w-4 mr-3" />
                          <span>{formatDate(registration.event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm font-bold text-gray-400">
                          <MapPinIcon className="h-4 w-4 mr-3" />
                          <span>{registration.event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-primary/5">
                      <Link
                        href={`/dashboard/tickets/${registration.ticketId}`}
                      >
                        <Button variant="outline" className="w-full rounded-2xl glass border-primary/10 text-primary font-bold h-12 transition-all">
                          View Ticket
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
