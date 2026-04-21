"use client";

import { mockMilestoneDetails, Phase, PHASE_ORDER } from "@/lib/mockData";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import PlanningLobby from "./sections/PlanningLobby";

export default function MilestoneWorkspace() {
    const params = useParams();
    const milestoneId = params.milestoneId as string;

    const milestone = mockMilestoneDetails;

    const [viewingPhase, setViewingPhase] = useState<Phase>(milestone.currActualPhase);

    // Will change for navigation
    const currIdx = PHASE_ORDER.indexOf(viewingPhase);

    // Actual current phase
    const actualIdx = PHASE_ORDER.indexOf(milestone.currActualPhase);

    // 0 is the far left
    const canGoLeft = currIdx > 0;
    // if curr idx is less than 3 (cuz 3 is far right) AND curr idx cant be more than actual (cuz locked)
    const canGoRight = currIdx < PHASE_ORDER.length - 1 && currIdx < actualIdx

    const isLocked = currIdx === actualIdx && currIdx < PHASE_ORDER.length - 1;

    const handleLeftClick = () => {
        if (canGoLeft) setViewingPhase(PHASE_ORDER[currIdx - 1]);
    }

    const handleRightClick = () => {
        if (canGoRight) setViewingPhase(PHASE_ORDER[currIdx + 1]);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
                <Link href={`/projects/${milestone.projectId}`} className="text-sm text-gray-500 hover:text-gray-900">
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
                    <span className="text-lg font-bold text-blue-700 bg-blue-50 px-4 py-1 rounded-full border border-blue-200">{viewingPhase}</span>
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
                    <PlanningLobby isHistory={viewingPhase !== milestone.currActualPhase} />
                )}
                    
                {/* {viewingPhase === 'DEVELOPMENT' && (
                    <DevelopmentBoard cards={milestone.devCards} />
                )}

                {viewingPhase === 'TESTING' && (
                    <div className="text-center text-gray-500 mt-20">Testing Phase UI goes here...</div>
                )} */}
            </main>
        </div>
    )
}

// function DevelopmentBoard({ cards }: { cards: any[] }) {
//   return (
//     <div className="flex gap-6 h-full min-h-125">
//       {/* Simple Kanban Column Mockup */}
//       <div className="bg-gray-100 rounded-xl p-4 w-80 shrink-0">
//         <h3 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wider">Sprint Backlog</h3>
//         <div className="grid gap-3">
//           {cards.map(card => (
//             <div key={card.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-grab">
//               <h4 className="font-medium">{card.title}</h4>
//               <p className="text-xs text-gray-500 mt-2">{card.status}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }