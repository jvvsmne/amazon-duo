import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { PRODUCTS, RELATED_SEARCHES } from './data/products';
import {
  CartItem,
  DeliveryLocation,
  Department,
  FilterState,
  Product,
  SortOption,
} from './types';
import { AmazonHeader } from './components/AmazonHeader';
import { ResultsSummaryBar } from './components/ResultsSummaryBar';
import { FiltersSidebar } from './components/FiltersSidebar';
import { SponsoredBrandBanner } from './components/SponsoredBrandBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, InstantOrder } from './components/CartDrawer';
import {
  AccountOrdersModal,
  AllDepartmentsDrawer,
  LocationModal,
} from './components/HeaderModals';
import { AmazonFooter } from './components/AmazonFooter';

const INITIAL_FILTERS: FilterState = {
  query: 'iphone duo',
  searchDepartment: 'All Departments',
  department: 'All',
  primeOnly: false,
  tomorrowOnly: false,
  minRating: null,
  brands: [],
  minPrice: null,
  maxPrice: null,
  condition: null,
  compatibleDevice: null,
};

const PAGE_SIZE = 12;

export default function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [instantOrder, setInstantOrder] = useState<InstantOrder | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<{
    product: Product;
    variant?: string;
  } | null>(null);

  const [location, setLocation] = useState<DeliveryLocation>({
    country: 'Singapore',
    postalCode: '018989',
    areaLabel: 'Marina Bay',
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [infoModalMode, setInfoModalMode] = useState<'account' | 'orders' | null>(
    null
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    const rawQuery = filters.query.trim().toLowerCase();
    const tokens = rawQuery
      ? rawQuery.split(/\s+/).filter(Boolean)
      : [];

    const results = PRODUCTS.filter((item) => {
      // Search query matching: treat "iphone duo" as full relevance match,
      // otherwise match tokens against title, brand, department, specs, or devices.
      if (tokens.length > 0 && rawQuery !== 'iphone duo') {
        const haystack = [
          item.title,
          item.brand,
          item.department,
          ...item.compatibleDevices,
          ...item.specs,
        ]
          .join(' ')
          .toLowerCase();

        const matchesAllTokens = tokens.every((t) => haystack.includes(t));
        if (!matchesAllTokens) return false;
      }

      // Header department selector
      if (
        filters.searchDepartment === 'Mobiles & Accessories' &&
        !['Cases & Covers', 'Screen Protectors', 'Car Mounts & Stands'].includes(
          item.department
        )
      ) {
        return false;
      }

      if (filters.department !== 'All' && item.department !== filters.department) {
        return false;
      }

      if (filters.primeOnly && !item.isPrime) return false;
      if (filters.tomorrowOnly && !item.isTomorrowDelivery) return false;
      if (filters.minRating !== null && item.rating < filters.minRating) {
        return false;
      }
      if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) {
        return false;
      }
      if (filters.minPrice !== null && item.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && item.price > filters.maxPrice) {
        return false;
      }
      if (filters.condition !== null && item.condition !== filters.condition) {
        return false;
      }
      if (
        filters.compatibleDevice !== null &&
        !item.compatibleDevices.includes(filters.compatibleDevice)
      ) {
        return false;
      }

      return true;
    });

    // Sort
    const sorted = [...results];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'review-desc':
        sorted.sort(
          (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
        );
        break;
      case 'newest':
        sorted.sort((a, b) => b.releaseOrder - a.releaseOrder);
        break;
      case 'featured':
      default:
        break;
    }

    return sorted;
  }, [filters, sortBy]);

  // Pagination
  const totalResults = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(
    startIdx,
    startIdx + PAGE_SIZE
  );

  // Active filter count (excluding query itself)
  const activeFilterCount =
    (filters.department !== 'All' ? 1 : 0) +
    (filters.primeOnly ? 1 : 0) +
    (filters.tomorrowOnly ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    filters.brands.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.condition !== null ? 1 : 0) +
    (filters.compatibleDevice !== null ? 1 : 0);

  const updateFilters = (updater: (prev: FilterState) => FilterState) => {
    setFilters(updater);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters((prev) => ({
      ...INITIAL_FILTERS,
      query: prev.query || 'iphone duo',
    }));
    setCurrentPage(1);
  };

  const handleResetHome = () => {
    setFilters(INITIAL_FILTERS);
    setSortBy('featured');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string, searchDepartment: string) => {
    setFilters((prev) => ({
      ...prev,
      query,
      searchDepartment,
    }));
    setCurrentPage(1);
  };

  const handleQuickNavDepartment = (deptKey: string) => {
    if (deptKey === 'prime') {
      updateFilters((prev) => ({ ...prev, primeOnly: true, department: 'All' }));
    } else if (deptKey === 'deals') {
      updateFilters((prev) => ({
        ...prev,
        department: 'All',
        query: 'iphone duo',
      }));
      setSortBy('price-asc');
    } else if (deptKey === 'bestsellers') {
      updateFilters((prev) => ({ ...prev, department: 'All' }));
      setSortBy('review-desc');
    } else {
      updateFilters((prev) => ({
        ...prev,
        department: deptKey as Department,
      }));
    }
  };

  // Cart handlers
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (
    product: Product,
    selectedVariant?: string,
    qty = 1
  ) => {
    const resolvedVariant =
      selectedVariant || product.variants?.[0]?.name || undefined;
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (c) =>
          c.product.id === product.id && c.selectedVariant === resolvedVariant
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qty,
        };
        return updated;
      }
      return [...prev, { product, selectedVariant: resolvedVariant, quantity: qty }];
    });
  };

  const handleBuyNow = (
    product: Product,
    selectedVariant?: string,
    qty = 1
  ) => {
    const resolvedVariant =
      selectedVariant || product.variants?.[0]?.name || undefined;
    const orderNum = `SG-408-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setInstantOrder({
      orderNumber: orderNum,
      product,
      selectedVariant: resolvedVariant,
      quantity: qty,
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (
    productId: string,
    variant: string | undefined,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedVariant === variant
          ) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (
    productId: string,
    variant: string | undefined
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedVariant === variant)
      )
    );
  };

  // Sponsored brand showcase products (Belkin + Anker)
  const sponsoredShowcase = useMemo(
    () =>
      PRODUCTS.filter((p) => ['prod-2', 'prod-3', 'prod-9'].includes(p.id)),
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F1111]">
      {/* Header */}
      <AmazonHeader
        searchQuery={filters.query}
        searchDepartment={filters.searchDepartment}
        onSearchSubmit={handleSearchSubmit}
        onResetHome={handleResetHome}
        onQuickNavDepartment={handleQuickNavDepartment}
        cartCount={totalCartCount}
        onOpenCart={() => {
          setInstantOrder(null);
          setIsCartOpen(true);
        }}
        location={location}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAllMenu={() => setIsAllMenuOpen(true)}
        onOpenAccountModal={() => setInfoModalMode('account')}
        onOpenOrdersModal={() => setInfoModalMode('orders')}
      />

      {/* Results Info & Sort Bar */}
      <ResultsSummaryBar
        totalResults={totalResults}
        startIndex={totalResults > 0 ? startIdx + 1 : 0}
        endIndex={Math.min(startIdx + PAGE_SIZE, totalResults)}
        query={filters.query}
        sortBy={sortBy}
        onSortChange={(s) => {
          setSortBy(s);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilterCount={activeFilterCount}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        onClearAllFilters={clearAllFilters}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-3 md:px-5 py-4">
        <div className="flex items-start gap-6">
          {/* Desktop Left Refinements Sidebar */}
          <div className="hidden lg:block w-[240px] shrink-0">
            <FiltersSidebar
              filters={filters}
              onChange={updateFilters}
              onClearAll={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Right Main Search Results Column */}
          <div className="flex-1 min-w-0">
            {/* Sponsored Brand Banner (shown on page 1 when unfiltered or default query) */}
            {safePage === 1 && activeFilterCount === 0 && (
              <SponsoredBrandBanner
                featuredProducts={sponsoredShowcase}
                onSelectProduct={(p) => setSelectedProduct({ product: p })}
                onFilterBrand={(brand) =>
                  updateFilters((prev) => ({
                    ...prev,
                    brands: [brand],
                  }))
                }
              />
            )}

            {/* Results Section Heading */}
            <div className="mb-3">
              <h1 className="text-[20px] font-bold text-[#0F1111] leading-tight">
                Results
              </h1>
              <p className="text-[13px] text-[#565959]">
                Check each product page for other buying options. Price and other details may vary based on product size and colour.
              </p>
            </div>

            {/* Product Results Grid / List or Empty State */}
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5'
                    : 'flex flex-col gap-3.5'
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onSelect={(p, variant) =>
                      setSelectedProduct({ product: p, variant })
                    }
                    onAddToCart={(p, variant) => handleAddToCart(p, variant, 1)}
                    onBuyNow={(p, variant) => handleBuyNow(p, variant, 1)}
                    onOpenCart={() => {
                      setInstantOrder(null);
                      setIsCartOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-[#E7E7E7] rounded-[6px] p-10 text-center space-y-3 bg-[#F7F8FA]">
                <Search className="w-10 h-10 text-[#565959] mx-auto stroke-[1.5]" />
                <h2 className="text-[18px] font-bold text-[#0F1111]">
                  No results match your current filters
                </h2>
                <p className="text-[13px] text-[#565959] max-w-md mx-auto">
                  Try clearing some filters or searching for &ldquo;iphone duo&rdquo;, &ldquo;magsafe&rdquo;, or &ldquo;belkin&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={handleResetHome}
                  className="px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-[13px] font-medium cursor-pointer"
                >
                  Reset search &amp; filters
                </button>
              </div>
            )}

            {/* Related Searches */}
            <section
              aria-label="Related searches"
              className="mt-8 pt-6 border-t border-[#E7E7E7]"
            >
              <h2 className="text-[16px] font-bold text-[#0F1111] mb-3">
                Related searches
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {RELATED_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      handleSearchSubmit(term, 'All Departments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 border border-[#D5D9D9] rounded-[4px] bg-white hover:bg-[#F7FAFA] text-left text-[13px] text-[#0F1111] cursor-pointer transition-colors"
                  >
                    <Search className="w-4 h-4 text-[#565959] shrink-0" />
                    <span className="truncate font-medium">{term}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Pagination Bar */}
            {totalResults > 0 && (
              <nav
                aria-label="Search results pagination"
                className="mt-8 flex justify-center"
              >
                <div className="inline-flex items-center border border-[#D5D9D9] rounded-[8px] overflow-hidden bg-white shadow-[0_1px_2px_rgba(15,17,17,0.06)] text-[14px] tabular-nums">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3.5 py-2.5 inline-flex items-center gap-1 border-r border-[#E7E7E7] ${
                      safePage === 1
                        ? 'text-[#A7ACB2] cursor-not-allowed'
                        : 'text-[#0F1111] hover:bg-[#F7FAFA] cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        aria-current={pageNum === safePage ? 'page' : undefined}
                        className={`px-4 py-2.5 border-r border-[#E7E7E7] cursor-pointer ${
                          pageNum === safePage
                            ? 'font-bold text-[#0F1111] border-b-2 border-b-[#0F1111] bg-[#FAFAFA]'
                            : 'text-[#0F1111] hover:bg-[#F7FAFA]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3.5 py-2.5 inline-flex items-center gap-1 ${
                      safePage === totalPages
                        ? 'text-[#A7ACB2] cursor-not-allowed'
                        : 'text-[#0F1111] hover:bg-[#F7FAFA] cursor-pointer'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <AmazonFooter
        onQuickSearch={(q) => {
          handleSearchSubmit(q, 'All Departments');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-black/55"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <div
            className="w-full max-w-[300px] bg-white h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-[#E7E7E7] flex items-center justify-between bg-[#F7F8FA]">
              <h2 className="text-[16px] font-bold text-[#0F1111]">Filters</h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 cursor-pointer"
              >
                <X className="w-5 h-5 text-[#0F1111]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto thin-scroll p-4">
              <FiltersSidebar
                filters={filters}
                onChange={updateFilters}
                onClearAll={clearAllFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
            <div className="p-3 border-t border-[#E7E7E7] bg-white">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[13px] font-medium text-[#0F1111] cursor-pointer"
              >
                Show {totalResults} results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct?.product || null}
        initialVariant={selectedProduct?.variant}
        location={location}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onFilterByBrand={(brand) =>
          updateFilters((prev) => ({
            ...prev,
            brands: [brand],
          }))
        }
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        instantOrder={instantOrder}
        location={location}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        onClearInstantOrder={() => setInstantOrder(null)}
      />

      {/* Header Modals & Drawers */}
      <LocationModal
        isOpen={isLocationModalOpen}
        location={location}
        onSave={setLocation}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <AllDepartmentsDrawer
        isOpen={isAllMenuOpen}
        onClose={() => setIsAllMenuOpen(false)}
        onSelectDepartment={(dept) =>
          updateFilters((prev) => ({
            ...prev,
            department: dept as Department,
          }))
        }
        onSelectQuery={(query) => handleSearchSubmit(query, 'All Departments')}
      />

      <AccountOrdersModal
        mode={infoModalMode}
        onClose={() => setInfoModalMode(null)}
      />
    </div>
  );
}
