"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format, parse } from "date-fns"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { updateDevice } from "@/app/actions"
import type { DisputedDevice } from "./feedback-table"

const formSchema = z.object({
  jcpp_entity_name: z
    .string()
    .min(1, {
      message: "Entity name is required",
    })
    .toLowerCase(),
  unit_id: z.string().min(1, {
    message: "Current unit ID is required",
  }),
  decommissioned_date: z.date().optional(),
  alternate_unit_id: z.string().optional(),
  alternate_entity_name: z.string().optional(),
  comments: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditDeviceFormProps {
  device: DisputedDevice
}

export function EditDeviceForm({ device }: EditDeviceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Parse dates from string to Date objects
  const parseDate = (dateString: string | undefined) => {
    if (!dateString) return undefined
    return parse(dateString, "yyyy-MM-dd", new Date())
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jcpp_entity_name: device.jcpp_entity_name,
      unit_id: device.unit_id,
      decommissioned_date: parseDate(device.decommissioned_date),
      alternate_unit_id: device.alternate_unit_id || "",
      alternate_entity_name: device.alternate_entity_name || "",
      comments: "", // Start with empty comments for new additions
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // Create FormData object for server action
      const formData = new FormData()

      // Add form fields to FormData
      formData.append("jcpp_entity_name", data.jcpp_entity_name)
      formData.append("unit_id", data.unit_id)

      if (data.decommissioned_date) {
        formData.append("decommissioned_date", data.decommissioned_date.toISOString())
      }

      if (data.alternate_unit_id) {
        formData.append("alternate_unit_id", data.alternate_unit_id)
      }

      if (data.alternate_entity_name) {
        formData.append("alternate_entity_name", data.alternate_entity_name)
      }

      if (data.comments) {
        formData.append("comments", data.comments)
      }

      // Submit form using server action
      const result = await updateDevice(device._id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Device updated successfully",
        })

        // Reset just the comments field
        form.setValue("comments", "")

        // Redirect to device detail page
        router.push(`/device/${device._id}`)
        router.refresh()
      } else {
        throw new Error(result.message || "Failed to update device")
      }
    } catch (error) {
      console.error("Error updating device:", error)
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "There was an error updating the device",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Entity</CardTitle>
        <CardDescription>Update information for this entity and add new comments</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="jcpp_entity_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter entity name" {...field} />
                    </FormControl>
                    <FormDescription>The name of the entity that is in dispute (lowercase)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Unit ID*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter current unit ID" {...field} />
                    </FormControl>
                    <FormDescription>The unit_id currently assigned to the entity</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decommissioned_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Decommissioned Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>Select date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Date the device was removed from the network (if applicable)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternate_unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Unit ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter alternate unit ID" {...field} />
                    </FormControl>
                    <FormDescription>The unit_id that you want the entity to be changed to</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternate_entity_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Entity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter alternate entity name" {...field} />
                    </FormControl>
                    <FormDescription>The unique name that you believe the entity should have</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border p-4 rounded-md bg-muted/20">
              <h3 className="font-medium mb-2">Existing Comments</h3>
              <div className="whitespace-pre-line text-sm text-muted-foreground mb-4">
                {device.comments || "No comments available"}
              </div>
            </div>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add New Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a new comment about this entity" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>New comments will be appended to the existing comments history</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push(`/device/${device._id}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Device"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
