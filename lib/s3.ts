import { BucketEncryption, BucketProps } from '@aws-cdk/aws-s3'

/**
 * Default settings for S3. Should be spread into S3 Bucket object as a part of creation.
 * See README for examples
 */
export const S3Defaults: Pick<BucketProps, 'enforceSSL' | 'publicReadAccess' | 'encryption'> = {
  enforceSSL: true,
  publicReadAccess: false,
  encryption: BucketEncryption.S3_MANAGED
}
