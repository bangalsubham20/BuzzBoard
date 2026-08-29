import { requireAdmin } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UsersIcon,
  UserCheckIcon,
  ShieldIcon,
  CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { UsersFilter } from "@/components/admin/users-filter";

export const metadata = {
  title: "Manage Users | Admin Dashboard",
  description: "View and manage all users in the system",
};

interface UsersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  await requireAdmin();

  // Await searchParams since it's now a Promise
  const params = await searchParams;

  const search = params.search as string;
  const role = params.role as string;

  // Build filter conditions
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { jisid: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "all") {
    where.role = role.toUpperCase();
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      _count: {
        select: {
          registrations: true,
          events: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get statistics
  const totalUsers = await prisma.user.count();
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
  const recentUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">Manage <span className="text-gradient">Users</span></h1>
        <p className="text-gray-600 mt-2 text-lg font-medium">
          View and manage all members of the BuzzBoard community
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">Total Users</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UsersIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{totalUsers}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">Students</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheckIcon className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{totalStudents}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Student accounts</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">Admins</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{totalAdmins}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Admin accounts</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/20 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/40">Recent</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarIcon className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{recentUsers}</div>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
              Registered this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 glass border-white/20 rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xl font-bold text-primary tracking-tight">Filter Users</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <UsersFilter />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xl font-bold text-primary">All Users ({users.length})</CardTitle>
          <CardDescription className="text-primary/40 font-bold uppercase text-[10px] tracking-widest mt-1">
            Manage student and admin credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="text-center py-24">
              <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                No users found
              </h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto">
                {search || role
                  ? "Try adjusting your filters to find specific members."
                  : "No users have registered for the platform yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-primary/5">
                  <TableRow className="hover:bg-transparent border-primary/5">
                    <TableHead className="py-4 pl-6 text-primary font-bold uppercase text-[10px] tracking-widest">User</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">JIS ID</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Role</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Registrations</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Events Created</TableHead>
                    <TableHead className="py-4 text-primary font-bold uppercase text-[10px] tracking-widest">Joined</TableHead>
                    <TableHead className="py-4 pr-6 text-right text-primary font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-primary/[0.02] border-primary/5 transition-colors">
                      <TableCell className="py-5 pl-6">
                        <div>
                          <div className="font-bold text-primary">{user.name}</div>
                          <div className="text-sm text-primary/40 font-bold">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <code className="text-xs bg-primary/5 text-primary font-bold px-3 py-1 rounded-full border border-primary/10">
                          {user.jisid}
                        </code>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          className={`${user.role === "ADMIN" ? "bg-primary text-white" : "bg-primary/5 text-primary/60"
                            } border-none font-bold py-1 px-3 rounded-full`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="font-bold">
                          {user._count.registrations > 0 ? (
                            <Link
                              href={`/admin/registrations?search=${user.jisid}`}
                              className="text-secondary hover:text-primary transition-colors hover:underline decoration-2"
                            >
                              {user._count.registrations}
                            </Link>
                          ) : (
                            <span className="text-primary/20">0</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="font-bold">
                          {user._count.events > 0 ? (
                            <Link
                              href={`/admin/events?organizer=${user.id}`}
                              className="text-secondary hover:text-primary transition-colors hover:underline decoration-2"
                            >
                              {user._count.events}
                            </Link>
                          ) : (
                            <span className="text-primary/20">0</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="text-sm">
                          <div className="font-bold text-primary">{formatDate(user.createdAt)}</div>
                          <div className="text-secondary font-bold text-[10px] uppercase tracking-wider">
                            {new Date(user.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/registrations?search=${user.jisid}`}
                          >
                            <Button variant="outline" size="sm" className="rounded-xl glass border-primary/10 text-primary font-bold hover:bg-primary/5 transition-all">
                              View Activity
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
