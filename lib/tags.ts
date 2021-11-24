import { Table } from '@aws-cdk/aws-dynamodb'
import { Construct, Tags } from '@aws-cdk/core'

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

export const forceTagDynamoDBAsSafe = (construct: Table): void => {
  Tags.of(construct).add('billingMode', 'Provisioned')
}
