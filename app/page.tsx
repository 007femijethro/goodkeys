import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Eye,
  House,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/lib/properties";

export default function Home() {
  const featured = properties.filter((property) => property.featured);

  return (
    <main>
      <Header />

      <section className="hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="container hero-inner">
          <div className="eyebrow"><Sparkles size={16} /> Renting, without the guesswork</div>
          <h1>Find a home<br />you can <em>trust.</em></h1>
          <p className="hero-copy">
            Verified properties, trusted agents, transparent move-in costs and easy
            inspection booking — all in one place.
          </p>
          <HeroSearch />
          <div className="hero-trust">
            <span><CheckCircle2 size={16} /> Verified listings</span>
            <span><CheckCircle2 size={16} /> Trusted agents</span>
            <span><CheckCircle2 size={16} /> No hidden rental costs</span>
          </div>
        </div>

        <div className="container hero-showcase">
          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90"
              alt="Modern Nigerian-inspired premium home"
            />
            <div className="floating-card floating-card-left">
              <span className="floating-icon"><ShieldCheck size={20} /></span>
              <div><strong>Verified listing</strong><small>Checked by GoodKeys</small></div>
            </div>
            <div className="floating-card floating-card-right">
              <span className="avatar-stack"><i>AO</i><i>JM</i><i>KA</i></span>
              <div><strong>Trusted by renters</strong><small>Built for confident decisions</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section stats-strip">
        <div className="container stats-grid">
          <div><strong>100%</strong><span>reviewed listings</span></div>
          <div><strong>Clear</strong><span>move-in cost breakdown</span></div>
          <div><strong>Direct</strong><span>inspection booking</span></div>
          <div><strong>Human</strong><span>moderation & support</span></div>
        </div>
      </section>

      <section className="section" id="trust">
        <div className="container section-heading-row">
          <div>
            <span className="section-kicker">Featured homes</span>
            <h2>Homes worth looking at.</h2>
            <p>Every listing shown here is designed to carry clearer pricing and trust signals.</p>
          </div>
          <Link className="arrow-link" href="/properties">View all properties <ArrowRight size={18} /></Link>
        </div>

        <div className="container property-grid">
          {featured.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
      </section>

      <section className="section process-section" id="how-it-works">
        <div className="container">
          <div className="center-heading">
            <span className="section-kicker">How GoodKeys works</span>
            <h2>From search to inspection,<br />without the usual stress.</h2>
          </div>

          <div className="process-grid">
            {[
              { icon: Search, n: "01", title: "Search smarter", text: "Filter by area, property type, bedrooms and your real annual budget." },
              { icon: ShieldCheck, n: "02", title: "Check the details", text: "See verification signals and the estimated total move-in cost before you commit." },
              { icon: CalendarCheck2, n: "03", title: "Book an inspection", text: "Choose a convenient time and manage confirmation directly from your dashboard." },
              { icon: House, n: "04", title: "Move with confidence", text: "Keep the conversation and property details together while you make your decision." },
            ].map(({ icon: Icon, n, title, text }) => (
              <article className="process-card" key={n}>
                <div className="process-top"><span className="process-icon"><Icon size={22} /></span><b>{n}</b></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container split-layout">
          <div className="trust-visual">
            <img
              src="https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85"
              alt="Bright modern living space"
            />
            <div className="cost-card">
              <span>Estimated move-in cost</span>
              <strong>₦3,350,000</strong>
              <hr />
              <div><span>Annual rent</span><b>₦2,500,000</b></div>
              <div><span>Agency fee</span><b>₦250,000</b></div>
              <div><span>Legal + caution</span><b>₦400,000</b></div>
              <div><span>Service charge</span><b>₦200,000</b></div>
            </div>
          </div>

          <div className="trust-copy">
            <span className="section-kicker">Know the real cost</span>
            <h2>No more finding out the full price after you fall in love with a home.</h2>
            <p>
              GoodKeys is being built around transparent rental pricing. See rent, agency,
              legal, caution and service charges in one place before an inspection.
            </p>
            <ul>
              <li><WalletCards size={19} /><span><strong>Transparent fees</strong>Understand the estimated move-in cost upfront.</span></li>
              <li><ShieldCheck size={19} /><span><strong>Verification signals</strong>Know whether an agent and listing have been reviewed.</span></li>
              <li><Eye size={19} /><span><strong>Better decisions</strong>Compare homes based on their real cost, not rent alone.</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section agent-section" id="agents">
        <div className="container agent-banner">
          <div>
            <span className="section-kicker light">For agents & landlords</span>
            <h2>List better. Build trust.<br />Get serious enquiries.</h2>
            <p>Manage listings, inspection requests and renter conversations from one workspace.</p>
            <Link className="button button-light" href="/register">Join as an agent <ArrowRight size={18} /></Link>
          </div>
          <div className="agent-metrics">
            <div><UsersRound /><strong>Verified profile</strong><span>Give renters a clearer trust signal.</span></div>
            <div><CalendarCheck2 /><strong>Inspection inbox</strong><span>Accept, decline or suggest another time.</span></div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand brand-footer"><span className="brand-mark"><House size={19} /></span><span>Good<span>Keys</span></span></div>
            <p>Find a home you can trust.</p>
          </div>
          <div><strong>Explore</strong><Link href="/properties">Properties</Link><a href="#how-it-works">How it works</a></div>
          <div><strong>Company</strong><a href="#">About</a><a href="#">Contact</a></div>
          <div><strong>Account</strong><Link href="/login">Log in</Link><Link href="/register">Create account</Link></div>
        </div>
        <div className="container footer-bottom">© 2026 GoodKeys. Built for better renting in Nigeria.</div>
      </footer>
    </main>
  );
}
