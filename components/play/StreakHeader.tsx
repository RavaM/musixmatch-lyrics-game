import { useGameStore } from "@/lib/store/game";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export const StreakHeader = () => {
  const { currentStreak, bestStreak } = useGameStore();
  return (
    <div className="flex justify-between items-center mb-4">
      <motion.div
        key={currentStreak}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex items-center gap-2 text-xs"
      >
        <span className="text-muted-foreground">Streak</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1">
          <Flame className="w-3 h-3 text-amber-400" />
          <span className="text-xs font-medium">{currentStreak}</span>
        </span>
      </motion.div>

      <span className="text-[11px] text-muted-foreground">
        Best streak: {bestStreak}
      </span>
    </div>
  );
};
