'use client';

import { projectService } from '@/lib/services/project';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewProjectModal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [client, setClient] = useState('');

    const handleClose = () => {
        setIsOpen(false);
        setError(null);
        setName('');
        setClient('');
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { data, error: submitError } = await projectService.create(name, client);

        if (submitError) {
            setError(submitError.message);
            setIsLoading(false);
        return;
        }

        // Reset and Close using your custom handler
        setIsLoading(false);
        handleClose();

        // Force the Dashboard to re-fetch
        router.refresh(); 
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
                + New Project
            </button>

            {isOpen && (

                <div
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleClose()
                        }
                    }} 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                >   
                    <div className="relative w-full max-w-sm md:max-w-md lg:max-w-xl bg-white border border-gray-400 rounded-lg p-6">
                        <h1>Create New Project</h1>

                        <form onSubmit={handleSubmit} className='grid gap-6 py-4'>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                {error}
                                </div>
                            )}

                            <div className='grid gap-2'>
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">Project Name</label>
                                <input 
                                    id="name" 
                                    required
                                    placeholder="e.g., Warteg POS System" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>

                            <div className='grid gap-2'>
                                <label htmlFor="client" className="text-sm font-medium text-gray-700">Client Name</label>
                                <input 
                                    id="client" 
                                    required
                                    placeholder="e.g., Budi's Eatery or Pauss Prod" 
                                    value={client}
                                    onChange={(e) => setClient(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>

                            <div className='grid gap-2'>
                                <button 
                                    type="button" 
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                                        isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                                    }`}
                                >
                                    {isLoading ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}