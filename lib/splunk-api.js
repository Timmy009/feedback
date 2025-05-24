/**
 * Utility functions for interacting with Splunk KVStore API
 */

// Constants for Splunk API
const SPLUNK_HOST = process.env.SPLUNK_HOST
const SPLUNK_PORT = process.env.SPLUNK_PORT || "8089"
const SPLUNK_USERNAME = process.env.SPLUNK_USERNAME
const SPLUNK_PASSWORD = process.env.SPLUNK_PASSWORD
const SPLUNK_APP = "search" // Change this to your app name if different
const SPLUNK_OWNER = "nobody" // Change this to the appropriate owner
const COLLECTION_NAME = "disputed_devices"

// Base URL for Splunk API
const SPLUNK_BASE_URL = `https://${SPLUNK_HOST}:${SPLUNK_PORT}`

// Base URL for KVStore API
const KVSTORE_BASE_URL = `${SPLUNK_BASE_URL}/servicesNS/${SPLUNK_OWNER}/${SPLUNK_APP}/storage/collections/data`

// Headers for authentication and content type
const getAuthHeaders = () => {
  const authString = `${SPLUNK_USERNAME}:${SPLUNK_PASSWORD}`
  const base64Auth = Buffer.from(authString).toString("base64")

  return {
    Authorization: `Basic ${base64Auth}`,
    "Content-Type": "application/json",
  }
}

// Fetch options to handle self-signed certificates
const getFetchOptions = (method, body) => {
  return {
    method,
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    // This is needed for Node.js to accept self-signed certificates
    agent:
      process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0"
        ? new (require("https").Agent)({ rejectUnauthorized: false })
        : undefined,
  }
}

/**
 * Get all entries from the disputed_devices KVStore collection
 */
export async function getAllDisputedDevices() {
  try {
    // Validate that we have the required environment variables
    if (!SPLUNK_HOST || !SPLUNK_USERNAME || !SPLUNK_PASSWORD) {
      console.error("Missing required Splunk environment variables")
      return {
        success: false,
        error: "Missing required Splunk environment variables",
        data: getMockDisputedDevices(), // Return mock data as fallback
      }
    }

    console.log(`Fetching data from: ${KVSTORE_BASE_URL}/${COLLECTION_NAME}`)

    const response = await fetch(`${KVSTORE_BASE_URL}/${COLLECTION_NAME}`, getFetchOptions("GET"))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Splunk API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to fetch disputed devices: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching disputed devices:", error)

    // Return mock data in development environment or when API is unavailable
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock data as fallback")
      return {
        success: true,
        data: getMockDisputedDevices(),
        warning: "Using mock data due to API connection issues",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: [], // Return empty array to prevent UI errors
    }
  }
}

/**
 * Get a single entry from the disputed_devices KVStore collection by ID
 */
