import { FC } from 'react';
import { useInvestorDealInvestments } from '@/hooks/customhooks/MembersHooks/useInvestorDealInvestments';
import CardDeal from './Deal';

const InvestorInvestments: FC<{ investor_id: string }> = ({ investor_id }) => {
  const { data } = useInvestorDealInvestments(investor_id);
  return (
    <div className="flex flex-wrap gap-4 overflow-y-auto h-[calc(100vh-40vh)]">
      {data?.deals.map(deal => <CardDeal deal={deal} />)}
    </div>
  );
};
export default InvestorInvestments;
