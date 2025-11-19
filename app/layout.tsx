import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Interface } from "@/components/Interface";
import { AppBackground } from "@/components/AppBackground";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musixmatch Quiz",
  description: "Get ready to test your music knowledge!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased h-screen w-screen relative overflow-hidden`}
      >
        <Interface />
        <AppBackground />
        <div className="w-full h-full px-8 py-40 relative pointer-events-none">
          {children}
        </div>
      </body>
    </html>
  );
}
