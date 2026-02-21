import { requireAdmin } from "@/lib/auth";
import { CreateEventForm } from "@/components/create-event-form";

export const metadata = {
  title: "Create Event | Admin Dashboard",
  description: "Create a new event for JIS College",
};

export default async function CreateEventPage() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">Create New <span className="text-gradient">Experience</span></h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            Fill in the details to launch a new event for the BuzzBoard community
          </p>
        </div>

        <CreateEventForm />
      </div>
    </div>
  );
}
