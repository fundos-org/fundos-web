import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvestorTransactions } from '@/hooks/customhooks/MembersHooks/useInvestorTransactions';
import { FC } from 'react';

const InvestorTransactions: FC<{ investor_id: string }> = ({ investor_id }) => {
  const { data } = useInvestorTransactions(investor_id);
  return (
    <div className="flex flex-col w-full border border-[#383739]">
      <Table className="rounded-none">
        <TableHeader className="bg-[#2A2A2B]">
          <TableRow className="border-zinc-400/60">
            <TableHead className="text-zinc-400">Transaction Type</TableHead>
            <TableHead className="text-zinc-400">Amount(INR)</TableHead>
            <TableHead className="text-zinc-400">Currency</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-zinc-400">Txn Date</TableHead>
            <TableHead className="text-zinc-400">Invitation Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.transactions &&
            data?.transactions?.map((transaction, idx) => (
              <TableRow className="border-[#2A2A2B]" key={idx + 1}>
                <TableCell className="font-medium">
                  {transaction.transaction_type}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.amount}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.currency}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {transaction.status}
                </TableCell>
                <TableCell className="font-medium text-center">
                  {transaction.created_at}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.invitation_code}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestorTransactions;
