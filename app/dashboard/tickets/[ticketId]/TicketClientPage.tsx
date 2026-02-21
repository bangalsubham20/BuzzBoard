"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  TicketIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime, isEventUpcoming } from "@/lib/utils";
import { QRCodeComponent } from "@/components/qr-code";

interface TicketPageProps {
  registration: any;
  user: any;
}

export default function TicketClientPage({
  registration,
  user,
}: TicketPageProps) {
  const isUpcoming = isEventUpcoming(registration.event.date);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/tickets">
            <Button variant="link" className="pl-0 text-primary hover:text-secondary font-bold transition-colors">
              ← Back to My Tickets
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden glass border-white/20 rounded-3xl shadow-2xl shadow-primary/5">
          <CardHeader className="bg-primary/5 border-b border-primary/10 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <TicketIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-primary tracking-tight">Event Ticket</CardTitle>
                  <p className="text-sm font-bold text-primary/40 uppercase tracking-widest">
                    JIS College of Engineering
                  </p>
                </div>
              </div>
              <Badge
                className={`${isUpcoming ? "bg-secondary text-white" : "bg-primary/10 text-primary/40"} border-none px-4 py-1.5 font-bold rounded-full`}
              >
                {isUpcoming ? "Active Ticket" : "Past Event"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Event Details */}
              <div>
                <h2 className="text-3xl font-extrabold text-primary mb-4 tracking-tight leading-tight">
                  {registration.event.title}
                </h2>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {registration.event.description}
                </p>
              </div>

              <Separator className="bg-primary/5" />

              {/* Event Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <CalendarIcon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary/40 mb-1">
                        Date & Time
                      </p>
                      <p className="text-primary font-bold">
                        {formatDateTime(registration.event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <MapPinIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary/40 mb-1">Venue</p>
                      <p className="text-primary font-bold">
                        {registration.event.venue}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <UserIcon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary/40 mb-1">
                        Attendee
                      </p>
                      <p className="text-primary font-bold">{user.name}</p>
                      <p className="text-xs font-bold text-secondary">{user.jisid}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary/40 mb-1">
                        Registered On
                      </p>
                      <p className="text-primary font-bold">
                        {formatDate(registration.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-primary/5" />

              {/* Ticket ID Section */}
              <div className="bg-primary-gradient p-6 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <TicketIcon size={80} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                      Ticket ID
                    </p>
                    <p className="text-xl font-mono font-black tracking-wider">
                      {registration.ticketId}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">Status</p>
                    <p className="font-black uppercase text-sm">{isUpcoming ? "Valid" : "Expired"}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center py-10">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white rounded-3xl shadow-xl shadow-primary/5 border border-primary/5">
                    <QRCodeComponent
                      value={`${window.location.origin}/api/attendance/verify/${registration.ticketId}`}
                      size={180}
                      className="rounded-xl"
                    />
                  </div>
                  <p className="text-sm font-bold text-primary/40 text-center max-w-[200px]">
                    Scan this QR code for attendance verification
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={`/events/${registration.event.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full h-14 rounded-2xl glass border-primary/10 text-primary font-bold hover:bg-primary/5 transition-all">
                    View Event Details
                  </Button>
                </Link>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl glass border-primary/10 text-primary font-bold hover:bg-primary/5 transition-all"
                >
                  Print Ticket
                </Button>
              </div>

              {/* Important Notes */}
              <div className="bg-secondary/10 rounded-3xl p-6 mt-8 border border-secondary/20">
                <h3 className="font-black text-primary mb-4 flex items-center uppercase tracking-widest text-xs">
                  <div className="h-2 w-2 rounded-full bg-secondary mr-2" />
                  Important Notes
                </h3>
                <ul className="text-sm text-primary/70 space-y-2 font-medium">
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    Please bring a valid ID along with this ticket
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    Arrive at least 15 minutes before the event starts
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    This ticket is non-transferable
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    Contact support if you have any issues
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
