import * as React from "react";
    import {
      ColumnDef,
      ColumnFiltersState,
      SortingState,
      VisibilityState,
      flexRender,
      getCoreRowModel,
      getFilteredRowModel,
      getPaginationRowModel,
      getSortedRowModel,
      useReactTable,
    } from "@tanstack/react-table";
    import { ChevronDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

    // Define the type for the user data
    interface User {
      user_id: string;
      first_name: string;
      last_name: string;
      email: string;
      capital_committed: number;
      kyc_status: string;
    }

    // Define props for the component
    interface UserTableProps {
        users: User[];
        header?: string
    }

    // Define the columns based on the API response
    const columns: ColumnDef<User>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "first_name",
        header: "First Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("first_name")}</div>
        ),
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("last_name")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
      },
      {
        accessorKey: "capital_committed",
        header: "Capital Committed",
        cell: ({ row }) => <div>{row.getValue("capital_committed")}</div>,
      },
      {
        accessorKey: "kyc_status",
        header: "KYC Status",
        cell: ({ row }) => <div>{row.getValue("kyc_status")}</div>,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.email)}
                >
                  Copy email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View profile</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

    const InvestorTable = ({ users, header }: UserTableProps) =>  {
      const [sorting, setSorting] = React.useState<SortingState>([]);
      const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
      const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
        const [rowSelection, setRowSelection] = React.useState({});

      const table = useReactTable({
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

      return (
        <div className="w-full">
          <div className="flex justify-between items-center py-4 bg-[#2A2A2B] px-5">
            <h1 className="text-2xl text-zinc-400 py-5 uppercase">{header} Onboarded</h1>
            <Input
              placeholder="Filter emails..."
              value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="max-w-sm ml-auto rounded-none"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-5 text-black rounded-none">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="px-5 bg-[#242325]">
            <Table className="rounded-none px-5">
              <TableHeader className="text-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-zinc-400">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="bg-[#242325] text-white">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
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
          <Pagination className="bg-[#2A2A2B] p-4">
            <PaginationContent className="w-full flex justify-between items-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => table.previousPage()}
                />
              </PaginationItem>
              <div className="flex gap-2">
                {table.getPageCount() <= 5 ? (
                  Array.from({ length: table.getPageCount() }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={table.getState().pagination.pageIndex === i}
                        onClick={() => table.setPageIndex(i)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))
                ) : (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={table.getState().pagination.pageIndex === 0}
                        onClick={() => table.setPageIndex(0)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {table.getState().pagination.pageIndex > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    {table.getState().pagination.pageIndex > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
                        >
                          {table.getState().pagination.pageIndex}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    {table.getState().pagination.pageIndex !== 0 &&
                      table.getState().pagination.pageIndex !== table.getPageCount() - 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            isActive
                            onClick={() => table.setPageIndex(table.getState().pagination.pageIndex)}
                          >
                            {table.getState().pagination.pageIndex + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                    {table.getState().pagination.pageIndex < table.getPageCount() - 2 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
                        >
                          {table.getState().pagination.pageIndex + 2}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    {table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={table.getState().pagination.pageIndex === table.getPageCount() - 1}
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      >
                        {table.getPageCount()}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </div>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => table.nextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      );
    }

export default InvestorTable;