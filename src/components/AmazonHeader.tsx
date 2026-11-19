import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  X,
} from 'lucide-react';
import { AmazonSgLogo } from './AmazonMarks';
import { DeliveryLocation } from '../types';

interface AmazonHeaderProps {
  searchQuery: string;
  searchDepartment: string;
  onSearchSubmit: (query: string, department: string) => void;
  onResetHome: () => void;
  onQuickNavDepartment: (dept: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  location: DeliveryLocation;
  onOpenLocationModal: () => void;
  onOpenAllMenu: () => void;
  onOpenAccountModal: () => void;
  onOpenOrdersModal: () => void;
}

const SEARCH_DEPARTMENTS = [
  'All Departments',
  'Electronics',
  'Mobiles & Accessories',
  'Computers',
  'Amazon Fresh',
  'Deals',
];

const SUB_NAV_ITEMS = [
  { label: 'Fresh', dept: 'All' },
  { label: 'Prime', dept: 'prime' },
  { label: "Today's Deals", dept: 'deals' },
  { label: 'Electronics', dept: 'Wireless Chargers' },
  { label: 'Mobiles', dept: 'Cases & Covers' },
  { label: 'Power & Cables', dept: 'USB Cables & Adapters' },
  { label: 'Power Banks', dept: 'Power Banks' },
  { label: 'Best Sellers', dept: 'bestsellers' },
];

export function AmazonHeader({
  searchQuery,
  searchDepartment,
  onSearchSubmit,
  onResetHome,
  onQuickNavDepartment,
  cartCount,
  onOpenCart,
  location,
  onOpenLocationModal,
  onOpenAllMenu,
  onOpenAccountModal,
  onOpenOrdersModal,
}: AmazonHeaderProps) {
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const [draftDept, setDraftDept] = useState(searchDepartment);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Sync external updates (e.g., clicking a related search)
  React.useEffect(() => {
    setDraftQuery(searchQuery);
  }, [searchQuery]);

  React.useEffect(() => {
    setDraftDept(searchDepartment);
  }, [searchDepartment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(draftQuery, draftDept);
  };

  return (
    <header className="w-full select-none">
      {/* Primary Top Bar (#131921) */}
      <div className="bg-[#131921] text-white px-3 md:px-4 h-[60px] flex items-center gap-2 md:gap-3">
        {/* Logo */}
        <button
          type="button"
          onClick={onResetHome}
          aria-label="Amazon.sg Home"
          className="px-2 py-1.5 rounded-xs border border-transparent hover:border-white transition-colors shrink-0 cursor-pointer"
        >
          <AmazonSgLogo />
        </button>

        {/* Deliver to Singapore */}
        <button
          type="button"
          onClick={onOpenLocationModal}
          className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xs border border-transparent hover:border-white transition-colors shrink-0 text-left cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-white mt-2 shrink-0" />
          <div className="leading-tight">
            <div className="text-[11px] text-[#CCCCCC] whitespace-nowrap">
              Deliver to
            </div>
            <div className="text-[13px] font-bold text-white whitespace-nowrap">
              {location.country} {location.postalCode}
            </div>
          </div>
        </button>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className={`flex-1 flex items-center h-[40px] rounded-[4px] overflow-hidden bg-white transition-shadow ${
            isSearchFocused ? 'ring-3 ring-[#FF9900]' : ''
          }`}
        >
          {/* Department Dropdown */}
          <div className="relative h-full hidden sm:flex items-center bg-[#E6E6E6] hover:bg-[#D4D4D4] border-r border-[#CDCDCD] text-[#555555] transition-colors">
            <select
              aria-label="Search in department"
              value={draftDept}
              onChange={(e) => {
                setDraftDept(e.target.value);
                onSearchSubmit(draftQuery, e.target.value);
              }}
              className="h-full pl-2.5 pr-6 text-[12px] font-medium bg-transparent text-[#0F1111] appearance-none cursor-pointer focus:outline-none max-w-[140px] truncate"
            >
              {SEARCH_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#555555] pointer-events-none absolute right-1.5" />
          </div>

          {/* Search Input */}
          <div className="relative flex-1 h-full flex items-center">
            <input
              type="text"
              aria-label="Search Amazon.sg"
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search Amazon.sg"
              className="w-full h-full px-3 pr-8 text-[14px] text-[#0F1111] bg-white focus:outline-none"
            />
            {draftQuery && (
              <button
                type="button"
                aria-label="Clear search query"
                onClick={() => {
                  setDraftQuery('');
                  onSearchSubmit('', draftDept);
                }}
                className="absolute right-2 p-1 text-[#565959] hover:text-[#0F1111] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Submit Button */}
          <button
            type="submit"
            aria-label="Go"
            className="h-full w-[45px] bg-[#FEBD69] hover:bg-[#F3A847] text-[#131921] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>
        </form>

        {/* Language / SG Flag */}
        <button
          type="button"
          onClick={onOpenLocationModal}
          className="hidden lg:flex items-center gap-1 px-2 py-2 rounded-xs border border-transparent hover:border-white transition-colors shrink-0 cursor-pointer"
          aria-label="Country and language settings"
        >
          <span
            className="inline-flex items-center justify-center w-5 h-3.5 rounded-[2px] overflow-hidden border border-white/25 text-[9px] font-bold"
            aria-hidden="true"
          >
            <span className="w-full h-full flex flex-col">
              <span className="h-1/2 bg-[#EF3340]" />
              <span className="h-1/2 bg-white" />
            </span>
          </span>
          <span className="text-[13px] font-bold">EN</span>
          <ChevronDown className="w-3 h-3 text-[#A7ACB2]" />
        </button>

        {/* Account & Lists */}
        <button
          type="button"
          onClick={onOpenAccountModal}
          className="hidden sm:flex flex-col justify-center px-2 py-1 rounded-xs border border-transparent hover:border-white transition-colors shrink-0 text-left cursor-pointer"
        >
          <span className="text-[11px] text-[#CCCCCC] leading-tight whitespace-nowrap">
            Hello, sign in
          </span>
          <span className="text-[13px] font-bold text-white leading-tight flex items-center gap-0.5 whitespace-nowrap">
            Account &amp; Lists
            <ChevronDown className="w-3 h-3 text-[#A7ACB2]" />
          </span>
        </button>

        {/* Returns & Orders */}
        <button
          type="button"
          onClick={onOpenOrdersModal}
          className="hidden lg:flex flex-col justify-center px-2 py-1 rounded-xs border border-transparent hover:border-white transition-colors shrink-0 text-left cursor-pointer"
        >
          <span className="text-[11px] text-[#CCCCCC] leading-tight whitespace-nowrap">
            Returns
          </span>
          <span className="text-[13px] font-bold text-white leading-tight whitespace-nowrap">
            &amp; Orders
          </span>
        </button>

        {/* Cart Button */}
        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Cart with ${cartCount} items`}
          className="flex items-end gap-1 px-2 py-1.5 rounded-xs border border-transparent hover:border-white transition-colors shrink-0 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7 text-white stroke-[1.8]" />
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#131921] text-[#F08804] text-[14px] font-extrabold leading-none flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          </div>
          <span className="hidden sm:inline text-[13px] font-bold text-white pb-0.5">
            Cart
          </span>
        </button>
      </div>

      {/* Secondary Sub-Nav (#232F3E) */}
      <nav
        aria-label="Main categories"
        className="bg-[#232F3E] text-white px-3 md:px-4 h-[39px] flex items-center gap-1 overflow-x-auto thin-scroll"
      >
        <button
          type="button"
          onClick={onOpenAllMenu}
          className="flex items-center gap-1 px-2 py-1.5 rounded-xs border border-transparent hover:border-white text-[13px] font-bold whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>All</span>
        </button>

        {SUB_NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onQuickNavDepartment(item.dept)}
            className="px-2.5 py-1.5 rounded-xs border border-transparent hover:border-white text-[13px] font-medium text-white whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}

        {/* Mobile location trigger */}
        <button
          type="button"
          onClick={onOpenLocationModal}
          className="md:hidden ml-auto flex items-center gap-1 px-2 py-1 text-[12px] text-[#CCCCCC] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>SG {location.postalCode}</span>
        </button>
      </nav>
    </header>
  );
}
