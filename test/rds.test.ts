// to be tested
import { DatabaseCluster, DatabaseEnvironments, DatabaseInstance } from '../lib/rds'

// tools
import '@aws-cdk/assert/jest'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { AuroraPostgresEngineVersion, DatabaseClusterEngine, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

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
