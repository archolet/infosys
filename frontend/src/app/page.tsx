import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login page
  // Middleware will handle redirect to dashboard if user is already authenticated
  redirect('/login');
}
