"use client"

import { useState, useEffect } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getDisputedDevices, markDeviceAsInactive, deleteDevice } from "@/app/actions"

// Type for disputed device
export type DisputedDevice = {
  _id: string
  jcpp_entity_name: string
  unit_id: string
  decommissioned_date?: string
  alternate_unit_id?: string
  alternate_entity_name?: string
  reported_by: string
  reported_date: string
  last_updated: string
  inactive_date?: string
  comments: string
}

export function FeedbackTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [data, setData] = useState<DisputedDevice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Define columns
  const columns: ColumnDef<DisputedDevice>[] = [
    {
      accessorKey: "jcpp_entity_name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Entity Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("jcpp_entity_name")}</div>,
    },
    {
      accessorKey: "unit_id",
      header: "Current Unit ID",
      cell: ({ row }) => <div>{row.getValue("unit_id")}</div>,
    },
    {
      accessorKey: "alternate_unit_id",
      header: "Alternate Unit ID",
      cell: ({ row }) => <div>{row.getValue("alternate_unit_id") || "-"}</div>,
    },
    {
      accessorKey: "reported_by",
      header: "Reported By",
      cell: ({ row }) => <div>{row.getValue("reported_by")}</div>,
    },
    {
      accessorKey: "reported_date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Reported Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("reported_date")}</div>,
    },
    {
      accessorKey: "last_updated",
      header: "Last Updated",
      cell: ({ row }) => <div>{row.getValue("last_updated")}</div>,
    },
    {
      accessorKey: "inactive_date",
      header: "Status",
      cell: ({ row }) => {
        const inactiveDate = row.getValue("inactive_date") as string | undefined
        return (
          <div className={inactiveDate ? "text-red-500" : "text-green-500"}>{inactiveDate ? "Inactive" : "Active"}</div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const device = row.original
        const isInactive = !!device.inactive_date

        const handleMarkInactive = async () => {
          try {
            const result = await markDeviceAsInactive(device._id)

            if (result.success) {
              toast({
                title: "Success",
                description: result.message || "Device marked as inactive successfully",
              })

              // Refresh data
              fetchData()
            } else {
              throw new Error(result.message || "Failed to mark device as inactive")
            }
          } catch (error) {
            console.error("Error marking device as inactive:", error)
            toast({
              title: "Action failed",
              description: error instanceof Error ? error.message : "Failed to mark device as inactive",
              variant: "destructive",
            })
          }
        }

        const handleDelete = async () => {
          try {
            const result = await deleteDevice(device._id)

            if (result.success) {
              toast({
                title: "Success",
                description: result.message || "Device deleted successfully",
              })

              // Refresh data
              fetchData()
            } else {
              throw new Error(result.message || "Failed to delete device")
            }
          } catch (error) {
            console.error("Error deleting device:", error)
            toast({
              title: "Action failed",
              description: error instanceof Error ? error.message : "Failed to delete device",
              variant: "destructive",
            })
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(device._id)}>Copy ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/device/${device._id}`)}>View details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/device/${device._id}/edit`)}>Edit</DropdownMenuItem>
              {!isInactive && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Mark as inactive</DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark as inactive?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the device as inactive. The device will no longer be included in statistics.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleMarkInactive}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the device from the KVStore.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Fetch data from Splunk KVStore
  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getDisputedDevices()

      if (result.success) {
        setData(result.data)

        // Show warning if using mock data
        if (result.warning) {
          toast({
            title: "Using mock data",
            description: "Connected to development mode with mock data. Real Splunk API connection unavailable.",
            variant: "warning",
          })
        }
      } else {
        throw new Error(result.message || "Failed to fetch disputed devices")
      }
    } catch (error) {
      console.error("Error fetching disputed devices:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch disputed devices",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading disputed devices...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter entities..."
          value={(table.getColumn("jcpp_entity_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("jcpp_entity_name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={fetchData}>Refresh</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
