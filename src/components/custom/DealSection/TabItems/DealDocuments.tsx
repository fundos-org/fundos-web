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
      <div className="flex gap-5 flex-wrap">
        {Object.entries(data?.documents ?? {}).map(([key, value]) => (
          <Card
            className="bg-[#383739 border-[#383739] w-[15rem] h-[13rem] cursor-pointer rounded-none flex justify-between p-0"
            onClick={() => setAwsObjectKey(value)}
          >
            <CardContent className="w-full flex justify-center items-center h-full">
              <FileText className="text-[#b3b3b3] w-16 h-16" />
            </CardContent>
            <CardFooter className="bg-[#535353] py-3">
              <p className="text-white">{convertKeyToLabel(key)}</p>
            </CardFooter>
          </Card>
        ))}
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
