import {
  BlockPublicAccess,
  BucketEncryption,
  BucketProps,
  Bucket as S3Bucket
} from 'aws-cdk-lib/aws-s3'
import { Construct, Node } from 'constructs'

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
  myProps: BucketProps
  constructor (scope: Construct, id: string, props?: BucketProps) {
    super(scope, id, {
      ...defaultBucketProps,
      ...props
    })
    this.myProps = {
      ...defaultBucketProps,
      ...props
    }

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkSsl(),
          ...this.checkPublicAccess(),
          ...this.checkEncryption()
        ]
      }
    })
  }

  protected checkSsl () {
    return this.myProps.enforceSSL
      ? []
      : ['enforceSSL must be true']
  }

  protected checkPublicAccess () {
    return this.myProps.blockPublicAccess !== BlockPublicAccess.BLOCK_ALL
      ? ['blockPublicAccess must be BLOCK_ALL']
      : []
  }

  protected checkEncryption () {
    return (!this.myProps.encryption || this.myProps.encryption === BucketEncryption.UNENCRYPTED)
      ? ['bucket must be encrypted']
      : []
  }
}
