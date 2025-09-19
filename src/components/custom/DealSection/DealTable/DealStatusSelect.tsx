import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { DealStatus } from '@/constants/dealsConstant';
import { useDealStatusChange } from '@/hooks/customhooks/DealsHooks/useDealStatusChange';
import { useNotification } from '@/components/custom/NotificationProvider';

function getStatusColor(status: DealStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-green-600';
    case 'CLOSED':
      return 'bg-red-600';
    case 'ON_HOLD':
      return 'bg-yellow-600';
    default:
      return 'bg-gray-600';
  }
}

function getStatusBgColor(status: DealStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CLOSED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'ON_HOLD':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

interface DealStatusSelectProps {
  deal_id: string;
  initialStatus: DealStatus;
}

const DealStatusSelect: React.FC<DealStatusSelectProps> = ({
  deal_id,
  initialStatus,
}) => {
  const [status, setStatus] = useState<DealStatus>(initialStatus || 'open');
  const [open, setOpen] = useState(false);
  const { mutateAsync: changeDealStatus } = useDealStatusChange();
  const notification = useNotification();

  const handleChangeStatus = async (status: DealStatus) => {
    if (status !== 'CLOSED' && !open) {
      const response = await changeDealStatus({ deal_id, status });
      if (!response) {
        notification.error(
          'Failed to Update Status',
          'Unable to change deal status. Please try again.',
          { duration: 5000 }
        );
        return;
      }
      if (response.message) {
        notification.success(
          'Status Updated',
          response.message,
          { duration: 3000 }
        );
      }
      setStatus(status);
    } else if (status === 'CLOSED' && !open) {
      setOpen(true);
    } else if (status === 'CLOSED' && open) {
      const response = await changeDealStatus({ deal_id, status });
      if (!response) {
        notification.error(
          'Failed to Close Deal',
          'Unable to close the deal. Please try again.',
          { duration: 5000 }
        );
        return;
      }
      if (response.message) {
        notification.success(
          'Deal Closed',
          response.message,
          { duration: 3000 }
        );
      }
      setStatus(status);
      setOpen(false);
    }
  };

  const handleClose = async () => {
    setStatus(initialStatus); // Revert to initial status on cancel
    setOpen(false);
  };

  return (
    <>
      <Select
        defaultValue={status}
        value={status}
        onValueChange={handleChangeStatus}
      >
        <SelectTrigger
          className={`rounded-lg border ${getStatusBgColor(status)} cursor-pointer font-medium px-3 py-1`}
        >
          <SelectValue>
            <span
              className={`mx-1 inline-block w-2 h-2 rounded-full ${getStatusColor(status)}`}
            />
            {status === 'OPEN' ? 'Active' : null}
            {status === 'CLOSED' ? 'Closed' : null}
            {status === 'ON_HOLD' ? 'On Hold' : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white text-gray-900 border border-gray-200 rounded-lg shadow-lg">
          <SelectItem className="rounded-md hover:bg-gray-50 cursor-pointer" value="OPEN">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
              Active
            </div>
          </SelectItem>
          <SelectItem className="rounded-md hover:bg-gray-50 cursor-pointer" value="CLOSED">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-600"></span>
              Closed
            </div>
          </SelectItem>
          <SelectItem className="rounded-md hover:bg-gray-50 cursor-pointer" value="ON_HOLD">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-600"></span>
              On Hold
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-white text-gray-900 border-gray-200 rounded-lg shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold text-gray-900">
              Are you closing this deal?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Closing the deal will mark it as closed and it cannot be
              reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel
              onClick={handleClose}
              className="bg-gray-100 px-6 text-gray-700 hover:bg-gray-200 border-gray-300 rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 rounded-lg px-6"
              onClick={() => handleChangeStatus('CLOSED' as DealStatus)}
            >
              Close Deal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DealStatusSelect;
