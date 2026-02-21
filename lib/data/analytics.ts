import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format, eachDayOfInterval, startOfHour } from "date-fns";

export async function getAnalyticsData() {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    // 1. Registration Trends (Last 30 days)
    const registrations = await prisma.registration.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo,
            },
        },
        select: {
            createdAt: true,
        },
    });

    // 2. Member Growth (Last 30 days)
    const newUsers = await prisma.user.findMany({
        where: {
            role: "STUDENT",
            createdAt: {
                gte: thirtyDaysAgo,
            },
        },
        select: {
            createdAt: true,
        },
    });

    // 3. Attendance Patterns (Hourly distribution)
    const attendance = await prisma.attendance.findMany({
        select: {
            markedAt: true,
        },
    });

    // 4. Event Performance stats
    const events = await prisma.event.findMany({
        include: {
            _count: {
                select: {
                    registrations: true,
                },
            },
            registrations: {
                include: {
                    attendance: true,
                },
            },
        },
    });

    // Process Registration Trends
    const dayRange = eachDayOfInterval({ start: thirtyDaysAgo, end: now });
    const registrationTrends = dayRange.map((day) => {
        const dayStr = format(day, "MMM dd");
        const count = registrations.filter(
            (r) => format(r.createdAt, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        ).length;
        return { date: dayStr, count };
    });

    // Process Member Growth
    const growthTrends = dayRange.map((day) => {
        const dayStr = format(day, "MMM dd");
        const count = newUsers.filter(
            (u) => format(u.createdAt, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        ).length;
        return { date: dayStr, count };
    });

    // Process Attendance Patterns (Hourly)
    const hourlyAttendance = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        count: 0,
    }));

    attendance.forEach((a) => {
        const hour = a.markedAt.getHours();
        hourlyAttendance[hour].count++;
    });

    // Process Event Performance
    const eventStats = events.map((event) => ({
        title: event.title,
        registrations: event._count.registrations,
        attendance: event.registrations.filter((r) => r.attendance).length,
    })).sort((a, b) => b.registrations - a.registrations).slice(0, 5);

    return {
        registrationTrends,
        growthTrends,
        hourlyAttendance,
        eventStats,
        totalStudents: await prisma.user.count({ where: { role: "STUDENT" } }),
        totalRegistrations: await prisma.registration.count(),
        totalAttendance: await prisma.attendance.count(),
    };
}
