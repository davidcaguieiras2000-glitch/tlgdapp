import { useEffect, useState } from "react";

let cache: string[] | undefined;

/** Loads all Brazilian municipalities (IBGE public list) once per session. */
export function useBrazilCities() {
  const [cities, setCities] = useState<string[]>(cache ?? []);
  useEffect(() => {
    if (cache) return;
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome")
      .then((r) => r.json())
      .then((data: { nome: string; microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } } }[]) => {
        cache = data.map((m) => `${m.nome}, ${m.microrregiao?.mesorregiao?.UF?.sigla ?? ""}`.replace(/, $/, ""));
        setCities(cache);
      })
      .catch(() => {});
  }, []);
  return cities;
}
