import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const useAwsFileObjectKey = (bucket: string, key: string) => {
  return useQuery(['AWS_FILE'], () => getFileUrl(bucket, key), {
    enabled: !!bucket && !!key,
    refetchOnWindowFocus: false,
    retry: 2,
    // keepPreviousData: true,
    //   staleTime: 1000 * 60 * 60 * 6, // 6 hours
    // onSuccess: () => toast.success('Investors fetched successfully'),
    onError: (error: Error) => {
      toast.error(`Fetch investors failed: ${error.message}`);
    },
  });
};

const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY as string,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS as string,
  },
});

async function getFileUrl(bucket: string, key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 6 });
    return url;
  } catch (error) {
    console.error('Error generating signed URL for S3 object:', error);
    throw new Error('Error generating signed URL for S3 object:');
  }
}
