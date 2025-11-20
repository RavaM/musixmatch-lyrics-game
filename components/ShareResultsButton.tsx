"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ShareResultsProps = {
  score: number;
  totalQuestions: number;
  country: "us" | "it";
};

export function ShareResultsButton({
  score,
  totalQuestions,
  country,
}: ShareResultsProps) {
  const shareText = `
    🎵 Who Sings? — My Results
    Score: ${score}
    Country: ${country.toUpperCase()} ${country === "it" ? "🇮🇹" : "🇺🇸"}

    Think you can beat me?
  `;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Who Sings — My Results",
          text: shareText,
          url: window.location.origin,
        });
        return;
      } catch (err) {
        console.error("Share failed", err);
      }
    }

    try {
      await navigator.clipboard.writeText(shareText.trim());
      toast("Copied!", {
        description: "Results copied to clipboard.",
      });
    } catch (err) {
      toast("Error", {
        description: "Could not copy to clipboard.",
      });
    }
  };

  return (
    <Button onClick={handleShare} className="mt-4 w-full">
      Share Results ✦
    </Button>
  );
}
