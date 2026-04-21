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