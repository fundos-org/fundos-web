import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TableCell } from '@/components/ui/table';
import { AppEnums } from '@/constants/enums';
import { useAwsFileObjectKey } from '@/hooks/useAwsFileObjectKey';
import { FileText, X } from 'lucide-react';
import { FC, memo, useState } from 'react';
import { InvestorEntity } from '../InvestorTable/InvestorTable';

const AdvancedInvestorFileDialog: FC<{ investor?: InvestorEntity }> = memo(
  () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { data: showFile, error } = useAwsFileObjectKey(
      AppEnums.AWS_BUCKET_NAME,
      'deals/pitch_decks/18e75944-883f-46b5-b716-22c61cc3a061_20250510134038.png' // ||
      //   investor.investor_id
    );

    return (
      <>
        <TableCell className="font-medium">
          <FileText
            onClick={() => setDialogOpen(true)}
            className="cursor-pointer"
          />
        </TableCell>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            hideCloseButton={true}
            className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-4xl max-h-[90vh]"
            aria-describedby={undefined}
            onInteractOutside={e => e.preventDefault()}
          >
            {!error ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl text-white flex items-center justify-between">
                    MCA DOCS
                    <DialogClose
                      asChild
                      className="border-[1px] border-[#383739] bg-[#242325] cursor-pointer"
                    >
                      <span className="p-1">
                        <X />
                      </span>
                    </DialogClose>
                  </DialogTitle>
                  <hr className="border-[#232A36] my-2" />
                </DialogHeader>
                <div className="w-full flex">
                  <img src={showFile} alt="File" />
                </div>
              </>
            ) : (
              <div>Some Error occured</div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

export default AdvancedInvestorFileDialog;
