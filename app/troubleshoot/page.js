import { SplunkConnectionStatus } from "@/components/splunk-connection-status"
import { Button } from "@/components/splunk-ui/button"
import { Card } from "@/components/splunk-ui/card"
import { Heading, P } from "@/components/splunk-ui/typography"
import Link from "next/link"

export default function TroubleshootPage() {
  return (
    <div className="splunk-p-24">
      <div className="splunk-flex-between splunk-mb-24">
        <div>
          <Heading level={1}>Troubleshooting</Heading>
          <P>Diagnose and fix issues with the Core Dataset Feedback system</P>
        </div>
        <Button appearance="secondary">
          <Link href="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="splunk-grid-2">
        <SplunkConnectionStatus />

        <Card>
          <Card.Header>
            <Heading level={2}>Common Issues</Heading>
            <P>Solutions for common problems</P>
          </Card.Header>
          <Card.Body>
            <div className="splunk-mb-16">
              <Heading level={3}>Failed to fetch</Heading>
              <P>This error typically occurs due to:</P>
              <ul style={{ listStyle: "disc", paddingLeft: "20px", marginTop: "8px" }}>
                <li>Missing or incorrect Splunk environment variables</li>
                <li>CORS issues when connecting to Splunk</li>
                <li>Self-signed certificate issues</li>
                <li>Network connectivity problems</li>
              </ul>
            </div>

            <div className="splunk-mb-16">
              <Heading level={3}>Self-signed Certificate Issues</Heading>
              <P>
                If your Splunk instance uses a self-signed certificate, set the environment variable
                <code style={{ background: "#f5f5f5", padding: "2px 4px", margin: "0 4px", borderRadius: "4px" }}>
                  NODE_TLS_REJECT_UNAUTHORIZED=0
                </code>
                to bypass certificate validation in development.
              </P>
            </div>

            <div>
              <Heading level={3}>KVStore Configuration</Heading>
              <P>
                Ensure that the KVStore is enabled in your Splunk instance and that the
                <code style={{ background: "#f5f5f5", padding: "2px 4px", margin: "0 4px", borderRadius: "4px" }}>
                  disputed_devices
                </code>
                collection exists.
              </P>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
