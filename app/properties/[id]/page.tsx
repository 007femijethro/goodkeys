import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, CalendarDays, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import { formatNaira, properties } from "@/lib/properties";

export default async function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = properties.find((item) => item.id === Number(id));
  if (!property) notFound();

  return (
    <main>
      <Header />
      <section className="property-detail">
        <div className="container">
          <Link className="detail-back" href="/properties"><ArrowLeft size={16} /> Back to properties</Link>

          <div className="detail-gallery">
            <img src={property.image} alt={property.title} />
            <div>
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85" alt="Property interior" />
              <img src="https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=800&q=85" alt="Property living space" />
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-copy">
              <div className="detail-title-row">
                <div>
                  <span className="verified-pill" style={{position:"static",display:"inline-flex",marginBottom:12,background:"#e8f3ee"}}>
                    <ShieldCheck size={15} /> Verified listing
                  </span>
                  <h1>{property.title}</h1>
                  <span className="detail-location"><MapPin size={16} /> {property.location}</span>
                </div>
                <div className="detail-price">{formatNaira(property.price)} <span>/ year</span></div>
              </div>

              <div className="detail-facts">
                <span><BedDouble size={19} /> {property.beds} bedrooms</span>
                <span><Bath size={19} /> {property.baths} bathrooms</span>
              </div>

              <h3>About this home</h3>
              <p>
                A well-presented {property.type.toLowerCase()} in {property.location}, with bright living spaces,
                modern finishes and practical access to the surrounding neighbourhood. GoodKeys displays
                verification and cost information so you can decide whether a property is worth inspecting.
              </p>

              <h3>Why this listing stands out</h3>
              <p>
                The listing includes an estimated move-in cost, a reviewed agent profile and inspection
                booking through GoodKeys. Exact property access details can be shared after an inspection is confirmed.
              </p>
            </div>

            <aside className="booking-card">
              <h3>Interested in this home?</h3>
              <p>Review the estimated cost, then request an inspection.</p>

              <div className="cost-breakdown">
                <div><span>Annual rent</span><strong>{formatNaira(property.price)}</strong></div>
                <div><span>Estimated fees & charges</span><strong>{formatNaira(property.moveIn - property.price)}</strong></div>
                <div className="cost-total"><span>Estimated move-in</span><strong>{formatNaira(property.moveIn)}</strong></div>
              </div>

              <button className="button"><CalendarDays size={18} /> Book an inspection</button>
              <button className="secondary-button"><MessageCircle size={18} style={{verticalAlign:"middle",marginRight:7}} /> Message agent</button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
