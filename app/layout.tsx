import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexgeno - 17 Years of Digital Excellence",
  description: "Mumbai-based digital marketing agency helping businesses shine online since 2008.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
