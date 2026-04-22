/**
 * API Configuration
 * Safe for build-time and runtime usage
 * Handles all environment scenarios
 */

/**
 * Get API base URL with safety checks
 * - Checks environment variable first (for build time)
 * - Falls back to window.location checks (for runtime only)
 * - Never crashes during build
 */
export const getApiBaseUrl = (): string => {
  try {
    // Priority 1: Environment variable (set at build or runtime)
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      const url = envUrl.trim();
      if (url) {
        return url.endsWith('/api') ? url : `${url}/api`;
      }
    }

    // Priority 2: Runtime detection (only if window exists)
    if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;

      // Local development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001/api';
      }

      // Codespaces environment
      if (hostname.includes('github.dev') || hostname.includes('preview.app.github.dev')) {
        const cleanHostname = hostname.replace(/^\d+-/, '').replace(/^8080-/, '');
        return `${protocol}//3001-${cleanHostname}/api`;
      }

      // Default production backend URL when no VITE_API_URL is configured
      return 'https://student-health-backend.onrender.com/api';
    }

    // Priority 3: Safe fallback
    return 'https://student-health-backend.onrender.com/api';
  } catch (error) {
    // Even if something goes wrong, return a safe fallback
    console.warn('Failed to determine API URL, using fallback', error);
    return 'https://student-health-backend.onrender.com/api';
  }
};

/**
 * Lazy-initialize API_BASE_URL to avoid build-time issues
 */
let cachedApiUrl: string | null = null;

export const getAPIBaseURL = (): string => {
  if (!cachedApiUrl) {
    cachedApiUrl = getApiBaseUrl();
  }
  return cachedApiUrl;
};

// For backward compatibility
export const API_BASE_URL = getAPIBaseURL();
