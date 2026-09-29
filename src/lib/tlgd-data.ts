export const routes = [
  { id: 1, from: "Curitiba", to: "Florianópolis", km: 300, hours: 4, cost: 897.4, status: "Planejada" },
  { id: 2, from: "Recife", to: "Maceió", km: 284, hours: 4, cost: 843.57, status: "Planejada" },
  { id: 3, from: "São Paulo", to: "Rio de Janeiro", km: 429, hours: 6, cost: 1312.11, status: "Em andamento" },
  { id: 4, from: "Belo Horizonte", to: "Brasília", km: 716, hours: 10, cost: 2109.23, status: "Concluída" },
];

export const fuels = [
  { name: "Diesel", price: "5,98", change: "+0,3%", tone: "warning" },
  { name: "Diesel S10", price: "6,15", change: "+0,2%", tone: "warning" },
  { name: "Gasolina", price: "6,19", change: "-0,5%", tone: "success" },
  { name: "Etanol", price: "3,89", change: "-1,2%", tone: "info" },
];

export const tolls = [
  ["Queimados", "APPI", "Rio de Janeiro", "14,50"], ["Simão Pereira", "Rota", "Minas Gerais", "17,50"],
  ["Guará", "Econorte", "Rio de Janeiro", "16,80"], ["Itu", "Autoban", "São Paulo", "15,40"],
  ["Limeira", "Anhanguera", "São Paulo", "15,40"], ["Juquitiba", "Rota do Mar", "São Paulo", "13,80"],
  ["Balsa Nova", "Via Sul", "Paraná", "12,90"],
];

export const demand = [
  ["06:00 — 09:00", "Manhã", "Pico alto", "high", "Deslocamentos executivos e viagens intermunicipais de ida"],
  ["12:00 — 14:00", "Tarde", "Pico médio", "high", "Horário de almoço, fretamentos e viagens curtas"],
  ["17:00 — 20:00", "Tarde/Noite", "Pico alto", "high", "Retorno para casa e início de viagens interestaduais noturnas"],
  ["22:00 — 23:59", "Noite", "Pico médio", "high", "Saída de ônibus interestaduais leito e semi-leito"],
  ["01:00 — 05:00", "Madrugada", "Baixa demanda", "low", "Poucas viagens programadas, ideal para manutenção"],
  ["09:00 — 12:00", "Manhã/Tarde", "Baixa demanda", "low", "Janela de menor movimento para revisões preventivas"],
];

export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "belo horizonte": { lat: -19.9167, lng: -43.9345 },
  "brasilia": { lat: -15.7939, lng: -47.8828 },
  "curitiba": { lat: -25.4284, lng: -49.2733 },
  "espirito santo": { lat: -20.3155, lng: -40.3128 },
  "florianopolis": { lat: -27.5954, lng: -48.548 },
  "maceio": { lat: -9.6498, lng: -35.7089 },
  "porto alegre": { lat: -30.0346, lng: -51.2177 },
  "recife": { lat: -8.0476, lng: -34.877 },
  "rio de janeiro": { lat: -22.9068, lng: -43.1729 },
  "salvador": { lat: -12.9777, lng: -38.5016 },
  "sao paulo": { lat: -23.5505, lng: -46.6333 },
  "vitoria": { lat: -20.3155, lng: -40.3128 },
};
