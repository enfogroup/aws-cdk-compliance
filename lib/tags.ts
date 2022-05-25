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
 * Tags a Bucket as exempt from the auto fixing of https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-2 which is handled within Enfo managed accounts
 * @param bucket
 * CDK Bucket Construct
 */
export const exemptBucketFromBlockPublicAutoFix = (bucket: Bucket): void => {
  Tags.of(bucket).add('BlockPublicAccessAutomation', ExemptionValue)
}

/**
 * Tags a Bucket as exempt from the auto fixing of https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-5 which is handled within Enfo managed accounts
 * @param bucket
 * CDK Bucket Construct
 */
export const exemptBucketFromSslAutoFix = (bucket: Bucket): void => {
  Tags.of(bucket).add('SecureTransportAutomation', ExemptionValue)
}

/**
 * Possible account environments
 */
export enum AccountEnvironment {
  DEVELOPMENT = 'Development',
  STAGE = 'Stage',
  TEST = 'Test',
  ACCEPTANCE_TEST = 'AcceptanceTest',
  SYSTEM_TEST = 'SystemTest',
  PRODUCTION = 'Production',
  OPS = 'Ops',
  ALL = 'ALL'
}

/**
 * Available Service Level Agreements
 */
export enum SLA {
  /**
   * Monday-Friday 07:00-17:00 CET
   */
  WEEKDAY = 'Weekday',
  /**
   * 24/7
   */
  TWENTY_FOUR_SEVEN = '24/7'
}

/**
 * Standard tags which should be applied to all resources in an Enfo account
 */
export interface StackTags {
  /**
   * Email of assigned owner
   */
  Owner: string
  /**
   * Name of the customer, from an Enfo perspective. This is optional if the whole account belongs to the same customer.
   */
  Customer?: string
  /**
   * Name of the project
   */
  Project: string
  /**
   * Project identifier in JIRA
   */
  ProjectKey: string
  /**
   * Cost center or business unit identification information, which is relevant for cost allocation purposes.
   * Format of value is customer specific. Multiple values can be specified if there are multiple levels in a hierarchy for cost allocation.
   * First value then is the top level and the following levels further down in the hierarchy.
   */
  CostCenter: string
  /**
   * Issue in JIRA which was the reason for this resource to be set up or created.
   * For example KEY-123
   */
  SetupRequest: string
  /**
   * The AWS account number
   */
  Account: string
  /**
   * Name of environment that this resource belongs to.
   * If it belongs to multiple environments multiple values may be specified.
   * Multiple values are specified as a string with comma separation between environments. For example 'Development,Test'
   */
  Environment: AccountEnvironment | string
  /**
   * Name of the resource, which may be added for extra description.
   * Do not include any key metadata in the Name tag only, use separate tags for that!
   * The Name tag shall never be required to obtain key information about a resource.
   * The primary purpose is to provide an easy human readable identifier.
   */
  Name?: string
  /**
   * How was this resource created and how does one manage it
   * Hard set to 'cdk' for this Interface
   */
  ManagedBy: 'cdk'
  /**
   * The repo containing the mechanism defined in ManagedBy.
   */
  Repo?: string
  /**
   * Service level agreement
   */
  SLA: SLA
}
