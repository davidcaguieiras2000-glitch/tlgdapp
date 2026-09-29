import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children: ReactNode;
};

export function Button({ variant = "primary", className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-strong",
        variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-surface-raised",
        variant === "outline" && "border border-primary/45 bg-transparent text-primary hover:bg-primary/10",
        variant === "ghost" && "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
