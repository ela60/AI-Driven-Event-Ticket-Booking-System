"use client"

import {useState} from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {ArrowUpDown, ChevronDown, MoreHorizontal} from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export type Booking = {
    id: string
    userId: string
    eventId: string
    createdAt: Date
    updatedAt: Date
    payment: Payment | null
    user: User
    event?: Event
}

export type Payment = {
    id: string
    stripeSessionId: string
    stripePaymentIntentId: string | null
    amount: number
    currency: string
    status: PaymentStatus
    paymentMethod: string | null
    userId: string | null
    customerEmail: string
    customerName: string | null
    eventId: string
    eventTitle: string
    ticketPrice: number
    bookingId: string | null
    paymentDate: Date
    errorMessage: string | null
    createdAt: Date
    updatedAt: Date
}

export type User = {
    id: string
    name: string | null
    email: string
    emailVerified: Date | null
    image: string | null
    role: "USER" | "ADMIN" | "ORGANIZER"
    createdAt: Date
    updatedAt: Date
}

export type Event = {
    id: string
    title: string
    description: string
    category: string
    location: string
    startDate: Date
    endDate: Date
    coverImage: string
    totalTickets: number
    availableTickets: number | null
    ticketPrice: number
    organizerId: string
    createdAt: Date
    updatedAt: Date
}

interface BookingListProps {
    bookings: Booking[]
}

export default function BookingList({bookings}: BookingListProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const columns: ColumnDef<Booking>[] = [
        {
            accessorKey: "user",
            header: "Customer",
            cell: ({row}) => {
                const user = row.original.user
                return (
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.image || undefined} alt={user.name || "User"}/>
                            <AvatarFallback>{user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user.name || "Unnamed User"}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "eventTitle",
            header: ({column}) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Event
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div>{row.original.event?.title || row.original.payment?.eventTitle || 'N/A'}</div>;
            }
        },
        {
            accessorKey: "payment.amount",
            header: ({column}) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
            cell: ({row}) => {
                const payment = row.original.payment
                if (!payment) return <div>N/A</div>

                const amount = payment.amount
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: payment.currency,
                }).format(amount)

                return <div className="font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "payment.status",
            header: "Status",
            cell: ({row}) => {
                const payment = row.original.payment
                const status = payment?.status || "PENDING"
                return (
                    <Badge
                        className={
                            status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }
                    >
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "payment.paymentMethod",
            header: "Payment Method",
            cell: ({row}) => {
                const payment = row.original.payment
                return <div className="capitalize">{payment?.paymentMethod || "N/A"}</div>
            },
        },
        {
            accessorKey: "createdAt",
            header: ({column}) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Booking Date
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
            cell: ({row}) => {
                return (
                    <div>
                        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                )
            },
        },
        {
            id: "actions",
            header : "Actions",
            cell: ({row}) => {
                const booking = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id)}>
                                Copy booking ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Send receipt</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: bookings,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <Input
                    placeholder="Filter events..."
                    value={(table.getColumn("eventTitle")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("event.title")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuItem
                                            key={column.id}
                                            className="capitalize"
                                            onClick={() => column.toggleVisibility(!column.getIsVisible())}
                                        >
                                            {column.id}
                                        </DropdownMenuItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="default">Export</Button>
                </div>
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
                                        <TableCell
                                            key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} booking(s) total.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

