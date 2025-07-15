// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// // import { useInvestorDelete } from '@/hooks/customhooks/MembersHooks/useInvestorDelete';
// import { useInvestors } from '@/hooks/customhooks/MembersHooks/useInvestorTable';
// import { RefreshCw } from 'lucide-react';
// import { lazy, Suspense, useState } from 'react';
// // import SwitchCustom from '@/components/ui/switchCustom';
// // import AdvancedInvestorActionsCell from './AdvancedInvestorActionsCell';
// const InvestorFileDisplayDialog = lazy(
//   () => import('../DialogItems/InvestorFileDisplayDialog')
// );
// // const InvestorDetailsDialog = lazy(
// //   () => import('../DialogItems/InvestorDetailsDialog')
// // );

// const products = [
//   {
//     id: 101,
//     name: 'Wireless Headphones',
//     category: 'Electronics',
//     price: 59.99,
//     rating: 4.5,
//     stockQuantity: 120,
//     supplier: 'SoundTech Ltd',
//     dateAdded: '2024-01-15',
//   },
//   {
//     id: 102,
//     name: 'Yoga Mat',
//     category: 'Sports & Fitness',
//     price: 25.0,
//     rating: 4.8,
//     stockQuantity: 200,
//     supplier: 'FitGear Inc',
//     dateAdded: '2024-01-20',
//   },
//   {
//     id: 103,
//     name: 'Coffee Maker',
//     category: 'Home Appliances',
//     price: 80.0,
//     rating: 4.2,
//     stockQuantity: 80,
//     supplier: 'HomeBrew Supplies',
//     dateAdded: '2024-02-05',
//   },
//   {
//     id: 104,
//     name: 'Running Shoes',
//     category: 'Sportswear',
//     price: 70.0,
//     rating: 4.6,
//     stockQuantity: 150,
//     supplier: 'RunWell Co.',
//     dateAdded: '2024-03-15',
//   },
//   {
//     id: 105,
//     name: 'Smartwatch',
//     category: 'Electronics',
//     price: 120.0,
//     rating: 4.7,
//     stockQuantity: 60,
//     supplier: 'TechTime',
//     dateAdded: '2024-04-10',
//   },
//   {
//     id: 106,
//     name: 'Gaming Mouse',
//     category: 'Electronics',
//     price: 45.0,
//     rating: 4.3,
//     stockQuantity: 95,
//     supplier: 'GamePro Gear',
//     dateAdded: '2024-04-22',
//   },
//   {
//     id: 107,
//     name: 'Blender',
//     category: 'Kitchen Appliances',
//     price: 55.0,
//     rating: 4.4,
//     stockQuantity: 110,
//     supplier: 'KitchenEssentials',
//     dateAdded: '2024-05-05',
//   },
//   {
//     id: 108,
//     name: 'Electric Kettle',
//     category: 'Kitchen Appliances',
//     price: 30.0,
//     rating: 4.1,
//     stockQuantity: 130,
//     supplier: 'HomeEssentials',
//     dateAdded: '2024-05-18',
//   },
//   {
//     id: 109,
//     name: 'Office Chair',
//     category: 'Furniture',
//     price: 150.0,
//     rating: 4.6,
//     stockQuantity: 50,
//     supplier: 'FurniPro',
//     dateAdded: '2024-06-01',
//   },
//   {
//     id: 110,
//     name: 'LED Desk Lamp',
//     category: 'Lighting',
//     price: 20.0,
//     rating: 4.5,
//     stockQuantity: 210,
//     supplier: 'BrightLight',
//     dateAdded: '2024-06-10',
//   },
//   {
//     id: 101,
//     name: 'Wireless Headphones',
//     category: 'Electronics',
//     price: 59.99,
//     rating: 4.5,
//     stockQuantity: 120,
//     supplier: 'SoundTech Ltd',
//     dateAdded: '2024-01-15',
//   },
//   {
//     id: 102,
//     name: 'Yoga Mat',
//     category: 'Sports & Fitness',
//     price: 25.0,
//     rating: 4.8,
//     stockQuantity: 200,
//     supplier: 'FitGear Inc',
//     dateAdded: '2024-01-20',
//   },
//   {
//     id: 103,
//     name: 'Coffee Maker',
//     category: 'Home Appliances',
//     price: 80.0,
//     rating: 4.2,
//     stockQuantity: 80,
//     supplier: 'HomeBrew Supplies',
//     dateAdded: '2024-02-05',
//   },
//   {
//     id: 104,
//     name: 'Running Shoes',
//     category: 'Sportswear',
//     price: 70.0,
//     rating: 4.6,
//     stockQuantity: 150,
//     supplier: 'RunWell Co.',
//     dateAdded: '2024-03-15',
//   },
//   {
//     id: 105,
//     name: 'Smartwatch',
//     category: 'Electronics',
//     price: 120.0,
//     rating: 4.7,
//     stockQuantity: 60,
//     supplier: 'TechTime',
//     dateAdded: '2024-04-10',
//   },
//   {
//     id: 106,
//     name: 'Gaming Mouse',
//     category: 'Electronics',
//     price: 45.0,
//     rating: 4.3,
//     stockQuantity: 95,
//     supplier: 'GamePro Gear',
//     dateAdded: '2024-04-22',
//   },
//   {
//     id: 107,
//     name: 'Blender',
//     category: 'Kitchen Appliances',
//     price: 55.0,
//     rating: 4.4,
//     stockQuantity: 110,
//     supplier: 'KitchenEssentials',
//     dateAdded: '2024-05-05',
//   },
//   {
//     id: 108,
//     name: 'Electric Kettle',
//     category: 'Kitchen Appliances',
//     price: 30.0,
//     rating: 4.1,
//     stockQuantity: 130,
//     supplier: 'HomeEssentials',
//     dateAdded: '2024-05-18',
//   },
//   {
//     id: 109,
//     name: 'Office Chair',
//     category: 'Furniture',
//     price: 150.0,
//     rating: 4.6,
//     stockQuantity: 50,
//     supplier: 'FurniPro',
//     dateAdded: '2024-06-01',
//   },
//   {
//     id: 110,
//     name: 'LED Desk Lamp',
//     category: 'Lighting',
//     price: 20.0,
//     rating: 4.5,
//     stockQuantity: 210,
//     supplier: 'BrightLight',
//     dateAdded: '2024-06-10',
//   },
//   {
//     id: 103,
//     name: 'Coffee Maker',
//     category: 'Home Appliances',
//     price: 80.0,
//     rating: 4.2,
//     stockQuantity: 80,
//     supplier: 'HomeBrew Supplies',
//     dateAdded: '2024-02-05',
//   },
//   {
//     id: 104,
//     name: 'Running Shoes',
//     category: 'Sportswear',
//     price: 70.0,
//     rating: 4.6,
//     stockQuantity: 150,
//     supplier: 'RunWell Co.',
//     dateAdded: '2024-03-15',
//   },
//   {
//     id: 105,
//     name: 'Smartwatch',
//     category: 'Electronics',
//     price: 120.0,
//     rating: 4.7,
//     stockQuantity: 60,
//     supplier: 'TechTime',
//     dateAdded: '2024-04-10',
//   },
//   {
//     id: 106,
//     name: 'Gaming Mouse',
//     category: 'Electronics',
//     price: 45.0,
//     rating: 4.3,
//     stockQuantity: 95,
//     supplier: 'GamePro Gear',
//     dateAdded: '2024-04-22',
//   },
//   {
//     id: 107,
//     name: 'Blender',
//     category: 'Kitchen Appliances',
//     price: 55.0,
//     rating: 4.4,
//     stockQuantity: 110,
//     supplier: 'KitchenEssentials',
//     dateAdded: '2024-05-05',
//   },
//   {
//     id: 108,
//     name: 'Electric Kettle',
//     category: 'Kitchen Appliances',
//     price: 30.0,
//     rating: 4.1,
//     stockQuantity: 130,
//     supplier: 'HomeEssentials',
//     dateAdded: '2024-05-18',
//   },
//   {
//     id: 109,
//     name: 'Office Chair',
//     category: 'Furniture',
//     price: 150.0,
//     rating: 4.6,
//     stockQuantity: 50,
//     supplier: 'FurniPro',
//     dateAdded: '2024-06-01',
//   },
//   {
//     id: 110,
//     name: 'LED Desk Lamp',
//     category: 'Lighting',
//     price: 20.0,
//     rating: 4.5,
//     stockQuantity: 210,
//     supplier: 'BrightLight',
//     dateAdded: '2024-06-10',
//   },
//   {
//     id: 101,
//     name: 'Wireless Headphones',
//     category: 'Electronics',
//     price: 59.99,
//     rating: 4.5,
//     stockQuantity: 120,
//     supplier: 'SoundTech Ltd',
//     dateAdded: '2024-01-15',
//   },
//   {
//     id: 102,
//     name: 'Yoga Mat',
//     category: 'Sports & Fitness',
//     price: 25.0,
//     rating: 4.8,
//     stockQuantity: 200,
//     supplier: 'FitGear Inc',
//     dateAdded: '2024-01-20',
//   },
//   {
//     id: 103,
//     name: 'Coffee Maker',
//     category: 'Home Appliances',
//     price: 80.0,
//     rating: 4.2,
//     stockQuantity: 80,
//     supplier: 'HomeBrew Supplies',
//     dateAdded: '2024-02-05',
//   },
//   {
//     id: 104,
//     name: 'Running Shoes',
//     category: 'Sportswear',
//     price: 70.0,
//     rating: 4.6,
//     stockQuantity: 150,
//     supplier: 'RunWell Co.',
//     dateAdded: '2024-03-15',
//   },
//   {
//     id: 105,
//     name: 'Smartwatch',
//     category: 'Electronics',
//     price: 120.0,
//     rating: 4.7,
//     stockQuantity: 60,
//     supplier: 'TechTime',
//     dateAdded: '2024-04-10',
//   },
//   {
//     id: 106,
//     name: 'Gaming Mouse',
//     category: 'Electronics',
//     price: 45.0,
//     rating: 4.3,
//     stockQuantity: 95,
//     supplier: 'GamePro Gear',
//     dateAdded: '2024-04-22',
//   },
//   {
//     id: 107,
//     name: 'Blender',
//     category: 'Kitchen Appliances',
//     price: 55.0,
//     rating: 4.4,
//     stockQuantity: 110,
//     supplier: 'KitchenEssentials',
//     dateAdded: '2024-05-05',
//   },
//   {
//     id: 108,
//     name: 'Electric Kettle',
//     category: 'Kitchen Appliances',
//     price: 30.0,
//     rating: 4.1,
//     stockQuantity: 130,
//     supplier: 'HomeEssentials',
//     dateAdded: '2024-05-18',
//   },
//   {
//     id: 109,
//     name: 'Office Chair',
//     category: 'Furniture',
//     price: 150.0,
//     rating: 4.6,
//     stockQuantity: 50,
//     supplier: 'FurniPro',
//     dateAdded: '2024-06-01',
//   },
//   {
//     id: 110,
//     name: 'LED Desk Lamp',
//     category: 'Lighting',
//     price: 20.0,
//     rating: 4.5,
//     stockQuantity: 210,
//     supplier: 'BrightLight',
//     dateAdded: '2024-06-10',
//   },
// ];

