import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

if (!region) {
  throw new Error("AWS_REGION belum diset");
}

if (!bucket) {
  throw new Error("AWS_S3_BUCKET belum diset");
}

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function getPresignedDownloadUrl(
  key: string,
  downloadName?: string
) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: downloadName
      ? `attachment; filename="${downloadName}"`
      : undefined,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 60 * 5,
  });
}