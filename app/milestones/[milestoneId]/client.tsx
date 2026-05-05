"use client";

import { Milestone, Phase, PHASE_ORDER } from "@/types/milestone";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PlanningLobby from "./sections/PlanningLobby";
import DevelopmentBoard from "./sections/DevelopmentBoard";
import TestingBoard from "./sections/TestingBoard";
import { Profile } from "@/types/profile";
import { ProjectMember } from "@/types/project_member";

interface MilestoneWorkspaceClientProps {
    initialMilestone: Milestone;
    profile: Profile | null;
    pm: ProjectMember | undefined;
}

export default function MilestoneWorkspaceClient({ initialMilestone, profile, pm }: MilestoneWorkspaceClientProps) {
    
    // We store the milestone in state so we can update it locally
    const [milestone, setMilestone] = useState(initialMilestone);
    const [viewingPhase, setViewingPhase] = useState<Phase>(initialMilestone.current_phase);
    const isPm = profile?.id === pm?.user_id

    const currIdx = PHASE_ORDER.indexOf(viewingPhase);
    const actualIdx = PHASE_ORDER.indexOf(milestone.current_phase);

    const canGoLeft = currIdx > 0;
    const canGoRight = currIdx < PHASE_ORDER.length - 1 && currIdx < actualIdx;
    const isLocked = currIdx === actualIdx && currIdx < PHASE_ORDER.length - 1;

    const handleLeftClick = () => {
        if (canGoLeft) setViewingPhase(PHASE_ORDER[currIdx - 1]);
    }

    const handleRightClick = () => {
        if (canGoRight) setViewingPhase(PHASE_ORDER[currIdx + 1]);
    }

    const handlePhaseUpdate = async (newPhase: Phase) => {
        // 1. Update the local UI instantly for a snappy feel
        setMilestone({ ...milestone, current_phase: newPhase });
        setViewingPhase(newPhase);

        // 2. TODO: You must also fire a Supabase update here!
        // await supabase.from('milestones').update({ current_phase: newPhase }).eq('id', milestone.id);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
                <Link href={`/projects/${milestone.project_id}`} className="text-sm text-gray-500 hover:text-gray-900">
                    ← Back to Project
                </Link>
                <h1 className="text-2xl font-bold mt-2">{milestone.name}</h1>
            </header>

            {/* Phase Nav */}
            <div className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center sticky top-0 shadow-sm z-10">
                <button
                    onClick={handleLeftClick}
                    disabled={!canGoLeft}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                        canGoLeft ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'text-gray-300 cursor-not-allowed'
                    }`}
                >
                    <ChevronLeft size={18} /> Previous Phase
                </button>

                <div className="text-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Currently Viewing</span>
                    <span className="text-lg font-bold text-blue-700 bg-blue-50 px-4 py-1 rounded-full border border-blue-200">
                        {viewingPhase}
                    </span>
                </div>

                <button
                    onClick={handleRightClick}
                    disabled={!canGoRight}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                        canGoRight ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                        isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'opacity-0 cursor-default'
                    }`}
                >
                    {isLocked ? (
                        <><Lock size={16} /> Locked</>
                    ) : (
                        <>Next Phase <ChevronRight size={18} /></>
                    )}
                </button>
            </div>

            {/* Workspace Canvas */}
            <main className="flex-1 p-8 overflow-x-auto">
                {viewingPhase === 'PLANNING' && (
                    <PlanningLobby
                        milestone={initialMilestone} 
                        profile={profile}
                        isHistory={viewingPhase !== milestone.current_phase} 
                        onPhaseUpdate={handlePhaseUpdate} 
                        isPm={isPm}
                    />
                )}
                    
                {viewingPhase === 'DEVELOPMENT' && (
                    <DevelopmentBoard onPhaseUpdate={handlePhaseUpdate} />
                )}

                {viewingPhase === 'TESTING' && (
                    <TestingBoard onPhaseUpdate={handlePhaseUpdate} />
                )}
            </main>
        </div>
    )
}