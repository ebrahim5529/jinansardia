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
