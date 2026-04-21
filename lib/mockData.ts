export type Phase = 'PLANNING' | 'DEVELOPMENT' | 'TESTING' | 'DONE';

export interface Milestone {
    id: string;
    name: string;
    currPhase: Phase;
    progress: number;
}

export interface Project {
    id: string;
    client: string;
    name: string;
    milestones: Milestone[];
}

export const mockProjects: Project[] = [
    {
        id: 'proj-1',
        client: 'Starlight Eatery',
        name: 'POS System & Web App',
        milestones: [
            { id: 'm-1', name: 'MVP Launch', currPhase: 'DEVELOPMENT', progress: 65 },
            { id: 'm-2', name: 'Analytics Dashboard', currPhase: 'PLANNING', progress: 10 },
        ]
    },
    {
        id: 'proj-2',
        client: 'Nexus Gaming',
        name: 'Tournament Bracket App',
        milestones: [
            { id: 'm-3', name: 'Phase 1: Registration', currPhase: 'TESTING', progress: 90 },
        ]
    }
];

export interface Card {
    id: string;
    title: string;
    status: string;
}

// export const mockMilestoneDetails = {
//     id: 'm-1',
//     projectId: 'proj-1',
//     name: 'MVP Launch',
//     currActualPhase: 'DEVELOPMENT' as Phase, // The furthest unlocked phase
//     planningCards: [
//         { id: 'p1', title: 'User Authentication Flow', status: 'Approved' },
//         { id: 'p2', title: 'Database Schema Design', status: 'Approved' },
//     ],
//     devCards: [
//         { id: 'd1', title: 'Build Login API', status: 'In Progress' },
//         { id: 'd2', title: 'Design Landing Page UI', status: 'To Do' },
//     ]
// };

export const mockMilestoneDetails = {
    id: 'm-2',
    projectId: 'proj-2',
    name: 'MVP Launch',
    currActualPhase: 'DEVELOPMENT' as Phase, // The furthest unlocked phase
};

// Helper array to calculate left/right logic
export const PHASE_ORDER: Phase[] = ['PLANNING', 'DEVELOPMENT', 'TESTING', 'DONE'];