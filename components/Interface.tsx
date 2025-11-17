import { Button } from "./ui/button";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { Logo } from "./Logo";

export const Interface = () => {
  return (
    <div className="absolute inset-0 p-8 pointer-events-none z-100">
      <header className="flex flex-row justify-between w-full">
        <Logo clickable size={40} />
        <Button
          asChild
          className="pointer-cursor pointer-events-auto aspect-square w-12 h-12"
        >
          <Link href="/leaderboard">
            <Trophy height={24} width={24} />
          </Link>
        </Button>
      </header>
    </div>
  );
};
