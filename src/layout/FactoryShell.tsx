"use client";

import React, { useEffect, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import FactoryHeader from "@/layout/FactoryHeader";
import FactorySidebar from "@/layout/FactorySidebar";
import Backdrop from "@/layout/Backdrop";

export default function FactoryShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl");
  }, []);

// #region agent log
  useEffect(() => {
    const isRtlVal = document.documentElement.dir === "rtl";
    console.log('DEBUG: FactoryShell RTL Check', { isRtl: isRtlVal, dir: document.documentElement.dir });
    fetch('http://127.0.0.1:7732/ingest/38974f4f-fb7c-47a7-8a89-84aebd4fa6dd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6bd7a9'},body:JSON.stringify({sessionId:'6bd7a9',location:'FactoryShell.tsx:21',message:'FactoryShell RTL Check',data:{isRtl: isRtlVal, dir: document.documentElement.dir},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
  }, []);
  // #endregion

  const mainContentMargin = isMobileOpen
    ? ""
    : isExpanded || isHovered
      ? isRtl
        ? "lg:mr-[290px]"
        : "lg:ml-[290px]"
      : isRtl
        ? "lg:mr-[90px]"
        : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <FactorySidebar />
      <Backdrop />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <FactoryHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
