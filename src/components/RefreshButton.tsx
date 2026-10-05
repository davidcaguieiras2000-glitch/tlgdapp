import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

const INTERVAL = 30;

/** Animated refresh button that auto-refreshes every 30 seconds. */
export function RefreshButton({ variant = "secondary", className, onRefresh }: { variant?: "secondary" | "ghost"; className?: string; onRefresh?: () => void }) {
  const [left, setLeft] = useState(INTERVAL);
  const [spinning, setSpinning] = useState(false);
  const [time, setTime] = useState("");

  const refresh = useCallback(() => {
    setSpinning(true);
    setLeft(INTERVAL);
    onRefresh?.();
    setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    window.setTimeout(() => setSpinning(false), 900);
  }, [onRefresh]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    const id = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => { if (left <= 0) refresh(); }, [left, refresh]);

  return (
    <Button variant={variant} onClick={refresh} className={cn("relative overflow-hidden", className)} title={time ? `Atualizado às ${time}` : undefined}>
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transition-[width] duration-1000 ease-linear" style={{ width: `${(left / INTERVAL) * 100}%` }} />
      <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span>
      <RefreshCw size={17} className={cn("transition-transform", spinning && "animate-spin")} />
      Atualizar <small className="font-normal text-muted-foreground tabular-nums">{left}s</small>
    </Button>
  );
}
