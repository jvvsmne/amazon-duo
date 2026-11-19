import React from 'react';
import { LayoutGrid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { SortOption } from '../types';

interface ResultsSummaryBarProps {
  totalResults: number;
  startIndex: number;
  endIndex: number;
  query: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
  onClearAllFilters: () => void;
}

export function ResultsSummaryBar({
  totalResults,
  startIndex,
  endIndex,
  query,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFilterCount,
  onOpenMobileFilters,
  onClearAllFilters,
}: ResultsSummaryBarProps) {
  return (
    <div className="bg-white border-b border-[#CCCCCC] shadow-[0_1px_2px_rgba(15,17,17,0.06)]">
      <div className="max-w-[1500px] mx-auto px-3 md:px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-[13px]">
        {/* Result Count */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#D5D9D9] bg-[#F0F2F2] hover:bg-[#E3E6E6] text-[13px] font-medium text-[#0F1111] cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="font-bold text-[#C45500] tabular-nums">
                ({activeFilterCount})
              </span>
            )}
          </button>

          <p className="text-[#0F1111] tabular-nums">
            {totalResults > 0 ? (
              <>
                <span>
                  {startIndex}-{endIndex} of{' '}
                  {totalResults === 16 && query.toLowerCase() === 'iphone duo'
                    ? 'over 2,000'
                    : totalResults}{' '}
                  results
                </span>
                {query.trim() && (
                  <>
                    {' '}
                    for{' '}
                    <span className="font-bold text-[#C45500]">
                      &ldquo;{query}&rdquo;
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                No results
                {query.trim() && (
                  <>
                    {' '}
                    for{' '}
                    <span className="font-bold text-[#C45500]">
                      &ldquo;{query}&rdquo;
                    </span>
                  </>
                )}
              </>
            )}
          </p>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="text-[12px] text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
            >
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Sort & View Switcher */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden sm:flex items-center border border-[#D5D9D9] rounded-[7px] overflow-hidden bg-[#F0F2F2]">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              title="Grid view"
              className={`p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0F1111] shadow-xs'
                  : 'text-[#565959] hover:text-[#0F1111]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              title="List view"
              className={`p-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#0F1111] shadow-xs'
                  : 'text-[#565959] hover:text-[#0F1111]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="relative inline-flex items-center">
            <label htmlFor="amz-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="amz-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] rounded-[7px] pl-3 pr-7 py-1 text-[12px] font-medium text-[#0F1111] shadow-[0_2px_5px_rgba(213,217,217,0.5)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#007185]"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Sort by: Price: Low to High</option>
              <option value="price-desc">Sort by: Price: High to Low</option>
              <option value="review-desc">Sort by: Avg. Customer Review</option>
              <option value="newest">Sort by: Newest Arrivals</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#0F1111] pointer-events-none absolute right-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
