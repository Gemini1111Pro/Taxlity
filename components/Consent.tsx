"use client";
import { useEffect, useState } from "react";
export default function Consent() {
  const [ok, setOk] = useState(true);
  useEffect(()=>{ setOk(!!localStorage.getItem("consent-ok")); }, []);
  if(ok) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 bg-black text-white text-sm p-3 flex items-center justify-center gap-4 z-50">
      We use cookies for analytics/ads. By using this site you accept our policies.
      <button className="btn bg-white text-black" onClick={()=>{localStorage.setItem("consent-ok","1"); setOk(true);}}>OK</button>
    </div>
  );
}
