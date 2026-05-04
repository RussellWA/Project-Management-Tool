import { Milestone } from "@/types/milestone";
import Link from "next/link";


export default function MilestoneList({milestone}: {milestone: Milestone}) {
    return (
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
    )
}