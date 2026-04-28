'use client';

import { useState } from 'react';
import { UserPlus, User, CheckCircle2, XCircle, ChevronDown, ChevronRight, Plus, MinusCircle } from 'lucide-react';
import EditableDescription from '@/components/EditableDescription';
import { Phase } from '@/lib/mockData';

type TestStatus = 'PENDING' | 'PASSED' | 'FAILED';

// 1. New Data Structure: Parent and Children
interface TestCase {
    id: string;
    description: string;
    status: TestStatus;
    notes: string;
}

interface FeatureGroup {
    id: string;
    devCardId: string;
    title: string;
    tester?: string;
    isExpanded: boolean;
    testCases: TestCase[];
}

interface TestingBoardProps {
    onPhaseUpdate: (phase: Phase) => void;
}

export default function TestingBoard({onPhaseUpdate}: TestingBoardProps) {
    // Mock Data with Nested Test Cases
    const [features, setFeatures] = useState<FeatureGroup[]>([
        { 
            id: 'f1', devCardId: 't1', title: 'User Login & JWT Auth', tester: 'Sarah', isExpanded: true,
            testCases: [
                { id: 'tc1', description: 'Login with valid credentials', status: 'PASSED', notes: '' },
                { id: 'tc2', description: 'Login with wrong password', status: 'PASSED', notes: 'Correctly shows error toast.' },
                { id: 'tc3', description: 'JWT token expires after 1hr', status: 'FAILED', notes: 'Token stayed alive for 24 hours.' },
            ]
        },
        { 
            id: 'f2', devCardId: 't2', title: 'Checkout Stripe Integration', isExpanded: false,
            testCases: [
                { id: 'tc4', description: 'Process valid visa card', status: 'PENDING', notes: '' },
                { id: 'tc5', description: 'Handle declined card', status: 'PENDING', notes: '' },
            ]
        }
    ]);

    const currentUser = 'Russell';

    // --- LOGIC HANDLERS ---
  
    // Calculate parent status dynamically
    const getParentStatus = (testCases: TestCase[]): TestStatus => {
        if (testCases.length === 0) return 'PENDING';
        if (testCases.some(tc => tc.status === 'FAILED')) return 'FAILED';
        if (testCases.every(tc => tc.status === 'PASSED')) return 'PASSED';
        return 'PENDING';
    };

    const toggleExpand = (featureId: string) => {
        setFeatures(features.map(f => f.id === featureId ? { ...f, isExpanded: !f.isExpanded } : f));
    };

    const handleClaim = (featureId: string) => {
        setFeatures(features.map(f => f.id === featureId ? { ...f, tester: f.tester === undefined ? currentUser : undefined } : f));
    }

    const updateTestCaseStatus = (featureId: string, testCaseId: string, newStatus: TestStatus) => {
        setFeatures(features.map(f => {
            if (f.id !== featureId) return f;
            return {
                ...f,
                testCases: f.testCases.map(tc => tc.id === testCaseId ? { ...tc, status: newStatus } : tc)
            };
        }));
    };

    const updateTestCaseNotes = (featureId: string, testCaseId: string, newNotes: string) => {
        setFeatures(features.map(f => {
            if (f.id !== featureId) return f;
            return {
                ...f,
                testCases: f.testCases.map(tc => tc.id === testCaseId ? { ...tc, notes: newNotes } : tc)
            };
        }));
    }

    const handleNewTestCase = (featureId: string) => {
        const newTestCase: TestCase = {
            id: crypto.randomUUID(),
            description: "",
            status: "PENDING",
            notes: "",
        }

        setFeatures(features.map(f => f.id === featureId ? {...f, testCases: [...f.testCases, newTestCase] } : f));
    }

    const handleNextPhase = () => {
        const allPassed = features.every(group =>
            group.testCases.length > 0 &&
            group.testCases.every(tc => tc.status === "PASSED")
        )

        if (allPassed) onPhaseUpdate("DONE")
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Quality Assurance</h2>
                    <p className="text-sm text-gray-500 mt-1">Break features down into specific test cases and verify them.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-5">Feature & Test Cases</div>
                    <div className="col-span-2">Tester</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">Notes</div>
                </div>

                {/* Features List */}
                <div className="divide-y divide-gray-200">
                    {features.map((feature) => {
                        const parentStatus = getParentStatus(feature.testCases);

                        return (
                            <div key={feature.id} className="flex flex-col">
                                
                                {/* --- PARENT ROW (The Feature) --- */}
                                <div 
                                    className={`grid grid-cols-12 gap-4 p-4 items-center cursor-pointer hover:bg-gray-50 transition-colors ${feature.isExpanded ? 'bg-blue-50/30' : ''}`}
                                    onClick={() => toggleExpand(feature.id)}
                                >
                                    {/* Feature Title with Chevron */}
                                    <div className="col-span-5 font-semibold text-gray-800 text-sm flex items-center gap-2 select-none">
                                        <button className="p-1 hover:bg-gray-200 rounded text-gray-500">
                                            {feature.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </button>
                                        {feature.title}
                                        <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {feature.testCases.length} cases
                                        </span>
                                    </div>

                                    {/* Tester */}
                                    <div className="col-span-2" onClick={(e) => e.stopPropagation()}>
                                        {feature.tester ? (
                                            <div onClick={() => handleClaim(feature.id)} className="flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100 w-fit">
                                                <User size={12} /> {feature.tester}
                                            </div>
                                        ) : (
                                            <button onClick={() => handleClaim(feature.id)} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-purple-600 hover:bg-purple-50 px-2 py-1 rounded-md transition-colors">
                                                <UserPlus size={14} /> Claim
                                            </button>
                                        )}
                                    </div>

                                    {/* Derived Parent Status Badge */}
                                    <div className="col-span-2">
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                                            parentStatus === 'PASSED' ? 'bg-green-100 text-green-700 border-green-200' :
                                            parentStatus === 'FAILED' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {parentStatus}
                                        </span>
                                    </div>
                                    
                                    <div className="col-span-3 text-xs text-gray-400 italic">
                                        {parentStatus === 'FAILED' ? 'Requires developer fix' : ''}
                                    </div>
                                </div>

                                {/* --- CHILD ROWS (The Test Cases) --- */}
                                {feature.isExpanded && (
                                    <div className="bg-gray-50/50 border-t border-gray-100 pb-2">
                                        {feature.testCases.map((tc) => (
                                            <div key={tc.id} className="grid grid-cols-12 gap-4 py-3 px-4 items-start group hover:bg-white transition-colors border-l-4 border-transparent hover:border-blue-400">
                                                
                                                {/* Indented Description */}
                                                <div className="col-span-5 pl-8 text-sm text-gray-600 flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0"></div>
                                                    {tc.description}
                                                </div>

                                                {/* Empty Tester Column (Inherited from Parent) */}
                                                <div className="col-span-2"></div>

                                                {/* Child Pass/Fail Toggles */}
                                                <div className="col-span-2 flex items-center gap-1">
                                                    <button 
                                                        onClick={() => updateTestCaseStatus(feature.id, tc.id, 'PASSED')}
                                                        className={`p-1.5 rounded-md transition-colors ${
                                                        tc.status === 'PASSED' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-200 hover:text-green-600'
                                                        }`} title="Pass">
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => updateTestCaseStatus(feature.id, tc.id, 'PENDING')}
                                                        className={`p-1.5 rounded-md transition-colors ${
                                                        tc.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:bg-gray-200 hover:text-orange-600'
                                                        }`} title="Pending">
                                                        <MinusCircle size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => updateTestCaseStatus(feature.id, tc.id, 'FAILED')}
                                                        className={`p-1.5 rounded-md transition-colors ${
                                                        tc.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:bg-gray-200 hover:text-red-600'
                                                        }`} title="Fail">
                                                        <XCircle size={16} />
                                                    </button>
                                                </div>

                                                {/* Child Notes */}
                                                <div className="col-span-3 text-sm">
                                                    <EditableDescription value={tc.notes} onChange={(newNotes) => updateTestCaseNotes(feature.id, tc.id, newNotes)} />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add New Test Case Button */}
                                        <div className="pl-12 py-2">
                                            <button 
                                                onClick={() => handleNewTestCase(feature.id)}
                                                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                <Plus size={14} /> Add test case
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}