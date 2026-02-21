import { requireAdmin } from "@/lib/auth";
import { AttendanceScanner } from "@/components/admin/attendance-scanner";

export const metadata = {
  title: "Scan Attendance | Admin Dashboard",
  description: "Scan QR codes to mark student attendance",
};

export default async function AttendanceScanPage() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">Scan <span className="text-gradient">Attendance</span></h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            Scan student QR codes to mark attendance for events
          </p>
        </div>

        <AttendanceScanner />
      </div>
    </div>
  );
}
