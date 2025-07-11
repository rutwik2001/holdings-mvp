export default function Footer() {
  return (
   <>
    <div className="w-full gap-[104px] pt-[96px] pb-[64px] pr-[72px] pl-[72px] bottom-0">
  <div className="w-full flex items-center justify-between">
    
    {/* Logo + Beta */}
    <h1 className="text-3xl font-bold text-[#005741] font-roobert flex items-center">
      Work<span className="text-[#00A5C6]">Trail</span>
      <span className="ml-2 bg-[#B0FF61] text-xs font-normal rounded-full px-[6px] py-[2px] flex items-center justify-center h-[17.33px]">
        Beta
      </span>
    </h1>

    {/* Navigation Links */}
    <nav className="flex gap-[16px] w-[536px] h-[25px] justify-end">
      <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">ZetaChain</a>
      <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Docs</a>
      <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">API</a>
      <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Support</a>
    </nav>

  </div>
    <br/> 
  <div className="w-full flex items-center justify-between gap-[100px]">
    
    {/* Logo + Beta */}
    
      <span className="text-[#000]">Copyright</span>
      
    

    {/* Navigation Links */}
    <nav className="flex gap-[16px] w-[536px] h-[25px] justify-end">
      <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Telegram</a>
      <a href="#" className="text-[#005741] text-sm font-roobert hover:underline">Discord</a>
    </nav>

  </div>
</div>
   </>
  );
}
