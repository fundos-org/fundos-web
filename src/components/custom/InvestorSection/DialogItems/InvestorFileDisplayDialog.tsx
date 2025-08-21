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

  const getExtension = (key?: string | null, url?: string | null) => {
    const source = key || url || '';
    const clean = source.split('?')[0].split('#')[0];
    const lastDot = clean.lastIndexOf('.');
    if (lastDot === -1) return '';
    return clean.substring(lastDot + 1).toLowerCase();
  };

  const getFileKind = (ext: string): 'image' | 'pdf' | 'video' | 'unknown' => {
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
      return 'image';
    }
    if (ext === 'pdf') return 'pdf';
    if (['mp4', 'webm', 'ogg', 'mov', 'm4v', 'avi'].includes(ext)) {
      return 'video';
    }
    return 'unknown';
  };

  const ext = getExtension(awsObjectKey, showFile ?? null);
  const kind = getFileKind(ext);

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
                  DOCUMENT
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
              <div className="w-full flex items-center justify-center">
                {kind === 'image' && (
                  <img
                    src={showFile}
                    alt="File"
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                )}
                {kind === 'pdf' && (
                  <iframe
                    src={showFile ?? ''}
                    title="PDF Document"
                    className="w-full h-[80vh]"
                  />
                )}
                {kind === 'video' && (
                  <video
                    src={showFile}
                    controls
                    className="w-full max-h-[80vh]"
                  />
                )}
                {kind === 'unknown' && (
                  <div className="text-sm text-gray-300">
                    Unable to preview this file type.
                    <a
                      href={showFile}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 underline text-blue-400"
                    >
                      Open in new tab
                    </a>
                  </div>
                )}
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
