import { Difficulty } from "@/app/milestones/[milestoneId]/sections/DevelopmentBoard";


export const getDifficultyColor = (level: Difficulty) => {
    switch(level) {
        case 1: return 'bg-blue-100 text-blue-700 border-blue-200';
        case 2: return 'bg-green-100 text-green-700 border-green-200';
        case 3: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 4: return 'bg-orange-100 text-orange-700 border-orange-200';
        case 5: return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700';
    }
};