// export interface InvestorEntity {
//   investor_id: string;
//   name: string;
//   mail: string;
//   type: 'entity' | 'individual';
//   deals_invested: number;
//   kyc_status: 'pending' | 'verified' | 'rejected';
//   mca_key: string;
//   joined_on: string;
//   profile_pic: string;
//   capital_commitment: number;
// }

// export interface Pagination {
//   page: number;
//   per_page: number;
//   total_records: number;
//   total_pages: number;
//   has_next: boolean;
//   has_prev: boolean;
// }

// export interface InvestorsListResponse {
//   subadmin_id: string;
//   subadmin_name: string;
//   investors: InvestorEntity[];
//   pagination: Pagination;
//   success: boolean;
// }
// // const test =
// //   'deals/pitch_decks/18e75944-883f-46b5-b716-22c61cc3a061_20250510134038.png'; //delete later

// const pageSizesList = [6, 10, 20, 50];

// const InvestorTable = () => {
//   // const [sendDetails, setSendDetails] = useState<InvestorEntity>();
//   // const [openDetails, setOpenDetails] = useState<boolean>(false);
//   const [awsObjectKey, setAwsObjectKey] = useState<string | null>(null);
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number>(6);
//   const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
//   // const { mutate: deleteInvestor } = useInvestorDelete();
//   const { data, isLoading, refetch } = useInvestors(pageNumber, pageSize);

