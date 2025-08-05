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
import toast from 'react-hot-toast';
import { useDealStatusChange } from '@/hooks/customhooks/DealsHooks/useDealStatusChange';

function getStatusColor(status: DealStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-green-400';
    case 'CLOSED':
      return 'bg-red-400';
    case 'ON_HOLD':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-400';
  }
}

function getStatusBgColor(status: DealStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-[#00fb5745]';
    case 'CLOSED':
      return 'bg-[#fd888845]';
    case 'ON_HOLD':
      return 'bg-[#fbbf2450]';
    default:
      return 'bg-[#6b728045]';
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

  const handleChangeStatus = async (status: DealStatus) => {
    if (status !== 'CLOSED' && !open) {
      const response = await changeDealStatus({ deal_id, status });
      if (!response) {
        toast.error('Failed to change deal status');
        return;
      }
      if (response.message) {
        toast.success(response.message);
      }
      setStatus(status);
    } else if (status === 'CLOSED' && !open) {
      setOpen(true);
    } else if (status === 'CLOSED' && open) {
      const response = await changeDealStatus({ deal_id, status });
      if (!response) {
        toast.error('Failed to change deal status');
        return;
      }
      if (response.message) {
        toast.success(response.message);
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
          className={`rounded-none border-0 text-white ${getStatusBgColor(status)} cursor-pointer`}
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
        <SelectContent className="bg-[#1a1a1a] text-white border rounded-none">
          <SelectItem className="rounded-none" value="OPEN">
            Active
          </SelectItem>
          <SelectItem className="rounded-none" value="CLOSED">
            Closed
          </SelectItem>
          <SelectItem className="rounded-none" value="ON_HOLD">
            On Hold
          </SelectItem>
        </SelectContent>
      </Select>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-700 rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Are you closing this deal?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Closing the deal will mark it as closed and it cannot be
              reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleClose}
              className="bg-gray-800 px-10 text-white hover:bg-gray-700 border-gray-700 rounded-none"
            >
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 rounded-none"
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
