import { getDeviceById } from "@/app/actions"
import { EditDeviceForm } from "@/components/edit-device-form"
import { notFound } from "next/navigation"

export default async function EditDevicePage({ params }: { params: { id: string } }) {
  const { id } = params
  const result = await getDeviceById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Edit Device</h1>
          <p className="text-muted-foreground">Update information for entity: {result.data.jcpp_entity_name}</p>
        </div>

        <EditDeviceForm device={result.data} />
      </div>
    </div>
  )
}
