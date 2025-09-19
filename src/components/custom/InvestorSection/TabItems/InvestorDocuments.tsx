import { uploadUnitStatement } from '@/axioscalls/apiServices';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useInvestorDocuments } from '@/hooks/customhooks/MembersHooks/useInvestorDocuments';
import isThisSubadmin from '@/lib/isSubadmin';
import { FileText, Upload } from 'lucide-react';
import { FC, lazy, Suspense, useRef, useState } from 'react';
import { useNotification } from '@/components/custom/NotificationProvider';
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
  const notification = useNotification();

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
      notification.error('Please upload a PDF file only');
      return;
    }
    try {
      setIsUploading(true);
      await uploadUnitStatement(file, investor_id);
      notification.success('Unit statement uploaded successfully');
      queryClient.invalidateQueries([
        QueryEnums.InvestorDocuments,
        investor_id,
      ]);
    } catch {
      notification.error('Failed to upload unit statement');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center py-4 bg-gray-50 px-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Investor Documents
          </h1>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(data?.documents ?? {}).map(([key, value]) => (
              <Card
                key={key}
                className="bg-white border border-gray-200 w-full h-[13rem] cursor-pointer rounded-lg hover:shadow-md transition-shadow p-0 relative"
                onClick={() => setAwsObjectKey(value)}
              >
                {key === 'unit_statement_key' && !isThisSubadmin() && (
                  <div
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-lg absolute top-2 right-2 flex items-center justify-center transition-colors"
                    onClick={handleChooseFile}
                    role="button"
                    aria-label="Upload unit statement (PDF)"
                  >
                    <Upload className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`} />
                  </div>
                )}
                <CardContent className="w-full flex justify-center items-center h-full pt-6">
                  <FileText className="text-gray-400 w-16 h-16" />
                </CardContent>
                <CardFooter className="bg-gray-100 py-3 px-4">
                  <p className="text-gray-900 font-medium text-sm">{convertKeyToLabel(key)}</p>
                </CardFooter>
              </Card>
            ))}
            {(!data?.documents || Object.keys(data.documents).length === 0) && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <span className="text-sm">No documents available for this investor.</span>
              </div>
            )}
          </div>
        </div>
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
