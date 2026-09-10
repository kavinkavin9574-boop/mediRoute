export type Severity = "Low" | "Moderate" | "High" | "Critical";

export type EmergencyCase = {
  name: string;
  age: string;
  gender: string;
  location: string;
  contact: string;
  emergencyType: string;
  symptoms: string;
  severity: Severity;
  facility: string;
  specialist: string;
  /** Latitude/longitude captured via "Use my current location". Optional. */
  lat?: number | undefined;
  lng?: number | undefined;
};

export const EMERGENCY_TYPES = [
  "Cardiac",
  "Accident/Trauma",
  "Respiratory",
  "Neurological",
  "Pediatric",
  "General Emergency",
];

export const SEVERITIES: Severity[] = ["Low", "Moderate", "High", "Critical"];

export const FACILITIES = [
  "General Ward",
  "ICU",
  "Emergency Department",
  "Operation Theatre",
  "Pediatric ICU",
  "Cardiac Care",
];

export const SPECIALISTS = [
  "Cardiologist",
  "Neurologist",
  "Orthopedic Specialist",
  "Pulmonologist",
  "Pediatrician",
  "General Physician",
  "Emergency Medicine Specialist",
];

export const emptyCase: EmergencyCase = {
  name: "",
  age: "",
  gender: "",
  location: "",
  contact: "",
  emergencyType: "",
  symptoms: "",
  severity: "Moderate",
  facility: "",
  specialist: "",
  lat: undefined,
  lng: undefined,
};

const KEY = "mediroute-case";

export function saveCase(c: EmergencyCase) {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY, JSON.stringify(c));
}

export function loadCase(): EmergencyCase | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EmergencyCase;
  } catch {
    return null;
  }
}

export const demoCase: EmergencyCase = {
  name: "Arun Kumar",
  age: "58",
  gender: "Male",
  location: "Anna Nagar, Chennai",
  contact: "+91 98400 12345",
  emergencyType: "Cardiac",
  symptoms: "Severe chest pain and breathlessness for the last 30 minutes.",
  severity: "Critical",
  facility: "ICU",
  specialist: "Cardiologist",
};

export function priorityOf(severity: Severity) {
  switch (severity) {
    case "Critical":
      return "CRITICAL";
    case "High":
      return "HIGH";
    case "Moderate":
      return "MODERATE";
    default:
      return "LOW";
  }
}

export type Hospital = {
  id: string;
  name: string;
  area: string;
  /** Fallback distance/travel time used when live coordinates aren't available. */
  distanceKm: number;
  travelMin: number;
  icuBeds: number;
  generalBeds: number;
  emergencyBeds: number;
  hasEmergencyDept: boolean;
  specialists: string[];
  facilities: string[];
  rating: number;
  trauma: boolean;
  /** Optional real coordinates. When set, and the patient shares their location,
   *  distance/travel time are computed live instead of using the fallback numbers. */
  lat?: number | undefined;
  lng?: number | undefined;
  /** Optional extra admin-editable details. */
  address?: string;
  phone?: string;
};

