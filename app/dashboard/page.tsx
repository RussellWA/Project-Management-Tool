import NewProjectModal from "@/components/NewProjectModal";
import SignOutButton from "@/components/SignOutButton";
import { profileService } from "@/lib/services/profiles";
import { projectService } from "@/lib/services/project";
import Link from "next/link";

// Force Next.js to always fetch fresh data when loading  the dashboard
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    // 1. ASYNC FETCHING (Runs securely on the server)
    const { data: projects, error } = await projectService.getAll();
    const { data: profile, error: profileError } = await profileService.getMyProfile();

    // 2. ERROR STATE
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">Failed to load projects: {error.message}</div>
            </div>
        );
    }

    return (
        /* The main wrapper applying your bg-gray-50 request */
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <div className="flex items-center gap-4">
                        {/* The modal is self-contained. It renders its own button! */}
                        <NewProjectModal />
                        <SignOutButton />
                        <div className="text-sm text-gray-500">
                            {profile ? (
                                <span className="text-green-600">● Logged in as: <strong>{profile.username}</strong></span>
                            ) : (
                                <span className="text-red-600">● Session Missing / No Profile</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* CONDITIONAL RENDERING: Empty State vs. Grid */}
                {!projects || projects.length === 0 ? (
                    
                    /* EMPTY STATE */
                    <div className="text-center mt-20">
                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 max-w-lg mx-auto shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                            <p className="text-gray-500 mb-6">Create your first project to start tracking milestones and tasks.</p>
                            {/* We put the modal button here too so they can create one! */}
                            <NewProjectModal />
                        </div>
                    </div>

                ) : (

                    /* POPULATED GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link key={project.id} href={`/projects/${project.id}`}>
                                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer bg-white group">
                                    <p className="text-sm text-gray-500 mb-1">{project.client}</p>
                                    <h2 className="text-xl font-semibold mb-4 text-gray-900">{project.name}</h2>

                                    <div className="flex justify-between items-center text-sm gap-4 border-t border-gray-100 pt-4 mt-2">
                                        <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100">
                                            {/* Note: We'll need to join milestones later, hardcoded to 0 for now */}
                                            0 Active Milestones
                                        </span>
                                        <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                            View →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
}