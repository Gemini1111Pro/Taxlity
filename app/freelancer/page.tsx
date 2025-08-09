"use client";
import { useEffect, useMemo, useState } from "react";
import { FiscalYears, Country } from "@/lib/fiscal-years";
import { loadTaxConfig } from "@/lib/tax-config";
import { computeFreelancer } from "@/lib/tax-engine";

export default function FreelancerPage(){
  const [country, setCountry] = useState<Country>("us");
  const [fy, setFy] = useState(0);
  const [params, setParams] = useState<any|null>(null);
  const [net, setNet] = useState(80000);
  const [w2, setW2] = useState(0);
  const [fs, setFs] = useState<"single"|"married_joint"|"married_separate"|"hoh">("single");
  const [qbi, setQBI] = useState(true);

  useEffect(()=>{
    const sel = FiscalYears[country][fy] ?? FiscalYears[country][0];
    loadTaxConfig(country, sel.taxYear).then(setParams);
  }, [country, fy]);

  const out = useMemo(()=>{
    if(!params) return null;
    return computeFreelancer({ filingStatus: fs, taxYear: (FiscalYears[country][fy]||{taxYear:2025}).taxYear, netIncome: net, w2Wages: w2, qbi }, params);
  }, [params, fs, net, w2, qbi, country, fy]);

  const cur = params?.currency?.symbol || "$";

  return (
    <div className="container py-10 space-y-6">
      <h1 className="h1">Freelancer Tax Calculator</h1>
      <p className="sub">Federal/national only. Local currency shown.</p>

      <section className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span>Country</span>
          <select value={country} onChange={e=>setCountry(e.target.value as Country)}>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="pk">Pakistan</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>Financial Year</span>
          <select value={fy} onChange={e=>setFy(Number(e.target.value))}>
            {FiscalYears[country].map((f,i)=>(<option value={i} key={i}>{f.label}</option>))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>Filing status</span>
          <select value={fs} onChange={e=>setFs(e.target.value as any)}>
            <option value="single">Single</option>
            <option value="married_joint">Married filing jointly</option>
            <option value="married_separate">Married filing separately</option>
            <option value="hoh">Head of household</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>Net self‑employment income</span>
          <input type="number" value={net} onChange={e=>setNet(Number(e.target.value)||0)} />
        </label>
        <label className="flex flex-col gap-1">
          <span>W‑2 wages (optional, US)</span>
          <input type="number" value={w2} onChange={e=>setW2(Number(e.target.value)||0)} />
        </label>
        <label className="flex items-center gap-2 mt-6">
          <input type="checkbox" checked={qbi} onChange={e=>setQBI(e.target.checked)} />
          <span>Apply QBI (simplified)</span>
        </label>
      </section>

      <section className="card">
        {!out? <div>Loading rules…</div> : (
          <div className="grid sm:grid-cols-2 gap-2">
            <div>Total tax: <b>{cur}{out.totalTax.toFixed(2)}</b></div>
            <div>Federal income tax: {cur}{out.federalIncomeTax.toFixed(2)}</div>
            <div>Self-employment tax: {cur}{out.selfEmploymentTax.toFixed(2)}</div>
            <div>Additional Medicare: {cur}{out.additionalMedicareTax.toFixed(2)}</div>
            <div>QBI deduction: −{cur}{out.qbiDeduction.toFixed(2)}</div>
            <div>Effective rate: {(out.effectiveRate*100).toFixed(2)}%</div>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-4">Method: progressive federal brackets + SE tax (SS/Medicare), Additional Medicare where applicable, simplified QBI. Informational only.</p>
      </section>
    </div>
  );
}
