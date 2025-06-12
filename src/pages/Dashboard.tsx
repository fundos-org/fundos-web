import { useAppStateEffect } from '@/app/hooks';
import { RootState } from '@/app/store';
import { fetchDashboardStatistics } from '@/axioscalls/dealApiServices';
import ActivitesList from '@/components/custom/ActivitesList';
import OverViewChart from '@/components/custom/OverViewChart';
import StatisticCardList from '@/components/custom/StatisticCardList';
import TransactionTable from '@/components/custom/tables/TransactionDetailsTable';
import { useState } from 'react';

const data = [
  {
    transaction_id: 'a1b2c3d4-e5f6-7890-g1h2-3i4j5k6l7m8n',
    investor: 'Anjali Patel',
    invested_in: 'TechTrend Innovations',
    amount: 150000,
    transaction_date: '2025-05-20T10:00:00',
  },
  {
    transaction_id: 'b2c3d4e5-f6g7-8901-h2i3-4j5k6l7m8n9o',
    investor: 'Vikram Singh',
    invested_in: 'GreenLeaf Energy',
    amount: 200000,
    transaction_date: '2025-05-19T14:30:00',
  },
  {
    transaction_id: 'c3d4e5f6-g7h8-9012-i3j4-5k6l7m8n9o0p',
    investor: 'Priya Gupta',
    invested_in: 'HealthCare Solutions',
    amount: 100000,
    transaction_date: '2025-05-18T09:15:00',
  },
  {
    transaction_id: 'd4e5f6g7-h8i9-0123-j4k5-6l7m8n9o0p1q',
    investor: 'Arjun Mehta',
    invested_in: 'AI Dynamics',
    amount: 300000,
    transaction_date: '2025-05-17T11:45:00',
  },
  {
    transaction_id: 'e5f6g7h8-i9j0-1234-k5l6-7m8n9o0p1q2r',
    investor: 'Neha Sharma',
    invested_in: 'EduTech Ventures',
    amount: 250000,
    transaction_date: '2025-05-16T16:00:00',
  },
  {
    transaction_id: 'f6g7h8i9-j0k1-2345-l6m7-8n9o0p1q2r3s',
    investor: 'Rohit Verma',
    invested_in: 'FinTech Pioneers',
    amount: 175000,
    transaction_date: '2025-05-15T13:20:00',
  },
  {
    transaction_id: 'g7h8i9j0-k1l2-3456-m7n8-9o0p1q2r3s4t',
    investor: 'Kavita Desai',
    invested_in: 'AgriTech Solutions',
    amount: 125000,
    transaction_date: '2025-05-14T10:30:00',
  },
  {
    transaction_id: 'h8i9j0k1-l2m3-4567-n8o9-0p1q2r3s4t5u',
    investor: 'Sanjay Kumar',
    invested_in: 'SmartCity Tech',
    amount: 200000,
    transaction_date: '2025-05-13T15:00:00',
  },
  {
    transaction_id: 'i9j0k1l2-m3n4-5678-o9p0-1q2r3s4t5u6v',
    investor: 'Deepika Rao',
    invested_in: 'CleanEnergy Systems',
    amount: 180000,
    transaction_date: '2025-05-12T12:10:00',
  },
  {
    transaction_id: 'j0k1l2m3-n4o5-6789-p0q1-2r3s4t5u6v7w',
    investor: 'Amit Joshi',
    invested_in: 'BioTech Innovate',
    amount: 220000,
    transaction_date: '2025-05-11T09:50:00',
  },
];

function Dashboard() {
  const stats = useAppStateEffect(
    (state: RootState) => state.dashboard.statistics,
    fetchDashboardStatistics
  );
  const [name] = useState(
    JSON.parse(sessionStorage.getItem('subadmindetails') || '{}').name || ''
  );
  if (!name) {
    return <div>Please log in</div>;
  }

  return (
    <>
      <h2 className="text-4xl">Welcome Back, {name}</h2>
      <div className="mb-8">
        <small className="text-gray-500">
          Measure your advertising ROI and report website traffic
        </small>
      </div>
      <StatisticCardList
        stats={stats as Record<string, string | number> | undefined}
      />
      <div className="w-full flex gap-5 mb-5">
        <OverViewChart />
        <ActivitesList />
      </div>
      <TransactionTable header="Recent" transactions={data} />
    </>
  );
}

export default Dashboard;
