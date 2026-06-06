export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  try {
    const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || "https://manus.im/oauth";
    const appId = import.meta.env.VITE_APP_ID || "";
    const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/callback` : "";
    const state = typeof window !== 'undefined' ? btoa(redirectUri) : "";

    let baseUrl = oauthPortalUrl;
    if (!baseUrl.startsWith('http')) {
      baseUrl = `https://${baseUrl}`;
    }
    
    // Manual string concatenation to avoid new URL() constructor issues if env is weird
    const cleanBase = baseUrl.replace(/\/$/, '');
    const loginUrl = `${cleanBase}/app-auth?appId=${encodeURIComponent(appId)}&redirectUri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&type=signIn`;
    
    return loginUrl;
  } catch (e) {
    console.error("Critical error generating login URL:", e);
    return "/login";
  }
};
