"use client";

import { Button } from "@/components/ui/button";
import { ChartCountry } from "@/lib/store/settings";
import { cn } from "@/lib/utils";

type Props = {
  country: ChartCountry;
  selected: boolean;
  onSelect: (country: ChartCountry) => void;
  flagSrc: string;
  label: string;
  className?: string;
};

export function ChartCountryButton({
  country,
  selected,
  onSelect,
  flagSrc,
  label,
  className,
}: Props) {
  return (
    <Button
      type="button"
      onClick={() => onSelect(country)}
      aria-pressed={selected}
      aria-label={label}
      className={cn(
        "relative h-12 aspect-square rounded-full overflow-hidden bg-cover bg-center border transition-transform pointer-events-auto",
        selected
          ? "border-white shadow-lg scale-[1.03]"
          : "border-border opacity-70",
        className
      )}
      style={{
        backgroundImage: `url('${flagSrc}')`,
      }}
    >
      {/* accessible text */}
      <span className="sr-only">{label}</span>

      {/* dark overlay when not selected */}
      {!selected && (
        <span className="absolute inset-0 bg-black/35 pointer-events-none" />
      )}
    </Button>
  );
}
