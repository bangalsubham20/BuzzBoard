import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getAnalyticsData } from "@/lib/data/analytics";

// GET - Admin fetch analytics data
export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const analytics = await getAnalyticsData();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
