import { requireAdmin } from "@/lib/auth";
import { getAnalyticsData } from "@/lib/data/analytics";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
    title: "Advanced Analytics | Admin Dashboard",
    description: "Monitor registration trends and attendance patterns",
};

export default async function AdminAnalyticsPage() {
    await requireAdmin();
    const data = await getAnalyticsData();

    return (
        <div className="min-h-screen bg-gradient-premium">
            <div className="container mx-auto py-12 px-4">
                <div className="mb-12">
                    <Link href="/admin">
                        <Button variant="link" className="pl-0 text-primary hover:text-secondary font-bold transition-colors mb-4">
                            ← Back to Command Center
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-extrabold text-primary tracking-tight">
                        Advanced <span className="text-gradient">Analytics</span>
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg font-medium">
                        Strategic insights into JIS College campus engagement.
                    </p>
                </div>

                <AnalyticsDashboard data={data} />
            </div>
        </div>
    );
}
