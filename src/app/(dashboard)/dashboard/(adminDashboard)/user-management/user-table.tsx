"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {ChevronDown, Trash2} from "lucide-react";
import Image from "next/image";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import {deleteUser} from "@/actions/userActions";

type User = {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string | null;
    createdAt: Date;
};

const UserManagementTable = ({users}: { users: User[] }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});


    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            ),
            cell: ({row}) => (
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
            accessorKey: "image",
            header: "User Image",
            cell: ({row}) => {
                const image = row.getValue("image") as string | null;
                return (
                    <div className="flex justify-center">
                        <Image
                            src={image || "/image/avatar-placeholder.jpg"}
                            alt={row.getValue("name") as string || "User"}
                            width={32}
                            height={32}
                            className='w-8 h-8 rounded-full'
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            header: "User Name",
            cell: ({row}) => <div>{row.getValue("name") || "N/A"}</div>,
        },
        {
            accessorKey: "email",
            header: "User Email",
            cell: ({row}) => <div>{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({row}) => <div>{row.getValue("role") || "User"}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({row}) => {
                const date = row.getValue("createdAt") as Date;
                return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
            },
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({row}) => {
                const id = row.original.id; // Get the id of the current row
                return (
                    <span
                        onClick={() => handleDelete(id)}
                        className='cursor-pointer text-red-500 pl-2'
                    >
            <Trash2/>
          </span>
                );
            },
        },
    ];

    const table = useReactTable<User>({
        data: users,
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

    // handle Delete button
    const handleDelete = async (id: string) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deleteUser(id);
                    toast.success("User deleted successfully");
                }
            });
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        }
    };

    if (users.length === 0) {
        return (
            <div className='flex justify-center items-center'>
                <h1 className='text-3xl font-bold text-red-500'>No users found</h1>
            </div>
        );
    }

    return (
        <div className='w-full p-6'>
            <h1 className='text-2xl font-bold'>User Management</h1>
            <div className='flex gap-4 items-center py-4'>
                <Input
                    placeholder='Search by User Name...'
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className='max-w-xs'
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' className='ml-auto'>
                            Columns <ChevronDown/>
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
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
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
        </div>
    );
};

export default UserManagementTable;