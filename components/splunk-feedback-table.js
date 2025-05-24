"use client"

import { useState, useEffect } from "react"
import { Table } from "@/components/splunk-ui/table"
import { Button } from "@/components/splunk-ui/button"
import { Text } from "@/components/splunk-ui/text"
import { Message } from "@/components/splunk-ui/message"
import { WaitSpinner } from "@/components/splunk-ui/wait-spinner"
import { Menu } from "@/components/splunk-ui/menu"
import { Popover } from "@/components/splunk-ui/popover"
import { Modal } from "@/components/splunk-ui/modal"
import { P } from "@/components/splunk-ui/typography"
import { getDisputedDevices, markDeviceAsInactive, deleteDevice } from "@/app/actions"
import { useRouter } from "next/navigation"

export function SplunkFeedbackTable() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterText, setFilterText] = useState("")
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState(null)
  const router = useRouter()

  // Fetch data from Splunk KVStore
  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getDisputedDevices()

      if (result.success) {
        setData(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch disputed devices")
      }
    } catch (error) {
      console.error("Error fetching disputed devices:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Filter data based on search text
  const filteredData = data.filter((device) => device.jcpp_entity_name.toLowerCase().includes(filterText.toLowerCase()))

  const handleAction = async () => {
    if (!selectedDevice || !actionType) return

    try {
      let result
      if (actionType === "inactive") {
        result = await markDeviceAsInactive(selectedDevice._id)
      } else {
        result = await deleteDevice(selectedDevice._id)
      }

      if (result.success) {
        fetchData() // Refresh data
        setActionModalOpen(false)
        setSelectedDevice(null)
        setActionType(null)
      } else {
        throw new Error(result.message || `Failed to ${actionType} device`)
      }
    } catch (error) {
      console.error(`Error ${actionType} device:`, error)
      setError(error instanceof Error ? error.message : `Failed to ${actionType} device`)
    }
  }

  const ActionMenu = ({ device }) => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
      <Popover open={menuOpen} onRequestClose={() => setMenuOpen(false)}>
        <Popover.Trigger>
          <Button appearance="secondary" onClick={() => setMenuOpen(!menuOpen)}>
            Actions
          </Button>
        </Popover.Trigger>
        <Popover.Body>
          <Menu>
            <Menu.Item
              onClick={() => {
                navigator.clipboard.writeText(device._id)
                setMenuOpen(false)
              }}
            >
              Copy ID
            </Menu.Item>
            <Menu.Item onClick={() => router.push(`/device/${device._id}`)}>View Details</Menu.Item>
            <Menu.Item onClick={() => router.push(`/device/${device._id}/edit`)}>Edit</Menu.Item>
            {!device.inactive_date && (
              <Menu.Item
                onClick={() => {
                  setSelectedDevice(device)
                  setActionType("inactive")
                  setActionModalOpen(true)
                  setMenuOpen(false)
                }}
              >
                Mark as Inactive
              </Menu.Item>
            )}
            <Menu.Item
              onClick={() => {
                setSelectedDevice(device)
                setActionType("delete")
                setActionModalOpen(true)
                setMenuOpen(false)
              }}
            >
              Delete
            </Menu.Item>
          </Menu>
        </Popover.Body>
      </Popover>
    )
  }

  if (isLoading) {
    return (
      <div className="splunk-flex-center" style={{ height: "400px" }}>
        <WaitSpinner size="large" />
        <span style={{ marginLeft: "16px" }}>Loading disputed devices...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="splunk-text-center" style={{ padding: "40px" }}>
        <Message appearance="error">{error}</Message>
        <Button onClick={fetchData} style={{ marginTop: "16px" }}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="splunk-flex-between splunk-mb-16">
        <Text
          value={filterText}
          onChange={(e, { value }) => setFilterText(value)}
          placeholder="Filter entities..."
          style={{ width: "300px" }}
        />
        <Button onClick={fetchData}>Refresh</Button>
      </div>

      <Table stripeRows>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Entity Name</Table.HeadCell>
            <Table.HeadCell>Current Unit ID</Table.HeadCell>
            <Table.HeadCell>Alternate Unit ID</Table.HeadCell>
            <Table.HeadCell>Reported By</Table.HeadCell>
            <Table.HeadCell>Reported Date</Table.HeadCell>
            <Table.HeadCell>Last Updated</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {filteredData.map((device) => (
            <Table.Row key={device._id}>
              <Table.Cell style={{ fontWeight: "bold" }}>{device.jcpp_entity_name}</Table.Cell>
              <Table.Cell>{device.unit_id}</Table.Cell>
              <Table.Cell>{device.alternate_unit_id || "-"}</Table.Cell>
              <Table.Cell>{device.reported_by}</Table.Cell>
              <Table.Cell>{device.reported_date}</Table.Cell>
              <Table.Cell>{device.last_updated}</Table.Cell>
              <Table.Cell>
                <span style={{ color: device.inactive_date ? "#d93f3f" : "#00a86b" }}>
                  {device.inactive_date ? "Inactive" : "Active"}
                </span>
              </Table.Cell>
              <Table.Cell>
                <ActionMenu device={device} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {filteredData.length === 0 && (
        <div className="splunk-text-center" style={{ padding: "40px" }}>
          <Message appearance="info">No disputed devices found.</Message>
        </div>
      )}

      <Modal open={actionModalOpen} onRequestClose={() => setActionModalOpen(false)}>
        <Modal.Header title={`${actionType === "inactive" ? "Mark as Inactive" : "Delete Device"}`} />
        <Modal.Body>
          <P>
            {actionType === "inactive"
              ? "This will mark the device as inactive. The device will no longer be included in statistics."
              : "This action cannot be undone. This will permanently delete the device from the KVStore."}
          </P>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setActionModalOpen(false)}>Cancel</Button>
          <Button
            appearance={actionType === "delete" ? "destructive" : "primary"}
            onClick={handleAction}
            style={{ marginLeft: "8px" }}
          >
            {actionType === "inactive" ? "Mark Inactive" : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
