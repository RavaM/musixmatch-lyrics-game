"use client";

import { usePlayerStore } from "@/lib/store/player";
import { useHistoryStore } from "@/lib/store/history";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NotLogged from "@/components/NotLogged";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const LAST_N = 10;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function MePage() {
  const { currentPlayer, logout } = usePlayerStore();
  const { results } = useHistoryStore();

  const myGames = currentPlayer
    ? results
        .filter((r) => r.playerName === currentPlayer.name)
        .slice(0, LAST_N)
    : [];

  if (!currentPlayer) {
    return <NotLogged />;
  }

  return (
    <motion.main
      className="h-full text-white flex flex-col flex-1 min-h-0"
      initial="hidden"
      animate="visible"
    >
      <motion.header
        className="flex justify-between items-center mb-8"
        variants={headerVariants}
      >
        <h1 className="text-2xl font-display">Your profile</h1>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </motion.header>

      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
      >
        <h2 className="text-xl font-display mb-2">
          Playing as: {currentPlayer.name}
        </h2>
        <Button onClick={logout}>Log out</Button>
      </motion.section>

      <section className="flex-1 flex flex-col min-h-0">
        <motion.h3
          className="text-lg font-display mb-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        >
          Your last {LAST_N} games
        </motion.h3>

        {myGames.length === 0 ? (
          <motion.p
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.25 }}
          >
            No games yet. Go play your first round!
          </motion.p>
        ) : (
          <motion.div
            className="flex-1 overflow-y-auto space-y-2 pointer-events-auto"
            variants={listVariants}
          >
            {myGames.map((g) => (
              <motion.div
                key={g.id}
                variants={itemVariants}
                className="flex items-center justify-between rounded-lg bg-muted/40 border border-border px-3 py-2 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span>Score: {g.score}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide rounded-full bg-muted/60 px-2 py-0.5">
                      <Image
                        src={
                          g.country === "us" ? "/flags/us.png" : "/flags/it.png"
                        }
                        alt={g.country.toUpperCase()}
                        width={24}
                        height={24}
                        className="w-3 h-3 rounded-[2px]"
                      />
                      {g.country.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {g.correctAnswers}/{g.totalQuestions} correct
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {new Date(g.createdAt).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </motion.main>
  );
}
