"use client";

import { Check, Clock, ExternalLink, FileText, Plus, Rocket } from "lucide-react";
import { useState } from "react";


interface Document {
    id: string;
    title: string;
    url: string;
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    isApprove: boolean;
}

export default function PlanningLobby({isHistory}: {isHistory?: boolean}) {
    // Mock Data: Documents
    const [documents, setDocuments] = useState<Document[]>([
        { id: '1', title: 'Master Project Proposal', url: '#' },
        { id: '2', title: 'Figma Design System', url: '#' },
    ]);

    // Mock Data: The Lobby
    const [team, setTeam] = useState<TeamMember[]>([
        { id: 'u1', name: 'Russell (You)', role: 'Lead Dev', isApprove: false },
        { id: 'u2', name: 'Sarah', role: 'Designer', isApprove: true },
        { id: 'u3', name: 'Mike', role: 'Project Manager', isApprove: false },
    ]);

    const allApprove = team.every(member => member.isApprove);
    // Simulate i am u1
    const currUser = team[0];

    const toggleStatus = () => {
        if (isHistory) return;
        setTeam(team.map(member => member.id === currUser.id ? {...member, isApprove: !member.isApprove} : member));
    }

    return (
        <div className="max-w-4xl mx-auto grid gap-6">
            {/* Documents */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Project Documents</h2>
                    <p className="text-sm text-gray-500">Attach all proposals, specs, and design links here</p>
                </div>

                <div className="p-4 grid gap-3">
                    {documents.map((doc) => (
                        <a
                            key={doc.id}
                            href={doc.url}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                                    <FileText size={20} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">{doc.title}</span>
                            </div>
                            <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600" />
                        </a>
                    ))}
                </div>

                {!isHistory && (
                    <div className="p-6">
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 p-3 border border-dashed border-gray-300 rounded-lg justify-center transition-colors hover:bg-gray-50">
                            <Plus size={16} /> Add Document Link
                        </button>
                    </div>
                )}

                <div className="p-6">
                    {/* Roster */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {team.map((member) => (
                            <div
                                key={member.id}
                                className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${
                                member.isApprove ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}
                            >
                                <div>
                                    <p className={`text-sm font-semibold ${member.isApprove ? 'text-green-800' : 'text-gray-700'}`}>
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                                {member.isApprove ? (
                                    <Check className="text-green-600" size={20} />
                                ) : (
                                    <Clock className="text-gray-300" size={20} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Action */}
                    {!isHistory && (
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                            <button
                                onClick={toggleStatus}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                                    currUser.isApprove
                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                        : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                }`}
                            >
                                {currUser.isApprove ? 'Cancel Approval' : 'Approve'}
                            </button>
                            
                            <button 
                                disabled={!allApprove}
                                className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold transition-all ${
                                allApprove 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg translate-y-0' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
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