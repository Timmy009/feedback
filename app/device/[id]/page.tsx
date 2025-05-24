import { getDeviceById } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function DeviceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const result = await getDeviceById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const device = result.data

  // Format comments for display
  const formattedComments = device.comments.split("\n").map((comment, index) => (
    <p key={index} className="py-1">
      {comment}
    </p>
  ))

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Device Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href={`/device/${id}/edit`}>Edit Device</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Entity Information</CardTitle>
            <CardDescription>Basic information about this entity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entity Name</p>
                <p className="text-lg font-medium">{device.jcpp_entity_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Unit ID</p>
                <p className="text-lg font-medium">{device.unit_id}</p>
              </div>
              {device.alternate_entity_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alternate Entity Name</p>
                  <p className="text-lg font-medium">{device.alternate_entity_name}</p>
                </div>
              )}
              {device.alternate_unit_id && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alternate Unit ID</p>
                  <p className="text-lg font-medium">{device.alternate_unit_id}</p>
                </div>
              )}
              {device.decommissioned_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Decommissioned Date</p>
                  <p className="text-lg font-medium">{device.decommissioned_date}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
            <CardDescription>Status and reporting details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className={`text-lg font-medium ${device.inactive_date ? "text-red-500" : "text-green-500"}`}>
                  {device.inactive_date ? "Inactive" : "Active"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reported By</p>
                <p className="text-lg font-medium">{device.reported_by}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reported Date</p>
                <p className="text-lg font-medium">{device.reported_date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-lg font-medium">{device.last_updated}</p>
              </div>
              {device.inactive_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive Date</p>
                  <p className="text-lg font-medium">{device.inactive_date}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Comments History</CardTitle>
          <CardDescription>History of comments on this entity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {formattedComments.length > 0 ? (
              formattedComments
            ) : (
              <p className="text-muted-foreground">No comments available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
