"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, InfoIcon } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { submitFeedback } from "@/app/actions"

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
  reported_by: z.string().email({
    message: "Please enter a valid email address",
  }),
  comments: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jcpp_entity_name: "",
      unit_id: "",
      alternate_unit_id: "",
      alternate_entity_name: "",
      reported_by: "",
      comments: "",
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

      formData.append("reported_by", data.reported_by)

      if (data.comments) {
        formData.append("comments", data.comments)
      }

      // Submit form using server action
      const result = await submitFeedback(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Feedback submitted successfully",
        })

        form.reset()

        // Refresh the data
        router.refresh()
      } else {
        throw new Error(result.message || "Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "There was an error submitting your feedback",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entity Dispute Form</CardTitle>
        <CardDescription>Use this form to report issues with data entities in the Core Dataset.</CardDescription>
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

              <FormField
                control={form.control}
                name="reported_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reported By*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormDescription>Your email address</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional information about this entity dispute"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide details about the issue with this entity</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fields marked with * are required</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-sm text-muted-foreground">
                The reported_date, last_updated, and inactive_date fields will be automatically populated.
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
