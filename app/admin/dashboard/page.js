'use client';

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-800 dark:text-gray-100">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            User Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-300">Name:</span>
              <span className="text-gray-800 dark:text-gray-100">
                {session?.user?.name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-300">Email:</span>
              <span className="text-gray-800 dark:text-gray-100">
                {session?.user?.email || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-300">User ID:</span>
              <span className="text-gray-800 dark:text-gray-100">
                {session?.user?.id || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
          >
            Log Out
          </button>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
