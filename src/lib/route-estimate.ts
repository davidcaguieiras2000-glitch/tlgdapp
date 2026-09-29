import { cityCoordinates } from "./tlgd-data";

export const DIESEL_PRICE = 5.98;
export const BUS_KM_PER_LITER = 3;
export const MAINTENANCE_PER_KM = 0.55;
export const TOLL_PER_KM = 0.16;

const normalizeCity = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

export function getCityPoint(city: string) {
  return cityCoordinates[normalizeCity(city)];
}

export function estimateRoute(origin: string, destination: string) {
  const start = getCityPoint(origin);
  const end = getCityPoint(destination);
  if (!start || !end) return undefined;

  const earthRadiusKm = 6371;
  const dLat = (end.lat - start.lat) * Math.PI / 180;
  const dLng = (end.lng - start.lng) * Math.PI / 180;
  const lat1 = start.lat * Math.PI / 180;
  const lat2 = end.lat * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const directKm = earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = Math.round(directKm * 1.18);
  const liters = km / BUS_KM_PER_LITER;
  const fuel = liters * DIESEL_PRICE;
  const toll = km * TOLL_PER_KM;
  const maintenance = km * MAINTENANCE_PER_KM;
  return { start, end, km, liters, fuel, toll, maintenance };
}