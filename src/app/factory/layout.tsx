"use client";

import React from "react";
import FactoryShell from "@/layout/FactoryShell";

export default function FactoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FactoryShell>{children}</FactoryShell>;
}
