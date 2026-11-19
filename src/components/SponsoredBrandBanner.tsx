import React from 'react';
import { Product } from '../types';
import { StarRating } from './AmazonMarks';

interface SponsoredBrandBannerProps {
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterBrand: (brand: string) => void;
}

export function SponsoredBrandBanner({
  featuredProducts,
  onSelectProduct,
  onFilterBrand,
}: SponsoredBrandBannerProps) {
  if (featuredProducts.length === 0) return null;

  return (
    <section
      aria-label="Sponsored brand showcase"
      className="border border-[#E7E7E7] rounded-[4px] bg-white overflow-hidden mb-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        {/* Left Brand Info */}
        <div className="md:col-span-4 bg-[#F7F8FA] p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E7E7E7]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] text-[#565959]">Sponsored</span>
              <span className="text-[11px] font-semibold text-[#007185]">
                Official Store
              </span>
            </div>
            <div className="text-[18px] font-bold text-[#0F1111] tracking-tight mb-1">
              Belkin &amp; Anker Qi2 Duo
            </div>
            <p className="text-[13px] text-[#565959] leading-snug">
              Certified 15W MagSafe-compatible dual chargers &amp; stands for iPhone 16 and AirPods.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => onFilterBrand('Belkin')}
              className="text-[13px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
            >
              Shop Belkin Qi2 collection &rsaquo;
            </button>
          </div>
        </div>

        {/* Right 3 Mini Cards */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E7E7]">
          {featuredProducts.slice(0, 3).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectProduct(item)}
              className="p-3.5 text-left hover:bg-[#FAFAFA] transition-colors flex sm:flex-col items-center sm:items-stretch gap-3 cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-full sm:h-28 bg-[#F7F7F7] rounded-[3px] p-2 flex items-center justify-center shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <p className="text-[13px] text-[#0F1111] group-hover:text-[#C7511F] line-clamp-2 leading-snug mb-1.5">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={item.rating} size={13} />
                  <span className="text-[12px] text-[#007185] tabular-nums">
                    {item.reviewCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
