import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Interface } from "@/components/Interface";
import { AppBackground } from "@/components/AppBackground";
import { SplashScreen } from "@/components/SplashScreen";
import { Toaster } from "@/components/ui/sonner";

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
        className={`${outfit.variable} ${inter.variable} antialiased h-svh w-screen relative overflow-hidden`}
      >
        <Interface />
        <AppBackground />
        <SplashScreen />
        <div className="w-full h-full px-8 pt-32 pb-8 relative pointer-events-none flex flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
