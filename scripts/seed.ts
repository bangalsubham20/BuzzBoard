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

    // Create Events with dynamic upcoming and past dates
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in10Days = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const in20Days = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);
    const past7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const events = [
        {
            title: "Tech Fiesta 2026",
            description: "Annual flagship technical fest of JIS College of Engineering. Featuring hackathons, robotics challenges, coding battles, and keynote tech talks.",
            date: in3Days,
            venue: "Main Auditorium",
            createdBy: admin.id,
        },
        {
            title: "Grand Cultural Night",
            description: "An extraordinary evening filled with live band performances, dance competitions, and theatrical showcases by student societies.",
            date: in10Days,
            venue: "Open Air Stage",
            createdBy: admin.id,
        },
        {
            title: "Full-Stack Web Dev Workshop",
            description: "Hands-on masterclass on building modern web applications with Next.js 15, TypeScript, Tailwind CSS, and Prisma.",
            date: in20Days,
            venue: "Computer Lab 1",
            createdBy: admin.id,
        },
        {
            title: "AI & Future Tech Summit",
            description: "Exploring groundbreaking advancements in Generative AI, Machine Learning, and Cloud Computing with industry guest speakers.",
            date: past7Days,
            venue: "Seminar Hall",
            createdBy: admin.id,
        },
    ];

    const createdEvents = [];
    for (const eventData of events) {
        const event = await prisma.event.create({
            data: eventData,
        });
        createdEvents.push(event);
        console.log(`Created event: ${event.title}`);
    }

    // Create sample registration & attendance for testing
    if (createdEvents.length > 0) {
        const reg = await prisma.registration.create({
            data: {
                userId: student.id,
                eventId: createdEvents[0].id,
            },
        });
        console.log(`Created sample registration for student: Ticket ID ${reg.ticketId}`);
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
