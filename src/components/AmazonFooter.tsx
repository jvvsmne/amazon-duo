import React from 'react';
import { AmazonSgLogo } from './AmazonMarks';

interface AmazonFooterProps {
  onQuickSearch: (query: string) => void;
}

export function AmazonFooter({ onQuickSearch }: AmazonFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-12 text-white">
      {/* Back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] py-3.5 text-[13px] font-medium text-white text-center transition-colors cursor-pointer"
      >
        Back to top
      </button>

      {/* Main Footer Columns */}
      <div className="bg-[#232F3E] py-10 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
          <div>
            <h3 className="font-bold text-[15px] mb-3">Get to Know Us</h3>
            <ul className="space-y-2 text-[#DDDDDD]">
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  About Amazon
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Amazon Science
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('iphone duo')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Amazon Singapore
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[15px] mb-3">Make Money with Us</h3>
            <ul className="space-y-2 text-[#DDDDDD]">
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Sell on Amazon
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Advertise Your Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Amazon Global Selling
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Fulfilment by Amazon
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[15px] mb-3">Shop Electronics</h3>
            <ul className="space-y-2 text-[#DDDDDD]">
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('magsafe duo')}
                  className="hover:underline text-left cursor-pointer"
                >
                  MagSafe Duo Chargers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('belkin')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Belkin Qi2 Stands
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('anker')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Anker Power Banks
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('ugreen')}
                  className="hover:underline text-left cursor-pointer"
                >
                  UGREEN GaN Chargers
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[15px] mb-3">Let Us Help You</h3>
            <ul className="space-y-2 text-[#DDDDDD]">
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Your Account
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Your Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Shipping Rates &amp; Policies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  Returns &amp; Replacements
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Locale Strip */}
      <div className="bg-[#131921] border-t border-[#3A4553] py-6 px-6">
        <div className="max-w-[1000px] mx-auto flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <AmazonSgLogo />
            <div className="flex items-center gap-2 text-[12px] text-[#CCCCCC]">
              <span className="px-3 py-1.5 border border-[#848688] rounded-[3px]">
                SGD — S$ Singapore Dollar
              </span>
              <span className="px-3 py-1.5 border border-[#848688] rounded-[3px]">
                Singapore
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#999999] text-center">
            Conditions of Use &amp; Sale · Privacy Notice · © 1996–2026, Amazon.com, Inc. or its affiliates
          </p>
        </div>
      </div>
    </footer>
  );
}
