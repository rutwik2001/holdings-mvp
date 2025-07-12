import React from "react";
import Skeleton  from "./Skeleton";
import HoldingsIllustration from "./illustrations/HoldingsIllustration"; 

type HoldingsSectionProps = {
  loading: boolean;
  walletAddress: string | null | undefined;
  portfolioValue: number;
};

export default function HoldingsSection({
  loading,
  walletAddress,
  portfolioValue,
}: HoldingsSectionProps) {
    
  return (
    <section className="w-[302px] md:w-[1168px] h-[360px] flex flex-col justify-center border-b border-[#E5E8EC] opacity-100 relative font-roobert font-medium">
      <h2 className="font-roobert text-[#696E75] font-medium text-[32px] leading-[110%] tracking-[-0.02em]">
        Holdings
      </h2>

      {loading ? (
        <div className="w-[100px] h-[30px]">
          <Skeleton className="w-[300px] h-[100px]" />
        </div>
      ) : walletAddress ? (
        <p className="font-roobert text-[#000000] text-[80px] leading-[110%] tracking-[-0.02em]">
          $
          {portfolioValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ) : (
        <>
          <p className="font-roobert text-[#000000] text-[80px] leading-[110%] tracking-[-0.02em]">
            $--
          </p>

          {/* Anchored to bottom of the section */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col items-start pb-6">
            <p className="text-[#005741] font-roobert text-sm mb-2">
              Start by getting some ZETA tokens
            </p>
          </div>
        </>
      )}
    </section>
  );
}
