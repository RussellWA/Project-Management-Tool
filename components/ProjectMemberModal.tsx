"use client";

import { createMember, updateMemberRoles } from "@/lib/services/project_member";
import { Profile } from "@/types/profile";
import { ProjectMember, Role, ROLE_GROUPS } from "@/types/project_member";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectMemberModalProps {
    projectId: string | undefined;
    profiles: Profile[] | null;
    member?: ProjectMember;
    existingMembers: ProjectMember[] | null;
}

export default function ProjectMemberModal({projectId, profiles, member, existingMembers}: ProjectMemberModalProps) {
    const router = useRouter();
    const isEditMode = !!member;
        
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const availableProfiles = profiles?.filter(prof => !existingMembers?.some(mem => mem.user_id === prof.id))

    // Form State
    const [selectedProfile, setSelectedProfile] = useState(
        member?.user_id ?? ""
    );

    const [roleList, setRoleList] = useState<Role[]>(
        member?.role_detail ?? []
    );
    
    useEffect(() => {
        setSelectedProfile(member?.user_id ?? "");
        setRoleList(member?.role_detail ?? []);
    }, [member]);

    const handleClose = () => {
        setIsOpen(false);
        setError(null);
        setSelectedProfile("");
        setRoleList([]);
    };
    
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!projectId) {
            return
        }

        if (isEditMode) {
            const { error: updateError } = await updateMemberRoles(member.id, roleList)

            if (updateError) {
                setError(updateError);
                setIsLoading(false);
                return;
            }
        }
        else {
            const newMember: ProjectMember = {
                id: "",
                user_id: selectedProfile,
                project_id: projectId,
                role: "MEMBER",
                role_detail: roleList
            }
    
            const { error: insertError } = await createMember(newMember)
    
            if (insertError) {
                setError(insertError);
                setIsLoading(false);
                return;
            }
        }
    
        setIsLoading(false);
        handleClose();
        router.refresh(); 
    };

    const toggleRole = (role: Role) => {
        setRoleList((prev) =>
            prev.includes(role)
            ? prev.filter((r) => r !== role)
            : [...prev, role]
        );
    }

    return (
        <>
            {isEditMode ? (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="text-amber-600"
                >
                    <Pencil size={18} />
                </button>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="text-blue-600 text-sm hover:underline"
                >
                    + Add
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">✕</button>

                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {isEditMode ? "Edit Project Member" : "Add Project Member"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile</label>
                                {isEditMode ? (
                                    <p>{profiles?.find(prof => prof.id === selectedProfile)?.username}</p>
                                ) : (
                                    <select
                                        value={selectedProfile}
                                        disabled={isEditMode}
                                        onChange={(e) => setSelectedProfile(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                                    >
                                        <option value="">Select User</option>
                                        {availableProfiles?.map((profile) => (
                                            <option key={profile.id} value={profile.id}>
                                                {profile.username}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
                                <div className="space-y-4">
                                    {Object.entries(ROLE_GROUPS).map(([group, roles]) => (
                                        <div key={group} className="space-y-2">
                                            <h3 className="font-semibold text-gray-700">
                                                {group}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-2">
                                                {roles.map((role) => (
                                                    <label
                                                        key={role}
                                                        className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
                                                    >

                                                        <input
                                                            type="checkbox"
                                                            checked={roleList.includes(role)}
                                                            onChange={() => toggleRole(role)}
                                                            className="w-4 h-4"
                                                        />

                                                        <span>{role}</span>

                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                                <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {isLoading ? 'Saving...' : isEditMode ? 'Update Member' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}