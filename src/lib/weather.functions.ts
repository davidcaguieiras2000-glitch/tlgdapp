import { createServerFn } from "@tanstack/react-start";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";
const CITIES = [
  ["São Paulo", -23.5505, -46.6333], ["Rio de Janeiro", -22.9068, -43.1729], ["Belo Horizonte", -19.9167, -43.9345],
  ["Curitiba", -25.4284, -49.2733], ["Brasília", -15.7939, -47.8828], ["Salvador", -12.9777, -38.5016],
] as const;
const TTL = 10 * 60 * 1000;

export type CityWeather = { city: string; temp: number | null; text: string; rain: number | null; wind: number | null };
let cache: { at: number; data: CityWeather[] } | undefined;

export const getWeather = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < TTL) return { updatedAt: cache.at, cities: cache.data };
  const lovable = process.env["LOVABLE_API_KEY"];
  const maps = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovable || !maps) throw new Error("Credenciais do Google Maps ausentes");
  const data = await Promise.all(CITIES.map(async ([city, lat, lng]): Promise<CityWeather> => {
    const res = await fetch(`${GATEWAY_URL}/weather/v1/currentConditions:lookup?location.latitude=${lat}&location.longitude=${lng}&languageCode=pt-BR`, {
      headers: { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": maps },
    });
    if (!res.ok) { console.error(`weather [${res.status}]: ${await res.text()}`); return { city, temp: null, text: "Indisponível", rain: null, wind: null }; }
    const j = (await res.json()) as { temperature?: { degrees?: number }; weatherCondition?: { description?: { text?: string } }; precipitation?: { probability?: { percent?: number } }; wind?: { speed?: { value?: number } } };
    return { city, temp: j.temperature?.degrees ?? null, text: j.weatherCondition?.description?.text ?? "—", rain: j.precipitation?.probability?.percent ?? null, wind: j.wind?.speed?.value ?? null };
  }));
  cache = { at: Date.now(), data };
  return { updatedAt: cache.at, cities: data };
});
