import { Status } from "@/app/milestones/[milestoneId]/sections/DevelopmentBoard";
import { Check, Circle, Eye, Loader2 } from "lucide-react";


interface StatusBadgeProps {
  status: Status;
}

const STATUS_STYLES = {
    TODO: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        icon: Circle,
    },
    IN_PROGRESS: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: Loader2,
    },
    REVIEW: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        icon: Eye,
    },
    DONE: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: Check,
    },
} as const;

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const style = STATUS_STYLES[status];
    const Icon = style.icon;

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}
        >
            <Icon className="w-4 h-4" />
            <span>
                {status.replace("_", " ")}
            </span>
        </div>
    );
};