export type FilingStatus = "single"|"married_joint"|"married_separate"|"hoh";
export type Inputs = { filingStatus:FilingStatus; taxYear:number; netIncome:number; w2Wages?:number; qbi?:boolean };
export type Outputs = { totalTax:number; federalIncomeTax:number; selfEmploymentTax:number; additionalMedicareTax:number; qbiDeduction:number; effectiveRate:number; notes:string[] };

function progressiveTax(t:number, brackets:{rate:number; upto:number|null}[]){
  let tax=0, prev=0;
  for(const b of brackets){
    const cap=(b.upto??Infinity) as number;
    const chunk=Math.max(0, Math.min(t, cap) - prev);
    tax += chunk * b.rate;
    if(t<=cap) break;
    prev = cap;
  }
  return tax;
}

export function computeFreelancer(inputs:Inputs, params:any):Outputs{
  const filing = inputs.filingStatus;
  const std = (params.standard_deduction||{})[filing] || 0;
  const addl = params.additional_medicare_thresholds || {};
  const addlBase = filing==="married_joint"?addl.married_filing_jointly: filing==="married_separate"?addl.married_filing_separately: filing==="hoh"?addl.head_of_household: addl.single || 0;

  const netSE = Math.max(0, inputs.netIncome * 0.9235);
  const w2 = inputs.w2Wages || 0;
  const ssCap = Math.max(0, (params.ssa_wage_base||0) - w2);
  const ss = Math.min(netSE, ssCap) * 0.124;
  const medicare = netSE * 0.029;
  const addlMed = Math.max(0, (w2 + netSE) - addlBase) * 0.009;
  const seTax = ss + medicare;

  const agi = Math.max(0, inputs.netIncome + w2 - seTax/2);
  const taxable = Math.max(0, agi - std);
  const brackets = (params.federal_brackets||{})[filing] || [];
  const fed = progressiveTax(taxable, brackets);

  const qbi = inputs.qbi ? Math.min(taxable*0.2, Math.max(0, inputs.netIncome)*0.2) : 0;
  const total = Math.max(0, fed + seTax + addlMed - qbi);
  const eff = (inputs.netIncome>0)? total/inputs.netIncome : 0;

  return { totalTax: total, federalIncomeTax: fed, selfEmploymentTax: seTax, additionalMedicareTax: addlMed, qbiDeduction: qbi, effectiveRate: eff, notes: [] };
}
