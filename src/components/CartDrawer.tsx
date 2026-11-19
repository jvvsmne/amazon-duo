import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle2, ShoppingBag, Zap } from 'lucide-react';
import { CartItem, DeliveryLocation, Product } from '../types';
import { PrimeBadge } from './AmazonMarks';

export interface InstantOrder {
  orderNumber: string;
  product: Product;
  selectedVariant?: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  instantOrder: InstantOrder | null;
  location: DeliveryLocation;
  onClose: () => void;
  onUpdateQty: (productId: string, variant: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variant: string | undefined) => void;
  onClearCart: () => void;
  onClearInstantOrder: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  instantOrder,
  location,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onClearInstantOrder,
}: CartDrawerProps) {
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 40;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    const num = `SG-408-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setOrderNumber(num);
    setCheckoutDone(true);
    onClearCart();
  };

  const handleClose = () => {
    setCheckoutDone(false);
    onClearInstantOrder();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[440px] bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131921] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {instantOrder ? (
              <>
                <Zap className="w-5 h-5 text-[#FFA41C] fill-[#FFA41C]" />
                <h2 className="text-[16px] font-bold">1-Click Express Order</h2>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 text-[#FF9900]" />
                <h2 className="text-[16px] font-bold">
                  Shopping Cart ({totalCount})
                </h2>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
            className="p-1 rounded-xs hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto thin-scroll p-4 space-y-4">
          {instantOrder ? (
            <div className="border border-[#067D62]/30 bg-[#F2FBF8] rounded-[8px] p-5 space-y-4 my-4">
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-11 h-11 text-[#067D62] mx-auto" />
                <h3 className="text-[18px] font-bold text-[#0F1111]">
                  1-Click Order Placed
                </h3>
                <p className="text-[13px] text-[#0F1111]">
                  Order{' '}
                  <span className="font-mono font-bold">
                    #{instantOrder.orderNumber}
                  </span>{' '}
                  confirmed for{' '}
                  <span className="font-semibold">
                    {location.country} {location.postalCode}
                  </span>
                  .
                </p>
              </div>

              <div className="bg-white border border-[#E7E7E7] rounded-[6px] p-3 flex gap-3 items-center">
                <div className="w-16 h-16 bg-[#F7F7F7] rounded-[4px] p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={instantOrder.product.image}
                    alt={instantOrder.product.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-[13px] font-medium text-[#0F1111] line-clamp-2 leading-snug">
                    {instantOrder.product.title}
                  </p>
                  {instantOrder.selectedVariant && (
                    <p className="text-[11px] text-[#565959]">
                      Colour: {instantOrder.selectedVariant}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[13px] pt-0.5">
                    <span className="text-[#565959] tabular-nums">
                      Qty: {instantOrder.quantity}
                    </span>
                    <span className="font-bold text-[#0F1111] tabular-nums">
                      S$
                      {(
                        instantOrder.product.price * instantOrder.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-[#565959] text-center">
                {instantOrder.product.deliveryText}
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 px-5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-[13px] font-medium cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          ) : checkoutDone ? (
            <div className="border border-[#067D62]/30 bg-[#F2FBF8] rounded-[8px] p-5 space-y-3 text-center my-8">
              <CheckCircle2 className="w-11 h-11 text-[#067D62] mx-auto" />
              <h3 className="text-[18px] font-bold text-[#0F1111]">
                Order Confirmed
              </h3>
              <p className="text-[13px] text-[#0F1111]">
                Order <span className="font-mono font-bold">#{orderNumber}</span>{' '}
                is being prepared for delivery to{' '}
                <span className="font-semibold">
                  {location.country} {location.postalCode}
                </span>
                .
              </p>
              <p className="text-[12px] text-[#565959]">
                Estimated arrival: Tomorrow, 19 Nov by 10 PM
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-[13px] font-medium cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#A7ACB2] mx-auto stroke-[1.5]" />
              <h3 className="text-[17px] font-bold text-[#0F1111]">
                Your Amazon Cart is empty
              </h3>
              <p className="text-[13px] text-[#565959] max-w-[260px] mx-auto">
                Add iPhone Duo chargers, power banks, or protective cases from the search results.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-[13px] font-medium cursor-pointer"
              >
                Browse results
              </button>
            </div>
          ) : (
            <>
              {/* Free Delivery Banner */}
              <div className="bg-[#F7F8FA] border border-[#E7E7E7] rounded-[6px] p-3 text-[12px]">
                {remainingForFree === 0 ? (
                  <div className="flex items-start gap-2 text-[#067D62] font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Your order qualifies for{' '}
                      <span className="font-bold">FREE Delivery</span> in
                      Singapore.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[#0F1111]">
                      Add{' '}
                      <span className="font-bold text-[#B12704] tabular-nums">
                        S${remainingForFree.toFixed(2)}
                      </span>{' '}
                      more for <span className="font-bold">FREE Delivery</span>
                    </p>
                    <div className="h-1.5 w-full bg-[#E7E7E7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#067D62] transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (subtotal / freeShippingThreshold) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-[#E7E7E7]">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                    className="py-3.5 flex gap-3"
                  >
                    <div className="w-20 h-20 bg-[#F7F7F7] rounded-[4px] p-2 flex items-center justify-center shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-[13px] font-medium text-[#0F1111] line-clamp-2 leading-snug">
                        {item.product.title}
                      </h4>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#565959]">
                          Colour: {item.selectedVariant}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-[#0F1111] tabular-nums">
                          S${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {item.product.isPrime && <PrimeBadge size="sm" />}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="inline-flex items-center border border-[#D5D9D9] rounded-full bg-[#F0F2F2]">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              onUpdateQty(
                                item.product.id,
                                item.selectedVariant,
                                -1
                              )
                            }
                            className="p-1.5 hover:bg-[#E3E6E6] rounded-l-full cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5 text-[#0F1111]" />
                          </button>
                          <span className="px-2.5 text-[12px] font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              onUpdateQty(
                                item.product.id,
                                item.selectedVariant,
                                1
                              )
                            }
                            className="p-1.5 hover:bg-[#E3E6E6] rounded-r-full cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#0F1111]" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onRemoveItem(item.product.id, item.selectedVariant)
                          }
                          className="inline-flex items-center gap-1 text-[12px] text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!instantOrder && items.length > 0 && !checkoutDone && (
          <div className="border-t border-[#E7E7E7] bg-[#F7F8FA] p-4 space-y-3">
            <div className="flex items-center justify-between text-[16px]">
              <span className="text-[#0F1111]">
                Subtotal ({totalCount} item{totalCount > 1 ? 's' : ''}):
              </span>
              <span className="font-bold text-[#0F1111] tabular-nums">
                S${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-2.5 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[14px] font-medium text-[#0F1111] shadow-xs cursor-pointer transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
