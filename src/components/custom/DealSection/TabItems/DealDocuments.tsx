import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useDealDocuments } from '@/hooks/customhooks/DealsHooks/useDealDocuments';
import { FileText } from 'lucide-react';
import { FC, lazy, Suspense, useState } from 'react';
const InvestorFileDisplayDialog = lazy(
  () => import('../../InvestorSection/DialogItems/InvestorFileDisplayDialog')
);

const convertKeyToLabel = (k: string) =>
  k
    .split('_')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ')
    .replace(' Key', '');

const DealDocuments: FC<{ deal_id: string }> = ({ deal_id }) => {
  const [awsObjectKey, setAwsObjectKey] = useState<string | null>(null);
  const { data } = useDealDocuments(deal_id);

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center py-4 bg-gray-50 px-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Deal Documents</h2>
        </div>
        
        <div className="p-6">
          {Object.entries(data?.documents ?? {}).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(data?.documents ?? {}).map(([key, value]) => (
                <Card
                  key={key}
                  className="bg-white border border-gray-200 w-full h-[13rem] cursor-pointer rounded-lg hover:shadow-md transition-shadow p-0 relative"
                  onClick={() => setAwsObjectKey(value)}
                >
                  <CardContent className="w-full flex justify-center items-center h-full p-4">
                    <FileText className="text-gray-400 w-16 h-16" />
                  </CardContent>
                  <CardFooter className="bg-gray-100 py-3 px-4">
                    <p className="text-gray-900 font-medium text-sm truncate w-full">
                      {convertKeyToLabel(key)}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-gray-400" />
                <span className="text-sm">No documents available for this deal.</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <InvestorFileDisplayDialog
          awsObjectKey={awsObjectKey}
          setAwsObjectKey={setAwsObjectKey}
        />
      </Suspense>
    </>
  );
};

export default DealDocuments;
