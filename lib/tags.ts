import { Tags } from 'aws-cdk-lib'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

/**
 * Available Backup plans. Availability depends on your agreement with Enfo
 */
export enum BackupPlan {
  /**
   * Creates backups in the region of the resource
   */
  STANDARD = 'Standard',
  /**
   * Creates backups in the region of the resource, and copies of those backups in eu-north-1, the Stockholm region
   */
  STOCKHOLM = 'StandardCrossRegionStockholm',
  /**
   * Creates backups in the region of the resource, and copies of those backups in eu-west-1, the Ireland region
   */
  IRELAND = 'StandardCrossRegionIreland',
  /**
   * Creates backups in the region of the resource, and copies of those backups in eu-central-1, the Frankfurt region
   */
  FRANKFURT = 'StandardCrossRegionFrankfurt'
}

/**
 * Tags a CDK Construct to enable Enfo Standard Backups.
 * If an a stack is supplied this will be applied to all resources within the stack.
 * See README for examples
 *
 * Backups only applies to databases. The following types of resources will be affected:
 * Aurora
 * RDS
 * DynamoDB
 * EBS
 * EC2
 * EFS
 * FSx
 * Storage Gateway
 * DocumentDB
 * Neptune
 *
 * @param construct
 * A CDK Construct
 * @param backupPlan
 * Which BackupPlan to use. Defaults to STANDARD
 */
export const enableBackups = (construct: Construct, backupPlan: BackupPlan = BackupPlan.STANDARD): void => {
  Tags.of(construct).add('BackupPlan', backupPlan)
}

/**
 * Static value used for exemption tags
 */
export const ExemptionValue = 'Exempt'

/**
 * Tags a Bucket as exempt from the auto fixing of https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-5 which is handled within Enfo managed accounts
 * @param bucket
 * CDK Bucket Construct
 */
export const exemptBucketFromSslAutoFix = (bucket: Bucket): void => {
  Tags.of(bucket).add('SecureTransportAutomation', ExemptionValue)
}

/**
 * Tags a Bucket as exempt from the auto fixing of https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-2 which is handled within Enfo managed accounts
 * @param bucket
 * CDK Bucket Construct
 */
export const exemptBucketFromBlockPublicAutoFix = (bucket: Bucket): void => {
  Tags.of(bucket).add('BlockPublicAccessAutomation', ExemptionValue)
}
