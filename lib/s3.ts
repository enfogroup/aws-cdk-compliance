import {
  BlockPublicAccess,
  BucketEncryption,
  BucketProps,
  Bucket as S3Bucket
} from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

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
 *
 * See README for usage examples
 */
export class Bucket extends S3Bucket {
  protected calculatedProps: BucketProps
  constructor (scope: Construct, id: string, props?: BucketProps) {
    super(scope, id, {
      ...defaultBucketProps,
      ...props
    })
    this.calculatedProps = {
      ...defaultBucketProps,
      ...props
    }

    this.node.addValidation({
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
    return this.calculatedProps.enforceSSL
      ? []
      : ['enforceSSL must be true']
  }

  protected checkPublicAccess () {
    return this.calculatedProps.blockPublicAccess !== BlockPublicAccess.BLOCK_ALL
      ? ['blockPublicAccess must be BLOCK_ALL']
      : []
  }

  protected checkEncryption () {
    return (!this.calculatedProps.encryption || this.calculatedProps.encryption === BucketEncryption.UNENCRYPTED)
      ? ['bucket must be encrypted']
      : []
  }
}
