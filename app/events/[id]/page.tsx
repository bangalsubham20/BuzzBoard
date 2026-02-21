import { getEventById } from "@/lib/data/events";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { RegisterButton } from "@/components/register-button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { prisma } from "@/lib/prisma"; // Declare the prisma variable
import { isUserRegistered } from "@/lib/data/registrations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params since it's now a Promise
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} | JIS College Event Management`,
    description: event.description,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params since it's now a Promise
  const { id } = await params;
  const event = await getEventById(id);
  const session = (await getServerSession(authOptions)) as any;

  if (!event) {
    notFound();
  }

  const organizer = await prisma.user.findUnique({
    where: { id: event.createdBy },
    select: { name: true },
  });

  // Check if user is already registered
  let isRegistered = false;
  if (session) {
    isRegistered = await isUserRegistered(session.user.id, event.id);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/events">
            <Button variant="link" className="pl-0 text-primary hover:text-secondary font-bold transition-colors">
              ← Back to Events
            </Button>
          </Link>
        </div>

        <div className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
          <div className="h-64 bg-secondary/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary-gradient opacity-5" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-secondary/50 relative z-10"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-extrabold text-primary mb-6 tracking-tight">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Card className="glass border-primary/5 rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center mr-4">
                        <CalendarIcon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary/40">
                          Date
                        </p>
                        <p className="text-primary font-bold">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center mr-4">
                        <ClockIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary/40">
                          Time
                        </p>
                        <p className="text-primary font-bold">
                          {new Date(event.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/5 rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center mr-4">
                        <MapPinIcon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary/40">
                          Venue
                        </p>
                        <p className="text-primary font-bold">{event.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center mr-4">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary/40">
                          Organizer
                        </p>
                        <p className="text-primary font-bold">
                          {organizer?.name || "JIS College"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-primary mb-4 tracking-tight">
                About this event
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed text-lg font-medium">
                  {event.description}
                </p>
              </div>
            </div>

            <Separator className="my-10 bg-primary/5" />

            <div className="flex justify-center">
              <RegisterButton
                eventId={event.id}
                isLoggedIn={!!session}
                isRegistered={isRegistered}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
