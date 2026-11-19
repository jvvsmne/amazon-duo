import React, { useState } from 'react';
import { Check, Smartphone, Zap } from 'lucide-react';
import { Product } from '../types';
import { PrimeBadge, StarRating } from './AmazonMarks';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onSelect: (product: Product, selectedVariant?: string) => void;
  onAddToCart: (product: Product, selectedVariant?: string) => void;
  onBuyNow: (product: Product, selectedVariant?: string) => void;
  onOpenCart: () => void;
}

export function ProductCard({
  product,
  viewMode,
  onSelect,
  onAddToCart,
  onBuyNow,
  onOpenCart,
}: ProductCardProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const activeVariant = product.variants?.[selectedVariantIdx]?.name;

  const wholePrice = Math.floor(product.price);
  const cents = (product.price % 1).toFixed(2).substring(2);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeVariant);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const renderBadge = () => {
    if (!product.badge) return null;
    if (product.badge === 'Best Seller') {
      return (
        <span className="inline-block bg-[#C45500] text-white text-[11px] font-semibold px-2 py-0.5 rounded-r-xs">
          Best Seller
        </span>
      );
    }
    if (product.badge === "Amazon's Choice") {
      return (
        <span className="inline-block bg-[#232F3E] text-white text-[11px] font-semibold px-2 py-0.5 rounded-r-xs">
          Amazon&apos;s <span className="text-[#FF9900]">Choice</span>
        </span>
      );
    }
    return (
      <span className="inline-block bg-[#CC0C39] text-white text-[11px] font-semibold px-2 py-0.5 rounded-r-xs">
        Limited time deal
      </span>
    );
  };

  const renderImage = () => (
    <div
      onClick={() => onSelect(product, activeVariant)}
      className={`relative bg-[#F7F7F7] flex items-center justify-center overflow-hidden cursor-pointer group ${
        viewMode === 'grid'
          ? 'aspect-square w-full p-4'
          : 'w-full sm:w-[220px] h-[220px] shrink-0 p-4'
      }`}
    >
      {product.badge && (
        <div className="absolute top-2 left-0 z-10">{renderBadge()}</div>
      )}

      {!imgError ? (
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-200"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-[#565959] gap-2 p-4 text-center">
          <Smartphone className="w-10 h-10 stroke-[1.5]" />
          <span className="text-[12px] font-medium line-clamp-2">
            {product.brand}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <article
      className={`bg-white border border-[#E7E7E7] rounded-[4px] overflow-hidden flex transition-shadow hover:shadow-[0_2px_8px_rgba(15,17,17,0.08)] ${
        viewMode === 'grid' ? 'flex-col' : 'flex-col sm:flex-row'
      }`}
    >
      {renderImage()}

      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
        <div className="space-y-1.5">
          {product.isSponsored && (
            <div className="text-[11px] text-[#565959] leading-none">
              Sponsored
            </div>
          )}

          {/* Color Swatches */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {product.variants.map((variant, idx) => (
                <button
                  key={variant.name}
                  type="button"
                  title={variant.name}
                  aria-label={`Select colour ${variant.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantIdx(idx);
                  }}
                  className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                    idx === selectedVariantIdx
                      ? 'ring-2 ring-[#007185] ring-offset-1 border-[#0F1111]'
                      : 'border-[#CCCCCC] hover:scale-110'
                  }`}
                  style={{ backgroundColor: variant.hex }}
                />
              ))}
              {activeVariant && (
                <span className="text-[11px] text-[#565959] ml-1 truncate">
                  {activeVariant}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-[15px] leading-[1.35] font-medium text-[#0F1111]">
            <button
              type="button"
              onClick={() => onSelect(product, activeVariant)}
              className="text-left hover:text-[#C7511F] transition-colors line-clamp-3 cursor-pointer"
            >
              {product.title}
            </button>
          </h2>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onSelect(product, activeVariant)}
              className="inline-flex items-center gap-1 cursor-pointer group"
            >
              <StarRating rating={product.rating} size={15} />
              <span className="text-[12px] text-[#007185] group-hover:text-[#C7511F] group-hover:underline tabular-nums">
                {product.reviewCount.toLocaleString()}
              </span>
            </button>
          </div>

          {product.boughtPastMonth && (
            <p className="text-[12px] text-[#565959] leading-tight">
              {product.boughtPastMonth}
            </p>
          )}

          {/* Price */}
          <div className="pt-1 flex items-baseline gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onSelect(product, activeVariant)}
              className="inline-flex items-start text-[#0F1111] tabular-nums cursor-pointer"
            >
              <span className="text-[12px] font-medium mt-0.5">S$</span>
              <span className="text-[24px] font-semibold leading-none tracking-tight">
                {wholePrice}
              </span>
              <span className="text-[12px] font-medium mt-0.5">{cents}</span>
            </button>

            {product.typicalPrice && (
              <span className="text-[12px] text-[#565959] tabular-nums">
                Typical:{' '}
                <span className="line-through">
                  S${product.typicalPrice.toFixed(2)}
                </span>
              </span>
            )}
          </div>

          {/* Prime & Delivery */}
          <div className="space-y-0.5 pt-0.5">
            {product.isPrime && (
              <div className="flex items-center gap-1.5">
                <PrimeBadge size="sm" />
              </div>
            )}
            <p className="text-[12px] text-[#0F1111] leading-snug">
              {product.deliveryText.includes('Tomorrow') ? (
                <>
                  FREE delivery{' '}
                  <span className="font-bold">Tomorrow, 19 Nov</span>
                  {product.deliveryText.includes('on S$40') && (
                    <span className="text-[#565959]">
                      {' '}
                      on S$40 of items shipped by Amazon
                    </span>
                  )}
                </>
              ) : (
                product.deliveryText
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons: Add to Cart + Prominent One-Click Buy Now */}
        <div
          className={`pt-2 flex flex-col gap-2 ${
            viewMode === 'list' ? 'sm:max-w-[260px]' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 py-1.5 px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                justAdded
                  ? 'bg-[#067D62] text-white border border-[#067D62]'
                  : 'bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-[#0F1111] border border-[#FCD200] shadow-[0_1px_2px_rgba(15,17,17,0.1)]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Added to cart</span>
                </>
              ) : (
                <span>Add to cart</span>
              )}
            </button>

            {justAdded && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCart();
                }}
                className="text-[12px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer shrink-0"
              >
                View cart
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product, activeVariant);
            }}
            className="w-full py-2 px-4 rounded-full bg-[#FFA41C] hover:bg-[#FA8900] active:bg-[#E77600] text-[#0F1111] border border-[#FF8F00] text-[14px] font-bold tracking-tight shadow-[0_2px_6px_rgba(255,164,28,0.35)] hover:shadow-[0_3px_8px_rgba(250,137,0,0.45)] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-[#0F1111] stroke-[#0F1111]" />
            <span>Buy now</span>
          </button>
        </div>
      </div>
    </article>
  );
}
