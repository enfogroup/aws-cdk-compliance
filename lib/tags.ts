import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { Tags } from 'aws-cdk-lib'
import { Construct } from 'constructs'

/**
 * Available Backup plans. Availability depends on your agreement with Enfo
 */
export enum BackupPlan {
  STANDARD = 'Standard',
  STOCKHOLM = 'StandardCrossRegionStockholm',
  IRELAND = 'StandardCrossRegionIreland',
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
 * Tags billing mode of a DynamoDB Table as compliant. Used to suppress warnings for billing mode PROVISIONED
 * @param construct
 * Table Construct
 */
export const allowBillingModeProvisioned = (construct: Table): void => {
  Tags.of(construct).add('BillingMode', 'Provisioned')
}
