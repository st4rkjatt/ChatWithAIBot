// authUtils.ts
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  exp: number; // expiry timestamp in seconds
}

export const setAutoLogout = (token: string, logout: () => void) => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const expiryTime = decoded.exp * 1000; // Convert to ms
    const currentTime = Date.now();
    const timeout = expiryTime - currentTime;

    if (timeout <= 0) {
      logout(); // Already expired
    } else {
      setTimeout(() => {
        logout(); // Auto logout
      }, timeout);
    }
  } catch (error) {
    console.error("Invalid token", error);
    logout();
  }
};