export const DEFAULT_HOSPITALS: Hospital[] = [
  {
    id: "citycare",
    name: "CityCare Medical Center",
    area: "Anna Nagar",
    distanceKm: 3.2,
    travelMin: 10,
    icuBeds: 2,
    generalBeds: 14,
    emergencyBeds: 5,
    hasEmergencyDept: true,
    specialists: [
      "Cardiologist",
      "Emergency Medicine Specialist",
      "General Physician",
      "Pulmonologist",
    ],
    facilities: ["ICU", "Emergency Department", "Cardiac Care", "General Ward"],
    rating: 4.6,
    trauma: true,
    lat: 13.085,
    lng: 80.2101,
    address: "Anna Nagar, Chennai",
    phone: "+91 44 2000 1111",
  },
  {
    id: "greenvalley",
    name: "Green Valley Multispeciality Hospital",
    area: "T. Nagar",
    distanceKm: 5.8,
    travelMin: 17,
    icuBeds: 4,
    generalBeds: 22,
    emergencyBeds: 3,
    hasEmergencyDept: true,
    specialists: [
      "Neurologist",
      "Orthopedic Specialist",
      "General Physician",
      "Emergency Medicine Specialist",
    ],
    facilities: ["ICU", "Emergency Department", "Operation Theatre", "General Ward"],
    rating: 4.3,
    trauma: true,
    lat: 13.0418,
    lng: 80.2341,
    address: "T. Nagar, Chennai",
    phone: "+91 44 2000 2222",
  },
  {
    id: "sunrise",
    name: "Sunrise Heart Institute",
    area: "Adyar",
    distanceKm: 8.4,
    travelMin: 22,
    icuBeds: 6,
    generalBeds: 9,
    emergencyBeds: 4,
    hasEmergencyDept: true,
    specialists: ["Cardiologist", "Pulmonologist", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Cardiac Care", "Operation Theatre", "Emergency Department"],
    rating: 4.8,
    trauma: false,
    lat: 13.0067,
    lng: 80.257,
    address: "Adyar, Chennai",
    phone: "+91 44 2000 3333",
  },
  {
    id: "lotus",
    name: "Lotus Children's Hospital",
    area: "Velachery",
    distanceKm: 11.1,
    travelMin: 28,
    icuBeds: 1,
    generalBeds: 18,
    emergencyBeds: 2,
    hasEmergencyDept: true,
    specialists: ["Pediatrician", "General Physician"],
    facilities: ["Pediatric ICU", "General Ward", "Emergency Department"],
    rating: 4.5,
    trauma: false,
    lat: 12.9756,
    lng: 80.2207,
    address: "Velachery, Chennai",
    phone: "+91 44 2000 4444",
  },
  {
    id: "metro",
    name: "Metro Trauma & Accident Care",
    area: "Guindy",
    distanceKm: 6.7,
    travelMin: 19,
    icuBeds: 3,
    generalBeds: 11,
    emergencyBeds: 8,
    hasEmergencyDept: true,
    specialists: ["Orthopedic Specialist", "Emergency Medicine Specialist", "Neurologist"],
    facilities: ["ICU", "Operation Theatre", "Emergency Department", "General Ward"],
    rating: 4.2,
    trauma: true,
    lat: 13.0067,
    lng: 80.2206,
    address: "Guindy, Chennai",
    phone: "+91 44 2000 5555",
  },
  {
    id: "riverside",
    name: "Riverside General Hospital",
    area: "Porur",
    distanceKm: 14.3,
    travelMin: 34,
    icuBeds: 0,
    generalBeds: 26,
    emergencyBeds: 1,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Pediatrician", "Orthopedic Specialist"],
    facilities: ["General Ward", "Emergency Department"],
    rating: 3.9,
    trauma: false,
    lat: 13.0381,
    lng: 80.1564,
    address: "Porur, Chennai",
    phone: "+91 44 2000 6666",
  },
  {
    id: "neurolife",
    name: "NeuroLife Speciality Centre",
    area: "Nungambakkam",
    distanceKm: 4.5,
    travelMin: 14,
    icuBeds: 2,
    generalBeds: 7,
    emergencyBeds: 0,
    hasEmergencyDept: false,
    specialists: ["Neurologist", "General Physician"],
    facilities: ["ICU", "Operation Theatre", "General Ward"],
    rating: 4.4,
    trauma: false,
    lat: 13.0603,
    lng: 80.2418,
    address: "Nungambakkam, Chennai",
    phone: "+91 44 2000 7777",
  },
  {
    id: "harbor",
    name: "Harbor Lung & Chest Hospital",
    area: "Perambur",
    distanceKm: 9.6,
    travelMin: 25,
    icuBeds: 5,
    generalBeds: 12,
    emergencyBeds: 3,
    hasEmergencyDept: true,
    specialists: ["Pulmonologist", "General Physician", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 4.1,
    trauma: false,
    lat: 13.1104,
    lng: 80.237,
    address: "Perambur, Chennai",
    phone: "+91 44 2000 8888",
  },
  {
    id: "unity",
    name: "Unity Community Hospital",
    area: "Ambattur",
    distanceKm: 12.8,
    travelMin: 31,
    icuBeds: 1,
    generalBeds: 20,
    emergencyBeds: 2,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Pediatrician"],
    facilities: ["General Ward", "Emergency Department", "Pediatric ICU"],
    rating: 4.0,
    trauma: false,
    lat: 13.1143,
    lng: 80.1548,
    address: "Ambattur, Chennai",
    phone: "+91 44 2000 9999",
  },
  {
    id: "cbe_life",
    name: "LifeLine Multispeciality Hospital",
    area: "RS Puram, Coimbatore",
    distanceKm: 427.4,
    travelMin: 513,
    icuBeds: 8,
    generalBeds: 30,
    emergencyBeds: 10,
    hasEmergencyDept: true,
    specialists: ["Cardiologist", "Neurologist", "Emergency Medicine Specialist", "General Physician"],
    facilities: ["ICU", "Emergency Department", "Operation Theatre", "Cardiac Care", "General Ward"],
    rating: 4.6,
    trauma: true,
    lat: 11.0018,
    lng: 76.9628,
    address: "RS Puram, Coimbatore",
    phone: "+91 422 200 1111",
  },
  {
    id: "cbe_clinic",
    name: "Kovai Family Clinic",
    area: "Peelamedu, Coimbatore",
    distanceKm: 425.0,
    travelMin: 510,
    icuBeds: 0,
    generalBeds: 4,
    emergencyBeds: 0,
    hasEmergencyDept: false,
    specialists: ["General Physician"],
    facilities: ["General Ward"],
    rating: 4.1,
    trauma: false,
    lat: 11.0296,
    lng: 77.0003,
    address: "Peelamedu, Coimbatore",
    phone: "+91 422 200 1122",
  },
  {
    id: "mdu_apex",
    name: "Apex Speciality Hospital",
    area: "Anna Nagar, Madurai",
    distanceKm: 422.1,
    travelMin: 507,
    icuBeds: 5,
    generalBeds: 20,
    emergencyBeds: 6,
    hasEmergencyDept: true,
    specialists: ["Orthopedic Specialist", "General Physician", "Emergency Medicine Specialist", "Pediatrician"],
    facilities: ["ICU", "Emergency Department", "Operation Theatre", "General Ward"],
    rating: 4.4,
    trauma: true,
    lat: 9.9394,
    lng: 78.1215,
    address: "Anna Nagar, Madurai",
    phone: "+91 452 200 2211",
  },
  {
    id: "mdu_clinic",
    name: "Vaigai Community Clinic",
    area: "Simmakkal, Madurai",
    distanceKm: 420.5,
    travelMin: 505,
    icuBeds: 0,
    generalBeds: 6,
    emergencyBeds: 1,
    hasEmergencyDept: false,
    specialists: ["General Physician", "Pediatrician"],
    facilities: ["General Ward", "Emergency Department"],
    rating: 3.9,
    trauma: false,
    lat: 9.9195,
    lng: 78.1193,
    address: "Simmakkal, Madurai",
    phone: "+91 452 200 2233",
  },
  {
    id: "try_rockfort",
    name: "Rockfort General Hospital",
    area: "Cantonment, Tiruchirappalli",
    distanceKm: 306.6,
    travelMin: 368,
    icuBeds: 4,
    generalBeds: 18,
    emergencyBeds: 5,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Orthopedic Specialist", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward", "Operation Theatre"],
    rating: 4.2,
    trauma: true,
    lat: 10.8155,
    lng: 78.689,
    address: "Cantonment, Tiruchirappalli",
    phone: "+91 431 200 3311",
  },
  {
    id: "try_clinic",
    name: "Cauvery Care Clinic",
    area: "Srirangam, Tiruchirappalli",
    distanceKm: 304.0,
    travelMin: 365,
    icuBeds: 0,
    generalBeds: 5,
    emergencyBeds: 0,
    hasEmergencyDept: false,
    specialists: ["General Physician"],
    facilities: ["General Ward"],
    rating: 4.0,
    trauma: false,
    lat: 10.8624,
    lng: 78.6928,
    address: "Srirangam, Tiruchirappalli",
    phone: "+91 431 200 3322",
  },
  {
    id: "slm_steel",
    name: "Steel City Hospital",
    area: "Fairlands, Salem",
    distanceKm: 279.5,
    travelMin: 335,
    icuBeds: 3,
    generalBeds: 16,
    emergencyBeds: 4,
    hasEmergencyDept: true,
    specialists: ["Cardiologist", "General Physician", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "Cardiac Care", "General Ward"],
    rating: 4.1,
    trauma: false,
    lat: 11.6716,
    lng: 78.1462,
    address: "Fairlands, Salem",
    phone: "+91 427 200 4411",
  },
  {
    id: "slm_clinic",
    name: "Sarabha Nadhi Clinic",
    area: "Hasthampatti, Salem",
    distanceKm: 278.0,
    travelMin: 333,
    icuBeds: 0,
    generalBeds: 4,
    emergencyBeds: 0,
    hasEmergencyDept: false,
    specialists: ["General Physician", "Pediatrician"],
    facilities: ["General Ward"],
    rating: 3.8,
    trauma: false,
    lat: 11.658,
    lng: 78.155,
    address: "Hasthampatti, Salem",
    phone: "+91 427 200 4422",
  },
  {
    id: "tvl_nellai",
    name: "Nellai Multispeciality Hospital",
    area: "Palayamkottai, Tirunelveli",
    distanceKm: 557.9,
    travelMin: 670,
    icuBeds: 3,
    generalBeds: 15,
    emergencyBeds: 4,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Pulmonologist", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 4.0,
    trauma: false,
    lat: 8.7285,
    lng: 77.737,
    address: "Palayamkottai, Tirunelveli",
    phone: "+91 462 200 5511",
  },
  {
    id: "vlr_cmc",
    name: "Vellore Christian Care Hospital",
    area: "Katpadi, Vellore",
    distanceKm: 124.7,
    travelMin: 150,
    icuBeds: 10,
    generalBeds: 35,
    emergencyBeds: 12,
    hasEmergencyDept: true,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Specialist", "Pulmonologist", "Emergency Medicine Specialist", "General Physician"],
    facilities: ["ICU", "Emergency Department", "Operation Theatre", "Cardiac Care", "Pediatric ICU", "General Ward"],
    rating: 4.9,
    trauma: true,
    lat: 12.9583,
    lng: 79.1378,
    address: "Katpadi, Vellore",
    phone: "+91 416 200 6611",
  },
  {
    id: "vlr_clinic",
    name: "Palar Family Clinic",
    area: "Gandhi Nagar, Vellore",
    distanceKm: 123.0,
    travelMin: 148,
    icuBeds: 0,
    generalBeds: 5,
    emergencyBeds: 0,
    hasEmergencyDept: false,
    specialists: ["General Physician"],
    facilities: ["General Ward"],
    rating: 4.0,
    trauma: false,
    lat: 12.92,
    lng: 79.135,
    address: "Gandhi Nagar, Vellore",
    phone: "+91 416 200 6622",
  },
  {
    id: "ere_kongu",
    name: "Kongu General Hospital",
    area: "Perundurai Road, Erode",
    distanceKm: 338.4,
    travelMin: 406,
    icuBeds: 3,
    generalBeds: 14,
    emergencyBeds: 4,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Orthopedic Specialist", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 4.0,
    trauma: false,
    lat: 11.345,
    lng: 77.728,
    address: "Perundurai Road, Erode",
    phone: "+91 424 200 7711",
  },
  {
    id: "tnj_periyar",
    name: "Periyar Heart & General Hospital",
    area: "Medical College Road, Thanjavur",
    distanceKm: 283.5,
    travelMin: 340,
    icuBeds: 4,
    generalBeds: 16,
    emergencyBeds: 4,
    hasEmergencyDept: true,
    specialists: ["Cardiologist", "General Physician", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "Cardiac Care", "General Ward"],
    rating: 4.2,
    trauma: false,
    lat: 10.777,
    lng: 79.146,
    address: "Medical College Road, Thanjavur",
    phone: "+91 4362 20 8811",
  },
  {
    id: "tup_tex",
    name: "TexCity Hospital",
    area: "Avinashi Road, Tiruppur",
    distanceKm: 386.8,
    travelMin: 464,
    icuBeds: 2,
    generalBeds: 12,
    emergencyBeds: 3,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Pulmonologist", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 3.9,
    trauma: false,
    lat: 11.115,
    lng: 77.355,
    address: "Avinashi Road, Tiruppur",
    phone: "+91 421 200 9911",
  },
  {
    id: "dgl_clinic",
    name: "Dindigul Town Clinic",
    area: "Begampur, Dindigul",
    distanceKm: 391.6,
    travelMin: 470,
    icuBeds: 0,
    generalBeds: 6,
    emergencyBeds: 1,
    hasEmergencyDept: false,
    specialists: ["General Physician", "Pediatrician"],
    facilities: ["General Ward", "Emergency Department"],
    rating: 3.8,
    trauma: false,
    lat: 10.3624,
    lng: 77.9695,
    address: "Begampur, Dindigul",
    phone: "+91 451 200 1011",
  },
  {
    id: "nkl_kanyakumari",
    name: "Kanyakumari Coastal Hospital",
    area: "East Car Street, Nagercoil",
    distanceKm: 627.2,
    travelMin: 753,
    icuBeds: 2,
    generalBeds: 14,
    emergencyBeds: 3,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Pediatrician", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 4.0,
    trauma: false,
    lat: 8.1793,
    lng: 77.4326,
    address: "East Car Street, Nagercoil",
    phone: "+91 4652 20 1111",
  },
  {
    id: "knc_temple",
    name: "Temple City Hospital",
    area: "Gandhi Road, Kanchipuram",
    distanceKm: 67.4,
    travelMin: 81,
    icuBeds: 2,
    generalBeds: 12,
    emergencyBeds: 3,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Orthopedic Specialist", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 4.1,
    trauma: false,
    lat: 12.8375,
    lng: 79.704,
    address: "Gandhi Road, Kanchipuram",
    phone: "+91 44 2000 1212",
  },
  {
    id: "knc_clinic",
    name: "Kanchi Family Clinic",
    area: "Big Kanchipuram, Kanchipuram",
    distanceKm: 66.0,
    travelMin: 79,
    icuBeds: 0,
    generalBeds: 4,
    emergencyBeds: 0,
    hasEmergencyDept: false,
    specialists: ["General Physician"],
    facilities: ["General Ward"],
    rating: 3.9,
    trauma: false,
    lat: 12.8322,
    lng: 79.6996,
    address: "Big Kanchipuram, Kanchipuram",
    phone: "+91 44 2000 1213",
  },
  {
    id: "ttn_port",
    name: "Pearl City Port Hospital",
    area: "Beach Road, Thoothukudi",
    distanceKm: 533.8,
    travelMin: 641,
    icuBeds: 2,
    generalBeds: 13,
    emergencyBeds: 3,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Pulmonologist", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 3.9,
    trauma: false,
    lat: 8.7642,
    lng: 78.145,
    address: "Beach Road, Thoothukudi",
    phone: "+91 461 200 1414",
  },
  {
    id: "kur_river",
    name: "Amaravathi Riverside Hospital",
    area: "Kovai Road, Karur",
    distanceKm: 335.6,
    travelMin: 403,
    icuBeds: 2,
    generalBeds: 10,
    emergencyBeds: 2,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Orthopedic Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 3.8,
    trauma: false,
    lat: 10.955,
    lng: 78.07,
    address: "Kovai Road, Karur",
    phone: "+91 4324 20 1515",
  },
  {
    id: "nmk_transport",
    name: "Namakkal Transport Hub Hospital",
    area: "Trichy Road, Namakkal",
    distanceKm: 308.6,
    travelMin: 370,
    icuBeds: 3,
    generalBeds: 15,
    emergencyBeds: 5,
    hasEmergencyDept: true,
    specialists: ["Orthopedic Specialist", "Emergency Medicine Specialist", "General Physician"],
    facilities: ["ICU", "Emergency Department", "Operation Theatre", "General Ward"],
    rating: 4.0,
    trauma: true,
    lat: 11.22,
    lng: 78.165,
    address: "Trichy Road, Namakkal",
    phone: "+91 4286 20 1616",
  },
  {
    id: "oty_hill",
    name: "Nilgiris Hill Hospital",
    area: "Charing Cross, Udhagamandalam",
    distanceKm: 431.1,
    travelMin: 517,
    icuBeds: 1,
    generalBeds: 8,
    emergencyBeds: 2,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Pediatrician"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 4.3,
    trauma: false,
    lat: 11.4102,
    lng: 76.695,
    address: "Charing Cross, Udhagamandalam",
    phone: "+91 423 200 1717",
  },
  {
    id: "hsr_border",
    name: "Hosur Border Care Hospital",
    area: "Bengaluru Road, Hosur",
    distanceKm: 267.8,
    travelMin: 321,
    icuBeds: 3,
    generalBeds: 14,
    emergencyBeds: 4,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Cardiologist", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "Cardiac Care", "General Ward"],
    rating: 4.1,
    trauma: false,
    lat: 12.735,
    lng: 77.83,
    address: "Bengaluru Road, Hosur",
    phone: "+91 4344 20 1818",
  },
  {
    id: "cdl_bay",
    name: "Bay of Bengal General Hospital",
    area: "Manjakuppam, Cuddalore",
    distanceKm: 158.0,
    travelMin: 190,
    icuBeds: 2,
    generalBeds: 12,
    emergencyBeds: 3,
    hasEmergencyDept: true,
    specialists: ["General Physician", "Pediatrician", "Emergency Medicine Specialist"],
    facilities: ["ICU", "Emergency Department", "General Ward"],
    rating: 3.9,
    trauma: false,
    lat: 11.75,
    lng: 79.75,
    address: "Manjakuppam, Cuddalore",
    phone: "+91 4142 20 1919",
  },
];

const HOSPITALS_KEY = "mediroute-hospitals";

/** Read the current hospital network — admin edits (if any) override the defaults. */
export function getHospitals(): Hospital[] {
  if (typeof window === "undefined") return DEFAULT_HOSPITALS;
  const raw = window.localStorage.getItem(HOSPITALS_KEY);
  if (!raw) return DEFAULT_HOSPITALS;
  try {
    const parsed = JSON.parse(raw) as Hospital[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_HOSPITALS;
    return parsed;
  } catch {
    return DEFAULT_HOSPITALS;
  }
}

export function saveHospitals(list: Hospital[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HOSPITALS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("mediroute-hospitals-changed"));
}

export function resetHospitals() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HOSPITALS_KEY);
  window.dispatchEvent(new Event("mediroute-hospitals-changed"));
}

