export default function Footer() {
  return (
    <div className="w-full px-6 md:px-[72px] pt-[48px] md:pt-[96px] pb-[20px]">
      {/* Top Section */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
        {/* Logo + Beta */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#005741] font-roobert flex items-center">
          Work<span className="text-[#00A5C6]">Trial</span>
          <span className="ml-2 bg-[#B0FF61] text-xs font-normal rounded-full px-[6px] py-[2px] flex items-center justify-center h-[17.33px]">
            Beta
          </span>
        </h1>

        {/* Navigation Links */}
        <nav className="w-full grid grid-cols-2 justify-between gap-x-4 gap-y-2 md:flex md:flex-wrap md:gap-[16px] md:w-[536px] md:h-[25px] md:justify-end">
          <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">ZetaChain</a>
          <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Docs</a>
          <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Explorer</a>
          <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Blog</a>
          <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Terms</a>
          <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Privacy Policy</a>
          <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Updates</a>
          <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Feedback</a>
        </nav>

      </div>

      {/* Socials */}
      <div className="mt-6 flex flex-col md:flex-row-reverse items-start md:items-center justify-between gap-6 md:gap-0">
  {/* Social Links */}
  <nav className="flex gap-6 ">
    <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Telegram</a>
    <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Discord</a>
  </nav>

  {/* Copyright */}
  <span className="text-[#000000] text-sm font-roobert mt-4 md:mt-0">
    © {new Date().getFullYear()} WorkTrail. All rights reserved.
  </span>
</div>

    </div>
  );
}
