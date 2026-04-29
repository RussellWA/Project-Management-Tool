import { Milestone } from "./milestone";

export interface Project {
    id: string;
    client: string;
    name: string;
    milestones: Milestone[];
}