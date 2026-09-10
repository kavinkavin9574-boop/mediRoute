export type LocationResult = {
  lat: number;
  lng: number;
  label: string;
};

/**
 * Ask the browser for the user's current GPS position, then reverse-geocode it
 * into a human-readable label via OpenStreetMap's free Nominatim API.
 * Falls back to a plain "lat, lng" label if reverse geocoding fails.
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation isn't supported in this browser.");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  }).catch((err: GeolocationPositionError) => {
    if (err.code === err.PERMISSION_DENIED) {
      throw new Error("Location access was denied. Allow location access and try again.");
    }
    if (err.code === err.TIMEOUT) {
      throw new Error("Timed out getting your location. Try again.");
    }
    throw new Error("Couldn't get your location. Try again or enter it manually.");
  });

  const { latitude: lat, longitude: lng } = position.coords;
  const label = await reverseGeocode(lat, lng);
  return { lat, lng, label };
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = (await res.json()) as {
      address?: Record<string, string>;
      display_name?: string;
    };
    const a = data.address ?? {};
    const area =
      a["suburb"] ||
      a["neighbourhood"] ||
      a["residential"] ||
      a["village"] ||
      a["town"] ||
      a["city_district"];
    const city = a["city"] || a["town"] || a["county"];
    if (area && city && area !== city) return `${area}, ${city}`;
    if (data.display_name) return data.display_name;
    if (city) return city;
    throw new Error("no address");
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}
