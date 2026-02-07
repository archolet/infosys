'use client';

import { POSProvider } from '@/contexts/POSContext';
import { Sidebar } from '@/components/pos/Sidebar';
import { TablesSection } from '@/components/pos/TablesSection';
import { ProductsSection } from '@/components/pos/ProductsSection';
import { CartSection } from '@/components/pos/CartSection';
import ProductModal from '@/components/pos/ProductModal';

// ═══════════════════════════════════════════════════════════════════════════════
// POS DASHBOARD - Refined Utility Theme
// ═══════════════════════════════════════════════════════════════════════════════
// Layout: Sidebar (72px) | Tables (23%) | Products (flex-1) | Cart (28%)
// Touch-optimized for tablet POS systems
// Design: Stone/zinc neutrals, indigo primary, clean surfaces
// ═══════════════════════════════════════════════════════════════════════════════

export default function POSPage() {
  return (
    <POSProvider>
      <div className="bg-grain min-h-screen bg-stone-100 dark:bg-stone-950">
        {/* Vertical Navigation Rail */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="ml-[72px] min-h-screen p-3">
          <div className="flex h-[calc(100vh-1.5rem)] gap-3">
            {/* MASALAR - Tables Section */}
            <TablesSection className="w-[23%] min-w-[300px]" />

            {/* URUNLER - Products Section */}
            <ProductsSection className="min-w-[420px] flex-1" />

            {/* HESAP - Cart/Bill Section */}
            <CartSection className="w-[28%] min-w-[340px]" />
          </div>
        </main>

        {/* Product Configuration Modal */}
        <ProductModal />
      </div>
    </POSProvider>
  );
}
