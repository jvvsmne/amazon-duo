import React, { useState } from 'react';
import { X, MapPin, ShieldCheck, Check } from 'lucide-react';
import { DeliveryLocation, Product } from '../types';
import { PrimeBadge, StarRating } from './AmazonMarks';

interface ProductDetailModalProps {
  product: Product | null;
  initialVariant?: string;
  location: DeliveryLocation;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: string, qty?: number) => void;
  onBuyNow: (product: Product, variant?: string, qty?: number) => void;
  onFilterByBrand: (brand: string) => void;
}

export function ProductDetailModal({
  product,
  initialVariant,
  location,
  onClose,
  onAddToCart,
  onBuyNow,
  onFilterByBrand,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    initialVariant
  );
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedVariant(initialVariant || product.variants?.[0]?.name);
      setQty(1);
      setAddedFeedback(false);
    }
  }, [product, initialVariant]);

  if (!product) return null;

  const discountPct =
    product.typicalPrice && product.typicalPrice > product.price
      ? Math.round(
          ((product.typicalPrice - product.price) / product.typicalPrice) * 100
        )
      : null;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, qty);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] max-w-[960px] w-full shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Strip */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E7E7E7] bg-[#F7F8FA]">
          <span className="text-[12px] text-[#565959] truncate">
            {product.department} &rsaquo; {product.brand} &rsaquo; ASIN:{' '}
            <span className="font-mono">{product.asin}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 rounded-full hover:bg-[#E7E7E7] text-[#0F1111] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-6 max-h-[82vh] overflow-y-auto thin-scroll">
          {/* Left: Product Image */}
          <div className="md:col-span-5 bg-[#F7F7F7] rounded-[6px] p-6 flex items-center justify-center min-h-[280px]">
            <img
              src={product.image}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="max-h-[320px] w-full object-contain mix-blend-multiply"
            />
          </div>

          {/* Center: Product Details */}
          <div className="md:col-span-4 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => {
                  onFilterByBrand(product.brand);
                  onClose();
                }}
                className="text-[13px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
              >
                Visit the {product.brand} Store
              </button>
              <h2
                id="pdp-modal-title"
                className="text-[18px] font-semibold text-[#0F1111] leading-snug mt-0.5"
              >
                {product.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 pb-2 border-b border-[#E7E7E7]">
              <span className="text-[13px] font-medium text-[#0F1111] tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <StarRating rating={product.rating} size={16} />
              <span className="text-[13px] text-[#007185] tabular-nums">
                {product.reviewCount.toLocaleString()} ratings
              </span>
            </div>

            {/* Price Block */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                {discountPct && (
                  <span className="text-[20px] font-light text-[#CC0C39] tabular-nums">
                    -{discountPct}%
                  </span>
                )}
                <div className="inline-flex items-start text-[#0F1111] tabular-nums">
                  <span className="text-[13px] font-medium mt-1">S$</span>
                  <span className="text-[28px] font-semibold leading-none">
                    {Math.floor(product.price)}
                  </span>
                  <span className="text-[13px] font-medium mt-1">
                    {(product.price % 1).toFixed(2).substring(2)}
                  </span>
                </div>
              </div>
              {product.typicalPrice && (
                <p className="text-[12px] text-[#565959] tabular-nums">
                  List Price:{' '}
                  <span className="line-through">
                    S${product.typicalPrice.toFixed(2)}
                  </span>
                </p>
              )}
              {product.isPrime && (
                <div className="pt-0.5">
                  <PrimeBadge size="md" />
                </div>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-2 border-t border-[#E7E7E7]">
                <div className="text-[13px] mb-2">
                  <span className="text-[#565959]">Colour: </span>
                  <span className="font-bold text-[#0F1111]">
                    {selectedVariant}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const active = selectedVariant === v.name;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setSelectedVariant(v.name)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] border text-[12px] cursor-pointer transition-colors ${
                          active
                            ? 'border-[#E77600] bg-[#FEF8F2] font-semibold text-[#0F1111]'
                            : 'border-[#D5D9D9] bg-white hover:bg-[#F7FAFA] text-[#0F1111]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15"
                          style={{ backgroundColor: v.hex }}
                        />
                        <span>{v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* About this item */}
            <div className="pt-2 border-t border-[#E7E7E7]">
              <h3 className="text-[14px] font-bold text-[#0F1111] mb-1.5">
                About this item
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 text-[13px] text-[#0F1111] leading-relaxed">
                {product.specs.map((spec, idx) => (
                  <li key={idx}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Purchase Box */}
          <div className="md:col-span-3">
            <div className="border border-[#D5D9D9] rounded-[8px] p-4 space-y-3 bg-white">
              <div className="text-[20px] font-semibold text-[#0F1111] tabular-nums">
                S${product.price.toFixed(2)}
              </div>

              <div className="text-[13px] text-[#0F1111] leading-snug">
                {product.deliveryText}
              </div>

              <div className="flex items-start gap-1.5 text-[12px] text-[#007185]">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#0F1111]" />
                <span>
                  Deliver to {location.country} {location.postalCode}
                </span>
              </div>

              <div className="text-[16px] font-medium text-[#007600]">
                In Stock
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="pdp-qty"
                  className="text-[13px] text-[#0F1111]"
                >
                  Qty:
                </label>
                <select
                  id="pdp-qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border border-[#D5D9D9] rounded-[6px] bg-[#F0F2F2] px-2.5 py-1 text-[13px] text-[#0F1111] cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`w-full py-2 px-4 rounded-full text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                    addedFeedback
                      ? 'bg-[#067D62] text-white'
                      : 'bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border border-[#FCD200]'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedVariant, qty)}
                  className="w-full py-2 px-4 rounded-full bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] border border-[#FF8F00] text-[13px] font-medium cursor-pointer transition-colors"
                >
                  Buy Now
                </button>
              </div>

              <div className="pt-2 border-t border-[#E7E7E7] text-[12px] text-[#565959] space-y-1">
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <span className="text-[#0F1111]">Amazon SG</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="text-[#0F1111]">{product.brand} Official</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-[#007185]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>15-day hassle-free returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
