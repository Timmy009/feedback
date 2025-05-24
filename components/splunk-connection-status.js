"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/splunk-ui/card"
import { Button } from "@/components/splunk-ui/button"
import { Message } from "@/components/splunk-ui/message"
import { WaitSpinner } from "@/components/splunk-ui/wait-spinner"
import { Heading, P } from "@/components/splunk-ui/typography"

export function SplunkConnectionStatus() {
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    data: null,
  })

  const checkConnection = async () => {
    setStatus({ loading: true, error: null, data: null })

    try {
      const response = await fetch("/api/splunk-test")

      if (!response.ok) {
        throw new Error(`Failed to check connection: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setStatus({ loading: false, error: null, data })
    } catch (error) {
      setStatus({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to check connection",
        data: null,
      })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (status.loading) {
    return (
      <Card>
        <Card.Header>
          <Heading level={2}>Checking Splunk Connection...</Heading>
        </Card.Header>
        <Card.Body className="splunk-flex-center" style={{ height: "200px" }}>
          <WaitSpinner size="large" />
          <span style={{ marginLeft: "16px" }}>Testing connection to Splunk...</span>
        </Card.Body>
      </Card>
    )
  }

  if (status.error) {
    return (
      <Card>
        <Card.Header>
          <Heading level={2}>Connection Check Failed</Heading>
        </Card.Header>
        <Card.Body>
          <Message appearance="error">{status.error}</Message>
          <div style={{ marginTop: "16px" }}>
            <Button appearance="primary" onClick={checkConnection}>
              Retry
            </Button>
          </div>
        </Card.Body>
      </Card>
    )
  }

  const { environmentVariables, connectionTest, tips } = status.data

  return (
    <Card>
      <Card.Header>
        <Heading level={2}>Splunk Connection Status</Heading>
        <P>{connectionTest.success ? "Successfully connected to Splunk" : "Failed to connect to Splunk"}</P>
      </Card.Header>
      <Card.Body>
        <div className="splunk-mb-16">
          <Heading level={3}>Connection Details</Heading>
          <P>{connectionTest.message}</P>
        </div>

        <div className="splunk-mb-16">
          <Heading level={3}>Environment Variables</Heading>
          <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
            {Object.entries(environmentVariables).map(([key, value]) => (
              <li key={key} style={{ color: value ? "#00a86b" : "#d93f3f" }}>
                {key}: {value ? "Set" : "Not set"}
              </li>
            ))}
          </ul>
        </div>

        {!connectionTest.success && (
          <div>
            <Heading level={3}>Troubleshooting Tips</Heading>
            <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: "16px" }}>
          <Button appearance="primary" onClick={checkConnection}>
            Refresh Status
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
