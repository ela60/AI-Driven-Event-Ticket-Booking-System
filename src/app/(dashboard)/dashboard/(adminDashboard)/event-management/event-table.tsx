//@typescript-eslint/no-explicit-any

"use client";
import { useState } from "react";
import type React from "react";

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
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { deleteEvent, updateEvent } from "@/actions/eventActions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export interface IEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: Date;
  endDate: Date;
  coverImage: string;
  totalTickets: number;
  ticketPrice: number;
  organizerId: string;
  availableTickets: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export const EventManagementTable = ({
  eventData,
}: {
  eventData: IEvent[];
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  const handleEditEvent = (event: IEvent) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };


  const handleDeleteEvent = (event: IEvent) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEvent) {
      try {
        const response = await deleteEvent(selectedEvent.id);
        toast.success(response.message);
      } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
      setIsDeleteModalOpen(false);
    }
  };

  const submitEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      try {
        const response = await updateEvent(selectedEvent.id, selectedEvent);
        toast.success(response.message);
      } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
    setIsEditModalOpen(false);
  };

  const data: IEvent[] = eventData;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const columns: ColumnDef<IEvent>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "coverImage",
      header: "Cover Image",
      cell: ({ row }) => (
        <div className='h-12 w-20 relative'>
          <Image
            src={process.env.NEXT_PUBLIC_URL_ENDPOINT + row.original.coverImage}
            alt={`${row.original.title} cover`}
            className='h-full w-full object-cover rounded-md'
            width={200}
            height={100}
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Event Title",
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => <div>{formatDate(row.original.startDate)}</div>,
    },
    {
      accessorKey: "ticketPrice",
      header: "Price",
      cell: ({ row }) => <div>{formatPrice(row.original.ticketPrice)}</div>,
    },
    {
      accessorKey: "availableTickets",
      header: "Available Tickets",
      cell: ({ row }) => (
        <div className='text-center'>
          {row.original.availableTickets}/{row.original.totalTickets}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEditEvent(row.original)}
            className='h-8 w-8 p-0'
          >
            <span className='sr-only'>Edit</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-pencil'
            >
              <path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
              <path d='m15 5 4 4' />
            </svg>
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleDeleteEvent(row.original)}
            className='h-8 w-8 p-0 text-destructive hover:bg-destructive/10'
          >
            <span className='sr-only'>Delete</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-trash-2'
            >
              <path d='M3 6h18' />
              <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
              <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
              <line x1='10' x2='10' y1='11' y2='17' />
              <line x1='14' x2='14' y1='11' y2='17' />
            </svg>
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
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
  });

  return (
    <div className='w-full p-6'>
      <h1 className='text-2xl font-bold'>Event Management</h1>
      <div className='flex gap-4 items-center py-4'>
        <Input
          placeholder='Search by title...'
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className='max-w-xs'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {/* Add this before the final closing div */}
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the event{" "}
              <Badge className={"rounded-sm"}>{selectedEvent?.title}</Badge> ?{" "}
              <br /> This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Make changes to the event details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitEditForm}>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='title' className='text-right'>
                  Title
                </Label>
                <Input
                  id='title'
                  value={selectedEvent?.title || ""}
                  onChange={(e) =>
                    setSelectedEvent(
                      selectedEvent
                        ? {
                            ...selectedEvent,
                            title: e.target.value,
                          }
                        : null
                    )
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='category' className='text-right'>
                  Category
                </Label>
                <Input
                  id='category'
                  value={selectedEvent?.category || ""}
                  onChange={(e) =>
                    setSelectedEvent(
                      selectedEvent
                        ? {
                            ...selectedEvent,
                            category: e.target.value,
                          }
                        : null
                    )
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='location' className='text-right'>
                  Location
                </Label>
                <Input
                  id='location'
                  value={selectedEvent?.location || ""}
                  onChange={(e) =>
                    setSelectedEvent(
                      selectedEvent
                        ? {
                            ...selectedEvent,
                            location: e.target.value,
                          }
                        : null
                    )
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='description' className='text-right'>
                  Description
                </Label>
                <Textarea
                  id='description'
                  value={selectedEvent?.description || ""}
                  onChange={(e) =>
                    setSelectedEvent(
                      selectedEvent
                        ? {
                            ...selectedEvent,
                            description: e.target.value,
                          }
                        : null
                    )
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='price' className='text-right'>
                  Price
                </Label>
                <Input
                  id='price'
                  type='number'
                  value={selectedEvent?.ticketPrice}
                  onChange={(e) =>
                    setSelectedEvent(
                      selectedEvent
                        ? {
                            ...selectedEvent,
                            ticketPrice: Number(e.target.value),
                          }
                        : null
                    )
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='totalTickets' className='text-right'>
                  Total Tickets
                </Label>
                <Input
                  id='totalTickets'
                  type='number'
                  value={selectedEvent?.totalTickets || ""}
                  onChange={(e) =>
                    setSelectedEvent(
                      selectedEvent
                        ? {
                            ...selectedEvent,
                            totalTickets: Number.parseInt(e.target.value),
                          }
                        : null
                    )
                  }
                  className='col-span-3'
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
