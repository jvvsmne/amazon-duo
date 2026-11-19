import React from 'react';

export function AmazonSgLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-baseline select-none ${className}`}>
      <div className="relative flex flex-col items-start leading-none">
        <div className="flex items-baseline">
          <span className="text-[22px] font-extrabold tracking-tight text-white">
            amazon
          </span>
          <span className="text-[13px] font-medium text-white/95 ml-0.5">.sg</span>
        </div>
        {/* Signature smile arrow */}
        <svg
          width="66"
          height="12"
          viewBox="0 0 66 12"
          fill="none"
          aria-hidden="true"
          className="-mt-1 ml-0.5"
        >
          <path
            d="M2 3.5C18 10.5 42 10.5 58 4"
            stroke="#FF9900"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M54 1.5L60.5 3.6L57.2 9"
            stroke="#FF9900"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function PrimeBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const textSize = size === 'sm' ? 'text-[13px]' : 'text-[14px]';
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-extrabold italic tracking-tight leading-none select-none ${textSize}`}
      aria-label="Amazon Prime"
    >
      <span className="text-[#FF9900] not-italic font-black">✓</span>
      <span className="text-[#00A8E1]">prime</span>
    </span>
  );
}

export function StarRating({
  rating,
  size = 15,
}: {
  rating: number;
  size?: number;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span
      className="inline-flex items-center gap-[1px]"
      aria-label={`${rating} out of 5 stars`}
    >
      {stars.map((index) => {
        const diff = rating - (index - 1);
        const fillType =
          diff >= 0.75 ? 'full' : diff >= 0.25 ? 'half' : 'empty';
        const gradId = `star-half-${index}-${Math.round(rating * 10)}`;

        return (
          <svg
            key={index}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="shrink-0"
          >
            {fillType === 'half' && (
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="#FFA41C" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M12 2.25l2.92 5.91 6.53.95-4.72 4.6 1.11 6.5L12 17.14l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.25z"
              fill={
                fillType === 'full'
                  ? '#FFA41C'
                  : fillType === 'half'
                    ? `url(#${gradId})`
                    : '#FFFFFF'
              }
              stroke="#DE7921"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
}
