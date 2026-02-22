import React from "react";
import FactoryShell from "@/layout/FactoryShell";
import FactoryAuthWrapper from "./FactoryAuthWrapper";

export default function FactoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FactoryAuthWrapper>
      <FactoryShell>{children}</FactoryShell>
    </FactoryAuthWrapper>
  );
}
