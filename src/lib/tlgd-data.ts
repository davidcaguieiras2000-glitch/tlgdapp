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
