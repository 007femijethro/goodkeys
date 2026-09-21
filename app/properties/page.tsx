import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/lib/properties";
import { SlidersHorizontal } from "lucide-react";

export default function PropertiesPage() {
  return (
    <main>
      <Header />
      <section className="listing-hero">
        <div className="container">
          <span className="section-kicker">Verified rental homes</span>
          <h1>Find your next home.</h1>
          <p>Browse clear, detailed rental listings and compare estimated move-in costs.</p>
        </div>
      </section>

      <section className="section listing-section">
        <div className="container filter-bar">
          <input placeholder="Search area or city" />
          <select defaultValue=""><option value="">Property type</option><option>Apartment</option><option>Duplex</option><option>Terrace</option></select>
          <select defaultValue=""><option value="">Bedrooms</option><option>1+</option><option>2+</option><option>3+</option><option>4+</option></select>
          <select defaultValue=""><option value="">Budget</option><option>Under ₦2M</option><option>₦2M – ₦4M</option><option>Above ₦4M</option></select>
          <button><SlidersHorizontal size={18} /> More filters</button>
        </div>

        <div className="container results-heading">
          <div><strong>{properties.length} homes</strong><span> available in this demo</span></div>
          <select defaultValue="recommended"><option value="recommended">Recommended</option><option>Price: low to high</option><option>Price: high to low</option></select>
        </div>

        <div className="container property-grid">
          {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
      </section>
    </main>
  );
}
