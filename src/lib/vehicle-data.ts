export type Groups = Record<string, string[]>;

export const vehicleTypes: Groups = {
  "Rodoviário": ["Convencional", "Executivo", "Semi-leito", "Leito", "Leito-cama"],
  "Double Deck": ["DD Executivo/Leito", "DD Semi-leito/Leito-cama"],
  "Micro e Midi": ["Micro-ônibus", "Midiônibus"],
};

export const bodies: Groups = {
  Marcopolo: ["Paradiso G8 1800 DD", "Paradiso G8 1600 LD", "Paradiso G8 1350", "Paradiso G8 1200", "Viaggio G8 1050", "Volare W9"],
  Comil: ["Campione Invictus DD", "Campione Invictus 1200", "Campione 4.05 HD", "Campione 3.65"],
  Irizar: ["i8", "i6s", "i6", "i5"],
  Busscar: ["Vissta Buss DD", "Vissta Buss 400", "Vissta Buss 360", "El Buss 340"],
  Mascarello: ["Roma R6", "Roma R4", "Gran Micro"],
};

export const chassis: Groups = {
  "Mercedes-Benz": ["O 500 RSD 2542 (8x2)", "O 500 RSD 2442 (6x2)", "O 500 RS 1836", "O 500 R 1833"],
  Volvo: ["B450R 6x2", "B420R 6x2", "B380R 4x2"],
  Scania: ["K 440 6x2", "K 410 6x2", "K 360 4x2"],
  Volkswagen: ["Volksbus 18.330 OT", "Volksbus 17.260 OD", "Volksbus 9.160 OD"],
  Iveco: ["Bus 170S28", "Daily 70C17"],
};

export const roadTypes: Groups = {
  "Rodovias federais (BR)": ["BR pista dupla", "BR pista simples"],
  "Rodovias estaduais": ["Estadual pista dupla", "Estadual pista simples"],
  "Concessionadas": ["Autoestrada pedagiada"],
  "Vias urbanas e serra": ["Perímetro urbano", "Trecho de serra"],
  "Estradas vicinais": ["Vicinal pavimentada", "Estrada de terra"],
};

/** km/L for each vehicle model. */
export function kmPerLiterFor(vehicle: string) {
  if (vehicle.startsWith("DD")) return 2.4;
  if (vehicle === "Micro-ônibus") return 5.5;
  if (vehicle === "Midiônibus") return 4.2;
  return 3;
}

/** Multipliers applied to consumption, maintenance and toll by road type. */
export function roadFactors(road: string) {
  const map: Record<string, { fuel: number; maint: number; toll: number }> = {
    "BR pista dupla": { fuel: 1, maint: 1, toll: 1 },
    "BR pista simples": { fuel: 1.08, maint: 1.1, toll: 0.8 },
    "Estadual pista dupla": { fuel: 1, maint: 1, toll: 1.2 },
    "Estadual pista simples": { fuel: 1.08, maint: 1.1, toll: 0.8 },
    "Autoestrada pedagiada": { fuel: 0.95, maint: 0.95, toll: 1.6 },
    "Perímetro urbano": { fuel: 1.3, maint: 1.2, toll: 0 },
    "Trecho de serra": { fuel: 1.25, maint: 1.3, toll: 1 },
    "Vicinal pavimentada": { fuel: 1.12, maint: 1.2, toll: 0 },
    "Estrada de terra": { fuel: 1.3, maint: 1.6, toll: 0 },
  };
  return map[road] ?? { fuel: 1, maint: 1, toll: 1 };
}
