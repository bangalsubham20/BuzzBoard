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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
                <div className="mb-8 sm:mb-12">
                    <Link href="/admin">
                        <Button variant="link" className="pl-0 text-primary hover:text-secondary font-bold transition-colors mb-4">
                            ← Back to Command Center
                        </Button>
                    </Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight">
                        Analytics <span className="text-gradient">Hub</span>
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
