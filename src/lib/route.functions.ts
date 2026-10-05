import { createServerFn } from "@tanstack/react-start";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

type Point = { lat: number; lng: number };

function headers() {
  const lovable = process.env['LOVABLE_API_KEY'];
  const maps = process.env['GOOGLE_MAPS_API_KEY'];
  if (!lovable || !maps) throw new Error("Credenciais do Google Maps ausentes");
  return { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": maps };
}

async function geocode(address: string): Promise<{ point: Point; label: string }> {
  const res = await fetch(
    `${GATEWAY_URL}/maps/api/geocode/json?address=${encodeURIComponent(address)}&region=br&components=country:BR&language=pt-BR`,
    { headers: headers() },
  );
  if (!res.ok) throw new Error(`Falha ao localizar endereço [${res.status}]: ${await res.text()}`);
  const data = (await res.json()) as {
    status: string;
    results?: { formatted_address: string; geometry: { location: Point } }[];
  };
  const first = data.results?.[0];
  if (data.status !== "OK" || !first) throw new Error(`Endereço não encontrado: ${address}`);
  return { point: first.geometry.location, label: first.formatted_address };
}

export const planRoute = createServerFn({ method: "POST" })
  .inputValidator((input: { origin: string; destination: string }) => {
    const origin = String(input?.origin ?? "").trim();
    const destination = String(input?.destination ?? "").trim();
    if (origin.length < 2 || destination.length < 2 || origin.length > 200 || destination.length > 200) {
      throw new Error("Informe origem e destino válidos");
    }
    return { origin, destination };
  })
  .handler(async ({ data }) => {
    const [o, d] = await Promise.all([geocode(data.origin), geocode(data.destination)]);
    const res = await fetch(`${GATEWAY_URL}/routes/directions/v2:computeRoutes`, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: o.point.lat, longitude: o.point.lng } } },
        destination: { location: { latLng: { latitude: d.point.lat, longitude: d.point.lng } } },
        travelMode: "DRIVE",
      }),
    });
    if (!res.ok) throw new Error(`Falha ao calcular rota [${res.status}]: ${await res.text()}`);
    const json = (await res.json()) as { routes?: { distanceMeters?: number; duration?: string }[] };
    const route = json.routes?.[0];
    if (!route?.distanceMeters) throw new Error("Não foi encontrada rota rodoviária entre os endereços");
    return {
      start: o.point,
      end: d.point,
      originLabel: o.label,
      destinationLabel: d.label,
      km: Math.round(route.distanceMeters / 1000),
      hours: parseInt(route.duration ?? "0", 10) / 3600,
    };
  });
