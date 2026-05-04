import DeleteMemberButton from "@/components/DeleteMemberButton";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import NewMilestoneModal from "@/components/NewMilestoneModal";
import ProjectMemberModal from "@/components/ProjectMemberModal";
import { getAllProfile, getProfile } from "@/lib/services/profiles";
import { getProject } from "@/lib/services/project";
import { getMembers } from "@/lib/services/project_member";
import Link from "next/link";
import MilestoneList from "./sections/MilestoneList";
import ProjectResources from "./sections/ProjectResources";

type Params = Promise<{ projectId: string }>;

export default async function ProjectView({params}: {params: Params}) {
    const resolvedParams = await params;

    const { data: project, error } = await getProject(resolvedParams.projectId)
    const { data: profile, error: profileError } = await getProfile()
    const { data: profiles } = await getAllProfile()
    const { data: members } = await getMembers(resolvedParams.projectId)

    const pm = members?.find(mem => mem.role === "PM")

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">Failed to load project: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 text-sm mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{project?.name}</h1>
                    <div className="flex items-center gap-4">
                        {project && project.milestones.length > 0 && profile?.id === pm?.user_id && (
                            <NewMilestoneModal id={resolvedParams.projectId} />
                        )}
                        <DocumentUploadModal projectId={resolvedParams.projectId} profile={profile} />
                        <div className="text-sm text-gray-500">
                            {profile ? (
                                <span className="text-green-600">● Logged in as: <strong>{profile.username}</strong></span>
                            ) : (
                                <span className="text-red-600">● Session Missing / No Profile</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {project?.documents && project.documents.length > 0 && (
                            <ProjectResources project={project} />
                        )}
                        {!project || project.milestones.length === 0 ? (                                    
                            /* EMPTY STATE */
                            <div className="text-center mt-20">
                                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 max-w-lg mx-auto shadow-sm">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h3>
                                    <p className="text-gray-500 mb-6">Create your first milestone.</p>
                                    {profile?.id === pm?.user_id && (
                                        <NewMilestoneModal id={resolvedParams.projectId} />
                                    )}
                                </div>
                            </div>                
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap-6">
                                {project.milestones.map((milestone) => (
                                    <MilestoneList key={milestone.id} milestone={milestone} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-gray-900">Project Team</h2>
                                {profile?.id === pm?.user_id && (
                                    <ProjectMemberModal projectId={project?.id} profiles={profiles} existingMembers={members} />
                                )}
                            </div>
                            
                            <ul className="space-y-3">
                                {members?.map((member) => {
                                    const user = profiles?.find(
                                        (profile) => profile.id === member.user_id
                                    );

                                    return (
                                        <li
                                            key={member.id}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-200" />

                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {user?.username ?? "Unknown User"} ({member.role})
                                                </span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {member.role_detail?.map((detail) => (
                                                        <span
                                                            key={detail}
                                                            className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700"
                                                        >
                                                            {detail}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {profile?.id === pm?.user_id && (
                                                <>
                                                    <ProjectMemberModal projectId={project?.id} profiles={profiles} member={member} existingMembers={members} />
                                                    
                                                    {member.role !== "PM" && (
                                                        <DeleteMemberButton
                                                            key={member.id}
                                                            memberId={member.id}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}