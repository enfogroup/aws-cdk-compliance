// to be tested
import { DatabaseCluster, DatabaseEnvironment, DatabaseInstance } from '../lib/rds'

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
        environment: DatabaseEnvironment.NOT_PRODUCTION,
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

    it('should throw if production database is in a single az', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')

      new DatabaseInstance(stack, 'DB', {
        vpc,
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        environment: DatabaseEnvironment.PRODUCTION,
        multiAz: false
      })

      expect(() => Template.fromStack(stack)).toThrow('Production instance must be multi AZ')
    })

    it('should should if publiclyAccessible is false', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        publiclyAccessible: true
      })

      expect(() => Template.fromStack(stack)).toThrow('publiclyAccessible must not be undefined nor true')
    })

    it('should throw if publiclyAccessible is undefined', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        publiclyAccessible: undefined
      })

      expect(() => Template.fromStack(stack)).toThrow('publiclyAccessible must not be undefined nor true')
    })

    it('should should if storageEncrypted is false', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        storageEncrypted: false
      })

      expect(() => Template.fromStack(stack)).toThrow('storageEncrypted must not be undefined nor false')
    })

    it('should throw if storageEncrypted is undefined', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        storageEncrypted: undefined
      })

      expect(() => Template.fromStack(stack)).toThrow('storageEncrypted must not be undefined nor false')
    })

    it('should should if iamAuthentication is false', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        iamAuthentication: false
      })

      expect(() => Template.fromStack(stack)).toThrow('iamAuthentication must not be undefined nor false')
    })

    it('should throw if iamAuthentication is undefined', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        iamAuthentication: undefined
      })

      expect(() => Template.fromStack(stack)).toThrow('iamAuthentication must not be undefined nor false')
    })

    it('should should if autoMinorVersionUpgrade is false', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        autoMinorVersionUpgrade: false
      })

      expect(() => Template.fromStack(stack)).toThrow('autoMinorVersionUpgrade must not be undefined nor false')
    })

    it('should throw if autoMinorVersionUpgrade is undefined', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        autoMinorVersionUpgrade: undefined
      })

      expect(() => Template.fromStack(stack)).toThrow('autoMinorVersionUpgrade must not be undefined nor false')
    })

    it('should should if copyTagsToSnapshot is false', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        copyTagsToSnapshot: false
      })

      expect(() => Template.fromStack(stack)).toThrow('copyTagsToSnapshot must not be undefined nor false')
    })

    it('should throw if copyTagsToSnapshot is undefined', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        copyTagsToSnapshot: undefined
      })

      expect(() => Template.fromStack(stack)).toThrow('copyTagsToSnapshot must not be undefined nor false')
    })

    it('should should if deletionProtection is false', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        deletionProtection: false
      })

      expect(() => Template.fromStack(stack)).toThrow('deletionProtection must not be undefined nor false')
    })

    it('should throw if deletionProtection is undefined', () => {
      const stack = new Stack()

      new DatabaseInstance(stack, 'DB', {
        vpc: new Vpc(stack, 'VPC'),
        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
        deletionProtection: undefined
      })

      expect(() => Template.fromStack(stack)).toThrow('deletionProtection must not be undefined nor false')
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
