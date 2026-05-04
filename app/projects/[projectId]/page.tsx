import DocumentUploadModal from "@/components/DocumentUploadModal";
import NewMilestoneModal from "@/components/NewMilestoneModal";
import { getProfile } from "@/lib/services/profiles";
import { getProject } from "@/lib/services/project";
import Link from "next/link";

type Params = Promise<{ projectId: string }>;

export default async function ProjectView({params}: {params: Params}) {
    const resolvedParams = await params;

    const { data: project, error } = await getProject(resolvedParams.projectId)
    const { data: profile, error: profileError } = await getProfile()

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">Failed to load project: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 text-sm mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{project?.name}</h1>
                    <div className="flex items-center gap-4">
                        <NewMilestoneModal id={resolvedParams.projectId} />
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

                {project?.documents && project.documents.length > 0 && (
                    <div className="mb-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Project Resources</h2>
                            <p className="text-sm text-gray-500">Master contracts, overarching specs, and brand assets.</p>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {project.documents.map((doc: any) => (
                                <a 
                                    key={doc.id} 
                                    href={doc.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* A simple document icon */}
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        </div>
                                        <span className="font-medium text-gray-700 group-hover:text-blue-700">{doc.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-blue-500">
                                        Open Link ↗
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {!project || project.milestones.length === 0 ? (                                    
                    /* EMPTY STATE */
                    <div className="text-center mt-20">
                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 max-w-lg mx-auto shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h3>
                            <p className="text-gray-500 mb-6">Create your first milestone.</p>
                            <NewMilestoneModal id={resolvedParams.projectId} />
                        </div>
                    </div>                
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap-6">
                        {project.milestones.map((milestone) => (
                            <Link key={milestone.id} href={`/milestones/${milestone.id}`}>
                                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors cursor-pointer bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">{milestone.name}</h2>
                                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{milestone.current_phase}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${milestone.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-right text-xs text-gray-500 mt-2">{milestone.progress}% Complete</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}