import React from "react";
import HospitalShell from "@/layout/HospitalShell";
import HospitalAuthWrapper from "./HospitalAuthWrapper";

export default function HospitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HospitalAuthWrapper>
      <HospitalShell>{children}</HospitalShell>
    </HospitalAuthWrapper>
  );
}
