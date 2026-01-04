'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
              <span className="text-sm font-bold text-white dark:text-zinc-900">I</span>
            </div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
              InfoSYS
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {user?.firstName} {user?.lastName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            You are logged in as <span className="font-medium">{user?.email}</span>
          </p>

          {/* User Info Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                User ID
              </h3>
              <p className="mt-1 font-mono text-sm text-zinc-900 dark:text-white">
                {user?.id?.slice(0, 8)}...
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Full Name
              </h3>
              <p className="mt-1 text-sm text-zinc-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Status
              </h3>
              <p className="mt-1 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user?.status
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {user?.status ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Quick Actions
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Common tasks and shortcuts
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <svg
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  New Project
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Create a new project
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  View Reports
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Access all reports
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <svg
                  className="h-5 w-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Team
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Manage team members
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <svg
                  className="h-5 w-5 text-orange-600 dark:text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Settings
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Configure your account
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
