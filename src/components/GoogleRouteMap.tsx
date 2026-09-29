import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

export type RoutePoint = { lat: number; lng: number };

declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (element: HTMLElement, options: Record<string, unknown>) => { fitBounds: (bounds: unknown, padding?: number) => void };
        Marker: new (options: Record<string, unknown>) => unknown;
        Polyline: new (options: Record<string, unknown>) => { setMap: (map: unknown) => void };
        LatLngBounds: new () => { extend: (point: RoutePoint) => void };
      };
    };
    initTlgdMap?: () => void;
  }
}

let mapsPromise: Promise<void> | undefined;

function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise((resolve, reject) => {
    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
    if (!key) {
      reject(new Error("Chave do mapa não configurada"));
      return;
    }
    window.initTlgdMap = () => resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&callback=initTlgdMap&channel=${encodeURIComponent(channel ?? "tlgd")}`;
    script.async = true;
    script.onerror = () => reject(new Error("Não foi possível carregar o mapa"));
    document.head.appendChild(script);
  });
  return mapsPromise;
}

export function GoogleRouteMap({ origin, destination }: { origin?: RoutePoint; destination?: RoutePoint }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadGoogleMaps().then(() => {
      if (!active || !elementRef.current || !window.google?.maps) return;
      const maps = window.google.maps;
      const map = new maps.Map(elementRef.current, {
        center: origin ?? { lat: -14.235, lng: -51.9253 },
        zoom: origin ? 7 : 4,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      });
      if (!origin || !destination) return;
      new maps.Marker({ map, position: origin, label: "A", title: "Origem" });
      new maps.Marker({ map, position: destination, label: "B", title: "Destino" });
      new maps.Polyline({
        map,
        path: [origin, destination],
        geodesic: true,
        strokeColor: "#f97316",
        strokeOpacity: 1,
        strokeWeight: 5,
      });
      const bounds = new maps.LatLngBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      map.fitBounds(bounds, 56);
    }).catch(() => active && setFailed(true));
    return () => { active = false; };
  }, [origin, destination]);

  if (failed) return <div className="grid h-72 place-items-center rounded-lg border border-border bg-secondary text-center text-muted-foreground"><div><MapPin className="mx-auto mb-2 text-primary"/>Mapa temporariamente indisponível</div></div>;
  return <div ref={elementRef} aria-label="Mapa da rota planejada" className="h-72 overflow-hidden rounded-lg border border-border bg-secondary" />;
}