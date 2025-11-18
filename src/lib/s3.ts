import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<string> {
  const key = `${folder}/${Date.now()}-${fileName}`;

  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
    Metadata: {
      uploadedAt: new Date().toISOString(),
    },
  };

  try {
    const result = await s3.upload(params).promise();

    // Return CloudFront URL if configured, otherwise S3 URL
    const cloudfrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
    if (cloudfrontDomain) {
      return `https://${cloudfrontDomain}/${key}`;
    }

    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFromS3(url: string): Promise<void> {
  try {
    // Extract key from URL
    const key = url.split('/').slice(3).join('/');

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file');
  }
}

export async function getPresignedUrl(
  fileName: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<{ url: string; key: string }> {
  const key = `${folder}/${Date.now()}-${fileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Expires: 300, // 5 minutes
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    return { url, key };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}
