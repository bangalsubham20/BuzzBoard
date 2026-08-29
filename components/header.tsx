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
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { MenuIcon } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession() as any;

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { label: "Home", href: "/", active: isActive("/") },
    { label: "Explorer", href: "/events", active: isActive("/events") },
    ...(session?.user?.role === "ADMIN" ? [
      { label: "Admin", href: "/admin", active: pathname.startsWith("/admin") }
    ] : []),
    ...(session ? [
      { label: "My Hub", href: "/dashboard", active: pathname.startsWith("/dashboard") }
    ] : [])
  ];

  return (
    <header className="graphic-card border-b border-secondary/20 sticky top-0 z-50 backdrop-blur-2xl">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-primary-gradient flex items-center justify-center mr-2.5 md:mr-3 group-hover:rotate-12 transition-transform shadow-graphic border border-secondary/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
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
            <span className="text-xl md:text-2xl font-black tracking-tight text-primary group-hover:text-secondary transition-colors">
              Buzz<span className="text-secondary">Board</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex ml-10 space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-extrabold tracking-wider uppercase transition-all relative py-1 ${link.active
                  ? "text-primary"
                  : "text-gray-600 hover:text-secondary"
                  }`}
              >
                {link.label}
                {link.active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 md:h-11 md:w-11 rounded-2xl hover:bg-secondary/15 transition-colors p-0 border border-secondary/20"
                >
                  <Avatar className="h-10 w-10 md:h-11 md:w-11 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-primary-gradient text-white font-black">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 graphic-card rounded-3xl p-2 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal px-4 py-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-extrabold text-primary leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs font-bold text-secondary leading-none mt-1 uppercase tracking-wider">
                      {session.user?.jisid} • {session.user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/10" />
                <div className="p-1">
                  <DropdownMenuItem asChild className="rounded-2xl cursor-pointer hover:bg-secondary/15 focus:bg-secondary/15 transition-colors h-11">
                    <Link href="/dashboard" className="font-extrabold text-primary">Student Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-2xl cursor-pointer hover:bg-secondary/15 focus:bg-secondary/15 transition-colors h-11">
                    <Link href="/dashboard/tickets" className="font-extrabold text-primary">My Tickets</Link>
                  </DropdownMenuItem>
                  {session.user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild className="rounded-2xl cursor-pointer hover:bg-secondary/15 focus:bg-secondary/15 transition-colors h-11">
                      <Link href="/admin" className="font-extrabold text-secondary">Admin Control Panel</Link>
                    </DropdownMenuItem>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-primary/10" />
                <div className="p-1">
                  <DropdownMenuItem
                    className="rounded-2xl cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-colors h-11 text-red-600 font-extrabold"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Disconnect
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="font-extrabold text-primary hover:text-secondary hover:bg-secondary/10 rounded-2xl px-3 md:px-6 text-xs md:text-sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-primary hover:bg-secondary text-white shadow-graphic font-extrabold rounded-2xl px-4 md:px-7 text-xs md:text-sm transition-all hover:scale-105 active:scale-95">
                  Join Now ➔
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Sheet Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-secondary/20 text-primary">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="graphic-card border-l border-secondary/30 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-8 pt-2">
                    <div className="h-10 w-10 rounded-2xl bg-primary-gradient flex items-center justify-center mr-3 border border-secondary/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      </svg>
                    </div>
                    <span className="text-xl font-black text-primary">
                      Buzz<span className="text-secondary">Board</span>
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={`text-base font-black uppercase tracking-wider p-3 rounded-2xl transition-all ${
                            link.active
                              ? "bg-secondary/15 text-primary border border-secondary/30"
                              : "text-gray-700 hover:bg-secondary/10 hover:text-primary"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>

                <div className="pt-6 border-t border-primary/10 text-center">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">JIS College Hub</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
