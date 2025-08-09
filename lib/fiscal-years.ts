export type Country = "us"|"uk"|"ca"|"au"|"pk";
export const FiscalYears: Record<Country, { label:string; taxYear:number }[]> = {
  us: [{ label: "Tax Year 2025", taxYear: 2025 }],
  uk: [{ label: "FY 2025/26", taxYear: 2026 }],
  ca: [{ label: "Tax Year 2025", taxYear: 2025 }],
  au: [{ label: "FY 2025/26", taxYear: 2026 }],
  pk: [{ label: "FY 2026/27", taxYear: 2027 }],
};
