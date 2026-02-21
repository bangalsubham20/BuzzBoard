"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession() as any;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="glass border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
              Buzz<span className="text-blue-600">Board</span>
            </span>
          </Link>
          <nav className="hidden md:flex ml-12 space-x-8">
            {[
              { label: "Home", href: "/", active: isActive("/") },
              { label: "Explorer", href: "/events", active: isActive("/events") },
              ...(session?.user?.role === "ADMIN" ? [
                { label: "Admin", href: "/admin", active: pathname.startsWith("/admin") }
              ] : []),
              ...(session ? [
                { label: "My Hub", href: "/dashboard", active: pathname.startsWith("/dashboard") }
              ] : [])
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold tracking-wide uppercase transition-all relative py-1 ${link.active
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
                  }`}
              >
                {link.label}
                {link.active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-2xl hover:bg-blue-50 transition-colors p-0"
                >
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass border-white/20 rounded-3xl p-2 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal px-4 py-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-bold text-gray-900 leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 leading-none mt-1 uppercase tracking-wider">
                      {session.user?.jisid} • {session.user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black/5" />
                <div className="p-1">
                  <DropdownMenuItem asChild className="rounded-2xl cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors h-11">
                    <Link href="/dashboard" className="font-bold text-gray-700">Student Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-2xl cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors h-11">
                    <Link href="/dashboard/tickets" className="font-bold text-gray-700">My Tickets</Link>
                  </DropdownMenuItem>
                  {session.user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild className="rounded-2xl cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors h-11">
                      <Link href="/admin" className="font-bold text-gray-700 text-blue-600">Admin Control Panel</Link>
                    </DropdownMenuItem>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-black/5" />
                <div className="p-1">
                  <DropdownMenuItem
                    className="rounded-2xl cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-colors h-11 text-red-600 font-bold"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Disconnect
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl px-6">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold rounded-2xl px-6 transition-all hover:scale-105 active:scale-95">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
