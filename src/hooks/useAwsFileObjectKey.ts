import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppEnums, AWS_REGION } from '@/constants/enums';

export const useAwsFileObjectKey = (bucket: string, key: string) => {
  return useQuery(
    [AppEnums.AWS_FILE, bucket, key],
    () => getFileUrl(bucket, key),
    {
      enabled: !!bucket && !!key,
      refetchOnWindowFocus: false,
      retry: 2,
      onError: (error: Error) => {
        toast.error(`Fetch investors failed: ${error.message}`);
      },
    }
  );
};

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY as string,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS as string,
  },
});

export async function getFileUrl(bucket: string, key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 6 });
    return url;
  } catch (error) {
    console.error('Error generating signed URL for S3 object:', error);
    throw new Error('Error generating signed URL for S3 object:');
  }
}
