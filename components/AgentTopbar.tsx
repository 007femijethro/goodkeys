import Link from "next/link";
import { Building2, Home, PlusCircle, ShieldCheck, UserRound } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function AgentTopbar() {
  return (
    <header className="dashboard-topbar agent-topbar">
      <Link href="/" className="brand">
        <span className="brand-mark"><Home size={18} /></span>
        <span>Good<span>Keys</span></span>
      </Link>
      <nav className="agent-nav">
        <Link href="/agent/dashboard">Overview</Link>
        <Link href="/agent/properties"><Building2 size={15}/> Properties</Link>
        <Link href="/agent/properties/new"><PlusCircle size={15}/> Add property</Link>
        <Link href="/agent/profile"><UserRound size={15}/> Profile</Link>
        <Link href="/agent/verification"><ShieldCheck size={15}/> Verification</Link>
      </nav>
      <LogoutButton />
    </header>
  );
}
