import { mockProjects } from "@/lib/mockData";
import Link from "next/link";

type Params = Promise<{ projectId: string }>;

export default async function ProjectView({params}: {params: Params}) {
    const resolvedParams = await params;
    const project = mockProjects.find(p => p.id === resolvedParams.projectId);
    if (!project) return <div>Project not found</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 text-sm mb-4 inline-block">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <p className="text-gray-500 mt-2">{project.client}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap-6">
                {project.milestones.map((milestone) => (
                    <Link key={milestone.id} href={`/milestones/${milestone.id}`}>
                        <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors cursor-pointer bg-white">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold">{milestone.name}</h2>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-blue text-blue-700 uppercase tracking-wider">{milestone.currPhase}</span>
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
        </div>
    )
}