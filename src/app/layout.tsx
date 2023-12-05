import Image from "next/image";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "../lib/utils";
import { Footer } from "@/components/Footer";
import logo from "../assets/vaseLogo.svg";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vase Studio",
  description: "Generated by create next app",
  icons: { icon: "/icon.png" },
};

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
        <div className="absolute top-0 left-0 m-2 w-16 md:w-32 h-16 md:h-32 z-10">
          <Image src={logo} alt="Vase Studio Logo" fill />
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
