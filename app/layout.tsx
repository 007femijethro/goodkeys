import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoodKeys | Find a home you can trust",
  description:
    "Discover verified rental properties, trusted agents and transparent move-in costs across Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
