import { createServerFn } from "@tanstack/react-start";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

type Point = { lat: number; lng: number };

function headers() {
  const lovable = process.env['LOVABLE_API_KEY'];
  const maps = process.env['GOOGLE_MAPS_API_KEY'];
  if (!lovable || !maps) throw new Error("Credenciais do Google Maps ausentes");
  return { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": maps };
}

async function searchPlace(text: string): Promise<{ point: Point; label: string } | undefined> {
  const res = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json", "X-Goog-FieldMask": "places.formattedAddress,places.location" },
    body: JSON.stringify({ textQuery: text, regionCode: "BR", languageCode: "pt-BR", pageSize: 1 }),
  });
  if (!res.ok) { console.error(`searchText [${res.status}]: ${await res.text()}`); return undefined; }
  const p = ((await res.json()) as { places?: { formattedAddress: string; location: { latitude: number; longitude: number } }[] }).places?.[0];
  return p ? { point: { lat: p.location.latitude, lng: p.location.longitude }, label: p.formattedAddress } : undefined;
}

async function geocode(address: string): Promise<{ point: Point; label: string }> {
  const res = await fetch(
    `${GATEWAY_URL}/maps/api/geocode/json?address=${encodeURIComponent(address)}&region=br&components=country:BR&language=pt-BR`,
    { headers: headers() },
  );
  if (!res.ok) throw new Error(`Falha ao localizar endereço [${res.status}]: ${await res.text()}`);
  const data = (await res.json()) as {
    status: string;
    results?: { formatted_address: string; types: string[]; partial_match?: boolean; geometry: { location: Point } }[];
  };
  const first = data.results?.[0];
  // Too broad (state/country) or fuzzy: look up the place itself (terminals, companies, landmarks).
  const vague = !first || first.partial_match || first.types.some((t) => t === "administrative_area_level_1" || t === "country");
  if (vague) {
    const place = await searchPlace(address);
    if (place) return place;
  }
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
    const ll = (p: Point) => ({ location: { latLng: { latitude: p.lat, longitude: p.lng } } });
    type R = { distanceMeters?: number; duration?: string; legs?: { startLocation?: { latLng?: { latitude: number; longitude: number } }; endLocation?: { latLng?: { latitude: number; longitude: number } } }[] };
    const compute = async (origin: object, destination: object): Promise<R | undefined> => {
      const res = await fetch(`${GATEWAY_URL}/routes/directions/v2:computeRoutes`, {
        method: "POST",
        headers: { ...headers(), "Content-Type": "application/json", "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.legs.startLocation,routes.legs.endLocation" },
        body: JSON.stringify({ origin, destination, travelMode: "DRIVE", regionCode: "BR", languageCode: "pt-BR" }),
      });
      if (!res.ok) { console.error(`computeRoutes [${res.status}]: ${await res.text()}`); return undefined; }
      const json = (await res.json()) as { routes?: R[] };
      return json.routes?.[0]?.distanceMeters ? json.routes[0] : undefined;
    };
    // Route between resolved points; fall back to Google's address resolution.
    const route =
      (await compute(ll(o.point), ll(d.point))) ??
      (await compute({ address: `${o.label}` }, { address: `${d.label}` }));
    if (!route?.distanceMeters) throw new Error("Não foi encontrada rota rodoviária entre os endereços. Tente incluir cidade e estado (ex: Cuiabá, MT).");
    const leg = route.legs?.[0];
    const toPoint = (x: { latitude: number; longitude: number } | undefined, f: Point) => (x ? { lat: x.latitude, lng: x.longitude } : f);
    o.point = toPoint(leg?.startLocation?.latLng, o.point);
    d.point = toPoint(leg?.endLocation?.latLng, d.point);
    return {
      start: o.point,
      end: d.point,
      originLabel: o.label,
      destinationLabel: d.label,
      km: Math.round(route.distanceMeters / 1000),
      hours: parseInt(route.duration ?? "0", 10) / 3600,
    };
  });
