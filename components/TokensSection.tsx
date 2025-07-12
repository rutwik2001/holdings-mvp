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
    <section className="w-full md:w-[1168px] opacity-100 flex flex-col justify-center pacity-100 relative font-roobert font-medium">
      <h3 className="font-semibold text-[#000000] text-[32px]">Tokens</h3>
      <p className="text-[#696E75] text-[16px]">
        ZetaChain compatible and ZRC-20 tokens across connected networks
      </p>

      {loading ? (<>
        <div className="flex w-full items-center  w-full md:w-[208px] h-[100px] md:h-[260px] bg-white border border-[#E5E8EC] rounded-[4px] md:rounded-[8px] opacity-100 p-2 md:p-4 flex items-center md:flex-col md:justify-center md:text-center gap-2 md:gap-0 transition-shadow duration-300 ">
          <Skeleton className="w-16 h-16 mb-0.5 rounded-full" /> {/* token icon placeholder */}
          <Skeleton className="w-20 h-6 mb-0.5 rounded" /> {/* token symbol */}
          <Skeleton className="w-24 h-8 mb-0.5 rounded" /> {/* token amount */}
          <Skeleton className="w-28 h-5 mb-0.5 rounded" /> {/* token value */}
        </div>
      </>) : walletAddress ? (
        <>
          {tokens.length === 0 ? (
            <NoTokens />
          ) : (
            <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-4 md:gap-[56px] w-full mt-[56px]">


              {tokens.map((token) => (
                <div
                    key={token.symbol + token.network}
                    className="flex w-full items-center  w-full md:w-[208px] h-[100px] md:h-[260px] bg-white border border-[#E5E8EC] rounded-[4px] md:rounded-[8px] opacity-100 p-2 md:p-4 flex items-center md:flex-col md:justify-center md:text-center gap-2 md:gap-0 transition-shadow duration-300 hover:shadow-[0px_0px_1px_0px_rgba(9,30,66,0.2),_0px_18px_28px_0px_rgba(9,30,66,0.1)]"
                  >

                    
                  {/* Left: Icon */}
                  <Image
                    src={`/images/${token.name}.png`}
                    alt={token.name}
                    width={40}
                    height={40}
                    className="md: mb-2"
                  />

                  {/* Center: Token Name */}
                  <div className="flex flex-col items-start gap-1 text-left md:text-center md:items-center md:mb-3">

                     <h4 className="text-[#000000] font-semibold text-[14px] flex-1">
                      {token.name}
                    </h4>
                    <p className="text-[#696E75] text-[12px]">on {token.network}</p>
                  </div>

                 

                  {/* Right: Info stack */}
                  <div className="flex flex-col items-end gap-1 text-right ml-auto md:ml-0 md:text-center md:items-center">
  <p className="text-[#696E75] font-medium text-[12px]">
    {Number(token.formattedBalance).toLocaleString()} {token.symbol}
  </p>
  <p className="text-[#000000] text-[14px]">
    ${token.valueUSD.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </p>
</div>


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
