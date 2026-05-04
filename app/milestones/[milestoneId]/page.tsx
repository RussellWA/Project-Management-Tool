import { getMilestone } from "@/lib/services/milestone";
import MilestoneWorkspaceClient from "./client";
import { getProfile } from "@/lib/services/profiles";

type Params = Promise<{ milestoneId: string }>;

export default async function MilestoneWorkspacePage({params}: {params: Params}) {
    const resolvedParams = await params;

    // 1. Secure Server-Side Fetch
    const { data: milestone, error } = await getMilestone(resolvedParams.milestoneId)
    const { data: profile, error: profileError } = await getProfile()

    // 2. Handle Errors on the Server
    if (error || !milestone) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Failed to load milestone: {error || 'Not found'}
                </div>
            </div>
        );
    }

    // 3. Pass the clean data to the interactive Client Component
    return <MilestoneWorkspaceClient initialMilestone={milestone} profile={profile} />;
}