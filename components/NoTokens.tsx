'use client';

export default function NoTokens() {
  return (
    <div className="w-[1168px] h-[192px] bg-[#F9F9FB] rounded-[5px] px-[24px] py-[56px] flex flex-col items-center justify-center  opacity-100 mt-[56px]">
      <p className="text-[#005741] font-roobert text-lg font-medium">
        You don't have any tokens yet
      </p>
      <a
        href="https://www.zetachain.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00A5C6] font-roobert underline text-sm hover:text-[#0086a0]"
      >
        Get ZetaChain
      </a>
    </div>
  );
}
