import { auth } from "./firebase";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
  // Try to get the current user's token
  let token = null;
  if (auth.currentUser) {
    // If this is a retry, force refresh the token
    token = await auth.currentUser.getIdToken(retryCount > 0);
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
    if (response.status === 401 && retryCount === 0 && auth.currentUser) {
      console.warn("Token expired or unauthorized, attempting to refresh token...");
      return fetchWithAuth(endpoint, options, 1);
    }
    
    let errorMsg = `API Error: ${response.statusText}`;
    try {
      const data = await response.json();
      errorMsg = data.detail || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  return response.json();
}
