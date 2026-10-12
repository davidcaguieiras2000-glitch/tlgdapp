import { useCallback, useEffect, useState } from "react";
import { CloudSun, Droplets, Wind } from "lucide-react";
import { getWeather, type CityWeather } from "@/lib/weather.functions";

/** Current weather in main cities via Google Maps, refreshed every 10 minutes. */
export function WeatherPanel() {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [at, setAt] = useState("");
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    try { const r = await getWeather(); setCities(r.cities); setAt(new Date(r.updatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })); setError(false); }
    catch { setError(true); }
  }, []);
  useEffect(() => { void load(); const id = window.setInterval(load, 10 * 60 * 1000); return () => window.clearInterval(id); }, [load]);

  return (
    <div className="rounded-lg border border-border/70 bg-card p-5">
      <h3 className="mb-4 flex items-center gap-2 font-bold"><CloudSun className="text-primary" size={20} /> Tempo agora nas principais cidades</h3>
      {error && <p className="text-sm text-danger">Não foi possível carregar o tempo agora.</p>}
      {!error && !cities.length && <p className="animate-pulse text-sm text-muted-foreground">Carregando previsão…</p>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cities.map((c) => (
          <div key={c.city} className="rounded-md bg-secondary p-3 transition-transform hover:-translate-y-0.5">
            <b className="block text-sm">{c.city}</b>
            <span className="text-2xl font-bold">{c.temp != null ? `${Math.round(c.temp)}°C` : "—"}</span>
            <small className="block text-muted-foreground">{c.text}</small>
            <small className="mt-1 flex gap-3 text-muted-foreground"><span className="flex items-center gap-1"><Droplets size={12} />{c.rain ?? "—"}%</span><span className="flex items-center gap-1"><Wind size={12} />{c.wind ?? "—"} km/h</span></small>
          </div>
        ))}
      </div>
      {at && <p className="mt-3 text-xs text-muted-foreground">Dados do Google Maps · atualizado às {at} · nova consulta a cada 10 min</p>}
    </div>
  );
}
