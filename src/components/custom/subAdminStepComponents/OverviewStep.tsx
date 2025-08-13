import { shareDetails } from '@/axioscalls/apiServices';
import { Button } from '@/components/ui/button';
import { AWS_BUCKET_NAME } from '@/constants/enums';
import { useSubadminDetails } from '@/hooks/customhooks/SubAdminsHooks/useSubadminDetails';
import { useAwsFileObjectKey } from '@/hooks/useAwsFileObjectKey';
import toast from 'react-hot-toast';

const OverviewStep = ({ subAdminId }: { subAdminId: string }) => {
  const { data } = useSubadminDetails('3a67afc8-5e60-44d1-a4f3-2f07b2f069ae');
  const { data: logo } = useAwsFileObjectKey(AWS_BUCKET_NAME, data?.logo ?? '');
  const handleClick = async () => {
    const response = await shareDetails(subAdminId);
    if (!response) {
      toast.error('Failed to send invite');
    }
  };

  return (
    <div className="relative text-white w-full">
      {data && (
        <div className="p-5 mb-5 bg-[#1C2526] border border-zinc-600">
          <div className="mb-5">
            <p className="text-lg font-medium">
              Congratulations, sub-admin created!
            </p>
            <p className="text-sm text-gray-400">
              An confirmation mail has been sent to {data?.name}
            </p>
          </div>
          <div className="flex gap-4 mb-6 bg-[#1C2526]">
            <div className="w-16 h-16 bg-white flex items-center justify-center">
              {logo && (
                <img
                  src={logo}
                  className="max-w-full max-h-full object-contain"
                  alt="suabdmin"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium capitalize">
                {data?.name}'s Investiee
              </p>
              <p className="text-sm text-gray-400">
                App link:{' '}
                <a href={data.app_link} className="underline text-blue-400">
                  {data.app_link}
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
