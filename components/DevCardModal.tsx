"use client";

import { DevCard } from "@/app/milestones/[milestoneId]/sections/DevelopmentBoard";
import DifficultyBadge from "./DifficultyBadge";
import { useEffect } from "react";
import { User } from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "./StatusBadge";


interface DevCardModalProps {
    card: DevCard;
    onClose: () => void;
    updateStatus: (id: string, direction: "next" | "prev") => void;
}

export default function DevCardModal({card, onClose, updateStatus}: DevCardModalProps) {

    const prevBtnClass = card.status === "IN_PROGRESS" ? 
    "bg-gray-900 hover:text-gray-900 hover:border-gray-900" : card.status === "REVIEW" ?
    "bg-amber-500 hover:text-amber-500 hover:border-amber-500" :
    "bg-red-500 hover:text-red-500 hover:border-red-500"

    const nextBtnClass = card.status === "IN_PROGRESS" ? 
    "bg-amber-500 hover:text-amber-500 hover:border-amber-500" :
    "bg-emerald-500 hover:text-emerald-500 hover:border-emerald-500"

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
                    <div className="flex items-center gap-4">
                        <p className="font-bold text-gray-800 text-lg">{card.title}</p>
                        <motion.div key={card.status} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <StatusBadge status={card.status} />
                        </motion.div>
                    </div>
                    {card.assignee ? (
                        <div className="flex gap-2 items-center">
                            <p className="text-gray-800 text-sm font-semibold">Assigned to </p>
                            <div className={"flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md borde text-gray-800 bg-gray-100"}>
                                <User size={12} /> {card.assignee}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => updateStatus(card.id, "next")}
                            className="rounded-lg px-3 py-1.5 text-sm text-white bg-blue-700 
                            hover:bg-white hover:text-blue-700 hover:border-blue-700 active:scale-95 transition cursor-pointer"
                        >
                            Claim Task
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-3 py-3">
                    <div className="col-span-3">
                        <p className="text-gray-800 text-sm">{card.description}</p>
                    </div>
                    <div className="col-span-1 flex gap-2 items-center justify-end">
                        <p className="text-gray-800 text-sm font-semibold">Difficulty:</p>
                        <DifficultyBadge difficulty={card.difficulty} />
                    </div>
                </div>
                {card.status !== "TODO" && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => updateStatus(card.id, "prev")}
                            className={`rounded-lg px-3 py-1.5 text-sm text-white ${prevBtnClass}
                            hover:bg-white hover:border active:scale-95 transition cursor-pointer`}
                        >
                            {card.status === "IN_PROGRESS" ? "Unclaim" : card.status === "REVIEW" ? "Revisions" : "Back to Review"}
                        </button>
                        {card.status !== "DONE" && (
                            <button
                                onClick={() => updateStatus(card.id, "next")}
                                className={`rounded-lg px-3 py-1.5 text-sm text-white ${nextBtnClass}
                                hover:bg-white hover:border active:scale-95 transition cursor-pointer`}
                            >
                                {card.status === "IN_PROGRESS" ? "Push Review" : "Finish Card"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}