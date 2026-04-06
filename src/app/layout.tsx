import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nigerian Safety Investigation Bureau (NSIB)",
  description: "Official Website of the Nigerian Safety Investigation Bureau. Enhancing public safety in transportation across Nigeria.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable}`}>
      <body>
        <Navbar />
        <div style={{ paddingTop: 'var(--nav-height)' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
