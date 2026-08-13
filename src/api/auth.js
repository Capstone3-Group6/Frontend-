const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ---------------- AUTH ----------------

export async function signup(credentials) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Signup failed (${res.status})`);
  }

  return res.json();
}

export async function login(credentials) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Login failed (${res.status})`);
  }

  return res.json();
}

export async function logoutRequest() {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Logout failed (${res.status})`);
  }

  return res.json();
}

// ---------------- CURRENT USER ----------------

export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Not logged in");
  }

  return res.json();
}

export async function syncUser(token, userData){
const res = await fetch(`${BASE_URL}/auth/auth0`,{
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(userData),
});

if(!res.ok){
  const body = await res.json().catch(() => {});

  throw new Error(body.error || `Auth0 sync failed(${res.status})`);
}

return res.json();
}