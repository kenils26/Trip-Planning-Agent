// Simple mock flight data: a plain list of flights.
// The tool filters this list by route (from -> to). To add more, just add rows.
// (Live fares need paid access, so these are representative sample flights.)

export type Flight = {
  from: string; // IATA code, e.g. DEL
  to: string; // IATA code, e.g. GOI
  airline: string;
  flightNumber: string;
  departureTime: string; // 24-hour HH:MM
  fare: number; // INR
};

export const FLIGHTS: Flight[] = [
  // Delhi -> Goa
  { from: "DEL", to: "GOI", airline: "IndiGo", flightNumber: "6E-965", departureTime: "06:15", fare: 8600 },
  { from: "DEL", to: "GOI", airline: "Air India", flightNumber: "AI-678", departureTime: "09:40", fare: 8350 },
  { from: "DEL", to: "GOI", airline: "Vistara", flightNumber: "UK-588", departureTime: "17:05", fare: 8250 },

  // Goa -> Delhi
  { from: "GOI", to: "DEL", airline: "IndiGo", flightNumber: "6E-742", departureTime: "11:20", fare: 8100 },
  { from: "GOI", to: "DEL", airline: "SpiceJet", flightNumber: "SG-231", departureTime: "19:35", fare: 7550 },

  // Delhi -> Mumbai
  { from: "DEL", to: "BOM", airline: "IndiGo", flightNumber: "6E-333", departureTime: "07:00", fare: 6200 },
  { from: "DEL", to: "BOM", airline: "Air India", flightNumber: "AI-865", departureTime: "13:10", fare: 6900 },
  { from: "DEL", to: "BOM", airline: "Vistara", flightNumber: "UK-955", departureTime: "20:15", fare: 7100 },

  // Mumbai -> Bengaluru
  { from: "BOM", to: "BLR", airline: "IndiGo", flightNumber: "6E-511", departureTime: "08:25", fare: 4800 },
  { from: "BOM", to: "BLR", airline: "Akasa Air", flightNumber: "QP-141", departureTime: "15:40", fare: 5100 },

  // Delhi -> Jaipur
  { from: "DEL", to: "JAI", airline: "IndiGo", flightNumber: "6E-202", departureTime: "10:05", fare: 3200 },
  { from: "DEL", to: "JAI", airline: "SpiceJet", flightNumber: "SG-118", departureTime: "18:50", fare: 2950 },
];
