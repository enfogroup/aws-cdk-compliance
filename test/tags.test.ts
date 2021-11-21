// to be tested
import { BackupPlan, tagConstructForBackup } from '../lib'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb'
import { ABSENT } from '@aws-cdk/assert/lib/assertions/have-resource'

describe('Tags', () => {
  describe('tagConstructForBackup', () => {
    it('should be able to tag all resources in a stack', () => {
      const stack = new Stack()
      new Bucket(stack, 'Bucket')
      new Table(stack, 'Table', { partitionKey: { name: 'pk', type: AttributeType.STRING } })

      tagConstructForBackup(stack)

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        Tags: [
          {
            Key: 'BackupPlan',
            Value: BackupPlan.STANDARD
          }
        ]
      })
      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        Tags: [
          {
            Key: 'BackupPlan',
            Value: BackupPlan.STANDARD
          }
        ]
      })
    })

    it('should tag specific resources', () => {
      const stack = new Stack()
      const bucket = new Bucket(stack, 'Bucket')
      new Table(stack, 'Table', { partitionKey: { name: 'pk', type: AttributeType.STRING } })

      tagConstructForBackup(bucket)

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        Tags: [
          {
            Key: 'BackupPlan',
            Value: BackupPlan.STANDARD
          }
        ]
      })
      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        Tags: ABSENT
      })
    })

    it('should respect the backupPlan parameter', () => {
      const stack = new Stack()
      new Bucket(stack, 'Bucket')

      tagConstructForBackup(stack, BackupPlan.IRELAND)

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        Tags: [
          {
            Key: 'BackupPlan',
            Value: BackupPlan.IRELAND
          }
        ]
      })
    })
  })
})
