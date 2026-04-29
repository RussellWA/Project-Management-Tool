export type Phase = 'PLANNING' | 'DEVELOPMENT' | 'TESTING' | 'DONE';

export interface Milestone {
    id: string;
    name: string;
    current_phase: Phase;
    progress: number;
}