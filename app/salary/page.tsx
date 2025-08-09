"use client";
import { useEffect, useMemo, useState } from "react";
import { FiscalYears, Country } from "@/lib/fiscal-years";
import { loadTaxConfig } from "@/lib/tax-config";
import { computeSalary } from "@/lib/salary-engine";

export default function SalaryPage(){
  const [country, setCountry] = useState<Country>("us");
  const [fy, setFy] = useState(0);
  const [params, setParams] = useState<any|null>(null);
  const [gross, setGross] = useState(60000);
  const [freq, setFreq] = useState<"annual"|"monthly"|"weekly"|"biweekly">("monthly");
  const [fs, setFs] = useState<"single"|"married_joint"|"married_separate"|"hoh">("single");

  useEffect(()=>{
    const sel = FiscalYears[country][fy] ?? FiscalYears[country][0];
    loadTaxConfig(country, sel.taxYear).then(setParams);
  }, [country, fy]);

  const out = useMemo(()=>{
    if(!params) return null;
    return computeSalary({ country, annualGross: gross, payFrequency: freq, filingStatus: fs }, params);
  }, [params, country, gross, freq, fs]);

  const cur = out?.currencySymbol || (params?.currency?.symbol || "$");

  return (
    <div className="container py-10 space-y-6">
      <h1 className="h1">Salary Tax Calculator</h1>
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
        {(country==="us") && (
          <label className="flex flex-col gap-1">
            <span>Filing status</span>
            <select value={fs} onChange={e=>setFs(e.target.value as any)}>
              <option value="single">Single</option>
              <option value="married_joint">Married filing jointly</option>
              <option value="married_separate">Married filing separately</option>
              <option value="hoh">Head of household</option>
            </select>
          </label>
        )}
        <label className="flex flex-col gap-1">
          <span>Annual gross salary</span>
          <input type="number" value={gross} onChange={e=>setGross(Number(e.target.value)||0)} />
        </label>
        <label className="flex flex-col gap-1">
          <span>Pay frequency</span>
          <select value={freq} onChange={e=>setFreq(e.target.value as any)}>
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="weekly">Weekly</option>
            <option value="annual">Annual</option>
          </select>
        </label>
      </section>

      <section className="card">
        {!out? <div>Loading rules…</div> : (
          <div className="grid sm:grid-cols-2 gap-2">
            <div>Annual income tax: <b>{cur}{out.annual.incomeTax.toFixed(2)}</b></div>
            <div>Social contributions: {cur}{out.annual.socialTax.toFixed(2)}</div>
            <div>Total deductions: {cur}{out.annual.totalDeductions.toFixed(2)}</div>
            <div>Net annual pay: <b>{cur}{out.annual.netPay.toFixed(2)}</b></div>
            <div>Effective tax rate: {(out.annual.effectiveTaxRate*100).toFixed(2)}%</div>
            <div>Net per {freq}: <b>{cur}{out.perPeriod.amount.toFixed(2)}</b></div>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-4">Method: progressive federal brackets + basic social (FICA/NI/CPP/EI/Medicare levy where applicable). Informational only.</p>
      </section>
    </div>
  );
}
