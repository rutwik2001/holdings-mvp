import React from "react";
import Image from "next/image";
import Skeleton from "./Skeleton"; // Replace with your Skeleton component import
import NoTokens from "./NoTokens"; // Replace with your actual NoTokens component import

type Token = {
  name: string;
  symbol: string;
  network: string;
  formattedBalance: string | number;
  valueUSD: number;
};

type TokensSectionProps = {
  loading: boolean;
  walletAddress: string | null | undefined;
  tokens: Token[];
};

export default function TokensSection({
  loading,
  walletAddress,
  tokens,
}: TokensSectionProps) {
  return (
    <section className="w-[1168px] opacity-100">
      <h3 className="font-semibold text-[#000000] text-[32px]">Tokens</h3>
      <p className="text-[#696E75] text-[16px]">
        ZetaChain compatible and ZRC-20 tokens across connected networks
      </p>

      {loading ? (
        <div className="w-[208px] h-[260px] bg-white border border-[#E5E8EC] rounded-[8px] p-4 flex flex-col items-center justify-center gap-4 mt-[56px]">
          <Skeleton className="w-16 h-16 rounded-full" /> {/* token icon placeholder */}
          <Skeleton className="w-20 h-6 rounded" /> {/* token symbol */}
          <Skeleton className="w-24 h-8 rounded" /> {/* token amount */}
          <Skeleton className="w-28 h-5 rounded" /> {/* token value */}
        </div>
      ) : walletAddress ? (
        <>
          {tokens.length === 0 ? (
            <NoTokens />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[56px] justify-items-center mt-[56px]">
              {tokens.map((token) => (
                <div
                  key={token.symbol + token.network}
                  className="w-[208px] h-[260px] bg-white border border-[#E5E8EC] rounded-[8px] opacity-100 p-4 text-center flex flex-col items-center justify-center transition-shadow duration-300 hover:shadow-[0px_0px_1px_0px_rgba(9,30,66,0.2),_0px_18px_28px_0px_rgba(9,30,66,0.1)]"
                >
                  <Image
                    src={`/images/${token.name}.png`}
                    alt={token.name}
                    width={40}
                    height={40}
                  />

                  <div className="gap-[16px] mb-3 mt-[16px]">
                    <h4 className="text-[#000000] font-semibold text-[14px]">
                      {token.name}
                    </h4>
                    <p className="text-[#696E75] text-[12px]">on {token.network}</p>
                  </div>
                  <p className="text-[#696E75] font-medium text-[12px] gap-[20px]">
                    {Number(token.formattedBalance).toLocaleString()}
                  </p>
                  <p className="text-[#000000] mt-1 text-[14px]">
                    $
                    {token.valueUSD.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <NoTokens />
      )}
    </section>
  );
}
