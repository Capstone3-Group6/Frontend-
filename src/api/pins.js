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
