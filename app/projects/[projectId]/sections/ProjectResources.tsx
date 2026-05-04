import { Project } from "@/types/project";


export default function ProjectResources({project}: {project: Project}) {
    return (
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
    )
}