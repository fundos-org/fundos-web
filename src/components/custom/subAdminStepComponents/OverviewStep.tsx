import { getSubAdminById, shareDetails } from '@/axioscalls/dealApiServices';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Response {
  name: string;
  username: string;
  password: string;
  invite_code: string;
}

const OverviewStep = ({ subAdminId }: { subAdminId: string }) => {
  const [data, setData] = useState<Response>();

  const callGetSubAdminById = useCallback(async () => {
    try {
      const response = await getSubAdminById(subAdminId);
      setData(response);
    } catch (error) {
      console.error('Error fetching sub-admin data:', error);
    }
  }, [subAdminId]);

  useEffect(() => {
    if (!data) {
      callGetSubAdminById();
    }
  }, [callGetSubAdminById, data]);

  const handleClick = async () => {
    const response = await shareDetails(subAdminId);
    if (!response) {
      toast.error('Failed to send invite');
    }
  };

  return (
    <div className="relative text-white w-full max-w-md">
      <div className="flex items-center gap-3 p-3 mb-4">
        <img width="50" src="/fund.svg" alt="image" />
        <div>
          <p className="text-lg font-medium">
            Congratulations, sub-admin created!
          </p>
          <p className="text-sm text-gray-400">
            An confirmation mail has been sent to {data?.name}
          </p>
        </div>
      </div>

      {data && (
        <div className="p-5 mb-10 bg-[#1C2526]">
          <div className="flex gap-4 mb-6 bg-[#1C2526]">
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded"></div>
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium">{data?.name}'s investiee</p>
              <p className="text-sm text-gray-400">
                App link:{' '}
                <a href={appLink} className="underline text-blue-400">
                  {appLink}
                </a>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-sm text-gray-400">Sub-admin name</p>
            <p className="text-sm">{data?.name}</p>
            <p className="text-sm text-gray-400">Username</p>
            <p className="text-sm">{data?.username}</p>
            <p className="text-sm text-gray-400">Password</p>
            <p className="text-sm">{data?.password}</p>
            <p className="text-sm text-gray-400">Invite Code</p>
            <p className="text-sm">{data?.invite_code}</p>
          </div>
        </div>
      )}
      <Button
        className="w-full bg-white text-black hover:bg-gray-200 rounded-none"
        onClick={handleClick}
      >
        Share details
      </Button>
    </div>
  );
};

export default OverviewStep;

const appLink = 'www.applink.com/pratyush-investiee';
