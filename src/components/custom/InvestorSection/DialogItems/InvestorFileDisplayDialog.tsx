import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AWS_BUCKET_NAME } from '@/constants/enums';
import { useAwsFileObjectKey } from '@/hooks/useAwsFileObjectKey';
import { X } from 'lucide-react';
import { Dispatch, FC, memo, SetStateAction } from 'react';

const AdvancedInvestorFileDialog: FC<{
  awsObjectKey: string | null;
  setAwsObjectKey: Dispatch<SetStateAction<string | null>>;
}> = memo(({ awsObjectKey, setAwsObjectKey }) => {
  const { data: showFile, error } = useAwsFileObjectKey(
    AWS_BUCKET_NAME,
    awsObjectKey ?? ''
  );

  return (
    <>
      <Dialog
        open={!!awsObjectKey}
        onOpenChange={open => {
          if (!open) setAwsObjectKey?.(null);
        }}
      >
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
                    <span
                      className="p-1"
                      onClick={() => setAwsObjectKey?.(null)}
                    >
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
});

export default AdvancedInvestorFileDialog;
