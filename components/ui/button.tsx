import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/hooks/useSound";

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-0 focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer pointer-events-auto hover:scale-[1.03] hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] before:absolute before:inset-0 before:rounded-md before:border before:border-white/0 before:transition-all before:pointer-events-none hover:before:border-white/40",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-transparent shadow-sm backdrop-blur-xl",
        success:
          "border border-emerald-500 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
        destructive:
          "border border-red-500 bg-red-500/10 text-red-300 hover:bg-red-500/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  silentClick?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      onClick,
      silentClick = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { playClick } = useSound();

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (!props.disabled && !silentClick) {
        playClick();
      }
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        tabIndex={0}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
