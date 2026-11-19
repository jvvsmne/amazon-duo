import React, { useState } from 'react';
import { X, MapPin, ChevronRight, User, PackageCheck } from 'lucide-react';
import { DeliveryLocation } from '../types';
import { DEPARTMENTS } from '../data/products';

interface LocationModalProps {
  isOpen: boolean;
  location: DeliveryLocation;
  onSave: (loc: DeliveryLocation) => void;
  onClose: () => void;
}

const SG_PRESETS: DeliveryLocation[] = [
  { country: 'Singapore', postalCode: '018989', areaLabel: 'Marina Bay' },
  { country: 'Singapore', postalCode: '238801', areaLabel: 'Orchard Road' },
  { country: 'Singapore', postalCode: '609601', areaLabel: 'Jurong East' },
];

export function LocationModal({
  isOpen,
  location,
  onSave,
  onClose,
}: LocationModalProps) {
  const [postal, setPostal] = useState(location.postalCode);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setPostal(location.postalCode);
    setError('');
  }, [location.postalCode, isOpen]);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = postal.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setError('Please enter a valid 6-digit Singapore postal code.');
      return;
    }
    onSave({
      country: 'Singapore',
      postalCode: trimmed,
      areaLabel: 'Singapore',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] w-full max-w-[380px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#F0F2F2] px-5 py-3.5 border-b border-[#D5D9D9] flex items-center justify-between">
          <h2
            id="location-modal-title"
            className="text-[16px] font-bold text-[#0F1111]"
          >
            Choose your location
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location modal"
            className="p-1 rounded-xs hover:bg-[#E3E6E6] cursor-pointer"
          >
            <X className="w-4 h-4 text-[#0F1111]" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-[13px]">
          <p className="text-[#565959] leading-snug">
            Delivery options and delivery speeds may vary for different Singapore postal codes.
          </p>

          <div className="space-y-1.5">
            <div className="text-[12px] font-semibold text-[#565959]">
              Quick Singapore addresses
            </div>
            {SG_PRESETS.map((preset) => (
              <button
                key={preset.postalCode}
                type="button"
                onClick={() => {
                  onSave(preset);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-[6px] border flex items-center justify-between cursor-pointer ${
                  location.postalCode === preset.postalCode
                    ? 'border-[#007185] bg-[#F2FAFB] font-semibold'
                    : 'border-[#D5D9D9] hover:bg-[#F7FAFA]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#007185]" />
                  <span>
                    {preset.areaLabel}, Singapore {preset.postalCode}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleApply} className="space-y-2 pt-2 border-t border-[#E7E7E7]">
            <label
              htmlFor="sg-postal-input"
              className="block text-[12px] font-bold text-[#0F1111]"
            >
              Or enter a Singapore postal code
            </label>
            <div className="flex gap-2">
              <input
                id="sg-postal-input"
                type="text"
                maxLength={6}
                value={postal}
                onChange={(e) => {
                  setPostal(e.target.value);
                  setError('');
                }}
                placeholder="e.g. 018989"
                className="flex-1 h-[34px] px-3 border border-[#888C8C] rounded-[4px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#007185] tabular-nums"
              />
              <button
                type="submit"
                className="px-4 h-[34px] rounded-[7px] border border-[#D5D9D9] bg-white hover:bg-[#F7FAFA] text-[13px] font-medium shadow-xs cursor-pointer"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-[12px] text-[#CC0C39]">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

interface AllDepartmentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDepartment: (dept: string) => void;
  onSelectQuery: (query: string) => void;
}

export function AllDepartmentsDrawer({
  isOpen,
  onClose,
  onSelectDepartment,
  onSelectQuery,
}: AllDepartmentsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-label="All Departments"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[340px] bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#232F3E] text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white text-[#232F3E] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-[17px] font-bold">Hello, sign in</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 text-white/90 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll divide-y divide-[#E7E7E7] text-[14px]">
          <div className="py-3">
            <h3 className="px-6 py-1.5 text-[16px] font-bold text-[#0F1111]">
              Trending Searches
            </h3>
            {['iphone duo', 'magsafe duo', 'belkin qi2', 'anker maggo'].map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    onSelectQuery(term);
                    onClose();
                  }}
                  className="w-full px-6 py-2.5 text-left hover:bg-[#EAEDED] flex items-center justify-between text-[#0F1111] cursor-pointer"
                >
                  <span className="capitalize">{term}</span>
                  <ChevronRight className="w-4 h-4 text-[#565959]" />
                </button>
              )
            )}
          </div>

          <div className="py-3">
            <h3 className="px-6 py-1.5 text-[16px] font-bold text-[#0F1111]">
              Shop by Department
            </h3>
            <button
              type="button"
              onClick={() => {
                onSelectDepartment('All');
                onClose();
              }}
              className="w-full px-6 py-2.5 text-left hover:bg-[#EAEDED] flex items-center justify-between text-[#0F1111] cursor-pointer"
            >
              <span>All Mobile &amp; Duo Accessories</span>
              <ChevronRight className="w-4 h-4 text-[#565959]" />
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => {
                  onSelectDepartment(dept);
                  onClose();
                }}
                className="w-full px-6 py-2.5 text-left hover:bg-[#EAEDED] flex items-center justify-between text-[#0F1111] cursor-pointer"
              >
                <span>{dept}</span>
                <ChevronRight className="w-4 h-4 text-[#565959]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoModalProps {
  mode: 'account' | 'orders' | null;
  onClose: () => void;
}

export function AccountOrdersModal({ mode, onClose }: InfoModalProps) {
  const [email, setEmail] = useState('');
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  if (!mode) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] w-full max-w-[400px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#F0F2F2] px-5 py-3.5 border-b border-[#D5D9D9] flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#0F1111]">
            {mode === 'account' ? 'Sign in to Amazon.sg' : 'Returns & Orders'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-xs hover:bg-[#E3E6E6] cursor-pointer"
          >
            <X className="w-4 h-4 text-[#0F1111]" />
          </button>
        </div>

        <div className="p-5 text-[13px] space-y-4">
          {mode === 'account' ? (
            signedInUser ? (
              <div className="space-y-3 text-center py-2">
                <p className="text-[15px] font-bold text-[#0F1111]">
                  Signed in as {signedInUser}
                </p>
                <p className="text-[#565959]">
                  Amazon Prime SG benefits are active for your session.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-medium cursor-pointer"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSignedInUser(email.trim());
                }}
                className="space-y-3"
              >
                <div>
                  <label
                    htmlFor="amz-signin-email"
                    className="block font-bold text-[#0F1111] mb-1"
                  >
                    Email or mobile phone number
                  </label>
                  <input
                    id="amz-signin-email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-[36px] px-3 border border-[#888C8C] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#007185]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-[8px] bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] font-medium text-[#0F1111] cursor-pointer"
                >
                  Continue
                </button>
                <p className="text-[11px] text-[#565959] leading-relaxed">
                  By continuing, you agree to Amazon.sg&apos;s Conditions of Use and Privacy Notice.
                </p>
              </form>
            )
          ) : (
            <div className="space-y-3">
              <div className="border border-[#D5D9D9] rounded-[6px] p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[12px] text-[#565959]">
                  <span>Order #SG-408-2910442</span>
                  <span className="font-semibold text-[#067D62] inline-flex items-center gap-1">
                    <PackageCheck className="w-3.5 h-3.5" />
                    Delivered
                  </span>
                </div>
                <p className="font-medium text-[#0F1111]">
                  Anker MagGo 10,000mAh Magnetic Power Bank Duo
                </p>
                <p className="text-[12px] text-[#565959]">
                  Delivered to Singapore 018989
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-medium cursor-pointer"
              >
                Back to search results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
