/**
 * API Configuration
 * Dynamically determines the backend API URL based on the environment
 */

export const getApiBaseUrl = (): string => {
  // If in development with localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }

  // If in GitHub Codespaces environment
  if (window.location.hostname.includes('github.dev') || window.location.hostname.includes('preview.app.github.dev')) {
    // Use VITE_API_URL from environment if available
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      return envUrl.replace(/\/api$/, '') + '/api';
    }
    // Construct the backend URL using the same domain but port 3001
    const protocol = window.location.protocol;
    const hostname = window.location.hostname.replace(/^\d+-/, '').replace(/^8080-/, '');
    return `${protocol}//3001-${hostname}/api`;
  }

  // Fallback to localhost for other cases
  return 'http://localhost:3001/api';
};

export const API_BASE_URL = getApiBaseUrl();
