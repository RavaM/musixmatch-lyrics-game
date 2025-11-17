"use client";

import { SplashScreen } from "@/components/SplashScreen";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  // TODO: add real fetching
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="text-white w-full h-full flex flex-col items-center overflow-hidden pointer-events-none">
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>

      <div className="flex flex-col items-center z-10 w-md aspect-square p-8 rounded-2xl text-center top-24 relative">
        <h1 className="uppercase text-4xl font-bold">
          Welcome to the
          <br />
          ✦coolest✦
          <br />
          lyrics game ;)
        </h1>
        <div className="mt-4 flex flex-col flex-1">
          <label htmlFor="username" className="uppercase text-sm">
            Enter your username below and choose an avatar!
          </label>
        </div>
        <Button asChild className="cursor-pointer pointer-events-auto">
          <Link href="/play">Start the game</Link>
        </Button>
      </div>
    </main>
  );
}