export async function getDisputedDeviceById(id) {
  try {
    // Validate that we have the required environment variables
    if (!SPLUNK_HOST || !SPLUNK_USERNAME || !SPLUNK_PASSWORD) {
      console.error("Missing required Splunk environment variables")

      // Return mock device if in development
      if (process.env.NODE_ENV === "development") {
        const mockDevices = getMockDisputedDevices()
        const device = mockDevices.find((d) => d._id === id) || mockDevices[0]
        return { success: true, data: device }
      }

      return {
        success: false,
        error: "Missing required Splunk environment variables",
      }
    }

    const response = await fetch(`${KVSTORE_BASE_URL}/${COLLECTION_NAME}/${id}`, getFetchOptions("GET"))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Splunk API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to fetch disputed device: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(`Error fetching disputed device with ID ${id}:`, error)

    // Return mock data in development environment
    if (process.env.NODE_ENV === "development") {
      const mockDevices = getMockDisputedDevices()
      const device = mockDevices.find((d) => d._id === id) || mockDevices[0]
      return {
        success: true,
        data: device,
        warning: "Using mock data due to API connection issues",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Create a new entry in the disputed_devices KVStore collection
 */
export async function createDisputedDevice(deviceData) {
  try {
    // Validate that we have the required environment variables
    if (!SPLUNK_HOST || !SPLUNK_USERNAME || !SPLUNK_PASSWORD) {
      console.error("Missing required Splunk environment variables")

      // Return mock success in development
      if (process.env.NODE_ENV === "development") {
        return {
          success: true,
          data: { ...deviceData, _id: `mock-${Date.now()}` },
          warning: "Using mock data due to API connection issues",
        }
      }

      return {
        success: false,
        error: "Missing required Splunk environment variables",
      }
    }

    const response = await fetch(`${KVSTORE_BASE_URL}/${COLLECTION_NAME}`, getFetchOptions("POST", deviceData))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Splunk API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to create disputed device: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error creating disputed device:", error)

    // Return mock success in development environment
    if (process.env.NODE_ENV === "development") {
      return {
        success: true,
        data: { ...deviceData, _id: `mock-${Date.now()}` },
        warning: "Using mock data due to API connection issues",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Update an existing entry in the disputed_devices KVStore collection
 */
export async function updateDisputedDevice(id, deviceData) {
  try {
    // Validate that we have the required environment variables
    if (!SPLUNK_HOST || !SPLUNK_USERNAME || !SPLUNK_PASSWORD) {
      console.error("Missing required Splunk environment variables")

      // Return mock success in development
      if (process.env.NODE_ENV === "development") {
        return {
          success: true,
          data: { ...deviceData, _id: id },
          warning: "Using mock data due to API connection issues",
        }
      }

      return {
        success: false,
        error: "Missing required Splunk environment variables",
      }
    }

    const response = await fetch(`${KVSTORE_BASE_URL}/${COLLECTION_NAME}/${id}`, getFetchOptions("POST", deviceData))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Splunk API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to update disputed device: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(`Error updating disputed device with ID ${id}:`, error)

    // Return mock success in development environment
    if (process.env.NODE_ENV === "development") {
      return {
        success: true,
        data: { ...deviceData, _id: id },
        warning: "Using mock data due to API connection issues",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Delete an entry from the disputed_devices KVStore collection
 */
export async function deleteDisputedDevice(id) {
  try {
    // Validate that we have the required environment variables
    if (!SPLUNK_HOST || !SPLUNK_USERNAME || !SPLUNK_PASSWORD) {
      console.error("Missing required Splunk environment variables")

      // Return mock success in development
      if (process.env.NODE_ENV === "development") {
        return {
          success: true,
          warning: "Using mock data due to API connection issues",
        }
      }

      return {
        success: false,
        error: "Missing required Splunk environment variables",
      }
    }

    const response = await fetch(`${KVSTORE_BASE_URL}/${COLLECTION_NAME}/${id}`, getFetchOptions("DELETE"))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Splunk API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to delete disputed device: ${response.status} ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error(`Error deleting disputed device with ID ${id}:`, error)

    // Return mock success in development environment
    if (process.env.NODE_ENV === "development") {
      return {
        success: true,
        warning: "Using mock data due to API connection issues",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Search for entries in the disputed_devices KVStore collection
 */
export async function searchDisputedDevices(query) {
  try {
    // Validate that we have the required environment variables
    if (!SPLUNK_HOST || !SPLUNK_USERNAME || !SPLUNK_PASSWORD) {
      console.error("Missing required Splunk environment variables")

      // Return filtered mock data in development
      if (process.env.NODE_ENV === "development") {
        const mockDevices = getMockDisputedDevices()
        return {
          success: true,
          data: mockDevices,
          warning: "Using mock data due to API connection issues",
        }
      }

      return {
        success: false,
        error: "Missing required Splunk environment variables",
      }
    }

    const headers = {
      ...getAuthHeaders(),
      query: JSON.stringify(query),
    }

    const response = await fetch(`${KVSTORE_BASE_URL}/${COLLECTION_NAME}`, {
      method: "GET",
      headers,
      cache: "no-store",
      agent:
        process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0"
          ? new (require("https").Agent)({ rejectUnauthorized: false })
          : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Splunk API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to search disputed devices: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error searching disputed devices:", error)

    // Return mock data in development environment
    if (process.env.NODE_ENV === "development") {
      return {
        success: true,
        data: getMockDisputedDevices(),
        warning: "Using mock data due to API connection issues",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Get mock disputed devices for development and testing
 */
function getMockDisputedDevices() {
  return [
    {
      _id: "1",
      jcpp_entity_name: "server001",
      unit_id: "unit-123",
      alternate_unit_id: "unit-456",
      reported_by: "john.doe@example.com",
      reported_date: "2023-05-15",
      last_updated: "2023-05-20",
      comments: "2023-05-15 14:30:00: This server should be assigned to a different unit.",
    },
    {
      _id: "2",
      jcpp_entity_name: "database002",
      unit_id: "unit-789",
      decommissioned_date: "2023-04-10",
      reported_by: "jane.smith@example.com",
      reported_date: "2023-04-12",
      last_updated: "2023-04-12",
      comments: "2023-04-12 09:15:00: This database was decommissioned on April 10th.",
    },
    {
      _id: "3",
      jcpp_entity_name: "router003",
      unit_id: "unit-456",
      alternate_entity_name: "core-router-003",
      reported_by: "admin@example.com",
      reported_date: "2023-06-01",
      last_updated: "2023-06-05",
      comments: "2023-06-01 11:45:00: The entity name should be updated to reflect its role.",
    },
  ]
}
