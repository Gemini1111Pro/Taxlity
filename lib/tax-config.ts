import type { Country } from "@/lib/fiscal-years";
export async function loadTaxConfig(country: Country, year: number){
  const key = `${country}-${year}`;
  const map: Record<string, any> = {
    "us-2025": () => import("@/config/tax/us/2025.json"),
    "uk-2026": () => import("@/config/tax/uk/2026.json"),
    "ca-2025": () => import("@/config/tax/ca/2025.json"),
    "au-2026": () => import("@/config/tax/au/2026.json"),
    "pk-2027": () => import("@/config/tax/pk/2027.json"),
  };
  const loader = map[key] || map[`${country}-2025`] || map["us-2025"];
  return (await loader()).default;
}
