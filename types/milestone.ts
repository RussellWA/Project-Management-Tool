import { Document } from "./document";

export type Phase = 'PLANNING' | 'DEVELOPMENT' | 'TESTING' | 'DONE';

// Helper array to calculate left/right logic
export const PHASE_ORDER: Phase[] = ['PLANNING', 'DEVELOPMENT', 'TESTING', 'DONE'];

export interface Milestone {
    id: string;
    project_id: string;
    name: string;
    current_phase: Phase;
    progress: number;
    documents: Document[];
}