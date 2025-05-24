import { SplunkFeedbackTable } from "@/components/splunk-feedback-table"
import { SplunkFeedbackForm } from "@/components/splunk-feedback-form"
import { Heading, P } from "@/components/splunk-ui/typography"
import { TabLayout } from "@/components/splunk-ui/tab-layout"

export default function DashboardPage() {
  return (
    <div className="splunk-p-24">
      <div className="splunk-mb-24">
        <Heading level={1}>Core Dataset Feedback Dashboard</Heading>
        <P>
          Report and track data entity issues in the Core Dataset. This dashboard allows entity owners to provide
          feedback and view existing disputes.
        </P>
      </div>

      <TabLayout>
        <TabLayout.Panel label="View Disputes" panelId="view">
          <SplunkFeedbackTable />
        </TabLayout.Panel>
        <TabLayout.Panel label="Report Issue" panelId="report">
          <SplunkFeedbackForm />
        </TabLayout.Panel>
      </TabLayout>
    </div>
  )
}
