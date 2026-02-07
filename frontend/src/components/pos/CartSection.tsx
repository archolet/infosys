'use client';

import { usePOSCart, usePOSTable, usePOSTotals } from '@/contexts/POSContext';
import { formatCurrency, TAX_RATE } from '@/data/posData';
import {
  Trash2,
  Minus,
  Plus,
  CreditCard,
  Printer,
  XCircle,
  ShoppingCart,
  Clock,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// HESAP - Refined Utility Theme + Dark Mode (Receipt Style)
// ═══════════════════════════════════════════════════════════════════════════════

interface CartSectionProps {
  className?: string;
}

export function CartSection({ className = '' }: CartSectionProps) {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = usePOSCart();
  const { selectedTable, clearTable } = usePOSTable();
  const { subtotal, taxAmount, total, itemCount } = usePOSTotals();

  const taxPercentage = Math.round(TAX_RATE * 100);

  return (
    <div
      className={`shadow-soft flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900 ${className}`}
    >
      {/* HEADER */}
      <div className="border-b border-stone-100 px-4 py-4 dark:border-stone-800">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Hesap
            </h2>
            {itemCount > 0 && (
              <span className="bg-primary-600 rounded-full px-2 py-0.5 text-[10px] font-bold text-white tabular-nums">
                {itemCount}
              </span>
            )}
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-danger hover:text-danger-dark flex items-center gap-1 text-[11px] transition-colors dark:hover:text-red-400"
            >
              <Trash2 size={12} />
              Temizle
            </button>
          )}
        </div>

        {/* Selected Table */}
        {selectedTable ? (
          <div className="rounded-xl bg-stone-900 p-3.5 text-white dark:border dark:border-stone-700 dark:bg-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 font-mono text-lg font-bold tabular-nums">
                  {selectedTable.name
                    .replace('Masa ', '')
                    .replace('Paket ', 'P')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedTable.name}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-stone-400">
                    <Users size={10} />
                    {selectedTable.capacity} kisilik
                    {selectedTable.waiter && ` | ${selectedTable.waiter}`}
                  </p>
                </div>
              </div>
              {selectedTable.openTime && (
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-[9px] tracking-wider text-stone-500 uppercase">
                    <Clock size={9} />
                    Acilis
                  </p>
                  <p className="font-mono text-sm font-bold text-white tabular-nums">
                    {selectedTable.openTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-300 p-3.5 text-center dark:border-stone-600">
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Masa secilmedi
            </p>
            <p className="mt-0.5 text-[10px] text-stone-300 dark:text-stone-600">
              Sol taraftan masa secerek baslayin
            </p>
          </div>
        )}
      </div>

      {/* CART ITEMS */}
      <div className="custom-scroll flex-1 overflow-y-auto bg-stone-50/50 p-3 dark:bg-stone-800/30">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
              <ShoppingCart
                size={24}
                className="text-stone-300 dark:text-stone-600"
              />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-stone-700 dark:text-stone-300">
              Sepet Bos
            </h3>
            <p className="max-w-[200px] text-xs text-stone-400 dark:text-stone-500">
              Menuden urun ekleyerek siparise baslayin
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {cart.map((item) => {
              const extrasTotal = item.extras.reduce(
                (sum, extra) => sum + extra.price,
                0
              );
              const lineTotal = (item.unitPrice + extrasTotal) * item.quantity;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="mb-2.5 rounded-xl border border-stone-200 bg-white p-3 shadow-xs dark:border-stone-700 dark:bg-stone-800"
                >
                  {/* Product Header */}
                  <div className="mb-1.5 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate pr-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {item.portion.icon} {item.portion.name}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="hover:text-danger hover:bg-danger-light dark:hover:bg-danger/10 rounded-lg p-1.5 text-stone-400 transition-colors dark:text-stone-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Extras */}
                  {item.extras.length > 0 && (
                    <div className="mb-1.5 border-l-2 border-stone-100 pl-2 dark:border-stone-700">
                      {item.extras.map((extra) => (
                        <div
                          key={extra.id}
                          className="flex justify-between text-[11px]"
                        >
                          <span className="text-stone-500 dark:text-stone-400">
                            + {extra.name}
                          </span>
                          <span className="font-mono text-amber-700 tabular-nums dark:text-amber-400">
                            +{formatCurrency(extra.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kitchen Note */}
                  {item.note && (
                    <div className="mb-1.5 rounded-lg bg-amber-50 p-2 dark:bg-amber-950/30">
                      <p className="text-[11px] text-amber-700 dark:text-amber-400">
                        {item.note}
                      </p>
                    </div>
                  )}

                  {/* Quantity + Price */}
                  <div className="flex items-center justify-between border-t border-stone-100 pt-2 dark:border-stone-700">
                    <div className="flex items-center gap-0.5 rounded-lg bg-stone-100 p-0.5 dark:bg-stone-700">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="btn-active-scale flex h-7 w-7 items-center justify-center rounded-md text-stone-600 transition-all hover:bg-white hover:shadow-xs dark:text-stone-300 dark:hover:bg-stone-600"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-bold text-stone-900 tabular-nums dark:text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="btn-active-scale flex h-7 w-7 items-center justify-center rounded-md text-stone-600 transition-all hover:bg-white hover:shadow-xs dark:text-stone-300 dark:hover:bg-stone-600"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-mono text-sm font-bold text-stone-900 tabular-nums dark:text-stone-100">
                      {formatCurrency(lineTotal)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* FOOTER - Bill Summary + Actions */}
      <div className="border-t border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900">
        {/* Bill Summary */}
        {cart.length > 0 && (
          <div className="space-y-1 px-4 pt-3.5 pb-2 font-mono text-xs">
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>Ara Toplam</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-500 dark:text-stone-400">
              <span>KDV (%{taxPercentage})</span>
              <span className="tabular-nums">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="!my-2 h-px bg-stone-200 dark:bg-stone-700" />
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                TOPLAM
              </span>
              <span className="text-xl font-bold text-stone-900 tabular-nums dark:text-stone-100">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 px-4 pt-2 pb-3.5">
          <button
            disabled={cart.length === 0}
            className={`touch-target btn-active-scale flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
              cart.length === 0
                ? 'cursor-not-allowed bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500'
                : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
            } `}
          >
            <CreditCard size={17} />
            Odeme Al
          </button>
          <div className="flex gap-2">
            <button
              disabled={cart.length === 0}
              className="touch-target btn-active-scale flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2.5 text-xs font-semibold text-stone-600 transition-all hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Printer size={14} />
              Yazdir
            </button>
            <button
              disabled={cart.length === 0}
              onClick={() => {
                clearCart();
                clearTable();
              }}
              className="border-danger/20 text-danger hover:bg-danger-light dark:hover:bg-danger/10 touch-target btn-active-scale flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
            >
              <XCircle size={14} />
              Iptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
