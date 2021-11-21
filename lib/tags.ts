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
 * Tags a CDK Construct to enable Enfo Standard Backup.
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
 */
export const tagConstructForBackup = (construct: Construct, plan: BackupPlan = BackupPlan.STANDARD): void => {
  Tags.of(construct).add('BackupPlan', plan)
}