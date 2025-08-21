import { uploadUnitStatement } from '@/axioscalls/apiServices';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useInvestorDocuments } from '@/hooks/customhooks/MembersHooks/useInvestorDocuments';
import isThisSubadmin from '@/lib/isSubadmin';
import { FileText, Upload } from 'lucide-react';
import { FC, lazy, Suspense, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { QueryEnums } from '@/queryEnums';
const InvestorFileDisplayDialog = lazy(
  () => import('../DialogItems/InvestorFileDisplayDialog')
);

const convertKeyToLabel = (k: string) =>
  k
    .split('_')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ')
    .replace(' Key', '');

const InvestorDocuments: FC<{ investor_id: string }> = ({ investor_id }) => {
  const [awsObjectKey, setAwsObjectKey] = useState<string | null>(null);
  const { data } = useInvestorDocuments(investor_id);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleChooseFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async e => {
    const file = e.target.files?.[0] ?? null;
    // reset input so same file can be re-selected later
    e.currentTarget.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      return;
    }
    try {
      setIsUploading(true);
      await uploadUnitStatement(file, investor_id);
      toast.success('Unit statement uploaded');
      queryClient.invalidateQueries([
        QueryEnums.InvestorDocuments,
        investor_id,
      ]);
    } catch {
      toast.error('Failed to upload unit statement');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <>
      <div className="flex gap-5 flex-wrap">
        {Object.entries(data?.documents ?? {}).map(([key, value]) => (
          <Card
            key={key}
            className="bg-[#383739 border-[#383739] w-[15rem] h-[13rem] cursor-pointer rounded-none flex justify-between p-0 relative"
            onClick={() => setAwsObjectKey(value)}
          >
            {key === 'unit_statement_key' && !isThisSubadmin() && (
              <div
                className="p-3 border bg-slate-400 hover:bg-slate-300 w-13 absolute top-2 right-2 disabled:opacity-60"
                onClick={handleChooseFile}
                role="button"
                aria-label="Upload unit statement (PDF)"
              >
                <Upload className={isUploading ? 'animate-pulse' : ''} />
              </div>
            )}
            {
              <>
                <CardContent className="w-full flex justify-center items-center h-full">
                  <FileText className="text-[#b3b3b3] w-16 h-16" />
                </CardContent>
                <CardFooter className="bg-[#535353] py-3">
                  <p className="text-white">{convertKeyToLabel(key)}</p>
                </CardFooter>
              </>
            }
          </Card>
        ))}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <InvestorFileDisplayDialog
          awsObjectKey={awsObjectKey}
          setAwsObjectKey={setAwsObjectKey}
        />
      </Suspense>
    </>
  );
};

export default InvestorDocuments;
