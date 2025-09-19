import { Card, CardContent } from '../ui/card';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Building,
  CreditCard,
  Target,
  BarChart3
} from 'lucide-react';

const formatKey = (key: string) => key.replace(/_/g, ' ').trim();

// Map stat keys to appropriate icons
const getStatIcon = (key: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    investors: <Users className="fundos-stat-icon" />,
    users: <Users className="fundos-stat-icon" />,
    amount: <DollarSign className="fundos-stat-icon" />,
    revenue: <DollarSign className="fundos-stat-icon" />,
    deals: <Building className="fundos-stat-icon" />,
    transactions: <CreditCard className="fundos-stat-icon" />,
    growth: <TrendingUp className="fundos-stat-icon" />,
    target: <Target className="fundos-stat-icon" />,
    performance: <BarChart3 className="fundos-stat-icon" />,
  };
  
  const normalizedKey = key.toLowerCase().replace(/_/g, '');
  return iconMap[normalizedKey] || <Activity className="fundos-stat-icon" />;
};

// Format large numbers with appropriate suffixes
const formatValue = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return String(value);
  
  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K`;
  }
  
  return String(numValue);
};

interface StatisticCardListProps {
  stats?: Record<string, string | number>;
  className?: string;
}

function StatisticCardList({ stats, className }: StatisticCardListProps) {
  const defaultStats = { 
    investors: '0', 
    deals: '0',
    amount: '0',
    growth: '0%'
  };

  return (
    <div className={`fundos-stats-grid ${className || ''}`}>
      {Object.entries(stats ?? defaultStats).map(([key, value], index) => (
        <Card
          key={index}
          className="fundos-stat-card fundos-stat-card-admin"
        >
          <CardContent className="p-6">
            {getStatIcon(key)}
            <div className="space-y-1">
              <p className="fundos-stat-label text-gray-600">
                {formatKey(key)}
              </p>
              <p className="fundos-stat-value text-gray-900">
                {formatValue(value)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatisticCardList;
