"use server"

import { format } from "date-fns"
import {
  createDisputedDevice,
  getAllDisputedDevices,
  getDisputedDeviceById,
  updateDisputedDevice,
  deleteDisputedDevice,
} from "@/lib/splunk-api"

/**
 * Submit feedback for a disputed device
 */
export async function submitFeedback(formData) {
  try {
    // Extract form data
    const rawData = {
      jcpp_entity_name: formData.get("jcpp_entity_name"),
      unit_id: formData.get("unit_id"),
      decommissioned_date: formData.get("decommissioned_date")
        ? new Date(formData.get("decommissioned_date"))
        : undefined,
      alternate_unit_id: formData.get("alternate_unit_id"),
      alternate_entity_name: formData.get("alternate_entity_name"),
      reported_by: formData.get("reported_by"),
      comments: formData.get("comments"),
    }

    // Basic validation
    if (!rawData.jcpp_entity_name || !rawData.unit_id || !rawData.reported_by) {
      throw new Error("Required fields are missing")
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(rawData.reported_by)) {
      throw new Error("Please enter a valid email address")
    }

    // Format dates for submission
    const today = new Date()
    const formattedData = {
      ...rawData,
      jcpp_entity_name: rawData.jcpp_entity_name.toLowerCase(),
      reported_date: format(today, "yyyy-MM-dd"),
      last_updated: format(today, "yyyy-MM-dd"),
      decommissioned_date: rawData.decommissioned_date ? format(rawData.decommissioned_date, "yyyy-MM-dd") : undefined,
      // Add timestamp to comments
      comments: rawData.comments ? `${format(today, "yyyy-MM-dd HH:mm:ss")}: ${rawData.comments}` : "",
    }

    // Submit to Splunk KVStore
    const result = await createDisputedDevice(formattedData)

    if (!result.success) {
      throw new Error(result.error || "Failed to submit feedback")
    }

    return { success: true, message: "Feedback submitted successfully" }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Get all disputed devices
 */
export async function getDisputedDevices() {
  try {
    const result = await getAllDisputedDevices()

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch disputed devices")
    }

    return {
      success: true,
      data: result.data,
      warning: result.warning, // Pass through any warnings
    }
  } catch (error) {
    console.error("Error fetching disputed devices:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: [],
    }
  }
}

/**
 * Get a disputed device by ID
 */
export async function getDeviceById(id) {
  try {
    const result = await getDisputedDeviceById(id)

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch disputed device")
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error(`Error fetching disputed device with ID ${id}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Update a disputed device
 */
export async function updateDevice(id, formData) {
  try {
    // First, get the existing device
    const existingDevice = await getDisputedDeviceById(id)

    if (!existingDevice.success) {
      throw new Error(existingDevice.error || "Failed to fetch disputed device for update")
    }

    // Extract form data
    const rawData = {
      jcpp_entity_name: formData.get("jcpp_entity_name"),
      unit_id: formData.get("unit_id"),
      decommissioned_date: formData.get("decommissioned_date")
        ? new Date(formData.get("decommissioned_date"))
        : undefined,
      alternate_unit_id: formData.get("alternate_unit_id"),
      alternate_entity_name: formData.get("alternate_entity_name"),
      reported_by: existingDevice.data.reported_by, // Keep the original reporter
      comments: formData.get("comments"),
    }

    // Basic validation
    if (!rawData.jcpp_entity_name || !rawData.unit_id) {
      throw new Error("Required fields are missing")
    }

    // Format dates for submission
    const today = new Date()
    const formattedData = {
      ...existingDevice.data, // Keep existing data
      ...rawData, // Update with new data
      jcpp_entity_name: rawData.jcpp_entity_name.toLowerCase(),
      last_updated: format(today, "yyyy-MM-dd"),
      decommissioned_date: rawData.decommissioned_date
        ? format(rawData.decommissioned_date, "yyyy-MM-dd")
        : existingDevice.data.decommissioned_date,
      // Append new comment if provided
      comments: rawData.comments
        ? `${existingDevice.data.comments}\n${format(today, "yyyy-MM-dd HH:mm:ss")}: ${rawData.comments}`
        : existingDevice.data.comments,
    }

    // Submit to Splunk KVStore
    const result = await updateDisputedDevice(id, formattedData)

    if (!result.success) {
      throw new Error(result.error || "Failed to update disputed device")
    }

    return { success: true, message: "Device updated successfully" }
  } catch (error) {
    console.error(`Error updating disputed device with ID ${id}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Mark a device as inactive
 */
export async function markDeviceAsInactive(id) {
  try {
    // First, get the existing device
    const existingDevice = await getDisputedDeviceById(id)

    if (!existingDevice.success) {
      throw new Error(existingDevice.error || "Failed to fetch disputed device")
    }

    // Update the device with inactive_date
    const today = new Date()
    const updatedData = {
      ...existingDevice.data,
      inactive_date: format(today, "yyyy-MM-dd"),
      last_updated: format(today, "yyyy-MM-dd"),
    }

    // Submit to Splunk KVStore
    const result = await updateDisputedDevice(id, updatedData)

    if (!result.success) {
      throw new Error(result.error || "Failed to mark device as inactive")
    }

    return { success: true, message: "Device marked as inactive successfully" }
  } catch (error) {
    console.error(`Error marking disputed device with ID ${id} as inactive:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Delete a disputed device
 */
export async function deleteDevice(id) {
  try {
    const result = await deleteDisputedDevice(id)

    if (!result.success) {
      throw new Error(result.error || "Failed to delete disputed device")
    }

    return { success: true, message: "Device deleted successfully" }
  } catch (error) {
    console.error(`Error deleting disputed device with ID ${id}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
