"use client";
import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";

type Profile = {
  full_name?: string; email?: string; phone?: string; business_name?: string;
  bio?: string; office_address?: string; cac_number?: string;
  profile_image_url?: string; verification_status?: string;
};

export default function AgentProfileForm() {
  const [profile,setProfile]=useState<Profile>({});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{ (async()=>{
    try{
      const r=await fetch("/api/agent/profile");
      const d=await r.json();
      if(!r.ok) throw new Error(d.message);
      setProfile(d.profile??{});
    }catch(e){setError(e instanceof Error?e.message:"Unable to load profile");}
    finally{setLoading(false);}
  })(); },[]);

  function set(key:keyof Profile,value:string){setProfile(p=>({...p,[key]:value}));}

  async function submit(e:FormEvent){
    e.preventDefault(); setSaving(true); setMessage(""); setError("");
    try{
      const r=await fetch("/api/agent/profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        fullName:profile.full_name,phone:profile.phone,businessName:profile.business_name,
        bio:profile.bio,officeAddress:profile.office_address,cacNumber:profile.cac_number,
        profileImageUrl:profile.profile_image_url
      })});
      const d=await r.json(); if(!r.ok) throw new Error(d.message); setMessage(d.message);
    }catch(e){setError(e instanceof Error?e.message:"Unable to save profile");}
    finally{setSaving(false);}
  }

  if(loading) return <div className="panel-card">Loading profile...</div>;

  return <form className="panel-card form-grid" onSubmit={submit}>
    <div className="form-section-heading"><div><h2>Agent profile</h2><p>Complete the information renters will use to identify you.</p></div>
      <span className={"status-badge status-"+(profile.verification_status??"unverified")}>{profile.verification_status??"unverified"}</span>
    </div>
    <label>Full name<input value={profile.full_name??""} onChange={e=>set("full_name",e.target.value)} required /></label>
    <label>Email<input value={profile.email??""} disabled /></label>
    <label>Phone number<input value={profile.phone??""} onChange={e=>set("phone",e.target.value)} placeholder="+234..." /></label>
    <label>Business / agency name<input value={profile.business_name??""} onChange={e=>set("business_name",e.target.value)} /></label>
    <label className="form-span-2">Office address<input value={profile.office_address??""} onChange={e=>set("office_address",e.target.value)} /></label>
    <label>CAC number<input value={profile.cac_number??""} onChange={e=>set("cac_number",e.target.value)} /></label>
    <label>Profile image URL<input value={profile.profile_image_url??""} onChange={e=>set("profile_image_url",e.target.value)} placeholder="https://..." /></label>
    <label className="form-span-2">Bio<textarea rows={5} value={profile.bio??""} onChange={e=>set("bio",e.target.value)} placeholder="Tell renters about your experience..." /></label>
    {error&&<div className="auth-alert auth-alert-error form-span-2">{error}</div>}
    {message&&<div className="auth-alert auth-alert-success form-span-2">{message}</div>}
    <div className="form-actions form-span-2"><button className="button" disabled={saving}>{saving?<><LoaderCircle className="spin-icon" size={17}/>Saving...</>:<><Save size={17}/>Save profile</>}</button></div>
  </form>
}
