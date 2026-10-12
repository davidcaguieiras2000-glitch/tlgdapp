import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { loadGoogleMaps } from "./GoogleRouteMap";

type Layer = { setMap: (m: unknown) => void };
type MapsWithTraffic = { Map: new (el: HTMLElement, o: Record<string, unknown>) => unknown; TrafficLayer: new () => Layer };

/** Google Maps with live traffic layer, re-fetched every 30 seconds. */
export function TrafficMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    let active = true;
    let id: number | undefined;
    loadGoogleMaps().then(() => {
      if (!active || !ref.current || !window.google?.maps) return;
      const maps = window.google.maps as unknown as MapsWithTraffic;
      const map = new maps.Map(ref.current, { center: { lat: -22.9, lng: -45.5 }, zoom: 6, clickableIcons: false, mapTypeControl: true, streetViewControl: false, fullscreenControl: false });
      let layer = new maps.TrafficLayer();
      layer.setMap(map);
      const stamp = () => setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      stamp();
      id = window.setInterval(() => { layer.setMap(null); layer = new maps.TrafficLayer(); layer.setMap(map); stamp(); }, 30000);
    }).catch(() => active && setFailed(true));
    return () => { active = false; if (id) window.clearInterval(id); };
  }, []);

  if (failed) return <div className="grid h-80 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground"><div className="text-center"><MapPin className="mx-auto mb-2 text-primary" />Mapa de trânsito indisponível</div></div>;
  return (
    <div>
      <div ref={ref} aria-label="Mapa de trânsito em tempo real" className="h-80 overflow-hidden rounded-lg border border-border bg-secondary" />
      <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 animate-pulse rounded-full bg-success" />Trânsito ao vivo do Google Maps · verde livre, amarelo moderado, vermelho lento{time && ` · atualizado às ${time}`}</p>
    </div>
  );
}
