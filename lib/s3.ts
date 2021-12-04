import { BlockPublicAccess, BucketEncryption, BucketProps as S3BucketProps, Bucket as S3Bucket } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

export interface BucketProps extends S3BucketProps {
  readonly enforceSSL?: true,
  readonly blockPublicAccess?: BlockPublicAccess,
  readonly encryption?: Exclude<BucketEncryption, BucketEncryption.UNENCRYPTED>
}

interface InternalBucketProps extends BucketProps {
  readonly enforceSSL: true,
  readonly blockPublicAccess: BlockPublicAccess,
  readonly encryption: Exclude<BucketEncryption, BucketEncryption.UNENCRYPTED>
}

/**
 * Compliant BucketProps. Can be manually spread into a Bucket constructor.
 *
 * See README for usage examples
 */
export const defaultBucketProps: BucketProps = {
  enforceSSL: true,
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  encryption: BucketEncryption.S3_MANAGED
}

/**
 * Compliant S3 Bucket.
 * SSL communication will be enforced.
 * Public access will be blocked.
 * S3 managed encryption will be enabled. This can be overwritten using the encryption key in props.
 *
 * See README for usage examples
 */
export class Bucket extends S3Bucket {
  constructor (scope: Construct, id: string, props?: BucketProps) {
    super(scope, id, {
      ...defaultBucketProps,
      ...props
    } as InternalBucketProps)
  }
}
