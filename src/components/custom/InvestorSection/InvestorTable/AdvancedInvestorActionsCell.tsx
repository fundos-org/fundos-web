import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { InvestorEntity } from './InvestorTable';
import { memo, Suspense, useState } from 'react';
import { TableCell } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UseMutateFunction } from 'react-query';
import { lazy } from 'react';
const InvestorEditDialog = lazy(
  () => import('../DialogItems/InvestorEditDialog')
);

const AdvancedInvestorActionsCell = memo(
  ({
    investor,
    deleteInvestor,
  }: {
    investor: InvestorEntity;
    deleteInvestor: UseMutateFunction<
      {
        success: boolean;
        message: string;
      },
      Error,
      string,
      unknown
    >;
  }) => {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isDialog, setIsDialog] = useState(false);

    const handleDeleteClick = () => {
      setDropdownOpen(false);
      setShowDeleteAlert(true);
    };

    const handleEdit = () => {
      setDropdownOpen(false);
      setIsDialog(true);
    };

    const handleConfirmDelete = async () => {
      setIsDeleting(true);
      try {
        deleteInvestor(investor.investor_id);
        setShowDeleteAlert(false);
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <>
        <TableCell className="font-medium">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="hover:bg-gray-100 p-2 rounded-none hover:text-black">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Member
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 focus:text-red-500"
                onClick={handleDeleteClick}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-400" />
                Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>

        {/* Enhanced Alert Dialog */}
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent className="rounded-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">
                Delete Investor
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-2">
                  <p>
                    Are you sure you want to delete{' '}
                    <strong>{investor.name}</strong>?
                  </p>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone. All data associated with this
                    investor will be permanently removed.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-gray-500 disabled:opacity-50 rounded-none"
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-none"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Suspense fallback={<div className="spinner">Loading...</div>}>
          <InvestorEditDialog
            isDialogOpen={isDialog}
            setDialogOpen={setIsDialog}
            investor_id={investor.investor_id}
          />
        </Suspense>
      </>
    );
  }
);

export default AdvancedInvestorActionsCell;
