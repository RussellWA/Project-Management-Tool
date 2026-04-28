import { projectService } from "@/lib/project";
import Link from "next/link";


export default async function Dashboard() {
    const { data: projects, error } = await projectService.getAll();

    if (error) {
        return <div>Failed to load projects: {error.message}</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Projects</h1>
                <button
                    // onClick={}
                >
                    + New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer bg-white">
                            <p className="text-sm text-gray-500 mb-1">{project.client}</p>
                            <h2 className="text-xl font-semibold mb-4">{project.name}</h2>

                            <div className="flex justify-between items-center text-sm gap-4">
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{project.milestones?.length || 0} Active Milestones</span>
                                <span className="text-blue-600 font-medium">View →</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}