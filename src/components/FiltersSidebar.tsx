import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Condition, Department, FilterState } from '../types';
import { ALL_BRANDS, COMPATIBLE_DEVICES, DEPARTMENTS } from '../data/products';
import { PrimeBadge, StarRating } from './AmazonMarks';

interface FiltersSidebarProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

const PRICE_RANGES: { label: string; min: number | null; max: number | null }[] = [
  { label: 'Under S$30', min: null, max: 30 },
  { label: 'S$30 to S$60', min: 30, max: 60 },
  { label: 'S$60 to S$120', min: 60, max: 120 },
  { label: 'S$120 to S$200', min: 120, max: 200 },
  { label: 'S$200 & Above', min: 200, max: null },
];

export function FiltersSidebar({
  filters,
  onChange,
  onClearAll,
  activeFilterCount,
}: FiltersSidebarProps) {
  const [minInput, setMinInput] = useState(
    filters.minPrice !== null ? String(filters.minPrice) : ''
  );
  const [maxInput, setMaxInput] = useState(
    filters.maxPrice !== null ? String(filters.maxPrice) : ''
  );

  React.useEffect(() => {
    setMinInput(filters.minPrice !== null ? String(filters.minPrice) : '');
    setMaxInput(filters.maxPrice !== null ? String(filters.maxPrice) : '');
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMin = minInput.trim() === '' ? null : Number(minInput);
    const parsedMax = maxInput.trim() === '' ? null : Number(maxInput);
    onChange((prev) => ({
      ...prev,
      minPrice: Number.isFinite(parsedMin) ? parsedMin : null,
      maxPrice: Number.isFinite(parsedMax) ? parsedMax : null,
    }));
  };

  const toggleBrand = (brand: string) => {
    onChange((prev) => {
      const exists = prev.brands.includes(brand);
      return {
        ...prev,
        brands: exists
          ? prev.brands.filter((b) => b !== brand)
          : [...prev.brands, brand],
      };
    });
  };

  return (
    <aside aria-label="Search refinements" className="text-[13px] text-[#0F1111] space-y-5">
      {activeFilterCount > 0 && (
        <div className="pb-2 border-b border-[#E7E7E7]">
          <button
            type="button"
            onClick={onClearAll}
            className="text-[13px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
          >
            Clear all filters ({activeFilterCount})
          </button>
        </div>
      )}

      {/* Delivery Day */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Delivery Day</h3>
        <label className="flex items-center gap-2 py-0.5 cursor-pointer hover:text-[#C45500]">
          <input
            type="checkbox"
            checked={filters.tomorrowOnly}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, tomorrowOnly: e.target.checked }))
            }
            className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
          />
          <span>Get It by Tomorrow</span>
        </label>
      </div>

      {/* Amazon Prime */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Amazon Prime</h3>
        <label className="flex items-center gap-2 py-0.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.primeOnly}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, primeOnly: e.target.checked }))
            }
            className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
          />
          <PrimeBadge size="md" />
        </label>
      </div>

      {/* Department */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Department</h3>
        {filters.department !== 'All' && (
          <button
            type="button"
            onClick={() =>
              onChange((prev) => ({ ...prev, department: 'All' }))
            }
            className="flex items-center gap-0.5 text-[13px] text-[#0F1111] hover:text-[#C45500] mb-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Any Department</span>
          </button>
        )}
        <ul className="space-y-1">
          {DEPARTMENTS.map((dept) => {
            const isSelected = filters.department === dept;
            return (
              <li key={dept}>
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      department: isSelected ? 'All' : (dept as Department),
                    }))
                  }
                  className={`text-left w-full py-0.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'font-bold text-[#0F1111]'
                      : 'text-[#0F1111] hover:text-[#C45500]'
                  } ${filters.department !== 'All' && !isSelected ? 'pl-3 text-[#565959]' : ''}`}
                >
                  {dept}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Customer Reviews */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Customer Reviews</h3>
        <ul className="space-y-1">
          {[4, 3, 2, 1].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <li key={stars}>
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      minRating: isSelected ? null : stars,
                    }))
                  }
                  className={`flex items-center gap-1.5 py-0.5 cursor-pointer group ${
                    isSelected ? 'font-bold' : ''
                  }`}
                >
                  <StarRating rating={stars} size={15} />
                  <span className="text-[12px] text-[#0F1111] group-hover:text-[#C45500]">
                    &amp; Up
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Brand */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Brand</h3>
        <ul className="space-y-1">
          {ALL_BRANDS.map((brand) => (
            <li key={brand}>
              <label className="flex items-center gap-2 py-0.5 cursor-pointer hover:text-[#C45500]">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
                />
                <span>{brand}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Price</h3>
        <ul className="space-y-1 mb-2.5">
          {PRICE_RANGES.map((range) => {
            const isActive =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <li key={range.label}>
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      minPrice: isActive ? null : range.min,
                      maxPrice: isActive ? null : range.max,
                    }))
                  }
                  className={`text-left py-0.5 cursor-pointer ${
                    isActive
                      ? 'font-bold text-[#0F1111]'
                      : 'text-[#0F1111] hover:text-[#C45500]'
                  }`}
                >
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>

        <form onSubmit={handlePriceSubmit} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-[#565959]">
              S$
            </span>
            <input
              type="number"
              min="0"
              aria-label="Minimum price in SGD"
              placeholder="Min"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className="w-full h-[30px] pl-6 pr-1.5 text-[12px] border border-[#888C8C] rounded-[4px] bg-white focus:outline-none focus:ring-2 focus:ring-[#007185] tabular-nums"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-[#565959]">
              S$
            </span>
            <input
              type="number"
              min="0"
              aria-label="Maximum price in SGD"
              placeholder="Max"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className="w-full h-[30px] pl-6 pr-1.5 text-[12px] border border-[#888C8C] rounded-[4px] bg-white focus:outline-none focus:ring-2 focus:ring-[#007185] tabular-nums"
            />
          </div>
          <button
            type="submit"
            className="h-[30px] px-2.5 rounded-[7px] border border-[#D5D9D9] bg-white hover:bg-[#F7FAFA] text-[12px] font-medium shadow-xs cursor-pointer"
          >
            Go
          </button>
        </form>
      </div>

      {/* Compatible Devices */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Compatible Devices</h3>
        <ul className="space-y-1">
          {COMPATIBLE_DEVICES.map((device) => {
            const isSelected = filters.compatibleDevice === device;
            return (
              <li key={device}>
                <label className="flex items-center gap-2 py-0.5 cursor-pointer hover:text-[#C45500]">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      onChange((prev) => ({
                        ...prev,
                        compatibleDevice: isSelected ? null : device,
                      }))
                    }
                    className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
                  />
                  <span>{device}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Condition</h3>
        <ul className="space-y-1">
          {(['New', 'Renewed'] as Condition[]).map((cond) => {
            const isSelected = filters.condition === cond;
            return (
              <li key={cond}>
                <button
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      condition: isSelected ? null : cond,
                    }))
                  }
                  className={`text-left py-0.5 cursor-pointer ${
                    isSelected
                      ? 'font-bold text-[#0F1111]'
                      : 'text-[#0F1111] hover:text-[#C45500]'
                  }`}
                >
                  {cond}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
