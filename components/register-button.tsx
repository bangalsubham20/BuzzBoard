"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { motion } from "framer-motion";

interface RegisterButtonProps {
  eventId: string;
  isLoggedIn: boolean;
  isRegistered: boolean;
}

export function RegisterButton({
  eventId,
  isLoggedIn,
  isRegistered,
}: RegisterButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!isLoggedIn) {
      router.push(`/auth/login?callbackUrl=/events/${eventId}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register for event");
      }

      toast({
        title: "Registration successful!",
        description: "You have successfully registered for this event.",
      });

      router.push(`/dashboard/tickets/${data.registration.ticketId}`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-3"
        >
          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-green-800 font-bold">
            You're confirmed for this event!
          </span>
        </motion.div>
        <Link href="/dashboard/tickets">
          <Button variant="outline" size="lg" className="rounded-2xl glass border-primary/10 text-primary font-bold hover:bg-primary/5 px-8">
            View My Ticket
          </Button>
        </Link>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p className="text-primary/60 font-bold mb-2">
          Please log in to register for this event
        </p>
        <Link href={`/auth/login?callbackUrl=/events/${eventId}`}>
          <Button size="lg" className="bg-primary hover:bg-secondary shadow-lg shadow-primary/20 rounded-2xl font-bold px-10 h-14 text-lg transition-all hover:scale-105">
            Log in to Register
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        size="lg"
        className="bg-primary hover:bg-secondary shadow-lg shadow-primary/20 rounded-2xl font-bold px-10 h-14 text-lg transition-all hover:scale-105"
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register for Event"}
      </Button>
      <p className="text-sm text-gray-400 font-bold">
        Quick & easy one-click registration
      </p>
    </div>
  );
}
