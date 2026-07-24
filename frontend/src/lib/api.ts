import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Try to get the current user's token
  let token = null;
  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = "API Error";
    try {
      const data = await response.json();
      errorMsg = data.detail || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  return response.json();
}
