export type SalaryInputs = {
  country:"us"|"uk"|"ca"|"au"|"pk";
  annualGross:number;
  payFrequency:"annual"|"monthly"|"weekly"|"biweekly";
  filingStatus?:"single"|"married_joint"|"married_separate"|"hoh";
};
export type SalaryOutputs = {
  annual:{ incomeTax:number; socialTax:number; totalDeductions:number; netPay:number; effectiveTaxRate:number };
  perPeriod:{ amount:number };
  currencySymbol:string;
};

function progressiveTax(t:number, bs:{rate:number; upto:number|null}[]){
  let tax=0, prev=0;
  for(const b of bs){
    const cap=(b.upto??Infinity) as number;
    const chunk=Math.max(0, Math.min(t, cap)-prev);
    tax += chunk*b.rate; if(t<=cap) break; prev = cap;
  }
  return tax;
}

export function computeSalary(inputs:SalaryInputs, params:any):SalaryOutputs{
  const filing = inputs.filingStatus || "single";
  const cur = params?.currency?.symbol || "$";
  const std = (params.standard_deduction||{})[filing] ?? params?.salary?.allowances?.personal_allowance ?? 0;
  const brackets = (params.federal_brackets||params.income_tax||{})[filing] || (params.federal_brackets||params.income_tax||[]);
  const taxable = Math.max(0, inputs.annualGross - std);
  const incomeTax = progressiveTax(taxable, brackets);

  let social = 0; const s = params?.salary?.social||{};
  if(inputs.country==="us"){
    const ss = Math.min(inputs.annualGross, s.fica_ss_wage_base||0) * (s.fica_ss_rate ?? 0.062);
    const med = inputs.annualGross * (s.medicare_rate ?? 0.0145);
    const th = (s.addl_medicare_thresholds?.[filing] ?? s.addl_medicare_thresholds?.single) || 0;
    const addl = Math.max(0, inputs.annualGross - th) * (s.addl_medicare_addl_rate ?? 0.009);
    social = ss + med + addl;
  }
  if(inputs.country==="uk"){
    const ee = s.ee_ni_bands as {upto:number|null; rate:number}[]|undefined;
    if(ee) social = progressiveTax(inputs.annualGross, ee);
  }
  if(inputs.country==="ca"){
    const cpp = Math.min(inputs.annualGross, (s.cpp?.ympe||0)) * (s.cpp?.rate||0);
    const ei = Math.min(inputs.annualGross*(s.ei?.rate||0), s.ei?.max||Infinity);
    social = cpp + ei;
  }
  if(inputs.country==="au"){
    social = inputs.annualGross * (s.medicare_levy_rate || 0.02);
  }
  if(inputs.country==="pk"){
    social = 0;
  }

  const total = incomeTax + social;
  const net = Math.max(0, inputs.annualGross - total);
  const eff = inputs.annualGross ? total/inputs.annualGross : 0;
  const divisor = inputs.payFrequency==="annual"?1: inputs.payFrequency==="monthly"?12: inputs.payFrequency==="weekly"?52:26;

  return { annual:{ incomeTax, socialTax:social, totalDeductions: total, netPay: net, effectiveTaxRate: eff }, perPeriod:{ amount: net / divisor }, currencySymbol: cur };
}
