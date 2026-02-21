"use client";

import type React from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function EventsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [venue, setVenue] = useState(searchParams.get("venue") || "all");

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "all") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const applyFilters = () => {
    const queryString = createQueryString({
      search: search || null,
      status: status === "all" ? null : status,
      venue: venue === "all" ? null : venue,
    });

    router.push(`${pathname}?${queryString}`);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setVenue("all");
    router.push(pathname);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-center">
      <div className="relative w-full md:w-64 group">
        <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          type="text"
          placeholder="Search events..."
          className="pl-10 h-10 rounded-xl border-white/20 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-[140px] h-10 rounded-xl border-white/20 bg-white/50 backdrop-blur-sm font-medium">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="glass border-white/20 rounded-2xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past Events</SelectItem>
          </SelectContent>
        </Select>

        <Select value={venue} onValueChange={setVenue}>
          <SelectTrigger className="w-full md:w-[140px] h-10 rounded-xl border-white/20 bg-white/50 backdrop-blur-sm font-medium">
            <SelectValue placeholder="Venue" />
          </SelectTrigger>
          <SelectContent className="glass border-white/20 rounded-2xl">
            <SelectItem value="all">All Venues</SelectItem>
            <SelectItem value="Auditorium">Auditorium</SelectItem>
            <SelectItem value="Seminar Hall">Seminar Hall</SelectItem>
            <SelectItem value="Sports Ground">Sports Ground</SelectItem>
            <SelectItem value="Computer Lab">Computer Lab</SelectItem>
            <SelectItem value="Library">Library</SelectItem>
            <SelectItem value="Conference Room">Conference Room</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Button
          type="submit"
          className="flex-1 md:flex-none h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold transition-all hover:scale-105"
        >
          Apply
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={resetFilters}
          className="flex-1 md:flex-none h-10 px-4 rounded-xl font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
