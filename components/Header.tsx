import Link from "next/link";
import { KeyRound, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link href="/" className="brand" aria-label="GoodKeys home">
          <span className="brand-mark"><KeyRound size={20} strokeWidth={2.4} /></span>
          <span>Good<span>Keys</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/properties">Find a home</Link>
          <a href="#how-it-works">How it works</a>
          <a href="#trust">Why GoodKeys</a>
          <a href="#agents">For agents</a>
        </nav>

        <div className="nav-actions">
          <Link className="text-link hide-mobile" href="/login">Log in</Link>
          <Link className="button button-small" href="/register">Get started</Link>
          <button className="menu-button" aria-label="Open navigation"><Menu size={22} /></button>
        </div>
      </div>
    </header>
  );
}
