// Simple mock hotel data: a plain list of hotels, filtered by city.
// Representative sample data (name, area, price/night, rating).

export type Hotel = {
  name: string;
  city: string;
  area: string;
  pricePerNight: number; // INR
  rating: number; // out of 5
};

export const HOTELS: Hotel[] = [
  // Goa
  { name: "Beachwood Resort", city: "Goa", area: "Calangute", pricePerNight: 4200, rating: 4.3 },
  { name: "Palm Cove Stay", city: "Goa", area: "Baga", pricePerNight: 2800, rating: 4.0 },
  { name: "Sunset Villas", city: "Goa", area: "Anjuna", pricePerNight: 6500, rating: 4.6 },

  // Jaipur
  { name: "Pink City Haveli", city: "Jaipur", area: "Old City", pricePerNight: 3500, rating: 4.4 },
  { name: "Amber Comfort Inn", city: "Jaipur", area: "Amer Road", pricePerNight: 2200, rating: 3.9 },
  { name: "Royal Rajputana", city: "Jaipur", area: "Civil Lines", pricePerNight: 7800, rating: 4.7 },

  // Delhi
  { name: "Connaught Grand", city: "Delhi", area: "Connaught Place", pricePerNight: 5200, rating: 4.5 },
  { name: "Metro Stay Karol Bagh", city: "Delhi", area: "Karol Bagh", pricePerNight: 2600, rating: 3.8 },

  // Mumbai
  { name: "Marine Bay Hotel", city: "Mumbai", area: "Marine Drive", pricePerNight: 6800, rating: 4.5 },
  { name: "Bandra Boutique Stay", city: "Mumbai", area: "Bandra", pricePerNight: 4500, rating: 4.2 },

  // Udaipur
  { name: "Lakeview Palace", city: "Udaipur", area: "Lake Pichola", pricePerNight: 5900, rating: 4.6 },
  { name: "Heritage Courtyard", city: "Udaipur", area: "City Palace Road", pricePerNight: 3200, rating: 4.1 },
];
