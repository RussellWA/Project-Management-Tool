"use client";

import DevCardModal from "@/components/DevCardModal";
import DifficultyBadge from "@/components/DifficultyBadge";
import { getDifficultyColor } from "@/util/helper";
import { CheckCircle2, User, UserPlus } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";

export type Status = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export const STATUS_ORDER: Status[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

export interface DevCard {
    id: string;
    title: string;
    difficulty: Difficulty;
    description: string;
    status: Status;
    assignee?: string;
}

export default function DevelopmentBoard() {
    const [selectedCard, setSelectedCard] = useState<DevCard | null>(null);

    // Mock Data
    const [cards, setCards] = useState<DevCard[]>([
        { id: 't1', title: 'Setup Next.js Auth', difficulty: 3, description: "setup bla bla bla", status: 'IN_PROGRESS', assignee: 'Russell' },
        { id: 't2', title: 'Design Database Schema', difficulty: 5, description: "design db schema for with dkaasdaa", status: 'REVIEW', assignee: 'Sarah' },
        { id: 't3', title: 'Build Dashboard Layout', difficulty: 2, description: "a", status: 'TODO' },
        { id: 't4', title: 'Integrate Payment API', difficulty: 4, description: "xendit only with all options", status: 'TODO' },
        { id: 't5', title: 'Initialize Repository', difficulty: 1, description: "self explanatory", status: 'DONE', assignee: 'Russell' },
    ]);

    const currUser = "Russell";

    const updateStatus = (id: string, direction: "next" | "prev") => {
        setCards(cards.map(card => {
            if (card.id !== id) return card;

            const currIdx = STATUS_ORDER.indexOf(card.status);

            let newIdx = currIdx;
            if (direction === "next" && currIdx < STATUS_ORDER.length - 1) {
                newIdx++;
            }
            if (direction === "prev" && currIdx > 0) {
                newIdx--;
            }

            const newStatus = STATUS_ORDER[newIdx]

            const newCard = {...card,
                status: newStatus,
                assignee: newStatus === "TODO" ? undefined : newStatus === "IN_PROGRESS" ? currUser : card.assignee}

            setSelectedCard(newCard)

            return newCard
        }))
    }

    const getCardsByStatus = (status: Status) => {
        return cards.filter(card => card.status === status);
    }

    const Column = ({title, status, count}: {title: string, status: Status, count: number}) => (
        <div className="flex-1 min-w-[320px] bg-gray-50/50 rounded-xl border border-gray-200 flex flex-col h-175">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    {title}
                    {status === "DONE" && <CheckCircle2 size={16} className="text-green-500" />}
                </h3>
                <span className="bg-white text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">{count}</span>
            </div>

            {/* Body */}
            <motion.div layout className="p-3 flex-1 overflow-y-auto space-y-3">
                {getCardsByStatus(status).map((card) => (
                    <motion.div
                        layout
                        layoutId={card.id}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className={`bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group ${
                            status === "DONE" ? "border-green-200 opacity-75 hover:opacity-100" : "border-gray-200"
                        }`}
                    >
                        <div className="mb-3">
                            <DifficultyBadge difficulty={card.difficulty} />
                        </div>

                        <h4 className={`font-medium text-sm mb-4 leading-snug ${
                            status === 'DONE' ? 'text-gray-500 line-through' : 'text-gray-800'
                        }`}>
                            {card.title}
                        </h4>

                        <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-1">
                            {card.assignee ? (
                                <div className={"flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md borde text-gray-800 bg-gray-100"}>
                                    <User size={12} /> {card.assignee}
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(card.id, "next");
                                    }}
                                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                                >
                                    <UserPlus size={14} /> Claim
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );

    return (
        <div className="h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Task Board</h2>
                    <p className="text-sm text-gray-500">Drag and drop tasks to update their status.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
                    + New Task
                </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4">
                <LayoutGroup>
                    <Column title="To Do" status="TODO" count={getCardsByStatus('TODO').length} />
                    <Column title="In Progress" status="IN_PROGRESS" count={getCardsByStatus('IN_PROGRESS').length} />
                    <Column title="Review" status="REVIEW" count={getCardsByStatus('REVIEW').length} />
                    <Column title="Done" status="DONE" count={getCardsByStatus('DONE').length} />
                </LayoutGroup>
            </div>

            {selectedCard && (
                <DevCardModal card={selectedCard} onClose={() => setSelectedCard(null)} updateStatus={updateStatus} />
            )}
        </div>
    )

}