export function hasCustomHospitals(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(HOSPITALS_KEY) !== null;
}

/** Great-circle distance between two coordinates, in kilometres. */
export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 =
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(s1 + s2));
}

/** Average simulated city-road speed used to turn live distance into a travel-time estimate. */
const AVG_CITY_SPEED_KMH = 28;

export type ScoredHospital = Hospital & {
  score: number;
  reasons: string[];
  bedsForFacility: number;
  hasFacility: boolean;
  hasSpecialist: boolean;
  /** True when distanceKm/travelMin below were computed live from the patient's shared location. */
  liveDistance: boolean;
};

function bedsFor(h: Hospital, facility: string) {
  if (facility === "ICU" || facility === "Cardiac Care") return h.icuBeds;
  if (facility === "Pediatric ICU")
    return h.facilities.includes("Pediatric ICU") ? Math.max(1, h.icuBeds) : 0;
  if (facility === "Emergency Department") return h.emergencyBeds;
  return h.generalBeds;
}

export function rankHospitals(c: EmergencyCase): ScoredHospital[] {
  const patientHasLocation = typeof c.lat === "number" && typeof c.lng === "number";

  return getHospitals()
    .map((h) => {
      const hasFacility = h.facilities.includes(c.facility);
      const hasSpecialist = h.specialists.includes(c.specialist);
      const beds = bedsFor(h, c.facility);
      const reasons: string[] = [];
      let score = 0;

      const liveDistance =
        patientHasLocation && typeof h.lat === "number" && typeof h.lng === "number";
      const distanceKm = liveDistance
        ? Math.round(
            haversineKm(c.lat as number, c.lng as number, h.lat as number, h.lng as number) * 10,
          ) / 10
        : h.distanceKm;
      const travelMin = liveDistance
        ? Math.max(4, Math.round((distanceKm / AVG_CITY_SPEED_KMH) * 60))
        : h.travelMin;

      if (hasFacility) {
        score += 30;
        reasons.push(`${c.facility} available`);
      } else reasons.push(`${c.facility} not listed`);

      if (hasSpecialist) {
        score += 25;
        reasons.push(`${c.specialist} on call`);
      } else reasons.push(`${c.specialist} unavailable`);

      if (beds > 0) {
        score += Math.min(20, 8 + beds * 3);
        reasons.push(`${beds} bed(s) free`);
      } else reasons.push("No free beds");

      const distScore = Math.max(0, 20 - distanceKm * 1.2);
      score += distScore;
      reasons.push(
        liveDistance
          ? `${distanceKm} km · ${travelMin} min (from your location)`
          : `${distanceKm} km · ${travelMin} min`,
      );

      if (h.hasEmergencyDept) {
        score += 8;
        reasons.push("24x7 Emergency Dept");
      }
      if ((c.emergencyType === "Accident/Trauma" || c.severity === "Critical") && h.trauma)
        score += 6;
      score += h.rating;

      return {
        ...h,
        distanceKm,
        travelMin,
        score: Math.round(Math.min(99, score)),
        reasons,
        bedsForFacility: beds,
        hasFacility,
        hasSpecialist,
        liveDistance,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function buildReferral(c: EmergencyCase, h: ScoredHospital) {
  return [
    "MEDIROUTE AI — EMERGENCY REFERRAL SUMMARY (DEMO)",
    "------------------------------------------------",
    `Patient      : ${c.name || "N/A"} | Age ${c.age || "N/A"} | ${c.gender || "N/A"}`,
    `Contact      : ${c.contact || "N/A"}`,
    `Location     : ${c.location || "N/A"}`,
    "",
    `Emergency    : ${c.emergencyType}`,
    `Severity     : ${c.severity} (Priority ${priorityOf(c.severity)})`,
    `Reported info: ${c.symptoms || "Not provided"}`,
    "",
    `Required facility  : ${c.facility}`,
    `Required specialist: ${c.specialist}`,
    "",
    `Recommended hospital: ${h.name}, ${h.area}`,
    `Distance / travel   : ${h.distanceKm} km · approx ${h.travelMin} min${h.liveDistance ? " (live GPS)" : ""}`,
    `Beds (${c.facility})  : ${h.bedsForFacility} available (simulated)`,
    `Emergency Department: ${h.hasEmergencyDept ? "Available" : "Not available"}`,
    `Match score         : ${h.score}%`,
    "",
    "Note: Simulated demo data. Not a medical diagnosis and not a substitute for emergency services.",
  ].join("\n");
}
