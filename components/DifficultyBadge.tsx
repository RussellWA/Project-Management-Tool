import { Difficulty } from "@/app/milestones/[milestoneId]/sections/DevelopmentBoard";
import { getDifficultyColor } from "@/util/helper";

interface DifficultyBadgeProps {
    difficulty: Difficulty;
}

export default function DifficultyBadge({difficulty}: DifficultyBadgeProps) {
    return (
        <div className="flex justify-between items-start">
            <div 
                className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold border ${getDifficultyColor(difficulty)}`}
            >
                {difficulty}
            </div>
        </div>
    )
}