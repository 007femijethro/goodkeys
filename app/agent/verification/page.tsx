import AgentTopbar from "@/components/AgentTopbar";
import VerificationForm from "@/components/VerificationForm";
import { requireSession } from "@/lib/session";

export default async function VerificationPage(){
  await requireSession(["agent","landlord"]);
  return <main className="dashboard-page"><AgentTopbar/><section className="dashboard-shell narrow-shell">
    <div className="dashboard-welcome"><span className="section-kicker">Trust & safety</span><h1>Verification</h1><p>Submit your identity information for GoodKeys review.</p></div>
    <VerificationForm/>
  </section></main>
}
