import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Dispatch, FC, SetStateAction } from 'react';

const DealEditDialog: FC<{
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  deal_id: string;
}> = ({ show, setShow, deal_id }) => {
  console.log(deal_id);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent
        className="max-w-[800px] h-[600px] rounded-none bg-[#1a1a1a] text-white border-0"
        hideCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl text-white flex items-center justify-between">
            Edit Deal
            <DialogClose
              asChild
              className="border-[1px] border-[#383739] bg-[#242325] cursor-pointer"
            >
              <span className="p-1">
                <X />
              </span>
            </DialogClose>
          </DialogTitle>
          <hr />
        </DialogHeader>
        <div>
          Edit Deal pending, ask manish to merge three endpoints and also make
          on deal details api for prepopulation
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealEditDialog;
