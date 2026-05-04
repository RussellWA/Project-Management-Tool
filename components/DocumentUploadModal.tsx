'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Document } from '@/types/document';
import { createDocument } from '@/lib/services/document';

interface DocumentUploadModalProps {
    projectId: string;          // Project is always required
    milestoneId?: string | null; // Optional phase
    taskId?: string | null;      // Optional task
    profile: any;
}

export default function DocumentUploadModal({ 
    projectId, 
    milestoneId = null, 
    taskId = null,
    profile,
}: DocumentUploadModalProps) {
  
    const router = useRouter();
    
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('link'); // e.g., 'figma', 'doc', 'link'

    const handleClose = () => {
        setIsOpen(false);
        setError(null);
        setName('');
        setUrl('');
        setType('link');
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        const document: Document = {
            id: "",
            name: name, 
            url: url,
            type: type,
            project_id: projectId,
            milestone_id: milestoneId,
            task_id: taskId,
            uploaded_by: profile.id 
        }

        const { error: insertError } = await createDocument(document)


        if (insertError) {
            setError(insertError);
            setIsLoading(false);
            return;
        }

        // 3. Reset, close, and refresh the UI
        setIsLoading(false);
        handleClose();
        router.refresh(); 
    };

    return (
        <>
        <button 
            onClick={() => setIsOpen(true)}
            className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            Add Document Link
        </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

                    <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">✕</button>

                        <h2 className="text-xl font-bold text-gray-900 mb-6">Attach Document</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                                <input 
                                    required
                                    placeholder="e.g., MVP Figma Board" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL / Link</label>
                                <input 
                                    type="url"
                                    required
                                    placeholder="https://..." 
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                                >
                                    <option value="figma">Figma File</option>
                                    <option value="doc">Google Doc</option>
                                    <option value="github">GitHub Repo</option>
                                    <option value="other">Other Link</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                                <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {isLoading ? 'Saving...' : 'Add Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}