import Script from "next/script";
export default function SeoJsonLd({ json }:{ json: object }){
  return <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(json)}} />
}
