// Simple mock train data: a plain list of trains, filtered by route (city -> city).
// Indian trains are identified by number + name, and use CITY names (not codes).
// Representative sample data for popular routes.

export type Train = {
  from: string; // city, e.g. Delhi
  to: string; // city, e.g. Jaipur
  trainNumber: string;
  trainName: string;
  departureTime: string; // 24-hour HH:MM
  arrivalTime: string; // 24-hour HH:MM (may be next day)
  duration: string; // human-readable, e.g. "4h 35m"
  fare: number; // INR (representative AC fare)
};

export const TRAINS: Train[] = [
  // Delhi -> Jaipur
  { from: "Delhi", to: "Jaipur", trainNumber: "12015", trainName: "Ajmer Shatabdi", departureTime: "06:05", arrivalTime: "10:40", duration: "4h 35m", fare: 905 },
  { from: "Delhi", to: "Jaipur", trainNumber: "12958", trainName: "Sampark Kranti SF", departureTime: "19:55", arrivalTime: "00:35", duration: "4h 40m", fare: 1120 },
  // Jaipur -> Delhi
  { from: "Jaipur", to: "Delhi", trainNumber: "12016", trainName: "Ajmer Shatabdi", departureTime: "17:50", arrivalTime: "22:30", duration: "4h 40m", fare: 905 },

  // Delhi -> Agra
  { from: "Delhi", to: "Agra", trainNumber: "12050", trainName: "Gatimaan Express", departureTime: "08:10", arrivalTime: "09:50", duration: "1h 40m", fare: 1505 },
  { from: "Delhi", to: "Agra", trainNumber: "12002", trainName: "Shatabdi Express", departureTime: "06:00", arrivalTime: "07:52", duration: "1h 52m", fare: 810 },

  // Mumbai -> Goa (Madgaon)
  { from: "Mumbai", to: "Goa", trainNumber: "10103", trainName: "Mandovi Express", departureTime: "07:10", arrivalTime: "19:00", duration: "11h 50m", fare: 560 },
  { from: "Mumbai", to: "Goa", trainNumber: "12051", trainName: "Jan Shatabdi", departureTime: "05:25", arrivalTime: "13:35", duration: "8h 10m", fare: 700 },
  // Goa -> Mumbai
  { from: "Goa", to: "Mumbai", trainNumber: "10104", trainName: "Mandovi Express", departureTime: "09:30", arrivalTime: "21:50", duration: "12h 20m", fare: 560 },

  // Mumbai -> Pune
  { from: "Mumbai", to: "Pune", trainNumber: "12124", trainName: "Deccan Queen", departureTime: "17:10", arrivalTime: "20:25", duration: "3h 15m", fare: 180 },
  { from: "Mumbai", to: "Pune", trainNumber: "11007", trainName: "Deccan Express", departureTime: "06:40", arrivalTime: "10:05", duration: "3h 25m", fare: 165 },

  // Delhi -> Mumbai
  { from: "Delhi", to: "Mumbai", trainNumber: "12952", trainName: "Mumbai Rajdhani", departureTime: "16:25", arrivalTime: "08:15", duration: "15h 50m", fare: 2110 },
];
