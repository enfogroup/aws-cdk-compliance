import { BlockPublicAccess, BucketEncryption, BucketProps, Bucket as S3Bucket } from '@aws-cdk/aws-s3'
import { Construct } from '@aws-cdk/core'

/**
 * Compliant BucketProps. Can be manually spread into a Bucket constructor.
 *
 * See README for usage examples
 */
export const compliantBucketProps: Readonly<Required<Pick<BucketProps, 'enforceSSL' | 'blockPublicAccess' | 'encryption'>>> = {
  enforceSSL: true,
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  encryption: BucketEncryption.S3_MANAGED
}

/**
 * Compliant S3 bucket.
 * SSL communication will be enforced.
 * Public access will be blocked.
 * S3 managed encryption will be enabled. This can be overwritten using the encryption key in props.
 *
 * See README for usage examples
 */
export class Bucket extends S3Bucket {
  constructor (scope: Construct, id: string, props?: BucketProps) {
    super(scope, id, {
      ...compliantBucketProps,
      ...props
    })
  }
}
