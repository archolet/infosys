import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
            <span className="text-xl font-bold text-white dark:text-zinc-900">I</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome to InfoSYS
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
              </div>
            }
          >
            <LoginFormWrapper />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} InfoSYS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
