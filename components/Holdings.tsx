import React from "react";
import Skeleton  from "./Skeleton";
import HoldingsIllustration from "./illustrations/HoldingsIllustration"; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Props for the HoldingsSection component
type HoldingsSectionProps = {
  loading: boolean;
  walletAddress: string | null | undefined;
  portfolioValue: number;
  comparedResult: {
    value: number;
    timestamp: number
  } | null;
};

export default function HoldingsSection({
  loading,
  walletAddress,
  portfolioValue,
  comparedResult
}: HoldingsSectionProps) {
    
  return (
    <section className="w-[302px] md:w-[1168px] h-[360px] flex flex-col justify-center border-b border-[#E5E8EC] opacity-100 relative font-roobert font-medium">
  <h2 className="text-[#696E75] font-medium text-[32px] leading-[110%] tracking-[-0.02em]">
    Holdings
  </h2>
    {/* Loading state: show skeleton UI */}
  {loading ? (
    <div className="w-[300px] h-[100px]">
      <Skeleton className="w-full h-full" />
    </div>
    // When wallet is connected
  ) : walletAddress ? (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mt-2">
      {/* Portfolio Value */}
      <p className="text-[#000000] text-[80px] leading-[110%] tracking-[-0.02em]">
        $
        {portfolioValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>

      {/*Show value change since last check (positive/negative/neutral) */}
      {comparedResult ? (
        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
          <p
            className={`text-[20px] font-roobert ${
              comparedResult.value > 0
                ? 'text-green-600'
                : comparedResult.value < 0
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            Changed By: {comparedResult.value > 0 ? '+' : ''}
            {comparedResult.value.toFixed(2)} USD
          </p>
          <span className="text-sm text-[#696E75] mt-1">
            Since {dayjs(comparedResult.timestamp).fromNow()}
          </span>
        </div>
      ) : (
        <div className="mt-4 md:mt-0">
          <p className="text-[20px] font-roobert text-[#696E75]">
            Check back later for your portfolio performance
          </p>
        </div>
      )}

    </div>
    // If wallet is not connected
  ) : (
    <>
      <p className="text-[#000000] text-[80px] leading-[110%] tracking-[-0.02em]">
        $--
      </p>

      {/* Anchored to bottom of the section */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-start pb-6">
        <p className="text-[#005741] text-sm mb-2">
          Start by getting some ZETA tokens
        </p>
      </div>
    </>
  )}
</section>

  );
}
