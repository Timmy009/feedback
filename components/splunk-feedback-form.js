"use client"
import { useState } from "react"
import { ControlGroup } from "./splunk-ui/control-group"
import { Text } from "./splunk-ui/text"
import { TextArea } from "./splunk-ui/textarea"
import { Button } from "./splunk-ui/button"
import { Card } from "./splunk-ui/card"
import { Heading } from "./splunk-ui/typography"
import { P } from "./splunk-ui/typography"
import { Message } from "./splunk-ui/message"
import { DatePicker } from "./splunk-ui/date-picker"
import { submitFeedback } from "@/app/actions"

export function SplunkFeedbackForm() {
  const [formData, setFormData] = useState({
    jcpp_entity_name: "",
    unit_id: "",
    decommissioned_date: "",
    alternate_unit_id: "",
    alternate_entity_name: "",
    reported_by: "",
    comments: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Create FormData object for server action
      const formDataObj = new FormData()

      // Add form fields to FormData
      formDataObj.append("jcpp_entity_name", formData.jcpp_entity_name.toLowerCase())
      formDataObj.append("unit_id", formData.unit_id)

      if (formData.decommissioned_date) {
        formDataObj.append("decommissioned_date", formData.decommissioned_date)
      }

      if (formData.alternate_unit_id) {
        formDataObj.append("alternate_unit_id", formData.alternate_unit_id)
      }

      if (formData.alternate_entity_name) {
        formDataObj.append("alternate_entity_name", formData.alternate_entity_name)
      }

      formDataObj.append("reported_by", formData.reported_by)

      if (formData.comments) {
        formDataObj.append("comments", formData.comments)
      }

      // Submit form using server action
      const result = await submitFeedback(formDataObj)

      if (result.success) {
        setMessage({ type: "success", text: result.message || "Feedback submitted successfully" })
        // Reset form
        setFormData({
          jcpp_entity_name: "",
          unit_id: "",
          decommissioned_date: "",
          alternate_unit_id: "",
          alternate_entity_name: "",
          reported_by: "",
          comments: "",
        })
      } else {
        throw new Error(result.message || "Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "There was an error submitting your feedback",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <Card.Header>
        <Heading level={2}>Entity Dispute Form</Heading>
        <P>Use this form to report issues with data entities in the Core Dataset.</P>
      </Card.Header>
      <Card.Body>
        {message && <Message appearance={message.type}>{message.text}</Message>}

        <form onSubmit={handleSubmit}>
          <div className="splunk-grid-2 splunk-mb-16">
            <ControlGroup label="Entity Name *" help="The name of the entity that is in dispute (lowercase)">
              <Text
                value={formData.jcpp_entity_name}
                onChange={(e, { value }) => handleInputChange("jcpp_entity_name", value)}
                placeholder="Enter entity name"
                required
              />
            </ControlGroup>

            <ControlGroup label="Current Unit ID *" help="The unit_id currently assigned to the entity">
              <Text
                value={formData.unit_id}
                onChange={(e, { value }) => handleInputChange("unit_id", value)}
                placeholder="Enter current unit ID"
                required
              />
            </ControlGroup>

            <ControlGroup
              label="Decommissioned Date"
              help="Date the device was removed from the network (if applicable)"
            >
              <DatePicker
                value={formData.decommissioned_date}
                onChange={(e, { value }) => handleInputChange("decommissioned_date", value)}
                placeholder="Select date"
              />
            </ControlGroup>

            <ControlGroup label="Alternate Unit ID" help="The unit_id that you want the entity to be changed to">
              <Text
                value={formData.alternate_unit_id}
                onChange={(e, { value }) => handleInputChange("alternate_unit_id", value)}
                placeholder="Enter alternate unit ID"
              />
            </ControlGroup>

            <ControlGroup label="Alternate Entity Name" help="The unique name that you believe the entity should have">
              <Text
                value={formData.alternate_entity_name}
                onChange={(e, { value }) => handleInputChange("alternate_entity_name", value)}
                placeholder="Enter alternate entity name"
              />
            </ControlGroup>

            <ControlGroup label="Reported By *" help="Your email address">
              <Text
                value={formData.reported_by}
                onChange={(e, { value }) => handleInputChange("reported_by", value)}
                placeholder="your.email@example.com"
                type="email"
                required
              />
            </ControlGroup>
          </div>

          <ControlGroup label="Comments" help="Provide details about the issue with this entity">
            <TextArea
              value={formData.comments}
              onChange={(e, { value }) => handleInputChange("comments", value)}
              placeholder="Add any additional information about this entity dispute"
              rows={4}
            />
          </ControlGroup>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <Button appearance="primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  )
}
