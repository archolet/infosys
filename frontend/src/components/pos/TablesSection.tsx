'use client';

import { usePOSNavigation, usePOSTable } from '@/contexts/POSContext';
import {
  zones,
  getTablesByZone,
  formatCurrency,
  ZoneId,
  TableStatus,
} from '@/data/posData';
import { Users, Clock, RefreshCw, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// MASALAR - Refined Utility Theme + Dark Mode
// ═══════════════════════════════════════════════════════════════════════════════

const statusConfig: Record<
  TableStatus,
  {
    bg: string;
    border: string;
    dot: string;
    dotPulse: boolean;
    label: string;
    labelColor: string;
  }
> = {
  empty: {
    bg: 'bg-white hover:bg-teal-50/40 dark:bg-stone-900 dark:hover:bg-teal-950/20',
    border: 'border-stone-200 dark:border-stone-700',
    dot: 'bg-teal-500',
    dotPulse: false,
    label: 'Bos',
    labelColor: 'text-teal-700 dark:text-teal-400',
  },
  occupied: {
    bg: 'bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
    dotPulse: true,
    label: 'Dolu',
    labelColor: 'text-rose-700 dark:text-rose-400',
  },
  reserved: {
    bg: 'bg-amber-50/50 hover:bg-amber-50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    dotPulse: false,
    label: 'Rezerve',
    labelColor: 'text-amber-700 dark:text-amber-400',
  },
};

// Stagger animation variants
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
};

interface TablesSectionProps {
  className?: string;
}

export function TablesSection({ className = '' }: TablesSectionProps) {
  const { activeZone, setActiveZone } = usePOSNavigation();
  const { selectedTable, selectTable } = usePOSTable();

  const zoneTables = getTablesByZone(activeZone);

  const getZoneStats = (zoneId: ZoneId) => {
    const tables = getTablesByZone(zoneId);
    const total = tables.length;
    const occupied = tables.filter((t) => t.status === 'occupied').length;
    const empty = tables.filter((t) => t.status === 'empty').length;
    const reserved = tables.filter((t) => t.status === 'reserved').length;
    return { total, occupied, empty, reserved };
  };

  const currentStats = getZoneStats(activeZone);

  return (
    <div
      className={`shadow-soft flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900 ${className}`}
    >
      {/* HEADER */}
      <div className="border-b border-stone-100 px-4 py-4 dark:border-stone-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Masalar
          </h2>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              {currentStats.empty}
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              {currentStats.occupied}
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {currentStats.reserved}
            </span>
          </div>
        </div>

        {/* Zone Tabs */}
        <div className="flex gap-1 rounded-lg bg-stone-100 p-0.5 dark:bg-stone-800">
          {zones.map((zone) => {
            const isActive = zone.id === activeZone;
            const stats = getZoneStats(zone.id);

            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`flex-1 rounded-md px-2.5 py-2 text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-stone-900 font-semibold text-white shadow-sm dark:bg-white dark:text-stone-900'
                    : 'bg-transparent font-medium text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-300'
                } `}
              >
                <span>{zone.name}</span>
                <span
                  className={`ml-1 font-mono ${isActive ? 'text-white/60 dark:text-stone-900/60' : 'text-stone-400 dark:text-stone-500'}`}
                >
                  {stats.occupied}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TABLE GRID */}
      <div className="custom-scroll flex-1 overflow-y-auto bg-stone-50/50 p-3 dark:bg-stone-800/30">
        <motion.div
          className="grid grid-cols-2 gap-2.5"
          key={activeZone}
          initial="hidden"
          animate="visible"
          variants={gridVariants}
        >
          {zoneTables.map((table) => {
            const config = statusConfig[table.status];
            const isSelected = selectedTable?.id === table.id;

            return (
              <motion.button
                key={table.id}
                variants={cardVariants}
                onClick={() => selectTable(table)}
                className={`touch-target btn-active-scale relative rounded-xl border p-3.5 text-left transition-all duration-200 ${config.bg} ${isSelected ? 'border-primary-500 shadow-glow' : config.border + ' hover:shadow-soft shadow-xs'} `}
              >
                {/* Selected check */}
                {isSelected && (
                  <div className="bg-primary-500 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full shadow-md">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Table Number + Status */}
                <div className="mb-2 flex items-start justify-between">
                  <span className="font-mono text-2xl font-bold text-stone-900 tabular-nums dark:text-stone-100">
                    {table.name.replace('Masa ', '').replace('Paket ', 'P')}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-semibold ${config.labelColor}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${config.dot} ${config.dotPulse ? 'animate-status-pulse' : ''}`}
                    />
                    {config.label}
                  </span>
                </div>

                {/* Capacity */}
                <div className="mb-1.5 flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                  <Users size={12} />
                  <span>{table.capacity} kisilik</span>
                </div>

                {/* Occupied Info */}
                {table.status === 'occupied' && (
                  <div className="border-t border-stone-200/60 pt-2 dark:border-stone-700/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                        <Clock size={11} />
                        <span>{table.openTime}</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-stone-900 tabular-nums dark:text-stone-100">
                        {formatCurrency(table.currentAmount || 0)}
                      </span>
                    </div>
                    {table.waiter && (
                      <p className="mt-1 text-[10px] text-stone-400 dark:text-stone-500">
                        {table.waiter}
                      </p>
                    )}
                  </div>
                )}

                {/* Reserved Info */}
                {table.status === 'reserved' && (
                  <div className="border-t border-amber-200/50 pt-2 text-[11px] text-amber-700 dark:border-amber-800/50 dark:text-amber-400">
                    20:00 rezervasyon
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Empty state */}
        {zoneTables.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-stone-400 dark:text-stone-500">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800">
              <Users size={24} className="text-stone-300 dark:text-stone-600" />
            </div>
            <p className="text-sm">Bu bolumde masa bulunmuyor</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-stone-100 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex gap-2">
          <button className="touch-target btn-active-scale flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 py-3 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800">
            <RefreshCw size={16} />
            Yenile
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 touch-target btn-active-scale flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all">
            <Plus size={16} />
            Yeni Siparis
          </button>
        </div>
      </div>
    </div>
  );
}
