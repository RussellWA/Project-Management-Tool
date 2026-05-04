"use client";

import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteMember } from "@/lib/services/project_member";

type Props = {
    memberId: string;
};

export default function DeleteMemberButton({
    memberId,
}: Props) {
    const router = useRouter();

    const handleMemberDelete = async () => {
        const { error } = await deleteMember(memberId);

        if (error) {
            toast.error(error || "Failed to delete member");
            return;
        }

        toast.success("Member deleted");
        router.refresh();
    };

    return (
        <button
            onClick={handleMemberDelete}
            className="text-red-600"
        >
            <Trash size={18} />
        </button>
    );
}