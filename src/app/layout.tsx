import type { Metadata } from "next";
import AppShell from "../components/shell/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strata Builds",
  description: "Design, data, structure — visualizations and digital products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
