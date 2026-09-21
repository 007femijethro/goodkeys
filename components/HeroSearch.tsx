import Link from "next/link";
import { Building2, MapPin, Search, WalletCards } from "lucide-react";

export default function HeroSearch() {
  return (
    <div className="search-panel">
      <div className="search-field">
        <span className="search-icon"><MapPin size={20} /></span>
        <div>
          <label>Location</label>
          <input placeholder="Lekki, Ikeja, Abuja..." />
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <span className="search-icon"><Building2 size={20} /></span>
        <div>
          <label>Property type</label>
          <select defaultValue="">
            <option value="" disabled>Any property</option>
            <option>Apartment</option>
            <option>Duplex</option>
            <option>Terrace</option>
            <option>Self contained</option>
          </select>
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <span className="search-icon"><WalletCards size={20} /></span>
        <div>
          <label>Annual budget</label>
          <select defaultValue="">
            <option value="" disabled>Any budget</option>
            <option>Under ₦1.5M</option>
            <option>₦1.5M – ₦3M</option>
            <option>₦3M – ₦5M</option>
            <option>Above ₦5M</option>
          </select>
        </div>
      </div>

      <Link className="search-button" href="/properties">
        <Search size={20} />
        <span>Search</span>
      </Link>
    </div>
  );
}
