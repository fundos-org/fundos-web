export const showS3File = (objectKey: string) =>
  `https://fundos-dev-bucket.s3.ap-south-1.amazonaws.com/${objectKey}`;

// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3 = new S3Client({ region: "us-east-1" }); // Or your region

// async function getImageUrl(bucket: string, key: string) {
//   const command = new GetObjectCommand({ Bucket: bucket, Key: key });
//   const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour expiry
//   return url;
// }
