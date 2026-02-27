import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadCVToR2(
  pdf: Buffer,
  userId: string
): Promise<string> {
  const fileName = `cvs/${userId}-${Date.now()}.pdf`;
  
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: pdf,
      ContentType: 'application/pdf',
    })
  );
  
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
  return publicUrl;
}