import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "../ui/pagination";

const invoices = [
  {
    investorId: "#356449",
    investorName: "Pratyush Kumar",
    investedIn: "Infotech Pvt ltd",
    capitalCommitted: "₹ 30,00,000",
    transactionDate: "02/04/2025",
  },
  {
    investorId: "#356449",
    investorName: "Pratyush Kumar",
    investedIn: "Infotech Pvt ltd",
    capitalCommitted: "₹ 30,00,000",
    transactionDate: "02/04/2025",
  },
  {
    investorId: "#356449",
    investorName: "Pratyush Kumar",
    investedIn: "Infotech Pvt ltd",
    capitalCommitted: "₹ 30,00,000",
    transactionDate: "02/04/2025",
  },
  {
    investorId: "#356449",
    investorName: "Pratyush Kumar",
    investedIn: "Infotech Pvt ltd",
    capitalCommitted: "₹ 30,00,000",
    transactionDate: "02/04/2025",
  },
  {
    investorId: "#356449",
    investorName: "Pratyush Kumar",
    investedIn: "Infotech Pvt ltd",
    capitalCommitted: "₹ 30,00,000",
    transactionDate: "02/04/2025",
  },
  {
    investorId: "#356449",
    investorName: "Pratyush Kumar",
    investedIn: "Infotech Pvt ltd",
    capitalCommitted: "₹ 30,00,000",
    transactionDate: "02/04/2025",
  },
  {
    investorId: "#356449",
    investorName: "Pratyush Kumar",
    investedIn: "Infotech Pvt ltd",
    capitalCommitted: "₹ 30,00,000",
    transactionDate: "02/04/2025",
  },
  {
    investorId: "#356449",
    investorName: "Pratyush Kumar",
    investedIn: "Infotech Pvt ltd",
    capitalCommitted: "₹ 30,00,000",
    transactionDate: "02/04/2025",
  },
];

export default function TransactionDetailsTable() {
  return (
    <>
      <div className="w-full bg-[#1f1f1f] border-0 rounded-none">
        <h2 className="text-2xl text-gray-400 p-5">TRANSACTION DETAILS</h2>
        <Table className="w-full text-white rounded-none border-0">
          <TableHeader className="bg-muted-foreground">
            <TableRow>
              {Object.keys(invoices[0]).map((key) => (
                <TableHead key={key} className="py-5 px-7 uppercase">
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.investorId}>
                {Object.keys(invoice).map((key) => (
                  <TableCell key={key} className="py-5 px-7">
                    {invoice[key as keyof typeof invoice]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination className="bg-muted-foreground p-4">
          <PaginationContent className="w-full flex justify-between items-center">
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <div className="flex gap-2">
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="text-black">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </div>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
