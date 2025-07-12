// import {
//   Dialog,
//   //   DialogClose,
//   DialogContent,
//   //   DialogDescription,
//   //   DialogHeader,
//   //   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from '@/components/ui/table';
// import { Table } from 'lucide-react';
// // import { cn } from '@/lib/utils';
// const InvestorDetailsDialog = ({
//   open,
//   onOpenChange,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) => {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="fixed inset-0 w-screen h-screen bg-[#181C23] p-6 border-none rounded-none max-w-none max-h-none text-white">
//         <div className="h-full flex flex-col">
//           <h2 className="text-2xl mb-4">Investors Onboarded</h2>
//           <div className="overflow-auto flex-1">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[50px]">Action</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Mail</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Deal Invested</TableHead>
//                   <TableHead>KYC Status</TableHead>
//                   <TableHead>Joining Date</TableHead>
//                   <TableHead>MCA</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <TableRow>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                   <TableCell>Manish Lamba</TableCell>
//                   <TableCell>rojasernest@example.net</TableCell>
//                   <TableCell>Individual</TableCell>
//                   <TableCell>-</TableCell>
//                   <TableCell>verified</TableCell>
//                   <TableCell>2025-07-11</TableCell>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                   <TableCell>Anthony Martino</TableCell>
//                   <TableCell>henry82@example.com</TableCell>
//                   <TableCell>Individual</TableCell>
//                   <TableCell>-</TableCell>
//                   <TableCell>rejected</TableCell>
//                   <TableCell>2025-07-11</TableCell>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                   <TableCell>Sharon Rosario</TableCell>
//                   <TableCell>jennypball@example.com</TableCell>
//                   <TableCell>Individual</TableCell>
//                   <TableCell>2</TableCell>
//                   <TableCell>rejected</TableCell>
//                   <TableCell>2025-07-11</TableCell>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                   <TableCell>Diane Peterson</TableCell>
//                   <TableCell>zsantiago@example.com</TableCell>
//                   <TableCell>Individual</TableCell>
//                   <TableCell>7</TableCell>
//                   <TableCell>verified</TableCell>
//                   <TableCell>2025-07-11</TableCell>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                   <TableCell>
//                     <span className="w-4 h-4 inline-block"></span>
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </div>
//           <div className="mt-4 flex justify-between items-center">
//             <span>Total records: 18</span>
//             <div className="flex items-center gap-2">
//               <span>1 2</span>
//               <span>Next</span>
//               <select className="bg-[#181C23] text-white border border-gray-600 rounded">
//                 <option>10</option>
//                 <option>20</option>
//                 <option>50</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default InvestorDetailsDialog;

import * as React from 'react';
import {
  Dialog,
  //   DialogTrigger,
  DialogContent,
  //   DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export function FullScreenDialog({
  open,
  onOpenChange,
  children,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'fixed inset-0 z-50 p-10 mx-[20rem] my-[0rem] rounded-none shadow-none w-screen h-screen max-w-none max-h-none bg-black'
        )}
      >
        {/* <DialogHeader className="p-6 border-b relative"> */}
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && <DialogDescription>{description}</DialogDescription>}
        <DialogClose asChild>
          <button
            onClick={() => onOpenChange(false)}
            className="text-lg font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </DialogClose>
        {/* </DialogHeader> */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
