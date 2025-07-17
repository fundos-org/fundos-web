import { FC } from 'react';

const DealTransactions: FC<{ deal_id: string }> = ({ deal_id }) => {
  return <div>DealTransactions {deal_id}</div>;
};

export default DealTransactions;
