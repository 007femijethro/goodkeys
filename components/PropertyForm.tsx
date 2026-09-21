"use client";
import { FormEvent, useMemo, useState } from "react";
import { Building2, LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const n=(v:string)=>Number(v.replace(/,/g,""))||0;
const money=(v:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(v);

export default function PropertyForm(){
 const router=useRouter();
 const [form,setForm]=useState({
  title:"",propertyType:"Apartment",description:"",bedrooms:"2",bathrooms:"2",toilets:"2",
  state:"Lagos",lga:"",area:"",streetAddress:"",annualRent:"",agencyFee:"",legalFee:"",
  cautionFee:"",serviceCharge:"",inspectionFee:"",otherCharges:"",parkingSpaces:"0",
  availableFrom:"",imageUrls:"",amenities:"",furnished:false,serviced:false
 });
 const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 const total=useMemo(()=>["annualRent","agencyFee","legalFee","cautionFee","serviceCharge","inspectionFee","otherCharges"].reduce((s,k)=>s+n(form[k as keyof typeof form] as string),0),[form]);
 function set(key:string,value:string|boolean){setForm(f=>({...f,[key]:value}));}
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");
  try{
   const payload={...form,bedrooms:n(form.bedrooms),bathrooms:n(form.bathrooms),toilets:n(form.toilets),parkingSpaces:n(form.parkingSpaces),
    annualRent:n(form.annualRent),agencyFee:n(form.agencyFee),legalFee:n(form.legalFee),cautionFee:n(form.cautionFee),serviceCharge:n(form.serviceCharge),
    inspectionFee:n(form.inspectionFee),otherCharges:n(form.otherCharges),
    imageUrls:form.imageUrls.split("\n").map(x=>x.trim()).filter(Boolean),amenities:form.amenities.split(",").map(x=>x.trim()).filter(Boolean)};
   const r=await fetch("/api/properties",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const d=await r.json();if(!r.ok)throw new Error(d.message);router.push("/agent/properties?created=1");router.refresh();
  }catch(e){setError(e instanceof Error?e.message:"Unable to create property");}finally{setBusy(false);}
 }
 const input=(key:keyof typeof form,label:string,opts?:{type?:string,placeholder?:string})=><label>{label}<input type={opts?.type??"text"} value={String(form[key])} onChange={e=>set(key,e.target.value)} placeholder={opts?.placeholder}/></label>;
 return <form className="panel-card form-grid property-form" onSubmit={submit}>
  <div className="form-section-heading form-span-2"><div><h2>New property listing</h2><p>The listing will be sent to GoodKeys admin review before it becomes public.</p></div><Building2 /></div>
  <h3 className="form-group-title form-span-2">Property details</h3>
  <label className="form-span-2">Listing title<input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Modern 3 Bedroom Apartment" required /></label>
  <label>Property type<select value={form.propertyType} onChange={e=>set("propertyType",e.target.value)}><option>Apartment</option><option>Duplex</option><option>Terrace</option><option>Detached</option><option>Semi-detached</option><option>Studio</option><option>Self-contained</option><option>Commercial</option></select></label>
  {input("bedrooms","Bedrooms",{type:"number"})}{input("bathrooms","Bathrooms",{type:"number"})}{input("toilets","Toilets",{type:"number"})}{input("parkingSpaces","Parking spaces",{type:"number"})}
  <label className="form-span-2">Description<textarea rows={5} value={form.description} onChange={e=>set("description",e.target.value)} required /></label>

  <h3 className="form-group-title form-span-2">Location</h3>
  {input("state","State")}{input("lga","LGA")}{input("area","Area")}{input("streetAddress","Street address")}
  {input("availableFrom","Available from",{type:"date"})}

  <h3 className="form-group-title form-span-2">Pricing</h3>
  {input("annualRent","Annual rent (₦)",{placeholder:"2500000"})}{input("agencyFee","Agency fee (₦)")}{input("legalFee","Legal fee (₦)")}{input("cautionFee","Caution fee (₦)")}{input("serviceCharge","Service charge (₦)")}{input("inspectionFee","Inspection fee (₦)")}{input("otherCharges","Other charges (₦)")}
  <div className="movein-preview"><span>Estimated move-in cost</span><strong>{money(total)}</strong></div>

  <h3 className="form-group-title form-span-2">Features & images</h3>
  <label className="check-field"><input type="checkbox" checked={form.furnished} onChange={e=>set("furnished",e.target.checked)}/> Furnished</label>
  <label className="check-field"><input type="checkbox" checked={form.serviced} onChange={e=>set("serviced",e.target.checked)}/> Serviced</label>
  <label className="form-span-2">Amenities, comma separated<input value={form.amenities} onChange={e=>set("amenities",e.target.value)} placeholder="Security, Parking, Prepaid Meter, Running Water" /></label>
  <label className="form-span-2">Image URLs, one per line<textarea rows={5} value={form.imageUrls} onChange={e=>set("imageUrls",e.target.value)} placeholder={"https://...\nhttps://..."} /></label>
  {error&&<div className="auth-alert auth-alert-error form-span-2">{error}</div>}
  <div className="form-actions form-span-2"><button className="button" disabled={busy}>{busy?<><LoaderCircle className="spin-icon" size={17}/>Submitting...</>:<><Send size={17}/>Submit for review</>}</button></div>
 </form>
}
