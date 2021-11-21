import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'

/**
 * Props for ExampleConstruct
 */
export interface ExampleConstructProps extends cdk.StackProps {
  /**
   * Name of S3 bucket
   */
  bucketName: string;
  /**
   * Optional name of index document enabling static website hosting
   */
  indexDocument?: string;
}

/**
 * Example construct which will create an S3 bucket based on user input
 */
export class ExampleConstruct extends cdk.Construct {
  constructor (scope: cdk.Construct, id: string, props: ExampleConstructProps) {
    super(scope, id)

    new s3.Bucket(scope, id + 'Bucket', {
      bucketName: props.bucketName,
      websiteIndexDocument: props.indexDocument
    })
  }
}

/**
 * Example function which applies settings to an S3 bucket
 * @param bucket
 * S3 Bucket
 */
export const applyBucketSettings = (bucket: s3.Bucket): void => {
  const rule: s3.LifecycleRule = {
    transitions: [
      {
        storageClass: s3.StorageClass.GLACIER,
        transitionAfter: cdk.Duration.days(30)
      }
    ]
  }
  bucket.addLifecycleRule(rule)
}
