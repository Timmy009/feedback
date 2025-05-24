import { NextResponse } from "next/server"
import { isDevelopment } from "@/lib/env-config"

// Constants for Splunk API
const SPLUNK_HOST = process.env.SPLUNK_HOST
const SPLUNK_PORT = process.env.SPLUNK_PORT || "8089"
const SPLUNK_USERNAME = process.env.SPLUNK_USERNAME
const SPLUNK_PASSWORD = process.env.SPLUNK_PASSWORD
const SPLUNK_APP = "search" // Change this to your app name if different
const SPLUNK_OWNER = "nobody" // Change this to the appropriate owner

export async function GET() {
  // Only allow this endpoint in development mode
  if (!isDevelopment) {
    return NextResponse.json({ error: "This endpoint is only available in development mode" }, { status: 403 })
  }

  try {
    // Check if environment variables are set
    const envCheck = {
      SPLUNK_HOST: !!SPLUNK_HOST,
      SPLUNK_PORT: !!SPLUNK_PORT,
      SPLUNK_USERNAME: !!SPLUNK_USERNAME,
      SPLUNK_PASSWORD: !!SPLUNK_PASSWORD,
    }

    // Don't expose actual credentials
    const config = {
      host: SPLUNK_HOST ? `${SPLUNK_HOST}:${SPLUNK_PORT}` : "Not configured",
      username: SPLUNK_USERNAME ? "Configured" : "Not configured",
      password: SPLUNK_PASSWORD ? "Configured" : "Not configured",
      app: SPLUNK_APP,
      owner: SPLUNK_OWNER,
    }

    // Test connection to Splunk
    let connectionTest = { success: false, message: "Not tested" }

    if (SPLUNK_HOST && SPLUNK_USERNAME && SPLUNK_PASSWORD) {
      try {
        // Base URL for Splunk API
        const SPLUNK_BASE_URL = `https://${SPLUNK_HOST}:${SPLUNK_PORT}`

        // Headers for authentication
        const authString = `${SPLUNK_USERNAME}:${SPLUNK_PASSWORD}`
        const base64Auth = Buffer.from(authString).toString("base64")

        const headers = {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/json",
        }

        // Test endpoint - just get server info
        const response = await fetch(`${SPLUNK_BASE_URL}/services/server/info?output_mode=json`, {
          method: "GET",
          headers,
          agent:
            process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0"
              ? new (require("https").Agent)({ rejectUnauthorized: false })
              : undefined,
        })

        if (response.ok) {
          const data = await response.json()
          connectionTest = {
            success: true,
            message: `Connected to Splunk ${data.entry[0].content.version || "Unknown version"}`,
          }
        } else {
          connectionTest = {
            success: false,
            message: `Failed to connect: ${response.status} ${response.statusText}`,
          }
        }
      } catch (error) {
        connectionTest = {
          success: false,
          message: `Connection error: ${error instanceof Error ? error.message : String(error)}`,
        }
      }
    }

    return NextResponse.json({
      environment: process.env.NODE_ENV,
      environmentVariables: envCheck,
      config,
      connectionTest,
      tips: [
        "If using self-signed certificates, set NODE_TLS_REJECT_UNAUTHORIZED=0 in your environment",
        "Make sure your Splunk instance is accessible from your server",
        "Check that your Splunk user has the necessary permissions",
        "Verify that the KVStore is enabled in your Splunk instance",
      ],
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to test Splunk connection",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
