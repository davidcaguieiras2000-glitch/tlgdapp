import { cityCoordinates } from "./tlgd-data";

export const DIESEL_PRICE = 5.98;
export const BUS_KM_PER_LITER = 3;
export const MAINTENANCE_PER_KM = 0.55;
export const TOLL_PER_KM = 0.16;

const normalizeCity = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

export function getCityPoint(city: string) {
  return cityCoordinates[normalizeCity(city)];
}

export function costsForKm(km: number) {
  const liters = km / BUS_KM_PER_LITER;
  return { km, liters, fuel: liters * DIESEL_PRICE, toll: km * TOLL_PER_KM, maintenance: km * MAINTENANCE_PER_KM };
}

export function estimateRoute(origin: string, destination: string) {
  const start = getCityPoint(origin);
  const end = getCityPoint(destination);
  if (!start || !end) return undefined;
  const R = 6371;
  const dLat = (end.lat - start.lat) * Math.PI / 180;
  const dLng = (end.lng - start.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const km = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.18);
  return { start, end, ...costsForKm(km) };
}
