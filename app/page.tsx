import { SplunkFeedbackForm } from "@/components/splunk-feedback-form"
import { Heading } from "@/components/splunk-ui/typography"
import { P } from "@/components/splunk-ui/typography"

export default function Home() {
  return (
    <div className="splunk-p-24">
      <div className="splunk-mb-24">
        <Heading level={1}>Core Dataset Feedback</Heading>
        <P>
          Report and track data entity issues in the Core Dataset. This form allows entity owners to provide feedback on
          data entities using Splunk Enterprise components.
        </P>
      </div>
      <SplunkFeedbackForm />
    </div>
  )
}
