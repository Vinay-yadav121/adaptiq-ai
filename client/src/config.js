// The address of the Node server. On your computer it falls back to localhost;
// when deployed, we set VITE_API_URL to the real server address.
export const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";