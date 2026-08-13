const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Get all mood pins
export async function getPins() {
  const res = await fetch(`${BASE_URL}/pins`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new Error(body.error || `Failed to get pins (${res.status})`);
  }

  return res.json();
}

// Get one mood pin
export async function getPin(id) {
  const res = await fetch(`${BASE_URL}/pins/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new Error(body.error || `Failed to get pin (${res.status})`);
  }

  return res.json();
}

// Create a mood pin
export async function createPin(pin) {
  const res = await fetch(`${BASE_URL}/pins`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pin),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new Error(body.error || `Failed to create pin (${res.status})`);
  }

  return res.json();
}

// Update a mood pin
export async function updatePin(id, updates) {
  const res = await fetch(`${BASE_URL}/pins/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new Error(body.error || `Failed to update pin (${res.status})`);
  }

  return res.json();
}

// Delete a mood pin
export async function deletePin(id) {
  const res = await fetch(`${BASE_URL}/pins/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new Error(body.error || `Failed to delete pin (${res.status})`);
  }

  return res.json();
}
