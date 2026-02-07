'use client';

import { useMemo } from 'react';
import {
  usePOSNavigation,
  usePOSModal,
  usePOSTable,
} from '@/contexts/POSContext';
import {
  categories,
  products,
  getProductsByCategory,
  formatCurrency,
} from '@/data/posData';
import { Search, X, Plus, Command, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// URUNLER - Refined Utility Theme + Dark Mode
// ═══════════════════════════════════════════════════════════════════════════════

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' as const },
  },
};

interface ProductsSectionProps {
  className?: string;
}

export function ProductsSection({ className = '' }: ProductsSectionProps) {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } =
    usePOSNavigation();
  const { openProductModal } = usePOSModal();
  const { selectedTable } = usePOSTable();

  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === 'all'
        ? products.filter((p) => p.isAvailable)
        : getProductsByCategory(activeCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  const handleProductClick = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.isAvailable) {
      openProductModal(product);
    }
  };

  return (
    <div
      className={`shadow-soft flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900 ${className}`}
    >
      {/* HEADER */}
      <div className="border-b border-stone-100 px-4 py-4 dark:border-stone-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Menu
          </h2>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600 tabular-nums dark:bg-stone-800 dark:text-stone-400">
            {filteredProducts.length} urun
          </span>
        </div>

        {/* Search - Command Palette Style */}
        <div className="relative mb-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search size={16} className="text-stone-400 dark:text-stone-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Urun ara..."
            className="focus:border-primary-500 focus:ring-primary-500/10 w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pr-20 pl-10 text-sm text-stone-800 placeholder-stone-400 shadow-xs transition-all duration-200 focus:bg-white focus:ring-2 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:placeholder-stone-500 dark:focus:bg-stone-800"
          />
          {!searchQuery && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="hidden items-center gap-0.5 rounded border border-stone-300/50 bg-stone-200/60 px-1.5 py-0.5 font-mono text-[10px] text-stone-500 sm:flex dark:border-stone-600/50 dark:bg-stone-700/60 dark:text-stone-400">
                <Command size={10} />K
              </kbd>
            </div>
          )}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 transition-colors hover:text-stone-600 dark:hover:text-stone-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="scrollbar-hide -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {categories.map((category) => {
            const isActive = category.id === activeCategory;
            const productCount =
              category.id === 'all'
                ? products.filter((p) => p.isAvailable).length
                : getProductsByCategory(category.id).length;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`btn-active-scale flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm dark:bg-white dark:text-stone-900'
                    : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-700'
                } `}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${isActive ? 'bg-white/15 text-white/80 dark:bg-stone-900/15 dark:text-stone-900/80' : 'bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400'}`}
                >
                  {productCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="custom-scroll flex-1 overflow-y-auto bg-stone-50/50 p-3 dark:bg-stone-800/30">
        {!selectedTable ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800"
            >
              <UtensilsCrossed
                size={28}
                className="text-stone-300 dark:text-stone-600"
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="mb-1 text-sm font-semibold text-stone-700 dark:text-stone-300">
              Masa Secilmedi
            </h3>
            <p className="max-w-[200px] text-xs text-stone-400 dark:text-stone-500">
              Siparis eklemek icin sol taraftan bir masa secin.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
              <Search
                size={24}
                className="text-stone-300 dark:text-stone-600"
              />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-stone-700 dark:text-stone-300">
              Urun Bulunamadi
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-500">
              &ldquo;{searchQuery}&rdquo; icin sonuc yok
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 mt-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-2.5 lg:grid-cols-3"
            key={`${activeCategory}-${searchQuery}`}
            initial="hidden"
            animate="visible"
            variants={gridVariants}
          >
            {filteredProducts.map((product) => {
              const isOutOfStock = !product.isAvailable;

              return (
                <motion.button
                  key={product.id}
                  variants={cardVariants}
                  onClick={() => handleProductClick(product.id)}
                  disabled={isOutOfStock}
                  className={`group touch-target btn-active-scale relative flex flex-col rounded-xl border bg-white p-3 text-left transition-all duration-200 dark:bg-stone-800 ${
                    isOutOfStock
                      ? 'cursor-not-allowed border-stone-100 opacity-50 dark:border-stone-700'
                      : 'hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-medium border-stone-200 dark:border-stone-700'
                  } `}
                >
                  {/* Out of Stock */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-stone-900/80">
                      <span className="bg-danger-light dark:bg-danger/20 text-danger-dark dark:text-danger rounded-md px-2.5 py-1 text-[10px] font-semibold">
                        Stokta Yok
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="mb-2.5 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-stone-50 dark:bg-stone-700/50">
                    <span className="text-3xl">{product.image || '🍽️'}</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="mb-0.5 line-clamp-2 text-xs leading-tight font-semibold text-stone-900 dark:text-stone-100">
                    {product.name}
                  </h3>

                  {/* Description */}
                  {product.description && (
                    <p className="mb-2 line-clamp-1 text-[10px] text-stone-400 dark:text-stone-500">
                      {product.description}
                    </p>
                  )}

                  {/* Price + Add */}
                  <div className="mt-auto flex items-center justify-between pt-1.5">
                    <span className="text-primary-600 dark:text-primary-400 font-mono text-sm font-bold tabular-nums">
                      {formatCurrency(product.basePrice)}
                    </span>
                    {!isOutOfStock && (
                      <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/60 flex h-7 w-7 items-center justify-center rounded-lg transition-colors">
                        <Plus size={14} />
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-stone-100 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <span>
            {selectedTable
              ? `${selectedTable.name} icin siparis ekleniyor`
              : 'Masa secilmedi'}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Menu guncel
          </span>
        </div>
      </div>
    </div>
  );
}
