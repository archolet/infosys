'use client';

import React, { useState } from 'react';
import { usePOSModal, usePOSCart, usePOSTable } from '@/contexts/POSContext';
import { Portion, Extra, formatCurrency, Product } from '@/data/posData';
import {
  X,
  Minus,
  Plus,
  ShoppingCart,
  FileText,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT MODAL - Framer Motion Spring Animations + Dark Mode
// ═══════════════════════════════════════════════════════════════════════════════

// Inner content component — key-based reset pattern replaces useEffect setState
function ModalContent({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart } = usePOSCart();
  const { selectedTable } = usePOSTable();

  const [selectedPortion, setSelectedPortion] = useState<Portion>(
    product.portions[0]
  );
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const basePrice = product.basePrice * selectedPortion.priceMultiplier;
  const extrasTotal = selectedExtras.reduce(
    (sum, extra) => sum + extra.price,
    0
  );
  const unitPrice = basePrice + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const availableExtras = product.extras || [];

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.id === extra.id);
      if (exists) return prev.filter((e) => e.id !== extra.id);
      return [...prev, extra];
    });
  };

  const handleAddToCart = () => {
    if (!selectedTable) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      portion: selectedPortion,
      extras: selectedExtras,
      quantity,
      unitPrice: basePrice,
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 25,
            mass: 0.8,
          }}
          className="pointer-events-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:border dark:border-stone-700 dark:bg-stone-900 dark:shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="relative border-b border-stone-200 p-5 dark:border-stone-700">
            <button
              onClick={onClose}
              className="focus-ring absolute top-4 right-4 rounded-lg p-2 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Kapat"
            >
              <X size={18} className="text-stone-500 dark:text-stone-400" />
            </button>

            <div className="flex items-center gap-4 pr-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-3xl dark:bg-stone-800">
                {product.image || '🍽️'}
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="modal-title"
                  className="truncate text-lg font-bold text-stone-900 dark:text-stone-100"
                >
                  {product.name}
                </h2>
                {product.description && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-stone-500 dark:text-stone-400">
                    {product.description}
                  </p>
                )}
                <p className="text-primary-600 dark:text-primary-400 mt-1 font-mono text-xl font-bold tabular-nums">
                  {formatCurrency(product.basePrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="custom-scroll max-h-[55vh] space-y-5 overflow-y-auto p-5">
            {/* Portion Selection */}
            <div>
              <h3 className="mb-2.5 text-xs font-semibold tracking-wider text-stone-500 uppercase dark:text-stone-400">
                Porsiyon Secimi
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {product.portions.map((portion) => {
                  const isSelected = selectedPortion?.id === portion.id;
                  return (
                    <button
                      key={portion.id}
                      onClick={() => setSelectedPortion(portion)}
                      className={`relative rounded-xl border p-3.5 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 shadow-glow'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:hover:border-stone-600 dark:hover:bg-stone-800'
                      } `}
                    >
                      {/* Radio indicator */}
                      <div
                        className={`absolute top-3 right-3 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-stone-300 dark:border-stone-600'} `}
                      >
                        {isSelected && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>

                      <div className="pr-7">
                        <span className="mr-1.5 text-base">
                          {portion.icon || '📦'}
                        </span>
                        <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {portion.name}
                        </span>
                        <p className="text-primary-600 dark:text-primary-400 mt-1 font-mono text-base font-bold tabular-nums">
                          {formatCurrency(
                            product.basePrice * portion.priceMultiplier
                          )}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extras */}
            {availableExtras.length > 0 && (
              <div>
                <h3 className="mb-2.5 text-xs font-semibold tracking-wider text-stone-500 uppercase dark:text-stone-400">
                  Ekstralar
                </h3>
                <div className="space-y-1.5">
                  {availableExtras.map((extra) => {
                    const isSelected = selectedExtras.some(
                      (e) => e.id === extra.id
                    );
                    return (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40'
                            : 'border-stone-200 hover:border-stone-300 dark:border-stone-700 dark:hover:border-stone-600'
                        } `}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-all ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-stone-300 dark:border-stone-600'} `}
                          >
                            {isSelected && (
                              <Check
                                size={10}
                                className="text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <span className="text-sm font-medium text-stone-800 dark:text-stone-200">
                            {extra.name}
                          </span>
                        </div>
                        <span
                          className={`font-mono text-xs tabular-nums ${extra.price > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                        >
                          {extra.price > 0
                            ? `+${formatCurrency(extra.price)}`
                            : 'Ucretsiz'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="mb-2.5 text-xs font-semibold tracking-wider text-stone-500 uppercase dark:text-stone-400">
                Adet
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="btn-active-scale flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 transition-colors hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-stone-800 dark:hover:bg-stone-700"
                  aria-label="Azalt"
                >
                  <Minus
                    size={18}
                    className="text-stone-700 dark:text-stone-300"
                  />
                </button>
                <span className="min-w-[2.5rem] text-center font-mono text-2xl font-bold text-stone-900 tabular-nums dark:text-stone-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn-active-scale flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700"
                  aria-label="Artir"
                >
                  <Plus
                    size={18}
                    className="text-stone-700 dark:text-stone-300"
                  />
                </button>
              </div>
            </div>

            {/* Kitchen Note */}
            <div>
              <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-stone-500 uppercase dark:text-stone-400">
                <FileText size={12} />
                Mutfak Notu
              </h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ozel istek veya not ekleyin..."
                className="focus:border-primary-500 focus:ring-primary-500/10 w-full resize-none rounded-xl border border-stone-200 bg-white p-3 text-sm text-stone-900 placeholder-stone-400 transition-all outline-none focus:ring-2 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:placeholder-stone-500"
                rows={2}
                maxLength={200}
              />
              <p className="mt-1 text-right text-[10px] text-stone-400 tabular-nums dark:text-stone-500">
                {note.length}/200
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-800/50">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-wider text-stone-500 uppercase dark:text-stone-400">
                  Toplam Tutar
                </p>
                <p className="font-mono text-2xl font-bold text-stone-900 tabular-nums dark:text-stone-100">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
              {quantity > 1 && (
                <p className="font-mono text-xs text-stone-500 tabular-nums dark:text-stone-400">
                  {quantity} x {formatCurrency(unitPrice)}
                </p>
              )}
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="btn-active-scale flex-1 rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
              >
                Iptal
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedTable}
                className="bg-primary-600 hover:bg-primary-700 btn-active-scale flex flex-[2] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={16} />
                Sepete Ekle
              </button>
            </div>

            {!selectedTable && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle size={13} />
                Lutfen once bir masa secin
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — AnimatePresence wrapper with key-based child reset
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProductModal() {
  const { isModalOpen, modalProduct, closeModal } = usePOSModal();

  return (
    <AnimatePresence>
      {isModalOpen && modalProduct && (
        <ModalContent
          key={modalProduct.id}
          product={modalProduct}
          onClose={closeModal}
        />
      )}
    </AnimatePresence>
  );
}
