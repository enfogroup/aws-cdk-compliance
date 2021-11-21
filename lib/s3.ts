import { BlockPublicAccess, BucketEncryption, BucketProps } from '@aws-cdk/aws-s3'

/**
 * Default settings for S3. Should be spread into S3 Bucket object as a part of creation.
 * See README for examples
 */
export const S3Defaults: Readonly<Pick<BucketProps, 'enforceSSL' | 'blockPublicAccess' | 'encryption'>> = {
  enforceSSL: true,
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  encryption: BucketEncryption.S3_MANAGED
}
