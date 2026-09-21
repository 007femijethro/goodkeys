"use client";
import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";

export default function VerificationForm(){
 const [status,setStatus]=useState("unverified");
 const [idType,setIdType]=useState("National ID");
 const [idDocumentUrl,setIdDocumentUrl]=useState("");
 const [selfieUrl,setSelfieUrl]=useState("");
 const [notes,setNotes]=useState("");
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");

 useEffect(()=>{fetch("/api/agent/verification").then(r=>r.json()).then(d=>{if(d.verification?.verification_status)setStatus(d.verification.verification_status)}).catch(()=>{})},[]);

 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");setMessage("");
  try{const r=await fetch("/api/agent/verification",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idType,idDocumentUrl,selfieUrl,notes})});
  const d=await r.json();if(!r.ok)throw new Error(d.message);setStatus("pending");setMessage(d.message);}
  catch(e){setError(e instanceof Error?e.message:"Submission failed");}finally{setBusy(false);}
 }
 return <form className="panel-card form-grid" onSubmit={submit}>
   <div className="form-section-heading form-span-2"><div><h2>Identity verification</h2><p>For this MVP, provide secure document URLs. Direct file upload comes next.</p></div><span className={"status-badge status-"+status}>{status}</span></div>
   <label>ID type<select value={idType} onChange={e=>setIdType(e.target.value)}><option>National ID</option><option>Driver's Licence</option><option>International Passport</option><option>Voter's Card</option></select></label>
   <label>ID document URL<input value={idDocumentUrl} onChange={e=>setIdDocumentUrl(e.target.value)} placeholder="https://..." required /></label>
   <label>Selfie / profile photo URL<input value={selfieUrl} onChange={e=>setSelfieUrl(e.target.value)} placeholder="https://..." required /></label>
   <label>Notes<input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional information for reviewer" /></label>
   {error&&<div className="auth-alert auth-alert-error form-span-2">{error}</div>}
   {message&&<div className="auth-alert auth-alert-success form-span-2">{message}</div>}
   <div className="form-actions form-span-2"><button className="button" disabled={busy||status==="pending"||status==="verified"}>{busy?<><LoaderCircle className="spin-icon" size={17}/>Submitting...</>:<><ShieldCheck size={17}/>Submit verification</>}</button></div>
 </form>
}