//   // if (error) return <div>Error occured please check api</div>;

//   // if (!data && !isLoading) {
//   //   return <div>No data found. Check session or API.</div>;
//   // }

//   const pagination = data?.pagination;

//   const handlePrev = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
//     e.preventDefault();
//     if (pagination?.has_prev && pageNumber > 1) {
//       setPageNumber(prev => prev - 1);
//     }
//   };

//   const handleNext = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
//     e.preventDefault();
//     if (pagination?.has_next && pageNumber < (pagination?.total_pages || 1)) {
//       setPageNumber(prev => prev + 1);
//     }
//   };

//   const handlePageSizeChange = (value: string) => {
//     setPageSize(Number(value));
//     setPageNumber(1);
//   };

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     try {
//       await refetch();
//     } finally {
//       setTimeout(() => setIsRefreshing(false), 500); // Small delay for better UX
//     }
//   };

//   // const goInsideDialog = (investor: InvestorEntity) => {
//   //   setOpenDetails(true);
//   //   setSendDetails(investor);
//   // };

//   return (
//     <>
//       <div className="w-full border border-[#2A2A2B]">
//         <div className="flex justify-between items-center py-3 bg-[#2A2A2B] px-5">
//           <h1 className="text-2xl text-zinc-400">INVESTORS ONBOARDED</h1>
//           <button
//             onClick={handleRefresh}
//             disabled={isRefreshing || isLoading}
//             className="flex gap-3 p-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
//             title="Refresh data"
//           >
//             {/* <span>Refresh:</span> */}
//             <RefreshCw
//               className={`w-5 h-5 text-zinc-400 ${
//                 isRefreshing || isLoading ? 'animate-spin' : null
//               } transition-transform duration-200 hover:text-zinc-300`}
//             />
//           </button>
//         </div>
//         <div className="grid w-full [&>div]:max-h-[calc(100vh-27rem)] [&>div]:border">
//           <Table>
//             <TableHeader>
//               <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
//                 <TableHead className="pl-4">ID</TableHead>
//                 <TableHead>Product Name</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Price (USD)</TableHead>
//                 <TableHead>Rating</TableHead>
//                 <TableHead>Stock Quantity</TableHead>
//                 <TableHead>Supplier</TableHead>
//                 <TableHead>Date Added</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="overflow-hidden">
//               {products.map(product => (
//                 <TableRow
//                   key={product.id}
//                   className="odd:bg-muted/50 [&>*]:whitespace-nowrap"
//                 >
//                   <TableCell className="pl-4">{product.id}</TableCell>
//                   <TableCell className="font-medium">{product.name}</TableCell>
//                   <TableCell>{product.category}</TableCell>
//                   <TableCell>{product.price}</TableCell>
//                   <TableCell>{product.rating}</TableCell>
//                   <TableCell>{product.stockQuantity}</TableCell>
//                   <TableCell>{product.supplier}</TableCell>
//                   <TableCell>{product.dateAdded}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//         {/* <Table className="rounded-none">
//           <TableHeader>
//             <TableRow className="border-zinc-400/60">
//               <TableHead className="text-zinc-400">Action</TableHead>
//               <TableHead className="text-zinc-400">Name</TableHead>
//               <TableHead className="text-zinc-400">Mail</TableHead>
//               <TableHead className="text-zinc-400">Type</TableHead>
//               <TableHead className="text-zinc-400 text-center">
//                 Deal Invested
//               </TableHead>
//               <TableHead className="text-zinc-400">KYC Status</TableHead>
//               <TableHead className="text-zinc-400">Joining Date</TableHead>
//               <TableHead className="text-zinc-400">
//                 Capital Commit(INR)
//               </TableHead>
//               <TableHead className="text-zinc-400">MCA</TableHead>
//               <TableHead className="text-zinc-400">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data?.investors &&
//               data?.investors?.map(investor => (
//                 <TableRow
//                   className="border-[#2A2A2B]"
//                   key={investor.investor_id}
//                 >
//                   <TableCell className="font-medium">
//                     <SwitchCustom />
//                   </TableCell>
//                   <TableCell
//                     className="font-medium flex items-center py-2 cursor-pointer hover:underline"
//                     onClick={() => goInsideDialog(investor)}
//                   >
//                     <div className="w-5 h-5 mr-2 mt-2 overflow-hidden rounded-full">
//                       <img
//                         src={investor.profile_pic}
//                         className="w-full h-full object-cover"
//                         alt="dp"
//                       />
//                     </div>
//                     <span className="mt-2">{investor.name}</span>
//                     <SquareArrowOutUpRight className="w-3 ml-1 mt-2 text-blue-400" />
//                   </TableCell>
//                   <TableCell className="font-medium">{investor.mail}</TableCell>
//                   <TableCell className="font-medium capitalize">
//                     {investor.type}
//                   </TableCell>
//                   <TableCell className="font-medium text-center">
//                     {investor.deals_invested}
//                   </TableCell>
//                   <TableCell className="font-medium">
//                     {investor.kyc_status}
//                   </TableCell>
//                   <TableCell className="font-medium">
//                     {investor.joined_on}
//                   </TableCell>
//                   <TableCell className="font-medium">
//                     {investor.capital_commitment}
//                   </TableCell>
//                   <TableCell className="font-medium">
//                     <FileText
//                       onClick={() => setAwsObjectKey(test)}
//                       className="cursor-pointer"
//                     />
//                   </TableCell>
//                   <AdvancedInvestorActionsCell
//                     key={investor.investor_id}
//                     investor={investor}
//                     deleteInvestor={deleteInvestor}
//                   />
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table> */}
//         <Pagination className="bg-[#2A2A2B] p-2 flex justify-between items-center">
//           <span>Total records: {data?.pagination.total_records}</span>
//           <PaginationContent className="gap-10">
//             <PaginationItem
//               className={`${!pagination?.has_prev ? 'hidden' : null} cursor-pointer`}
//             >
//               <PaginationPrevious
//                 className="rounded-none"
//                 onClick={handlePrev}
//                 aria-disabled={!pagination?.has_prev}
//               />
//             </PaginationItem>
//             <div className="flex gap-2">
//               {Array.from(
//                 { length: pagination?.total_pages || 1 },
//                 (_, idx) => (
//                   <PaginationItem key={idx + 1} className="cursor-pointer">
//                     <PaginationLink
//                       className={`${pageNumber === idx + 1 ? 'text-black' : 'text-white'} rounded-none`}
//                       isActive={pageNumber === idx + 1}
//                       onClick={e => {
//                         e.preventDefault();
//                         setPageNumber(idx + 1);
//                       }}
//                     >
//                       {idx + 1}
//                     </PaginationLink>
//                   </PaginationItem>
//                 )
//               )}
//             </div>
//             <PaginationItem
//               className={`${!pagination?.has_next ? 'hidden' : null} cursor-pointer`}
//             >
//               <PaginationNext className="rounded-none" onClick={handleNext} />
//             </PaginationItem>
//           </PaginationContent>
//           <div className="flex items-center">
//             <label htmlFor="pageSizeSelect" className="text-sm font-medium">
//               Records per page:&nbsp;
//             </label>
//             <Select
//               onValueChange={handlePageSizeChange}
//               defaultValue={String(pageSize)}
//             >
//               <SelectTrigger className="rounded-none w-[100px]">
//                 <SelectValue placeholder="Select Page Size" />
//               </SelectTrigger>
//               <SelectContent className="rounded-none">
//                 {pageSizesList.map(ps => (
//                   <SelectItem key={ps} value={String(ps)}>
//                     {ps}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </Pagination>
//       </div>
//       {/* <Suspense fallback={<div>Loading...</div>}>
//         <InvestorDetailsDialog
//           open={openDetails}
//           onOpenChange={setOpenDetails}
//           details={sendDetails}
//         />
//       </Suspense> */}
//       <Suspense fallback={<div>Loading...</div>}>
//         <InvestorFileDisplayDialog
//           // awsObjectKey={sendDetails?.investor_id}
//           awsObjectKey={awsObjectKey}
//           setAwsObjectKey={setAwsObjectKey}
//         />
//       </Suspense>
//     </>
//   );
// };

// export default InvestorTable;
