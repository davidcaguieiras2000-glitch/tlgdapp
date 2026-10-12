import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { Card } from "./Ui";
import { TrafficMap } from "./TrafficMap";
import { WeatherPanel } from "./WeatherPanel";
import { RefreshButton } from "./RefreshButton";
import { cn } from "@/lib/utils";

const roads = [
  ["Via Dutra (BR-116)", "SP ↔ RJ"], ["Rod. dos Bandeirantes (SP-348)", "São Paulo"], ["Fernão Dias (BR-381)", "SP ↔ MG"],
  ["Régis Bittencourt (BR-116)", "SP ↔ PR"], ["Linha Vermelha", "Rio de Janeiro"], ["Freeway (BR-290)", "Porto Alegre"],
] as const;
const levels = ["Livre", "Moderado", "Lento", "Congestionado"] as const;
const tone = ["bg-success", "bg-info", "bg-warning", "bg-danger"];
const text = ["text-success", "text-info", "text-warning", "text-danger"];

const sample = () => roads.map(() => Math.floor(Math.random() * 4));

export function LiveTraffic() {
  const [state, setState] = useState<number[]>(() => roads.map((_, i) => i % 4));
  const tick = useCallback(() => setState(sample()), []);
  useEffect(() => { tick(); }, [tick]);
  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Activity className="animate-pulse text-primary" /> Trânsito agora</h2>
        <RefreshButton onRefresh={tick} />
      </div>
      <div className="mb-5 space-y-5"><TrafficMap/><WeatherPanel/></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {roads.map(([name, place], i) => {
          const lv = state[i] ?? 0;
          return (
            <div key={name} className="rounded-md bg-secondary p-4">
              <div className="flex items-center gap-3">
                <span className="relative flex size-3"><span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-70", tone[lv])} /><span className={cn("relative inline-flex size-3 rounded-full", tone[lv])} /></span>
                <div className="min-w-0 flex-1"><b className="block truncate text-sm">{name}</b><small className="text-muted-foreground">{place}</small></div>
                <span className={cn("text-xs font-bold", text[lv])}>{levels[lv]}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background"><div className={cn("h-full rounded-full transition-all duration-1000", tone[lv])} style={{ width: `${25 + lv * 25}%` }} /></div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span>Mapa com trânsito do Google Maps em tempo real; lista abaixo é demonstrativa.</span><Link to="/transito" className="text-primary">Ver tudo →</Link></div>
    </Card>
  );
}
