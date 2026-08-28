import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// DELETE - Cancel or delete a registration
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const registration = await prisma.registration.findUnique({
      where: { id },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Registration not found" },
        { status: 404 }
      );
    }

    // Only the owner of the registration or an ADMIN can cancel/delete it
    if (
      registration.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.registration.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Registration cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return NextResponse.json(
      { message: "Failed to cancel registration" },
      { status: 500 }
    );
  }
}
