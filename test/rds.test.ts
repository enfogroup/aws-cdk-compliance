// to be tested
import { DatabaseCluster, DatabaseEnvironments, DatabaseInstance } from '../lib/rds'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Template, Match } from '@aws-cdk/assertions'
import { Vpc } from '@aws-cdk/aws-ec2'
import { AuroraPostgresEngineVersion, DatabaseClusterEngine, DatabaseInstanceEngine, PostgresEngineVersion } from '@aws-cdk/aws-rds'

describe('RDS', () => {
  describe('DatabaseInstance', () => {
    it('should have sane defaults', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')

      new DatabaseInstance(stack, 'DB', { vpc, engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }) })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::RDS::DBInstance', Match.objectLike({
        PubliclyAccessible: false,
        StorageEncrypted: true,
        EnableIAMDatabaseAuthentication: true,
        AutoMinorVersionUpgrade: true,
        CopyTagsToSnapshot: true,
        DeletionProtection: true,
        MultiAZ: true
      }))
    })

    it('allows non-prod db to be single az', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')

      new DatabaseInstance(stack, 'DB', {
        vpc,
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        environment: DatabaseEnvironments.NONPROD,
        multiAz: false
      })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::RDS::DBInstance', Match.objectLike({
        PubliclyAccessible: false,
        StorageEncrypted: true,
        EnableIAMDatabaseAuthentication: true,
        AutoMinorVersionUpgrade: true,
        CopyTagsToSnapshot: true,
        DeletionProtection: true,
        MultiAZ: false
      }))
    })

    it('should reject prod database in a single az', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')

      new DatabaseInstance(stack, 'DB', {
        vpc,
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        environment: DatabaseEnvironments.PROD,
        multiAz: false
      })

      expect(() => Template.fromStack(stack)).toThrow('Prod instances must be multi AZ')
    })
  })

  describe('DatabaseCluster', () => {
    it('should have sane defaults', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')

      new DatabaseCluster(stack, 'DB', {
        engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_13_4 }),
        instanceProps: {
          vpc
        }
      })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::RDS::DBCluster', Match.objectLike({
        StorageEncrypted: true,
        EnableIAMDatabaseAuthentication: true,
        CopyTagsToSnapshot: true,
        DeletionProtection: true
      }))
      template.hasResourceProperties('AWS::RDS::DBInstance', Match.objectLike({
        PubliclyAccessible: false,
        AutoMinorVersionUpgrade: true
      }))
    })
  })
})
