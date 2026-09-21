import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin, ShieldCheck } from "lucide-react";
import { formatNaira, type Property } from "@/lib/properties";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="property-card">
      <div className="property-image-wrap">
        <img className="property-image" src={property.image} alt={property.title} />
        {property.verified && (
          <span className="verified-pill"><ShieldCheck size={15} /> Verified</span>
        )}
        <button className="heart-button" aria-label="Save property"><Heart size={19} /></button>
      </div>

      <div className="property-body">
        <div className="property-price-row">
          <div>
            <strong>{formatNaira(property.price)}</strong>
            <span>/ year</span>
          </div>
          <span className="property-type">{property.type}</span>
        </div>

        <h3>{property.title}</h3>
        <p className="property-location"><MapPin size={15} /> {property.location}</p>

        <div className="property-meta">
          <span><BedDouble size={17} /> {property.beds} beds</span>
          <span><Bath size={17} /> {property.baths} baths</span>
        </div>

        <div className="move-in-note">
          <span>Estimated move-in</span>
          <strong>{formatNaira(property.moveIn)}</strong>
        </div>

        <Link className="card-link" href={"/properties/" + property.id}>View property</Link>
      </div>
    </article>
  );
}
