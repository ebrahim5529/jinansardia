"use client";

import React from "react";
import HospitalShell from "@/layout/HospitalShell";

export default function HospitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HospitalShell>{children}</HospitalShell>;
}
