export type Property = {
  id: string | number;
  title: string;
  location: string;
  price: number;
  moveIn: number;
  beds: number;
  baths: number;
  type: string;
  image: string;
  verified: boolean;
  featured?: boolean;
};

export const properties: Property[] = [
  {
    id: 1,
    title: "Contemporary 3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: 4500000,
    moveIn: 5850000,
    beds: 3,
    baths: 4,
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    verified: true,
    featured: true,
  },
  {
    id: 2,
    title: "Bright 2 Bedroom City Apartment",
    location: "Yaba, Lagos",
    price: 2600000,
    moveIn: 3320000,
    beds: 2,
    baths: 2,
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85",
    verified: true,
    featured: true,
  },
  {
    id: 3,
    title: "Premium 4 Bedroom Terrace",
    location: "Jabi, Abuja",
    price: 6500000,
    moveIn: 8100000,
    beds: 4,
    baths: 5,
    type: "Terrace",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    verified: true,
    featured: true,
  },
  {
    id: 4,
    title: "Modern 1 Bedroom Apartment",
    location: "Ikeja GRA, Lagos",
    price: 2200000,
    moveIn: 2850000,
    beds: 1,
    baths: 2,
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
    verified: true,
  },
  {
    id: 5,
    title: "Spacious 3 Bedroom Duplex",
    location: "Bodija, Ibadan",
    price: 3200000,
    moveIn: 4050000,
    beds: 3,
    baths: 4,
    type: "Duplex",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
    verified: true,
  },
  {
    id: 6,
    title: "Serviced 2 Bedroom Apartment",
    location: "GRA, Port Harcourt",
    price: 3000000,
    moveIn: 3900000,
    beds: 2,
    baths: 3,
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
    verified: true,
  },
];

export const formatNaira = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
