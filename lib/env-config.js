/**
 * Environment configuration for the application
 */

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === "development"

// Check if we should use mock data (for development or when API is unavailable)
export const useMockData = isDevelopment

// Check if we should ignore SSL certificate errors (for development with self-signed certs)
export const ignoreSSLErrors = process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0"

// Log environment configuration
if (isDevelopment) {
  console.log("Running in development mode")
  if (useMockData) {
    console.log("Using mock data when API is unavailable")
  }
  if (ignoreSSLErrors) {
    console.log("Ignoring SSL certificate errors")
  }
}
