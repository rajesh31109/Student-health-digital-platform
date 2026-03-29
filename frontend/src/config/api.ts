/**
 * API Configuration
 * Dynamically determines the backend API URL based on the environment
 * Safe for build-time and runtime usage
 */

export const getApiBaseUrl = (): string => {
  // Check if we have environment variable set (from .env or Vercel)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.includes('/api') ? envUrl : envUrl + '/api';
  }

  // Only use window.location if window is defined (runtime only)
  if (typeof window !== 'undefined') {
    // If in development with localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }

    // If in GitHub Codespaces environment
    if (window.location.hostname.includes('github.dev') || window.location.hostname.includes('preview.app.github.dev')) {
      // Construct the backend URL using the same domain but port 3001
      const protocol = window.location.protocol;
      const hostname = window.location.hostname.replace(/^\d+-/, '').replace(/^8080-/, '');
      return `${protocol}//3001-${hostname}/api`;
    }
  }

  // Fallback for build time and other cases
  return 'http://localhost:3001/api';
};

// Initialize at module load time
let apiBaseUrl: string | null = null;

export const API_BASE_URL = (() => {
  if (apiBaseUrl === null) {
    apiBaseUrl = getApiBaseUrl();
  }
  return apiBaseUrl;
})();
