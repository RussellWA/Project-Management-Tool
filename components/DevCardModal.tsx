"use client";

import { DevCard } from "@/app/milestones/[milestoneId]/sections/DevelopmentBoard";
import DifficultyBadge from "./DifficultyBadge";
import { useEffect } from "react";
import { User } from "lucide-react";


interface DevCardModalProps {
    card: DevCard;
    onClose: () => void;
    claimTask: (id: string) => void;
}

export default function DevCardModal({card, onClose, claimTask}: DevCardModalProps) {

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = ""
        }
    }, [])    

    return (
        <div
            // e.currentTarget = backdrop, e.target = what i clicked
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose()
                }
            }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <div className="w-full max-w-sm md:max-w-lg lg:max-w-2xl bg-white border border-gray-400 rounded-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-500/30 pb-3">
                    {card.assignee ? (
                        <div className="flex gap-2 items-center">
                            <p className="text-gray-800 text-sm">Assigned to </p>
                            <div className={"flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md borde text-gray-800 bg-gray-100"}>
                                <User size={12} /> {card.assignee}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => claimTask(card.id)}
                            className="rounded-lg px-3 py-1.5 text-sm text-white bg-gray-900 
                            hover:bg-white hover:text-black hover:border active:scale-95 transition cursor-pointer"
                        >
                            Claim Task
                        </button>
                    )}
                    <p className="font-bold text-gray-800 text-lg">{card.title}</p>
                    <div className="flex gap-2 items-center">
                        <p className="text-gray-800 text-sm">Difficulty:</p>
                        <DifficultyBadge difficulty={card.difficulty} />
                    </div>
                </div>

                <div>

                </div>
            </div>
        </div>
    )
}