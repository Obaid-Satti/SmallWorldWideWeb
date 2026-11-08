import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Small Web",
  description: "Browse a small web of independent pages.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
