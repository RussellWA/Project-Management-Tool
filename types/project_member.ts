
export type AccessLevel = "MEMBER" | "PM" | null

export const ROLE_GROUPS = {
    "Development": [
        "Full Stack Dev",
        "Back End Dev",
        "Front End Dev",
        "Game Dev",
    ],

    "Design & Art": [
        "UI UX",
        "Game Artist",
    ],

    "Testing & QA": [
        "Game Tester",
        "QA Tester",
    ],

    "Sound": [
        "Sound Designer"
    ]
} as const;

export type Role =
  typeof ROLE_GROUPS[keyof typeof ROLE_GROUPS][number];

export interface ProjectMember {
    id: string;
    project_id: string;
    user_id: string;
    role: AccessLevel;
    role_detail: Role[];
}