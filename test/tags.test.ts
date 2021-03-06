// to be tested
import { BackupPlan, enableBackups, exemptBucketFromBlockPublicAutoFix, exemptBucketFromSslAutoFix } from '../lib'

// tools
import '@aws-cdk/assert/jest'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { ABSENT } from '@aws-cdk/assert/lib/assertions/have-resource'
import { App, Stack } from 'aws-cdk-lib'

describe('Tags', () => {
  describe('enableBackups', () => {
    it('should be able to tag all resources in a stack', () => {
      const stack = new Stack()
      new Bucket(stack, 'Bucket')
      new Table(stack, 'Table', { partitionKey: { name: 'pk', type: AttributeType.STRING } })

      enableBackups(stack)

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

    it('should tag all resources in an app', () => {
      const app = new App()
      const stackOne = new Stack(app, 'one')
      new Bucket(stackOne, 'Bucket')
      const stackTwo = new Stack(app, 'two')
      new Table(stackTwo, 'Table', { partitionKey: { name: 'pk', type: AttributeType.STRING } })

      enableBackups(app)

      expect(stackOne).toHaveResource('AWS::S3::Bucket', {
        Tags: [
          {
            Key: 'BackupPlan',
            Value: BackupPlan.STANDARD
          }
        ]
      })
      expect(stackTwo).toHaveResource('AWS::DynamoDB::Table', {
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

      enableBackups(bucket)

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

      enableBackups(stack, BackupPlan.IRELAND)

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

  describe('exemptBucketFromBlockPublicAutoFix', () => {
    it('should tag an S3 bucket as exempt', () => {
      const stack = new Stack()
      const bucket = new Bucket(stack, 'Bucket')

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        Tags: ABSENT
      })

      exemptBucketFromBlockPublicAutoFix(bucket)

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        Tags: [
          {
            Key: 'BlockPublicAccessAutomation',
            Value: 'Exempt'
          }
        ]
      })
    })
  })

  describe('exemptBucketFromSslAutoFix', () => {
    it('should tag an S3 bucket as exempt', () => {
      const stack = new Stack()
      const bucket = new Bucket(stack, 'Bucket')

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        Tags: ABSENT
      })

      exemptBucketFromSslAutoFix(bucket)

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        Tags: [
          {
            Key: 'SecureTransportAutomation',
            Value: 'Exempt'
          }
        ]
      })
    })
  })
})
