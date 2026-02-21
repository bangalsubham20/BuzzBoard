import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");

    // Clear existing data
    await prisma.attendance.deleteMany({});
    await prisma.registration.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({});

    // Create Users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@jiscollege.ac.in",
            jisid: "JIS/2024/0001",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    const student = await prisma.user.create({
        data: {
            name: "Student User",
            email: "student@jiscollege.ac.in",
            jisid: "JIS/2024/0002",
            password: hashedPassword,
            role: "STUDENT",
        },
    });

    console.log(`Created users: ${admin.email}, ${student.email}`);

    // Create Events
    const events = [
        {
            title: "Tech Fiesta 2024",
            description: "Annual technical fest of JIS College of Engineering. Featuring coding competitions, robotics workshops, and tech talks.",
            date: new Date("2024-04-15T10:00:00Z"),
            venue: "Main Auditorium",
            createdBy: admin.id,
        },
        {
            title: "Cultural Night",
            description: "A night filled with music, dance, and performances by our talented students.",
            date: new Date("2024-04-20T18:00:00Z"),
            venue: "Open Stage",
            createdBy: admin.id,
        },
        {
            title: "Workshop on Next.js",
            description: "Hands-on workshop on building modern web applications with Next.js 14 and App Router.",
            date: new Date("2024-05-05T14:00:00Z"),
            venue: "Computer Lab 1",
            createdBy: admin.id,
        },
        {
            title: "AI & ML Seminar",
            description: "Exploring the latest trends in Artificial Intelligence and Machine Learning with industry experts.",
            date: new Date("2024-05-12T11:00:00Z"),
            venue: "Seminar Hall",
            createdBy: admin.id,
        },
    ];

    for (const eventData of events) {
        const event = await prisma.event.create({
            data: eventData,
        });
        console.log(`Created event: ${event.title}`);
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:");
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
