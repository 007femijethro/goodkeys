import AgentTopbar from "@/components/AgentTopbar";
import AgentProfileForm from "@/components/AgentProfileForm";
import { requireSession } from "@/lib/session";

export default async function AgentProfilePage(){
  await requireSession(["agent","landlord"]);
  return <main className="dashboard-page"><AgentTopbar/><section className="dashboard-shell narrow-shell">
    <div className="dashboard-welcome"><span className="section-kicker">Account</span><h1>Agent profile</h1><p>Keep your public identity and business details accurate.</p></div>
    <AgentProfileForm/>
  </section></main>
}
