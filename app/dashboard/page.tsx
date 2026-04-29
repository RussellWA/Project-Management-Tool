
import { getAllProjects } from "@/lib/services/project";
import { getProfile } from "@/lib/services/profiles";
import { ProjectPage } from "./ProjectPage";

// Force Next.js to always fetch fresh data when loading the dashboard
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    // 1. ASYNC FETCHING (Runs securely on the server)
    const { data: projects, error: projectError } = await getAllProjects()
    const { data: profile, error: profileError } = await getProfile();
    // const { data: profile, error: profileError } = await profileService.getMyProfile();

    // 2. ERROR STATE
    if (projectError) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">Failed to load projects: {projectError}</div>
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">Failed to load profile: {profileError}</div>
            </div>
        );
    }

    return (
        <>
            {projects && profile && (
                <ProjectPage projects={projects} profile={profile} />
            )}
        </>
    );
}