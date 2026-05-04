import DocumentUploadModal from "@/components/DocumentUploadModal";
import { Milestone, Phase } from "@/types/milestone";
import { Profile } from "@/types/profile";
import { ExternalLink, FileText, Rocket } from "lucide-react";

interface PlanningLobbyProps {
    milestone: Milestone;
    isHistory?: boolean;
    onPhaseUpdate: (phase: Phase) => void
    profile: Profile | null;
}

export default function PlanningLobby({milestone, isHistory, onPhaseUpdate, profile}: PlanningLobbyProps) {

    return (
        <div className="max-w-4xl mx-auto grid gap-6">
            {/* Documents */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Project Documents</h2>
                    <p className="text-sm text-gray-500">Attach all proposals, specs, and design links here</p>
                </div>

                <div className="p-4 grid gap-3">
                    {milestone?.documents?.map((doc) => (
                        <a
                            key={doc.id}
                            href={doc.url}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                                    <FileText size={20} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">{doc.name}</span>
                            </div>
                            <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600" />
                        </a>
                    ))}
                </div>

                {!isHistory && (
                    <div className="p-6">
                        <DocumentUploadModal projectId={milestone.project_id} milestoneId={milestone.id} profile={profile} />
                    </div>
                )}

                <div className="p-6">
                    {/* Action */}
                    {!isHistory && (
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                            <button 
                                onClick={() => onPhaseUpdate("DEVELOPMENT")}
                                className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg translate-y-0"
                            >
                                Start Development <Rocket size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}