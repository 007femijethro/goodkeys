import AgentTopbar from "@/components/AgentTopbar";
import PropertyForm from "@/components/PropertyForm";
import { requireSession } from "@/lib/session";

export default async function NewPropertyPage(){
  await requireSession(["agent","landlord"]);
  return <main className="dashboard-page"><AgentTopbar/><section className="dashboard-shell narrow-shell">
    <div className="dashboard-welcome"><span className="section-kicker">New listing</span><h1>Add a property</h1><p>Give renters clear information and transparent move-in costs.</p></div>
    <PropertyForm/>
  </section></main>
}
