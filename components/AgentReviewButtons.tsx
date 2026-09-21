"use client";
import { useState } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AgentReviewButtons({userId}:{userId:string}){
  const router=useRouter(); const [busy,setBusy]=useState("");
  async function act(action:"approve"|"reject"){
    setBusy(action);
    try{
      await fetch(`/api/admin/agents/${userId}/review`,{
        method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})
      });
      router.refresh();
    }finally{setBusy("");}
  }
  return <div className="review-actions">
    <button className="approve-button" onClick={()=>act("approve")} disabled={!!busy}>{busy==="approve"?<LoaderCircle className="spin-icon" size={15}/>:<Check size={15}/>}Approve</button>
    <button className="reject-button" onClick={()=>act("reject")} disabled={!!busy}>{busy==="reject"?<LoaderCircle className="spin-icon" size={15}/>:<X size={15}/>}Reject</button>
  </div>
}
