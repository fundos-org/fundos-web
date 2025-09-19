import * as React from 'react';
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
} from '@tanstack/react-table';
import { ChevronDown, Receipt, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { formatEnumToText } from '@/lib/formatUtils';
import { Card, CardContent } from '@/components/ui/card';

// Function to format column names to display text
const getColumnDisplayName = (columnId: string): string => {
  const columnMap: Record<string, string> = {
    'first_name': 'First Name',
    'last_name': 'Last Name', 
    'transaction_id': 'Transaction ID',
    'transaction_date': 'Transaction Date',
    'invested_in': 'Invested In',
    'amount': 'Amount',
    'currency': 'Currency',
    'status': 'Status',
    'transaction_type': 'Transaction Type',
    'created_at': 'Created At',
    'updated_at': 'Updated At',
  };
  
  return columnMap[columnId] || formatEnumToText(columnId);
};

// Define the type for the transaction data
interface Transaction {
  transaction_id: string;
  investor: string;
  invested_in: string;
  amount: number;
  transaction_date: string;
}

// Define props for the component
interface InvestmentTableProps {
  transactions: Transaction[] | [];
  header?: string;
}

// Helper function to split investor name into first and last names
const splitInvestorName = (fullName: string) => {
  const [firstName, ...lastNameParts] = fullName.split(' ');
  return {
    first_name: firstName || '',
    last_name: lastNameParts.join(' ') || '',
  };
};

// Define the columns based on the transaction data
const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-gray-300"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-gray-300"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'first_name',
    accessorKey: 'investor',
    header: 'First Name',
    cell: ({ row }) => (
      <div className="font-medium">
        {splitInvestorName(row.getValue('first_name')).first_name}
      </div>
    ),
  },
  {
    id: 'last_name',
    accessorKey: 'investor',
    header: 'Last Name',
    cell: ({ row }) => (
      <div className="font-medium">
        {splitInvestorName(row.getValue('last_name')).last_name}
      </div>
    ),
  },
  {
    accessorKey: 'invested_in',
    header: 'Invested In',
    cell: ({ row }) => <div>{row.getValue('invested_in')}</div>,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="font-semibold text-green-600">
        ₹{(row.getValue('amount') as number).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'transaction_date',
    header: 'Transaction Date',
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue('transaction_date')).toLocaleDateString()}
      </div>
    ),
  },
];

const TransactionTable = ({ transactions, header }: InvestmentTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: transactions,
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

  // Empty state component
  const EmptyState = () => (
    <Card className="mx-auto mt-8 max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Receipt className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
        <p className="text-gray-600 mb-4">
          There are currently no {header?.toLowerCase() || 'recent'} transactions to display.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="fundos-dashboard-section-admin w-full">
      {/* Table Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {header || 'Recent'} Transactions
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Filter investors..."
              value={
                (table.getColumn('first_name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn('first_name')?.setFilterValue(event.target.value)
              }
              className="pl-10 max-w-sm"
            />
          </div>
          
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="lg:ml-0">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {getColumnDisplayName(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Content or Empty State */}
      {!transactions || transactions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="bg-gray-50">
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id} className="font-semibold text-gray-900">
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
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="text-gray-900">
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
                      className="h-24 text-center text-gray-500"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {table.getRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} transactions
              </div>
              
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem className={!table.getCanPreviousPage() ? 'opacity-50' : 'cursor-pointer'}>
                    <PaginationPrevious 
                      onClick={() => table.previousPage()} 
                      aria-disabled={!table.getCanPreviousPage()}
                    />
                  </PaginationItem>
                  
                  <div className="flex gap-1">
                    {table.getPageCount() <= 5 ? (
                      Array.from({ length: table.getPageCount() }, (_, i) => (
                        <PaginationItem key={i} className="cursor-pointer">
                          <PaginationLink
                            isActive={table.getState().pagination.pageIndex === i}
                            onClick={() => table.setPageIndex(i)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                    ) : (
                      <>
                        <PaginationItem className="cursor-pointer">
                          <PaginationLink
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
                          <PaginationItem className="cursor-pointer">
                            <PaginationLink
                              onClick={() =>
                                table.setPageIndex(
                                  table.getState().pagination.pageIndex - 1
                                )
                              }
                            >
                              {table.getState().pagination.pageIndex}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        {table.getState().pagination.pageIndex !== 0 &&
                          table.getState().pagination.pageIndex !==
                            table.getPageCount() - 1 && (
                            <PaginationItem>
                              <PaginationLink isActive>
                                {table.getState().pagination.pageIndex + 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                        {table.getState().pagination.pageIndex <
                          table.getPageCount() - 2 && (
                          <PaginationItem className="cursor-pointer">
                            <PaginationLink
                              onClick={() =>
                                table.setPageIndex(
                                  table.getState().pagination.pageIndex + 1
                                )
                              }
                            >
                              {table.getState().pagination.pageIndex + 2}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        {table.getState().pagination.pageIndex <
                          table.getPageCount() - 3 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem className="cursor-pointer">
                          <PaginationLink
                            isActive={
                              table.getState().pagination.pageIndex ===
                              table.getPageCount() - 1
                            }
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                          >
                            {table.getPageCount()}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                  </div>
                  
                  <PaginationItem className={!table.getCanNextPage() ? 'opacity-50' : 'cursor-pointer'}>
                    <PaginationNext 
                      onClick={() => table.nextPage()} 
                      aria-disabled={!table.getCanNextPage()}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionTable;
