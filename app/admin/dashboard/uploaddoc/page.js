'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadDocumentsPage() {
    // Always call hooks at the top
    const { data: session, status } = useSession();
    const router = useRouter();

    // Form state hooks
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    // Check authentication on mount
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    // Loading state must come after all hook declarations
    if (status === 'loading' || !session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-lg text-gray-800 dark:text-gray-100">Loading...</p>
            </div>
        );
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        const formData = new FormData();
        formData.append('title', title);
        if (file) formData.append('file', file);

        try {
            // Adjust the endpoint as needed
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                throw new Error('Upload failed');
            }
            setUploadSuccess('Document uploaded successfully!');
            setTitle('');
            setFile(null);
        } catch (error) {
            setUploadError(error.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Upload Documents - Admin Dashboard</title>
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="lg:w-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            <div className="mb-10 text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto flex items-center justify-center mb-4">
                                    <span className="text-3xl font-bold text-white">
                                        {session.user.name ? session.user.name[0].toUpperCase() : 'A'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Admin</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</p>
                            </div>
                            <nav className="space-y-4">
                                <Link
                                    href="/admin/upload"
                                    className="block px-5 py-3 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 border-2 border-indigo-500 shadow transition"
                                >
                                    Upload Documents
                                </Link>
                                <Link
                                    href="/admin/my-documents"
                                    className="block px-5 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                >
                                    My Documents
                                </Link>
                                <button
                                    onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                                    className="w-full mt-6 px-5 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                                >
                                    Log Out
                                </button>
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <main className="lg:flex-grow">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                                    Upload Documents
                                </h2>
                                <form onSubmit={handleUpload} className="space-y-6">
                                    <div>
                                        <label className="block text-lg text-gray-600 dark:text-gray-300 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-lg text-gray-600 dark:text-gray-300 mb-2">File</label>
                                        <input
                                            type="file"
                                            className="w-full text-gray-800 dark:text-gray-100"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            required
                                        />
                                    </div>
                                    {uploadError && <p className="text-red-500">{uploadError}</p>}
                                    {uploadSuccess && <p className="text-green-500">{uploadSuccess}</p>}
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Document'}
                                    </button>
                                </form>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-800 text-center py-4 shadow-inner mt-12">
                    <p className="text-gray-600 dark:text-gray-300">
                        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                    </p>
                </footer>
            </div>
        </>
    );
}
