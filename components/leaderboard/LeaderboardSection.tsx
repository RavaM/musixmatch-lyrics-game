import { ChartCountry } from "@/lib/store/settings";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

type LeaderboardEntry = {
  name: string;
  bestScore: number;
  gamesPlayed: number;
  country: ChartCountry;
};

type LeaderboardSectionProps = {
  title: string;
  flagSrc: string;
  emptyText: string;
  entries: LeaderboardEntry[];
  delay: number;
  currentPlayerName?: string | null;
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

export const LeaderboardSection = ({
  title,
  flagSrc,
  emptyText,
  entries,
  delay,
  currentPlayerName,
}: LeaderboardSectionProps) => {
  return (
    <section>
      <motion.div
        className="flex items-center gap-2 mb-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay }}
      >
        <img src={flagSrc} alt={title} className="w-5 h-5 rounded-[2px]" />
        <h2 className="text-lg font-display">{title}</h2>
      </motion.div>

      {entries.length === 0 ? (
        <p className="text-muted-foreground text-xs">{emptyText}</p>
      ) : (
        <motion.ol
          className="space-y-2"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {entries.map((entry, index) => {
            const isCurrent =
              currentPlayerName &&
              entry.name.toLowerCase() === currentPlayerName.toLowerCase();

            return (
              <motion.li
                key={`${entry.name}-${entry.country}`}
                variants={itemVariants}
                className={cn(
                  "flex justify-between items-center bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm",
                  isCurrent && "border-[#FF6050]/80 bg-[#FF6050]/5"
                )}
              >
                <span>
                  #{index + 1} {entry.name}
                  {isCurrent && (
                    <span className="text-[11px] text-[#FF6050] ml-1">
                      (you)
                    </span>
                  )}
                  {entry.gamesPlayed > 1 && (
                    <span className="ml-2 text-[11px] text-muted-foreground">
                      · {entry.gamesPlayed} games
                    </span>
                  )}
                </span>
                <span className="font-mono">{entry.bestScore}</span>
              </motion.li>
            );
          })}
        </motion.ol>
      )}
    </section>
  );
};
