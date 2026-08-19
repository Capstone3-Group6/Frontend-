const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// POST /pins
export async function createPin(pinData, token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/pins`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(pinData),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new Error(
      body.error || `Failed to create pin (${res.status})`
    );
  }

  return res.json();
}

// GET /pins
export async function getPins(token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/pins`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new Error(
      body.error || `Failed to get pins (${res.status})`
    );
  }

  return res.json();
}

// GET /pins/me
export async function getMyPins(token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/pins/me`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error ||
        `Could not load your mood pins (${response.status})`
    );
  }

  return response.json();
}


export async function deletePin(id) {
  const response = await fetch(`${BASE_URL}/pins/${id}`, {
    method: "DELETE",    
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Could not delete your mood pins");
  }

  return response.json();
}

// POST /pins/:id/save
export async function savePin(id, token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/pins/${id}/save`, {
    method: "POST",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Could not save pin (${response.status})`);
  }

  return response.json();
}

// DELETE /pins/:id/save
export async function unsavePin(id, token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/pins/${id}/save`, {
    method: "DELETE",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Could not remove saved pin (${response.status})`);
  }

  return response.json();
}

// GET /pins/saved
export async function getSavedPins(token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/pins/saved`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Could not load saved pins (${response.status})`);
  }

  return response.json();
}
