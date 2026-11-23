import type { ReactNode } from "react";
import LegacyLightCanvas from "../../components/shell/LegacyLightCanvas";
export default function InstrumentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LegacyLightCanvas>{children}</LegacyLightCanvas>;
}
