const TEMP_PINS_KEY = "mood-map-temp-pins";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function createPin(pindata) {
  const res = await fetch(`${BASE_URL}/pins`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pindata),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => {});

    // localStorage stores only strings, so saved pins must be parsed
    // back into JavaScript objects before the map can render them.
    return savedPins ? JSON.parse(savedPins) : [];
  } catch (error) {
    console.error("Could not read temporary pins:", error);
    return [];
    throw new Error(body.Error || `Could not create pin (${res.status})`);
  }

  return res.json();
}

export async function getPins() {
  const res = await fetch(`${BASE_URL}/pins`, {
    credentials: "include",
  });

  if(!res.ok){
    const body = await res.json.catch(() => {})
    throw new Error(body.Error || `Failed to get pins (${res.status})`);
  }

  return res.json();
}
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getMyPins() {
  const response = await fetch(`${BASE_URL}/pins/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not load your mood pins");
  }

  return response.json();
}
