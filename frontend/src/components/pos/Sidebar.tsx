'use client';

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  ChefHat,
  LayoutGrid,
  Package,
  BarChart3,
  Settings,
  User,
  Wallet,
  LogOut,
  Loader2,
  Sun,
  Moon,
  SunMoon,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// ═══════════════════════════════════════════════════════════════════════════════
// POS SIDEBAR - Refined Utility Design (72px Rail)
// ═══════════════════════════════════════════════════════════════════════════════

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '??';
}

function getFullName(firstName?: string, lastName?: string): string {
  return [firstName, lastName].filter(Boolean).join(' ') || 'Kullanici';
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'satis', label: 'Satis', icon: Monitor, href: '/pos' },
  { id: 'mutfak', label: 'Mutfak', icon: ChefHat, href: '/pos/mutfak' },
  { id: 'masa', label: 'Masa', icon: LayoutGrid, href: '/pos/masa' },
  { id: 'stok', label: 'Stok', icon: Package, href: '/pos/stok' },
  { id: 'rapor', label: 'Rapor', icon: BarChart3, href: '/pos/rapor' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// USER AVATAR DROPDOWN
// ═══════════════════════════════════════════════════════════════════════════════

function UserAvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const userInfo = useMemo(
    () => ({
      initials: getInitials(user?.firstName, user?.lastName),
      fullName: getFullName(user?.firstName, user?.lastName),
      email: user?.email || '',
    }),
    [user]
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch {
      // Silent fail - logout will clear state anyway
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-primary-600 relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 transition-all duration-200 hover:scale-105 active:scale-95 ${isOpen ? 'ring-primary-400 scale-105' : 'ring-primary-400/40 hover:ring-primary-400'} `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={userInfo.fullName}
      >
        {userInfo.initials}
      </button>

      {/* Online Indicator */}
      <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 bg-emerald-500 dark:border-zinc-950" />

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute bottom-full left-0 z-50 mb-3 w-56 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl"
            role="menu"
          >
            {/* User Info Header */}
            <div className="border-b border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white">
                  {userInfo.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {userInfo.fullName}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {userInfo.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <User
                  size={16}
                  className="group-hover:text-primary-400 text-zinc-500 transition-colors"
                />
                <span>Profil Ayarlari</span>
              </button>

              <button
                className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <Wallet
                  size={16}
                  className="group-hover:text-primary-400 text-zinc-500 transition-colors"
                />
                <span>Hesap Bilgileri</span>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-zinc-800 py-1">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                role="menuitem"
              >
                {isLoggingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                )}
                <span className="font-medium">
                  {isLoggingOut ? 'Cikis yapiliyor...' : 'Cikis Yap'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME TOGGLE BUTTON
// ═══════════════════════════════════════════════════════════════════════════════

// useSyncExternalStore: server=false, client=true — no setState in effect needed
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Before hydration: render a stable placeholder that matches SSR output
  const Icon = !mounted
    ? SunMoon
    : theme === 'system'
      ? SunMoon
      : resolvedTheme === 'dark'
        ? Sun
        : Moon;
  const title = !mounted
    ? 'Sistem'
    : theme === 'light'
      ? 'Acik Tema'
      : theme === 'dark'
        ? 'Koyu Tema'
        : 'Sistem';

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-zinc-300"
      title={title}
      aria-label={`Tema: ${title}`}
    >
      <Icon size={18} strokeWidth={1.5} />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/pos') return pathname === '/pos' || pathname === '/pos/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed top-0 left-0 z-50 flex h-screen w-[72px] flex-col items-center border-r border-zinc-800 bg-zinc-900 py-5 dark:border-zinc-700 dark:bg-zinc-950">
      {/* Logo */}
      <div className="mb-8">
        <div className="from-primary-500 to-primary-600 shadow-primary-500/20 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-lg">
          G
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex w-full flex-1 flex-col gap-0.5 px-1.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative flex w-full flex-col items-center justify-center gap-1 rounded-lg py-3 transition-all duration-200 ${active ? 'text-white' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'} `}
            >
              {/* Active indicator bar */}
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="bg-primary-500 absolute top-1/2 left-0 h-7 w-[3px] -translate-y-1/2 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="mb-1">
        <ThemeToggle />
      </div>

      {/* Settings */}
      <div className="mb-4">
        <Link
          href="/pos/ayarlar"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-zinc-300"
          title="Ayarlar"
        >
          <Settings size={18} strokeWidth={1.5} />
        </Link>
      </div>

      {/* User */}
      <div className="pb-2">
        <UserAvatarDropdown />
      </div>
    </aside>
  );
}
