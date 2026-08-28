import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  try {
    await prisma.$connect();
    console.log("✅ SUCCESS: Database connection established!");
    const userCount = await prisma.user.count();
    const eventCount = await prisma.event.count();
    console.log(`📊 DB Stats -> Users: ${userCount}, Events: ${eventCount}`);
  } catch (error: any) {
    console.error("❌ ERROR: Database connection failed!");
    console.error("Message:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
